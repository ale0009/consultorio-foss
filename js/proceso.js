// Página /proceso/: tablas, diagnóstico rápido y gráficas SVG propias.
import { CRITERIOS, CATEGORIAS, PREGUNTAS_DIAGNOSTICO } from './datos.js';
import { recomendarCategoria } from './motor.js';
import { iniciarTema } from './tema.js';

const $ = (sel) => document.querySelector(sel);
const num = (x, d = 2) => x.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d });
const categoria = (id) => CATEGORIAS.find((c) => c.id === id);

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
    <a class="boton boton--primario boton--chico" href="../?categoria=${principal.id}">Evaluar con los pesos de ${principal.id}</a>`;
}

/* ---------- Gráficas (SVG propio, sin bibliotecas) ---------- */
const SVG = 'http://www.w3.org/2000/svg';

/**
 * Barras horizontales sobre una escala fija. filas: [{ etiqueta, valor, texto, fuente?, acento? }].
 * En contenedores estrechos la etiqueta va encima de la barra para no encoger el texto.
 */
function barras(destino, filas, { maximo, titulo, formato }) {
  const estrecho = destino.clientWidth < 520;
  const ancho = estrecho ? 360 : 640;
  const etq = estrecho ? 0 : 210;
  const paso = estrecho ? 62 : 46;
  const desp = estrecho ? 26 : 0; // desplazamiento vertical de la barra bajo la etiqueta
  const alto = filas.length * paso + 28;
  const util = ancho - etq - 64;
  const x = (v) => (v / maximo) * util;
  const marcas = [0, maximo / 2, maximo];
  destino.innerHTML = `
    <svg viewBox="0 0 ${ancho} ${alto}" role="img" aria-label="${titulo}" class="barras">
      ${marcas.map((m) => `<line x1="${etq + x(m)}" y1="4" x2="${etq + x(m)}" y2="${alto - 22}" class="g-rejilla"/><text x="${etq + x(m)}" y="${alto - 6}" text-anchor="${m === 0 && estrecho ? 'start' : 'middle'}" class="g-eje">${formato(m)}</text>`).join('')}
      ${filas.map((f, i) => {
        const y = 10 + i * paso;
        const yb = y + desp;
        return `<g class="g-fila"><title>${f.texto}</title>
          <rect x="0" y="${y - 6}" width="${ancho}" height="${paso - 6}" class="g-blanco"/>
          <text x="0" y="${y + 15}" class="g-etiqueta">${f.etiqueta}${estrecho && f.fuente ? ` <tspan class="g-fuente">· ${f.fuente}</tspan>` : ''}</text>
          ${!estrecho && f.fuente ? `<text x="0" y="${y + 31}" class="g-fuente">${f.fuente}</text>` : ''}
          <rect x="${etq}" y="${yb}" width="${Math.max(x(f.valor), 4)}" height="24" class="g-barra${f.acento ? ' g-barra--acento' : ''}"/>
          <text x="${etq + x(f.valor) + 8}" y="${yb + 17}" class="g-valor">${formato(f.valor)}</text></g>`;
      }).join('')}
    </svg>`;
}

function pintarGraficaProblema() {
  barras(document.querySelector('#grafica-problema'), [
    { etiqueta: 'Usa software sin licencia', valor: 68, fuente: 'DANE, 2022', texto: '68 % de las micro y pequeñas empresas usa software propietario sin licencia válida (DANE, 2022)' },
    { etiqueta: 'El costo frena lo digital', valor: 71, fuente: 'DANE, 2022', texto: '71 % señala el costo de licencias como barrera principal (DANE, 2022)' },
    { etiqueta: 'Desconoce alternativas libres', valor: 73, fuente: 'CEPAL, 2022', texto: '73 % de los tomadores de decisiones desconoce alternativas de código abierto (CEPAL, 2022)' },
    { etiqueta: 'Ya adoptó algo FOSS', valor: 12, fuente: 'DANE, 2022', acento: true, texto: '12 % ha adoptado alguna herramienta FOSS (DANE, 2022)' },
  ], { maximo: 100, titulo: 'El problema en cifras: 68 % sin licencia, 71 % frenado por el costo, 73 % desconoce alternativas, 12 % adoptó FOSS', formato: (v) => `${v} %` });
}

function pintarGraficaMarcos() {
  const nombres = ['OpenBRR', 'QSOS', 'EvdEN', 'BasicMet'];
  const filas = nombres.map((n, k) => {
    const total = MARCOS.reduce((a, fila) => a + fila[k + 1], 0);
    return { etiqueta: n, valor: total, texto: `${n}: ${total} de 12 criterios` };
  });
  filas.push({ etiqueta: 'RCI', valor: 12, acento: true, texto: 'RCI: 12 de 12 criterios' });
  barras(document.querySelector('#grafica-marcos'), filas, { maximo: 12, titulo: 'Criterios cubiertos de 12: OpenBRR 9, QSOS 9, EvdEN 9, BasicMet 6, RCI 12', formato: (v) => `${v}` });
}

function pintarMapaPesos() {
  const celda = 44, izq = 250, arriba = 34;
  const todos = CATEGORIAS.flatMap((c) => c.pesos);
  const min = Math.min(...todos), max = Math.max(...todos);
  const ancho = izq + 12 * celda + 4, alto = arriba + CATEGORIAS.length * celda + 4;
  // Una sola tinta (cian), de clara a oscura: magnitud secuencial.
  const opacidad = (w) => 0.12 + 0.88 * ((w - min) / (max - min));
  document.querySelector('#mapa-pesos').innerHTML = `
    <svg viewBox="0 0 ${ancho} ${alto}" role="img" aria-label="Mapa de calor de los pesos de los 12 criterios en las 11 categorías; mínimo ${min.toFixed(2)}, máximo ${max.toFixed(2)}" class="mapa">
      ${CRITERIOS.map((c, j) => `<text x="${izq + j * celda + celda / 2}" y="${arriba - 12}" text-anchor="middle" class="g-eje">${c.id}</text>`).join('')}
      ${CATEGORIAS.map((cat, i) => `
        <text x="${izq - 10}" y="${arriba + i * celda + celda / 2 + 5}" text-anchor="end" class="g-etiqueta g-etiqueta--chica">${cat.nombre}</text>
        ${cat.pesos.map((w, j) => `<g class="g-celda"><title>${cat.nombre} · ${CRITERIOS[j].id} ${CRITERIOS[j].nombre}: w = ${w.toFixed(2).replace('.', ',')}</title>
          <rect x="${izq + j * celda + 1}" y="${arriba + i * celda + 1}" width="${celda - 2}" height="${celda - 2}" class="g-calor" style="fill-opacity:${opacidad(w).toFixed(2)}"/>
          ${w === Math.max(...cat.pesos) ? `<text x="${izq + j * celda + celda / 2}" y="${arriba + i * celda + celda / 2 + 5}" text-anchor="middle" class="g-celda-valor">${w.toFixed(2).slice(1).replace('.', ',')}</text>` : ''}</g>`).join('')}`).join('')}
    </svg>`;
}

iniciarTema();
iniciarMenu();
pintarMarcos();
pintarOwasp();
iniciarDiagnostico();
pintarGraficaProblema();
pintarGraficaMarcos();
pintarMapaPesos();
let temporizadorGraficas;
let anchoPrevio = window.innerWidth;
window.addEventListener('resize', () => {
  if (window.innerWidth === anchoPrevio) return;
  anchoPrevio = window.innerWidth;
  clearTimeout(temporizadorGraficas);
  temporizadorGraficas = setTimeout(() => { pintarGraficaProblema(); pintarGraficaMarcos(); }, 150);
});
