// Interfaz de la herramienta «¿Es APTO?». Toda la lógica de cálculo está en motor.js,
// datos.js y github.js (funciones puras con pruebas); aquí solo se conecta el DOM.
import { CRITERIOS, CATEGORIAS, EJEMPLO_LIBREOFFICE, NIVELES, GITHUB_RESPALDO, descriptorNivel } from './datos.js';
import { evaluar, puntajeDesdePorcentaje, criterioQueMasFrena } from './motor.js';
import { parsearRepo, consultarRepo, sugerirDesdeRepo, buscarEnGithub, cupoBusqueda } from './github.js';
import { CATALOGO, CATALOGO_FECHA, filtrarCatalogo, buscarPorRepo, sugerirCategoria, normalizar } from './catalogo.js';
import { iniciarTema } from './tema.js';

const $ = (sel) => document.querySelector(sel);
const num = (x, d = 2) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d });
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const categoria = (id) => CATEGORIAS.find((c) => c.id === id);
const sinMovimiento = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const PUNTAJES_EJEMPLO = EJEMPLO_LIBREOFFICE.porcentajes.map(puntajeDesdePorcentaje);
const estado = { puntajes: [...PUNTAJES_EJEMPLO], categoria: EJEMPLO_LIBREOFFICE.categoria, esEjemplo: true, sugeridos: new Set(), seleccion: null };
let clasePrevia = null;

/* ---------- Tablero de criterios ---------- */
function pintarTablero() {
  $('#criterios').innerHTML = CRITERIOS.map((c, i) => `
    <div class="crit" id="crit-${i}">
      <div class="crit__cab">
        <span class="crit__id">${c.id}</span>
        <span class="crit__nombre" id="cn-${i}">${c.nombre}</span>
        <span class="crit__chip" id="chip-${i}" hidden>sugerido</span>
        <span class="crit__peso" id="w-${i}" title="Peso del criterio en esta categoría"></span>
      </div>
      <div class="niveles" role="radiogroup" aria-labelledby="cn-${i}" aria-describedby="cd-${i}" id="niv-${i}">
        ${[1, 2, 3, 4, 5].map((n) => `
          <label class="nivel" data-n="${n}">
            <input type="radio" name="c${i}" value="${n}" class="nivel__input">
            <span class="nivel__pip" aria-hidden="true">${n}</span>
            <span class="sr-only">${n}, ${NIVELES[n]}</span>
          </label>`).join('')}
      </div>
      <p class="crit__desc" id="cd-${i}"></p>
    </div>`).join('');

  CRITERIOS.forEach((c, i) => {
    const grupo = $(`#niv-${i}`);
    grupo.addEventListener('change', (e) => {
      estado.puntajes[i] = Number(e.target.value);
      estado.sugeridos.delete(i);
      salirDeEjemplo();
      pintarCriterio(i);
      recalcular();
    });
    grupo.querySelectorAll('.nivel').forEach((et) => {
      const n = Number(et.dataset.n);
      const ver = () => describir(i, n, true);
      et.addEventListener('mouseenter', ver);
      et.querySelector('input').addEventListener('focus', () => describir(i, estado.puntajes[i], false));
    });
    grupo.addEventListener('mouseleave', () => describir(i, estado.puntajes[i], false));
  });
}

function describir(i, n, vistaPrevia) {
  const p = $(`#cd-${i}`);
  p.classList.toggle('crit__desc--previa', vistaPrevia);
  p.innerHTML = `<b>${n} · ${NIVELES[n]}</b> ${esc(descriptorNivel(CRITERIOS[i], n))}`;
}

function pintarCriterio(i) {
  const v = estado.puntajes[i];
  const grupo = $(`#niv-${i}`);
  grupo.dataset.v = v;
  const input = grupo.querySelector(`input[value="${v}"]`);
  if (!input.checked) input.checked = true;
  $(`#chip-${i}`).hidden = !estado.sugeridos.has(i);
  describir(i, v, false);
}

function pintarPesos() {
  const pesos = categoria(estado.categoria).pesos;
  const max = Math.max(...pesos);
  pesos.forEach((w, i) => {
    const el = $(`#w-${i}`);
    el.textContent = `w ${num(w)}`;
    el.classList.toggle('crit__peso--max', w === max);
  });
}

/* ---------- Resultado ---------- */
let temporizadorAnuncio;
function recalcular() {
  const cat = categoria(estado.categoria);
  const r = evaluar(estado.puntajes, cat.pesos);
  const nombre = $('#nombre').value.trim() || 'Software sin nombre';
  $('#hud-software').textContent = `${nombre} · ${cat.nombre}`;
  $('#ptotal').textContent = num(r.ptotal);
  $('#sigma').textContent = num(r.sigma);
  $('#imin').textContent = `${Math.round(r.imin * 12)}/12`;
  const medidor = $('#medidor');
  medidor.style.width = `${((r.ptotal - 1) / 4) * 100}%`;
  medidor.dataset.clase = r.clasificacion;

  const sello = $('#sello');
  sello.textContent = r.clasificacion;
  sello.dataset.clase = r.clasificacion;
  $('#mini-sello').textContent = r.clasificacion;
  $('#mini-sello').dataset.clase = r.clasificacion;
  $('#mini-p').textContent = num(r.ptotal);
  if (clasePrevia && clasePrevia !== r.clasificacion) golpe();
  clasePrevia = r.clasificacion;

  const f = criterioQueMasFrena(estado.puntajes, cat.pesos);
  const freno = $('#freno');
  if (!f) {
    freno.innerHTML = '<p class="freno__titulo">Logro: perfil perfecto</p><p>Los 12 criterios están en 5. Nada te frena.</p>';
    $('#mini-freno').textContent = 'Nada te frena';
  } else {
    const c = CRITERIOS[f.indice];
    const cambia = f.clasificacionSiSube !== r.clasificacion;
    freno.innerHTML = `
      <p class="freno__titulo">El criterio que más te frena</p>
      <p class="freno__nombre"><span class="crit__id">${c.id}</span> ${c.nombre} <span class="freno__dato">${f.puntaje}/5 · w ${num(f.peso)}</span></p>
      <p class="freno__efecto">Si llegara a 5: P<sub>total</sub> ${num(f.ptotalSiSube)} <span class="freno__mas">+${num(f.perdida)}</span>${cambia ? ` <span class="freno__salto" data-clase="${f.clasificacionSiSube}">→ ${f.clasificacionSiSube}</span>` : ''}</p>
      <button type="button" class="freno__ir" data-i="${f.indice}">Ir a ${c.id}</button>`;
    freno.querySelector('.freno__ir').addEventListener('click', () => {
      const destino = $(`#crit-${f.indice}`);
      destino.scrollIntoView({ behavior: sinMovimiento() ? 'auto' : 'smooth', block: 'center' });
      destino.querySelector('input:checked').focus({ preventScroll: true });
      destino.classList.remove('crit--foco'); void destino.offsetWidth; destino.classList.add('crit--foco');
    });
    $('#mini-freno').textContent = `Frena: ${c.id} ${c.nombre}`;
  }

  $('#tabla-aportes').innerHTML = CRITERIOS.map((c, i) =>
    `<tr><th scope="row">${c.id} ${c.nombre}</th><td>${estado.puntajes[i]}</td><td>${num(cat.pesos[i])}</td><td>${num(r.aportes[i])}</td></tr>`
  ).join('') + `<tr class="fila-total"><th scope="row">P<sub>total</sub></th><td></td><td>1,00</td><td>${num(r.ptotal)}</td></tr>`;

  clearTimeout(temporizadorAnuncio);
  temporizadorAnuncio = setTimeout(() => {
    $('#anuncio').textContent = `${r.clasificacion}. Puntaje total ${num(r.ptotal)} de 5.`;
  }, 700);
}

function golpe() {
  const caja = $('.hud__sello-caja');
  caja.classList.remove('golpe');
  void caja.offsetWidth; // reinicia la animación
  caja.classList.add('golpe');
}

/* ---------- Ejemplo, limpiar y categoría ---------- */
function ponerTodo(puntajes) {
  estado.puntajes = [...puntajes];
  CRITERIOS.forEach((_, i) => pintarCriterio(i));
}

function salirDeEjemplo() {
  if (!estado.esEjemplo) return;
  estado.esEjemplo = false;
  $('#insignia-ejemplo').hidden = true;
}

function cargarEjemplo() {
  estado.categoria = EJEMPLO_LIBREOFFICE.categoria;
  estado.esEjemplo = true;
  estado.sugeridos.clear();
  $('#categoria').value = estado.categoria;
  $('#nombre').value = EJEMPLO_LIBREOFFICE.nombre;
  $('#insignia-ejemplo').hidden = false;
  $('#repo').value = 'LibreOffice/core';
  $('#github-estado').innerHTML = '';
  estado.seleccion = deCatalogo(CATALOGO.find((e) => e.n === EJEMPLO_LIBREOFFICE.nombre));
  pintarQueEs(estado.seleccion);
  pintarPesos();
  ponerTodo(PUNTAJES_EJEMPLO);
  recalcular();
}

function limpiar() {
  estado.sugeridos.clear();
  $('#nombre').value = '';
  estado.seleccion = null;
  pintarQueEs(null);
  salirDeEjemplo();
  ponerTodo(Array(12).fill(3));
  recalcular();
  $('#nombre').focus();
}

/* ---------- GitHub (opcional) ---------- */
const fecha = (iso) => new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });

function pintarGithub(datos, { respaldo = false, ahora = Date.now() } = {}) {
  const sug = sugerirDesdeRepo(datos, ahora);
  const filas = ['C1', 'C2', 'C3'].map((id, k) => {
    const s = sug[id];
    const c = CRITERIOS[k];
    return `<li class="sug">
      <span class="crit__id">${id}</span>
      <div class="sug__texto"><b>${c.nombre}: ${s.puntaje ?? '—'}</b> <span>${esc(s.motivo)}</span></div>
      ${s.puntaje ? `<button type="button" class="boton boton--mini" data-aplicar="${k}" data-v="${s.puntaje}">Usar ${s.puntaje}</button>` : ''}
    </li>`;
  }).join('');
  $('#github-estado').innerHTML = `
    ${respaldo ? `<p class="aviso-respaldo">Sin conexión: datos de ejemplo del ${fecha(`${GITHUB_RESPALDO.fecha}T12:00:00Z`)} (${esc(datos.repo)}).</p>` : ''}
    <div class="repo">
      <p class="repo__nombre"><a class="enlace" href="${esc(datos.url)}" rel="noopener">${esc(datos.repo)}</a>${datos.archivado ? ' <span class="chapa chapa--na">archivado</span>' : ''}</p>
      <dl class="repo__datos">
        <div><dt>Licencia</dt><dd>${esc(datos.licenciaSpdx ?? 'ninguna')}</dd></div>
        <div><dt>En GitHub desde</dt><dd>${new Date(datos.creado).getFullYear()}</dd></div>
        <div><dt>Último cambio</dt><dd>${fecha(datos.ultimoPush)}</dd></div>
        <div><dt>Contribuidores</dt><dd>${datos.contribuidores == null ? 's. d.' : datos.contribuidores.toLocaleString('es-CO')}</dd></div>
        <div><dt>Estrellas</dt><dd>${datos.estrellas.toLocaleString('es-CO')}</dd></div>
      </dl>
    </div>
    <p class="sug__aviso"><b>Sugerencia editable.</b> Son reglas calculadas aquí a partir de los descriptores de la investigación; revísalas antes de usarlas.</p>
    <ul class="lista-limpia sugs">${filas}</ul>
    <button type="button" class="boton boton--chico boton--primario" id="aplicar-todo">Usar las sugerencias</button>`;

  const aplicar = (k, v) => {
    estado.puntajes[k] = v;
    estado.sugeridos.add(k);
    pintarCriterio(k);
  };
  $('#github-estado').querySelectorAll('[data-aplicar]').forEach((b) => b.addEventListener('click', () => {
    salirDeEjemplo();
    aplicar(Number(b.dataset.aplicar), Number(b.dataset.v));
    recalcular();
  }));
  $('#aplicar-todo').addEventListener('click', () => {
    salirDeEjemplo();
    ['C1', 'C2', 'C3'].forEach((id, k) => { if (sug[id].puntaje) aplicar(k, sug[id].puntaje); });
    if (!$('#nombre').value.trim()) $('#nombre').value = datos.repo.split('/')[1];
    recalcular();
  });
  return sug;
}

/** Aplica de una vez las sugerencias C1–C3 (las marca como «sugerido»). */
function aplicarSugerencias(sug) {
  ['C1', 'C2', 'C3'].forEach((id, k) => {
    if (!sug[id].puntaje) return;
    estado.puntajes[k] = sug[id].puntaje;
    estado.sugeridos.add(k);
    pintarCriterio(k);
  });
  recalcular();
}

function pintarErrorGithub(mensaje) {
  $('#github-estado').innerHTML = `
    <div class="error-github" role="alert">
      <p><b>No se pudo consultar.</b> ${esc(mensaje)}</p>
      <button type="button" class="boton boton--chico" id="usar-respaldo">Ver con datos de ejemplo (sin conexión)</button>
    </div>`;
  $('#usar-respaldo').addEventListener('click', () => {
    pintarGithub(GITHUB_RESPALDO, { respaldo: true, ahora: Date.parse(`${GITHUB_RESPALDO.fecha}T20:00:00Z`) });
  });
}

async function consultar({ aplicar = false } = {}) {
  const boton = $('#consultar');
  const destino = parsearRepo($('#repo').value);
  if (!destino) {
    pintarErrorGithub('Escribe el repositorio como «dueño/repo» o pega su URL de GitHub.');
    $('#repo').focus();
    return;
  }
  boton.disabled = true;
  boton.textContent = 'Consultando…';
  $('#github-estado').innerHTML = `<p class="cargando">Preguntando a GitHub por ${esc(destino.dueno)}/${esc(destino.repo)}…</p>`;
  try {
    const datos = await consultarRepo(destino);
    const sug = pintarGithub(datos);
    if (aplicar && parsearRepo($('#repo').value)?.repo === destino.repo) aplicarSugerencias(sug);
  } catch (e) {
    pintarErrorGithub(e.message);
  } finally {
    boton.disabled = false;
    boton.textContent = 'Consultar';
  }
}

/* ---------- Buscador de software: catálogo local + búsqueda en vivo en GitHub ---------- */
const fechaCatalogo = new Date(`${CATALOGO_FECHA}T12:00:00Z`).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
const buscador = { opciones: [], activo: -1, cache: new Map(), marcas: [], bloqueoHasta: 0, buscando: null, temporizador: null, aviso: '' };

const deCatalogo = (e) => e && ({ origen: 'catalogo', nombre: e.n, que: e.que, lic: e.lic, repo: e.repo, url: e.url, cat: e.cat, aviso: e.aviso ?? null, semilla: Boolean(e.s) });

function deGithub(item) {
  const enCatalogo = buscarPorRepo(item.repo);
  if (enCatalogo) return deCatalogo(enCatalogo);
  return {
    origen: 'github', nombre: item.nombre, que: item.descripcion, lic: item.licenciaSpdx ?? 'sin licencia detectada',
    repo: item.repo, url: item.url, sitio: item.sitio, estrellas: item.estrellas, ultimoPush: item.ultimoPush,
    catSugerida: sugerirCategoria({ nombre: item.nombre, descripcion: item.descripcion, temas: item.temas }),
    aviso: item.archivado ? 'El repositorio está archivado: ya no recibe cambios.' : null,
  };
}

function abrirPanel(abierto) {
  $('#buscador-panel').hidden = !abierto;
  $('#nombre').setAttribute('aria-expanded', String(abierto));
  if (!abierto) { buscador.activo = -1; $('#nombre').removeAttribute('aria-activedescendant'); }
}

const resumenGithub = (it) => [
  `★ ${it.estrellas.toLocaleString('es-CO')}`,
  it.licenciaSpdx ?? 'sin licencia',
  `último cambio ${fecha(it.ultimoPush)}`,
].join(' · ');

function pintarOpciones() {
  const texto = $('#nombre').value;
  const q = normalizar(texto);
  if (!q) { abrirPanel(false); return; }
  const locales = filtrarCatalogo(texto, CATALOGO, 6);
  const enGithub = buscador.cache.get(q);
  const opciones = [];
  let html = '';
  if (locales.length) {
    html += `<li class="buscador__grupo" role="presentation">Catálogo · ${locales.length}</li>`;
    locales.forEach((e) => {
      opciones.push({ tipo: 'sel', sel: deCatalogo(e) });
      const cat = categoria(e.cat).nombre;
      html += `<li class="opcion" role="option" id="op-${opciones.length - 1}" data-i="${opciones.length - 1}" aria-selected="false">
        <span class="opcion__fila"><span class="opcion__nombre">${esc(e.n)}</span><span class="opcion__meta">${esc(cat)} · ${esc(e.lic)}</span></span>
        <span class="opcion__que">${esc(e.que)}</span></li>`;
    });
  }
  if (enGithub) {
    const ya = new Set(locales.map((e) => e.repo?.toLowerCase()));
    const nuevos = enGithub.filter((it) => !ya.has(it.repo.toLowerCase()));
    html += `<li class="buscador__grupo" role="presentation">En GitHub · ${nuevos.length ? 'elige el correcto' : 'nada nuevo'}</li>`;
    nuevos.forEach((it) => {
      opciones.push({ tipo: 'sel', sel: deGithub(it) });
      html += `<li class="opcion" role="option" id="op-${opciones.length - 1}" data-i="${opciones.length - 1}" aria-selected="false">
        <span class="opcion__fila"><span class="opcion__nombre">${esc(it.repo)}</span><span class="opcion__meta">${esc(resumenGithub(it))}</span></span>
        <span class="opcion__que">${esc(it.descripcion || 'Sin descripción en GitHub.')}${it.archivado ? ' · archivado' : ''}</span></li>`;
    });
  } else if (q.length >= 2 && buscador.buscando !== q) {
    opciones.push({ tipo: 'buscar', q: texto.trim() });
    html += `<li class="opcion opcion--accion" role="option" id="op-${opciones.length - 1}" data-i="${opciones.length - 1}" aria-selected="false">
      <span class="opcion__fila"><span class="opcion__nombre">Buscar «${esc(texto.trim())}» en GitHub</span><span class="opcion__meta">nombre, descripción, estrellas y licencia</span></span></li>`;
  }
  buscador.opciones = opciones;
  buscador.activo = -1;
  $('#sugerencias').innerHTML = html;
  $('#nombre').removeAttribute('aria-activedescendant');
  let estadoHtml = buscador.aviso;
  if (buscador.buscando === q) estadoHtml = `<p class="cargando">Buscando «${esc(texto.trim())}» en GitHub…</p>`;
  else if (!locales.length && !enGithub && !buscador.aviso) estadoHtml = '<p>No está en el catálogo local. Búscalo en GitHub.</p>';
  $('#buscador-estado').innerHTML = estadoHtml;
  abrirPanel(true);
}

function moverActivo(paso) {
  const n = buscador.opciones.length;
  if (!n) return;
  buscador.activo = (buscador.activo + paso + n) % n;
  $('#sugerencias').querySelectorAll('[role="option"]').forEach((li) => {
    const si = Number(li.dataset.i) === buscador.activo;
    li.setAttribute('aria-selected', String(si));
    if (si) li.scrollIntoView({ block: 'nearest' });
  });
  $('#nombre').setAttribute('aria-activedescendant', `op-${buscador.activo}`);
}

function usarOpcion(i) {
  const op = buscador.opciones[i];
  if (!op) return;
  if (op.tipo === 'buscar') { buscarGithub(op.q); return; }
  elegir(op.sel);
}

async function buscarGithub(texto) {
  const q = normalizar(texto);
  if (!q || buscador.buscando === q) return;
  if (buscador.cache.has(q)) { pintarOpciones(); return; }
  const ahora = Date.now();
  const cupo = cupoBusqueda(buscador.marcas, ahora);
  const espera = Math.max(cupo.esperaMs, buscador.bloqueoHasta - ahora);
  if (espera > 0) {
    buscador.aviso = `<p class="aviso-limite">GitHub permite 10 búsquedas por minuto sin cuenta. Espera ${Math.ceil(espera / 1000)} s.</p><p>Mientras tanto: elige del catálogo, o escribe «dueño/repo» en «Traer licencia y comunidad desde GitHub».</p>`;
    pintarOpciones();
    return;
  }
  buscador.marcas = [...cupo.recientes, ahora];
  buscador.buscando = q;
  buscador.aviso = '';
  pintarOpciones();
  try {
    buscador.cache.set(q, await buscarEnGithub(texto));
  } catch (e) {
    if (e.tipo === 'limite') {
      buscador.bloqueoHasta = Date.now() + (e.esperaMs ?? 60_000);
      buscador.aviso = `<p class="aviso-limite">${esc(e.message)}</p><p>Mientras tanto: elige del catálogo, o escribe «dueño/repo» en «Traer licencia y comunidad desde GitHub».</p>`;
    } else {
      buscador.aviso = `<p class="aviso-limite">${esc(e.message)}</p><p>Sin conexión: solo se muestra el catálogo local (${CATALOGO.length} proyectos verificados el ${fechaCatalogo}).</p>`;
    }
  } finally {
    buscador.buscando = null;
  }
  if (normalizar($('#nombre').value) === q && document.activeElement === $('#nombre')) pintarOpciones();
}

function pintarQueEs(sel) {
  const caja = $('#que-es');
  if (!sel) { caja.hidden = true; caja.innerHTML = ''; return; }
  const catId = sel.cat ?? sel.catSugerida?.id ?? null;
  const cat = catId ? categoria(catId).nombre : 'sin deducir';
  let enlace = '';
  try { enlace = new URL(sel.sitio || sel.url).hostname.replace(/^www\./, ''); } catch { /* sin enlace */ }
  const nota = sel.origen === 'catalogo'
    ? `Categoría del catálogo${sel.semilla ? ' de Mario y David' : ''}; cámbiala arriba si tu uso es otro.`
    : sel.catSugerida
      ? `Categoría sugerida por las palabras «${esc(sel.catSugerida.coincidencias.slice(0, 3).join('», «'))}» de su descripción (regla calculada aquí); cámbiala si no encaja.`
      : 'No pude deducir la categoría: elígela arriba.';
  const c13 = sel.repo ? 'C1–C3 se precargan desde GitHub' : 'No vive en GitHub: puntúa C1–C3 a mano';
  caja.innerHTML = `
    <p class="que-es__cab"><span class="que-es__etq">Qué es</span><span class="que-es__nombre">${esc(sel.nombre)}</span><span class="que-es__origen">${sel.origen === 'catalogo' ? 'del catálogo' : 'desde GitHub'}</span></p>
    <p class="que-es__texto">${sel.origen === 'github' ? (sel.que ? `<span lang="en">${esc(sel.que)}</span> <span class="campo__nota">(descripción del repositorio)</span>` : 'El repositorio no tiene descripción.') : esc(sel.que)}</p>
    <dl class="que-es__datos">
      <div><dt>Licencia</dt><dd>${esc(sel.lic)}</dd></div>
      <div><dt>Categoría</dt><dd>${esc(cat)}${sel.origen === 'github' && sel.catSugerida ? ' (sugerida)' : ''}</dd></div>
      ${sel.estrellas != null ? `<div><dt>Estrellas</dt><dd>${sel.estrellas.toLocaleString('es-CO')}</dd></div>` : ''}
      ${enlace ? `<div><dt>Sitio</dt><dd><a class="enlace" href="${esc(sel.sitio || sel.url)}" rel="noopener" target="_blank">${esc(enlace)}</a></dd></div>` : ''}
    </dl>
    ${sel.aviso ? `<p class="que-es__aviso"><b>Ojo:</b> ${esc(sel.aviso)}</p>` : ''}
    <p class="que-es__nota">${nota} ${c13}; C4–C12 quedan en 3 hasta que los puntúes.</p>`;
  caja.hidden = false;
}

function elegir(sel) {
  estado.seleccion = sel;
  $('#nombre').value = sel.nombre;
  abrirPanel(false);
  salirDeEjemplo();
  const catId = sel.cat ?? sel.catSugerida?.id;
  if (catId && categoria(catId)) {
    estado.categoria = catId;
    $('#categoria').value = catId;
    pintarPesos();
  }
  estado.sugeridos.clear();
  ponerTodo(Array(12).fill(3));
  recalcular();
  pintarQueEs(sel);
  if (sel.repo) {
    $('#repo').value = sel.repo;
    $('#github').open = true;
    consultar({ aplicar: true });
  } else {
    $('#repo').value = '';
    $('#github-estado').innerHTML = `<p class="pie">${esc(sel.nombre)} no tiene repositorio en GitHub; su código está en <a class="enlace" href="${esc(sel.url)}" rel="noopener" target="_blank">su sitio</a>. Puntúa C1–C3 a mano.</p>`;
  }
}

function iniciarBuscador() {
  const input = $('#nombre');
  input.addEventListener('input', () => {
    if (estado.seleccion && input.value !== estado.seleccion.nombre) { estado.seleccion = null; pintarQueEs(null); }
    salirDeEjemplo();
    recalcular();
    buscador.aviso = '';
    pintarOpciones();
    clearTimeout(buscador.temporizador);
    const q = normalizar(input.value);
    // Si el catálogo no tiene nada, se pregunta a GitHub solo cuando la persona deja de escribir.
    if (q.length >= 3 && !filtrarCatalogo(input.value).length && !buscador.cache.has(q)) {
      buscador.temporizador = setTimeout(() => buscarGithub(input.value), 700);
    }
  });
  input.addEventListener('focus', () => { if (input.value && !estado.seleccion) pintarOpciones(); });
  input.addEventListener('keydown', (e) => {
    const abierto = !$('#buscador-panel').hidden;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!abierto) pintarOpciones();
      moverActivo(e.key === 'ArrowDown' ? 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (!abierto) return;
      usarOpcion(buscador.activo >= 0 ? buscador.activo : 0);
    } else if (e.key === 'Escape' && abierto) {
      e.preventDefault();
      abrirPanel(false);
    }
  });
  input.addEventListener('blur', () => setTimeout(() => { if (document.activeElement !== input) abrirPanel(false); }, 120));
  const panel = $('#buscador-panel');
  panel.addEventListener('pointerdown', (e) => e.preventDefault()); // no quita el foco del campo
  $('#sugerencias').addEventListener('click', (e) => {
    const li = e.target.closest('[role="option"]');
    if (li) usarOpcion(Number(li.dataset.i));
  });
}

/* ---------- Barra mini del veredicto (móvil) ---------- */
function iniciarHudMini() {
  const mini = $('#hud-mini');
  if (!('IntersectionObserver' in window)) return;
  new IntersectionObserver(([e]) => mini.classList.toggle('hud-mini--oculto', e.isIntersecting), { threshold: 0.25 }).observe($('#hud'));
}

/* ---------- Inicio ---------- */
function iniciar() {
  iniciarTema();
  const sel = $('#categoria');
  sel.innerHTML = CATEGORIAS.map((c) => `<option value="${c.id}">${c.nombre}</option>`).join('');
  pintarTablero();
  sel.addEventListener('change', () => { estado.categoria = sel.value; salirDeEjemplo(); pintarPesos(); recalcular(); });
  iniciarBuscador();
  $('#ejemplo').addEventListener('click', cargarEjemplo);
  $('#limpiar').addEventListener('click', limpiar);
  $('#consultar').addEventListener('click', () => consultar());
  $('#repo').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); consultar(); } });
  iniciarHudMini();

  cargarEjemplo();
  // /proceso/ enlaza aquí con ?categoria=CATx desde el diagnóstico rápido.
  const pedida = new URLSearchParams(location.search).get('categoria');
  if (pedida && categoria(pedida)) {
    estado.categoria = pedida;
    sel.value = pedida;
    $('#nombre').value = '';
    estado.seleccion = null;
    pintarQueEs(null);
    salirDeEjemplo();
    pintarPesos();
    ponerTodo(Array(12).fill(3));
    recalcular();
  }
}

iniciar();
