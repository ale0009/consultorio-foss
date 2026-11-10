// Interfaz de la herramienta «¿Es APTO?». Toda la lógica de cálculo está en motor.js,
// datos.js y github.js (funciones puras con pruebas); aquí solo se conecta el DOM.
import { CRITERIOS, CATEGORIAS, EJEMPLO_LIBREOFFICE, NIVELES, GITHUB_RESPALDO, descriptorNivel } from './datos.js';
import { evaluar, puntajeDesdePorcentaje, criterioQueMasFrena } from './motor.js';
import { parsearRepo, consultarRepo, sugerirDesdeRepo } from './github.js';
import { iniciarTema } from './tema.js';

const $ = (sel) => document.querySelector(sel);
const num = (x, d = 2) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d });
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const categoria = (id) => CATEGORIAS.find((c) => c.id === id);
const sinMovimiento = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const PUNTAJES_EJEMPLO = EJEMPLO_LIBREOFFICE.porcentajes.map(puntajeDesdePorcentaje);
const estado = { puntajes: [...PUNTAJES_EJEMPLO], categoria: EJEMPLO_LIBREOFFICE.categoria, esEjemplo: true, sugeridos: new Set() };
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
  pintarPesos();
  ponerTodo(PUNTAJES_EJEMPLO);
  recalcular();
}

function limpiar() {
  estado.sugeridos.clear();
  $('#nombre').value = '';
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

async function consultar() {
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
    pintarGithub(await consultarRepo(destino));
  } catch (e) {
    pintarErrorGithub(e.message);
  } finally {
    boton.disabled = false;
    boton.textContent = 'Consultar';
  }
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
  $('#nombre').addEventListener('input', () => { salirDeEjemplo(); recalcular(); });
  $('#ejemplo').addEventListener('click', cargarEjemplo);
  $('#limpiar').addEventListener('click', limpiar);
  $('#consultar').addEventListener('click', consultar);
  $('#repo').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); consultar(); } });
  iniciarHudMini();

  cargarEjemplo();
  // /proceso/ enlaza aquí con ?categoria=CATx desde el diagnóstico rápido.
  const pedida = new URLSearchParams(location.search).get('categoria');
  if (pedida && categoria(pedida)) {
    estado.categoria = pedida;
    sel.value = pedida;
    $('#nombre').value = '';
    salirDeEjemplo();
    pintarPesos();
    ponerTodo(Array(12).fill(3));
    recalcular();
  }
}

iniciar();
