// Consulta opcional a la API pública de GitHub (sin clave, admite CORS; límite de
// 60 consultas por hora por IP) y sugerencias de puntaje para los criterios que la
// investigación marca como automatizables desde metadatos del repositorio: C1 Licencia,
// C2 Madurez y C3 Comunidad (Tabla 5.6.2). Las sugerencias son editables: nunca
// sustituyen el juicio de quien evalúa.
// Las funciones de interpretación son puras; `consultarRepo` recibe `fetch` como
// parámetro para poder probarla sin red.

const API = 'https://api.github.com';
const DIA = 86_400_000;
const ANIO = 365.25 * DIA;

/** Acepta «dueño/repo», «github.com/dueño/repo» o la URL completa. Devuelve null si no es válido. */
export function parsearRepo(texto) {
  if (typeof texto !== 'string') return null;
  let t = texto.trim().replace(/^https?:\/\//i, '').replace(/^(www\.)?github\.com\//i, '');
  t = t.replace(/[?#].*$/, '');
  const partes = t.split('/').filter(Boolean);
  if (partes.length < 2) return null;
  const dueno = partes[0];
  const repo = partes[1].replace(/\.git$/i, '');
  if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(dueno)) return null;
  if (!/^[A-Za-z0-9._-]{1,100}$/.test(repo) || repo === '.' || repo === '..') return null;
  return { dueno, repo };
}

/** Número de la última página en una cabecera Link de GitHub (rel="last"), o null. */
export function ultimaPagina(link) {
  if (!link) return null;
  const m = String(link).match(/[?&]page=(\d+)[^>]*>;\s*rel="last"/);
  return m ? Number(m[1]) : null;
}

const LICENCIAS_ANCLA = /^(A|L)?GPL-|^MIT$|^Apache-2\.0$/;
const LICENCIAS_LIBRES = new Set([
  'BSD-2-Clause', 'BSD-3-Clause', 'MPL-2.0', 'EPL-1.0', 'EPL-2.0', 'ISC', 'Unlicense', '0BSD', 'Zlib',
  'BSL-1.0', 'EUPL-1.1', 'EUPL-1.2', 'Artistic-2.0', 'OSL-3.0', 'AFL-3.0', 'ECL-2.0', 'MS-PL', 'MS-RL',
  'NCSA', 'PostgreSQL', 'UPL-1.0', 'MulanPSL-2.0', 'CECILL-2.1', 'LPPL-1.3c', 'OFL-1.1', 'WTFPL', 'CC0-1.0',
]);

/** Sugerencia para C1 Licencia a partir del identificador SPDX que detecta GitHub. */
export function sugerirLicencia(spdx) {
  if (!spdx) return { puntaje: 1, motivo: 'GitHub no encuentra licencia: sin licencia, por defecto todos los derechos quedan reservados.' };
  if (spdx === 'NOASSERTION' || spdx === 'other') {
    return { puntaje: 2, motivo: 'Hay un archivo de licencia que GitHub no reconoce: léelo a mano antes de puntuar.' };
  }
  if (LICENCIAS_ANCLA.test(spdx)) return { puntaje: 5, motivo: `${spdx}: es de las licencias que la rúbrica pone como ejemplo del nivel 5 (GPL, MIT, Apache).` };
  if (LICENCIAS_LIBRES.has(spdx)) return { puntaje: 4, motivo: `${spdx}: licencia libre reconocida, distinta de las del nivel 5; revisa sus condiciones.` };
  return { puntaje: 3, motivo: `${spdx}: licencia poco común; confirma que es libre (OSI o FSF).` };
}

/** Sugerencia para C2 Madurez: antigüedad del repositorio y señales de abandono. */
export function sugerirMadurez({ creado, ultimoPush, archivado }, ahora = Date.now()) {
  if (archivado) return { puntaje: 1, motivo: 'El repositorio está archivado: ya no recibe cambios.' };
  const anios = (ahora - Date.parse(creado)) / ANIO;
  const diasSinPush = (ahora - Date.parse(ultimoPush)) / DIA;
  const texto = `${anios < 1 ? 'menos de 1 año' : `${Math.floor(anios)} ${Math.floor(anios) === 1 ? 'año' : 'años'}`} en GitHub`;
  let puntaje;
  if (anios < 1) puntaje = 1;
  else if (anios < 2) puntaje = 2;
  else if (anios < 3) puntaje = 3;
  else if (anios < 5) puntaje = 4;
  else puntaje = diasSinPush <= 90 ? 5 : 4;
  const extra = puntaje === 5 ? ' y cambios en los últimos 90 días; confirma que haya una versión LTS.'
    : anios >= 5 ? ', pero sin cambios en los últimos 90 días.' : '.';
  return { puntaje, motivo: `${texto}${extra}` };
}

/** Sugerencia para C3 Comunidad: contribuidores y actividad en los últimos seis meses. */
export function sugerirComunidad({ contribuidores, ultimoPush, archivado }, ahora = Date.now()) {
  const diasSinPush = (ahora - Date.parse(ultimoPush)) / DIA;
  if (archivado || diasSinPush > 182) return { puntaje: 1, motivo: 'Sin actividad en los últimos seis meses: comunidad inactiva.' };
  if (contribuidores == null) return { puntaje: null, motivo: 'GitHub no dio el número de contribuidores (pasa en repositorios enormes): puntúa a mano.' };
  const n = contribuidores.toLocaleString('es-CO');
  let puntaje;
  if (contribuidores <= 1) puntaje = 1;
  else if (contribuidores < 10) puntaje = 2;
  else if (contribuidores < 100) puntaje = 3;
  else if (contribuidores < 10000) puntaje = 4;
  else puntaje = 5;
  return { puntaje, motivo: `${n} ${contribuidores === 1 ? 'contribuidor' : 'contribuidores'} y actividad reciente.` };
}

/** Las tres sugerencias juntas, en el formato que usa la interfaz. */
export function sugerirDesdeRepo(datos, ahora = Date.now()) {
  return {
    C1: sugerirLicencia(datos.licenciaSpdx),
    C2: sugerirMadurez(datos, ahora),
    C3: sugerirComunidad(datos, ahora),
  };
}

/** Error con un mensaje pensado para mostrarse tal cual al visitante. */
export class ErrorGithub extends Error {
  constructor(mensaje, tipo) { super(mensaje); this.tipo = tipo; }
}

function horaReset(cabeceras) {
  const reset = Number(cabeceras.get('x-ratelimit-reset'));
  if (!reset) return '';
  const h = new Date(reset * 1000);
  return ` Se libera a las ${String(h.getHours()).padStart(2, '0')}:${String(h.getMinutes()).padStart(2, '0')}.`;
}

/**
 * Consulta el repositorio y su número de contribuidores (2 peticiones).
 * Devuelve los datos normalizados o lanza ErrorGithub con un mensaje claro.
 */
export async function consultarRepo({ dueno, repo }, fetchFn = globalThis.fetch) {
  const base = `${API}/repos/${encodeURIComponent(dueno)}/${encodeURIComponent(repo)}`;
  const opciones = { headers: { Accept: 'application/vnd.github+json' } };
  let r;
  try {
    r = await fetchFn(base, opciones);
  } catch {
    throw new ErrorGithub('No hubo conexión con GitHub. Revisa tu red o usa los datos de ejemplo.', 'red');
  }
  if (r.status === 404) throw new ErrorGithub(`No existe el repositorio público ${dueno}/${repo} (o es privado).`, 'no-existe');
  if (r.status === 403 || r.status === 429) {
    if (r.headers.get('x-ratelimit-remaining') === '0') {
      throw new ErrorGithub(`Se agotaron las 60 consultas por hora que GitHub permite sin cuenta.${horaReset(r.headers)}`, 'limite');
    }
    throw new ErrorGithub('GitHub rechazó la consulta. Intenta de nuevo en unos minutos.', 'rechazo');
  }
  if (!r.ok) throw new ErrorGithub(`GitHub respondió con un error (${r.status}).`, 'http');
  const d = await r.json();

  let contribuidores = null;
  try {
    const rc = await fetchFn(`${base}/contributors?per_page=1&anon=1`, opciones);
    if (rc.status === 204) contribuidores = 0;
    else if (rc.ok) {
      const pagina = ultimaPagina(rc.headers.get('link'));
      contribuidores = pagina ?? (await rc.json()).length;
    }
  } catch { /* sin el conteo, C3 queda para puntuar a mano */ }

  return {
    repo: d.full_name,
    url: d.html_url,
    licenciaSpdx: d.license?.spdx_id ?? null,
    licenciaNombre: d.license?.name ?? null,
    creado: d.created_at,
    ultimoPush: d.pushed_at,
    archivado: Boolean(d.archived),
    estrellas: d.stargazers_count,
    forks: d.forks_count,
    contribuidores,
  };
}
