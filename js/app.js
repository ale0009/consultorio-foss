// Interfaz del sitio: conecta el DOM con las funciones puras de motor.js.
import { CRITERIOS, CATEGORIAS, EJEMPLO_LIBREOFFICE, PREGUNTAS_DIAGNOSTICO } from './datos.js';
import { evaluar, puntajeDesdePorcentaje, recomendarCategoria } from './motor.js';

const $ = (sel) => document.querySelector(sel);
const num = (x, d = 2) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d });
const categoria = (id) => CATEGORIAS.find((c) => c.id === id);

/* ---------- Tema claro / oscuro ---------- */
function iniciarTema() {
  const boton = $('.boton-tema');
  const raiz = document.documentElement;
  const oscuroSistema = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
  const esOscuro = () => (raiz.dataset.theme ? raiz.dataset.theme === 'dark' : oscuroSistema());
  const pintar = () => {
    boton.setAttribute('aria-label', esOscuro() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    boton.setAttribute('aria-pressed', String(esOscuro()));
  };
  boton.addEventListener('click', () => {
    raiz.dataset.theme = esOscuro() ? 'light' : 'dark';
    try { localStorage.setItem('tema', raiz.dataset.theme); } catch (e) { /* sin almacenamiento */ }
    pintar();
  });
  pintar();
}

/* ---------- Menú móvil ---------- */
function iniciarMenu() {
  const boton = $('.boton-menu');
  const menu = $('#menu');
  const cerrar = () => { boton.setAttribute('aria-expanded', 'false'); menu.classList.remove('abierto'); };
  boton.addEventListener('click', () => {
    const abierto = boton.getAttribute('aria-expanded') === 'true';
    boton.setAttribute('aria-expanded', String(!abierto));
    menu.classList.toggle('abierto', !abierto);
  });
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) cerrar(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('abierto')) { cerrar(); boton.focus(); } });
}

/* ---------- Tabla del estado del arte ---------- */
const MARCOS = [
  // [criterio, OpenBRR, QSOS, EvdEN, BasicMet, RCI]
  ['Licencia y tipo FOSS', 1, 1, 1, 1, 'C1'],
  ['Madurez y estabilidad', 1, 1, 1, 1, 'C2'],
  ['Comunidad y ecosistema', 1, 1, 0, 0, 'C3'],
  ['Funcionalidad técnica', 1, 1, 1, 1, 'C4'],
  ['Usabilidad', 0, 1, 1, 0, 'C5'],
  ['Interoperabilidad', 1, 1, 1, 0, 'C6'],
  ['Personalización', 0, 1, 0, 0, 'C7'],
  ['Documentación', 1, 1, 1, 1, 'C8'],
  ['Seguridad', 1, 0, 1, 0, 'C9'],
  ['Escalabilidad', 0, 0, 0, 0, 'C10'],
  ['Ciclo de vida y soporte', 1, 1, 1, 1, 'C11'],
  ['Viabilidad económica (TCO)', 1, 0, 1, 1, 'C12'],
];
function pintarMarcos() {
  const marca = (v) => (v ? '<span class="si">Sí</span>' : '<span class="no">No</span>');
  $('#tabla-marcos').innerHTML = MARCOS.map(([c, a, b, d, e, rci]) =>
    `<tr><th scope="row">${c}</th><td>${marca(a)}</td><td>${marca(b)}</td><td>${marca(d)}</td><td>${marca(e)}</td><td><span class="si si--rci">Sí (${rci})</span></td></tr>`
  ).join('');
}

/* ---------- OWASP ---------- */
const OWASP = [
  ['A01', 'Broken Access Control', 'Parcial', 'Alta', 'Tres capas de control: rutas protegidas, guardas por rol y políticas RLS.'],
  ['A02', 'Cryptographic Failures', 'Mitigado', 'Baja', 'Credenciales delegadas en GoTrue, que guarda contraseñas con hash bcrypt.'],
  ['A03', 'Injection', 'Mitigado', 'Baja', 'Consultas parametrizadas generadas por PostgREST; sin SQL concatenado.'],
  ['A04', 'Insecure Design', 'Moderado', 'Alta', 'Debilidades de diseño listadas, p. ej. sin límite de intentos de inicio de sesión.'],
  ['A05', 'Security Misconfiguration', 'Parcial', 'Media', 'Configuración de conexión expuesta en el bundle; documentada como deuda.'],
  ['A06', 'Vulnerable and Outdated Components', 'Monitoreo', 'Media', 'Auditoría de dependencias y revisión de CVE; sin críticos durante el desarrollo.'],
  ['A07', 'Identification and Authentication Failures', 'Mitigado', 'Baja', 'Identidad delegada en GoTrue; la autenticación dual queda como deuda técnica.'],
  ['A08', 'Software and Data Integrity Failures', 'Parcial', 'Alta', 'Reversión manual al guardar evaluaciones; falta una transacción atómica real.'],
  ['A09', 'Security Logging and Monitoring Failures', 'Bien implementado', 'Baja', 'Tabla de logs inmutable por RLS e inserción vía RPC con SECURITY DEFINER.'],
  ['A10', 'Server-Side Request Forgery', 'No aplicable', 'N/A', 'No hay servidor intermedio que haga peticiones en nombre del cliente.'],
];
function pintarOwasp() {
  const clase = (estado) => ({ Mitigado: 'ok', 'Bien implementado': 'ok', Parcial: 'medio', Moderado: 'medio', Monitoreo: 'medio' }[estado] || 'na');
  $('#lista-owasp').innerHTML = OWASP.map(([id, nombre, estado, prioridad, nota]) => `
    <li class="owasp__item">
      <span class="owasp__id">${id}</span>
      <div class="owasp__cuerpo">
        <p class="owasp__nombre">${nombre}</p>
        <p class="owasp__nota">${nota}</p>
      </div>
      <div class="owasp__estado">
        <span class="chapa chapa--${clase(estado)}">${estado}</span>
        <span class="owasp__prioridad">Prioridad v2.0: ${prioridad}</span>
      </div>
    </li>`).join('');
}

/* ---------- Motor RCI ---------- */
const estado = { puntajes: Array(12).fill(3), categoria: 'CAT1' };
const NIVELES = { 1: 'Crítico', 2: 'Deficiente', 3: 'Aceptable', 4: 'Bueno', 5: 'Excelente' };

function pintarCriterios() {
  const pesos = categoria(estado.categoria).pesos;
  $('#lista-criterios').innerHTML = CRITERIOS.map((c, i) => `
    <div class="criterio">
      <div class="criterio__cabecera">
        <label for="c-${i}" class="criterio__nombre"><span class="criterio__id">${c.id}</span> ${c.nombre}</label>
        <span class="criterio__peso" id="w-${i}" title="Peso del criterio en la categoría">w = ${num(pesos[i])}</span>
      </div>
      <div class="criterio__control">
        <input type="range" id="c-${i}" min="1" max="5" step="1" value="${estado.puntajes[i]}"
          aria-describedby="d-${i}" aria-valuetext="${estado.puntajes[i]}, ${NIVELES[estado.puntajes[i]]}">
        <output for="c-${i}" class="criterio__valor" id="v-${i}">${estado.puntajes[i]}</output>
      </div>
      <p class="criterio__desc" id="d-${i}">${c.descripcion} <span class="criterio__anclas">1: ${c.critico} · 5: ${c.excelente}</span></p>
    </div>`).join('');
  CRITERIOS.forEach((_, i) => {
    $(`#c-${i}`).addEventListener('input', (e) => {
      const v = Number(e.target.value);
      estado.puntajes[i] = v;
      e.target.setAttribute('aria-valuetext', `${v}, ${NIVELES[v]}`);
      $(`#v-${i}`).textContent = v;
      recalcular();
    });
  });
}

function actualizarPesos() {
  const pesos = categoria(estado.categoria).pesos;
  pesos.forEach((w, i) => { $(`#w-${i}`).textContent = `w = ${num(w)}`; });
}

function ponerPuntajes(puntajes) {
  estado.puntajes = [...puntajes];
  puntajes.forEach((v, i) => {
    const r = $(`#c-${i}`);
    r.value = v;
    r.setAttribute('aria-valuetext', `${v}, ${NIVELES[v]}`);
    $(`#v-${i}`).textContent = v;
  });
}

let temporizadorAnuncio;
function recalcular() {
  const cat = categoria(estado.categoria);
  const r = evaluar(estado.puntajes, cat.pesos);
  const nombre = $('#nombre-software').value.trim() || 'Software sin nombre';
  $('#resultado-nombre').textContent = `${nombre} · ${cat.id} ${cat.nombre}`;
  $('#ptotal').textContent = num(r.ptotal);
  $('#sigma').textContent = num(r.sigma);
  $('#imin').textContent = `${Math.round(r.imin * 100)} %`;
  const sello = $('#sello');
  sello.textContent = r.clasificacion;
  sello.dataset.clase = r.clasificacion;
  $('#medidor-relleno').style.width = `${((r.ptotal - 1) / 4) * 100}%`;
  $('#medidor-relleno').dataset.clase = r.clasificacion;

  const textos = {
    APTO: 'Recomendable sin restricciones para el contexto evaluado.',
    CONDICIONAL: 'Adoptable bajo condiciones: capacitación, adaptación o soporte adicional.',
    'NO APTO': 'No recomendable para el contexto evaluado.',
  };
  const bajos = CRITERIOS.filter((_, i) => estado.puntajes[i] < 3).map((c) => c.id);
  $('#explicacion').textContent = textos[r.clasificacion] +
    (bajos.length ? ` Criterios por debajo de 3: ${bajos.join(', ')}.` : ' Ningún criterio por debajo de 3.');

  $('#tabla-aportes').innerHTML = CRITERIOS.map((c, i) =>
    `<tr><th scope="row">${c.id} ${c.nombre}</th><td>${estado.puntajes[i]}</td><td>${num(cat.pesos[i])}</td><td>${num(r.aportes[i], 2)}</td></tr>`
  ).join('') + `<tr class="fila-total"><th scope="row">P<sub>total</sub></th><td></td><td>1,00</td><td>${num(r.ptotal)}</td></tr>`;

  clearTimeout(temporizadorAnuncio);
  temporizadorAnuncio = setTimeout(() => {
    $('#anuncio').textContent = `Puntaje total ${num(r.ptotal)} de 5: ${r.clasificacion}.`;
  }, 600);
}

function iniciarMotor() {
  const sel = $('#categoria');
  sel.innerHTML = CATEGORIAS.map((c) => `<option value="${c.id}">${c.id} · ${c.nombre}</option>`).join('');
  sel.value = estado.categoria;
  pintarCriterios();
  sel.addEventListener('change', () => { estado.categoria = sel.value; actualizarPesos(); recalcular(); });
  $('#nombre-software').addEventListener('input', recalcular);
  $('#cargar-ejemplo').addEventListener('click', cargarEjemplo);
  $('#reiniciar').addEventListener('click', () => {
    ponerPuntajes(Array(12).fill(3));
    $('#nombre-software').value = '';
    recalcular();
  });
  cargarEjemplo();
}

function cargarEjemplo() {
  estado.categoria = EJEMPLO_LIBREOFFICE.categoria;
  $('#categoria').value = estado.categoria;
  $('#nombre-software').value = `${EJEMPLO_LIBREOFFICE.nombre} (ejemplo)`;
  actualizarPesos();
  ponerPuntajes(EJEMPLO_LIBREOFFICE.porcentajes.map(puntajeDesdePorcentaje));
  recalcular();
}

/* ---------- Diagnóstico ---------- */
const respuestas = {};
function iniciarDiagnostico() {
  $('#lista-preguntas').innerHTML = PREGUNTAS_DIAGNOSTICO.map((p, i) => `
    <li class="pregunta">
      <fieldset>
        <legend><span class="pregunta__codigo">${p.codigo}</span> ${p.texto}</legend>
        <div class="opciones">
          <label><input type="radio" name="q-${i}" value="0" checked> No</label>
          <label><input type="radio" name="q-${i}" value="1"> Sí</label>
          <label><input type="radio" name="q-${i}" value="2"> Sí, es prioritario</label>
        </div>
      </fieldset>
    </li>`).join('');
  $('#form-diagnostico').addEventListener('change', (e) => {
    const m = e.target.name?.match(/^q-(\d+)$/);
    if (!m) return;
    respuestas[PREGUNTAS_DIAGNOSTICO[Number(m[1])].codigo] = Number(e.target.value);
    pintarDiagnostico();
  });
}

function pintarDiagnostico() {
  const { ranking, recomendadas } = recomendarCategoria(respuestas, PREGUNTAS_DIAGNOSTICO);
  const caja = $('#diag-resultado');
  if (!recomendadas.length) {
    caja.innerHTML = '<p>Responda al menos una pregunta con «Sí».</p>';
    return;
  }
  const principal = categoria(recomendadas[0]);
  const wMax = Math.max(...principal.pesos);
  const top = CRITERIOS.filter((_, i) => principal.pesos[i] === wMax).map((c) => `${c.id} ${c.nombre}`);
  const topTexto = top.length > 1 ? `${top.slice(0, -1).join(', ')} y ${top.at(-1)}` : top[0];
  const otras = ranking.filter((r) => r.puntaje > 0 && r.categoria !== principal.id);
  caja.innerHTML = `
    <p class="diag__principal"><span class="diag__id">${principal.id}</span> ${principal.nombre}</p>
    ${recomendadas.length > 1 ? `<p>Empate con: ${recomendadas.slice(1).map((id) => `${id} ${categoria(id).nombre}`).join(', ')}.</p>` : ''}
    <p>En esta categoría ${top.length > 1 ? 'los criterios con más peso son' : 'el criterio con más peso es'} <strong>${topTexto}</strong> (w = ${num(wMax)}). El banco completo tiene ${principal.preguntas} preguntas para ella.</p>
    ${otras.length && recomendadas.length === 1 ? `<p class="pie">También marcó: ${otras.map((r) => r.categoria).join(', ')}.</p>` : ''}
    <button type="button" class="boton boton--primario boton--chico" id="ir-motor">Evaluar con el vector de ${principal.id}</button>`;
  $('#ir-motor').addEventListener('click', () => {
    estado.categoria = principal.id;
    $('#categoria').value = principal.id;
    actualizarPesos();
    recalcular();
    $('#motor').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    $('#categoria').focus({ preventScroll: true });
  });
}

iniciarTema();
iniciarMenu();
pintarMarcos();
pintarOwasp();
iniciarMotor();
iniciarDiagnostico();
