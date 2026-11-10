import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parsearRepo, ultimaPagina, sugerirLicencia, sugerirMadurez, sugerirComunidad,
  sugerirDesdeRepo, consultarRepo, ErrorGithub,
} from '../js/github.js';
import { GITHUB_RESPALDO } from '../js/datos.js';

const AHORA = Date.parse('2026-11-10T20:00:00Z');
const haceAnios = (a) => new Date(AHORA - a * 365.25 * 86_400_000).toISOString();
const haceDias = (d) => new Date(AHORA - d * 86_400_000).toISOString();

test('parsearRepo acepta formas comunes y rechaza basura', () => {
  const esperado = { dueno: 'LibreOffice', repo: 'core' };
  assert.deepEqual(parsearRepo('LibreOffice/core'), esperado);
  assert.deepEqual(parsearRepo('https://github.com/LibreOffice/core'), esperado);
  assert.deepEqual(parsearRepo('github.com/LibreOffice/core.git'), esperado);
  assert.deepEqual(parsearRepo('  https://www.github.com/LibreOffice/core/tree/master?x=1 '), esperado);
  for (const malo of ['', 'libreoffice', '/core', 'due ño/repo', 'a/..', null, 'x/<script>']) {
    assert.equal(parsearRepo(malo), null, String(malo));
  }
});

test('ultimaPagina lee rel="last" de la cabecera Link', () => {
  const link = '<https://api.github.com/repositories/1/contributors?per_page=1&anon=1&page=2>; rel="next", <https://api.github.com/repositories/1/contributors?per_page=1&anon=1&page=2948>; rel="last"';
  assert.equal(ultimaPagina(link), 2948);
  assert.equal(ultimaPagina(null), null);
  assert.equal(ultimaPagina('<x?page=2>; rel="next"'), null);
});

test('C1 Licencia: ancla 5, libre reconocida, desconocida y ausente', () => {
  assert.equal(sugerirLicencia('GPL-3.0').puntaje, 5);
  assert.equal(sugerirLicencia('AGPL-3.0').puntaje, 5);
  assert.equal(sugerirLicencia('MIT').puntaje, 5);
  assert.equal(sugerirLicencia('Apache-2.0').puntaje, 5);
  assert.equal(sugerirLicencia('MPL-2.0').puntaje, 4);
  assert.equal(sugerirLicencia('BSD-3-Clause').puntaje, 4);
  assert.equal(sugerirLicencia('NOASSERTION').puntaje, 2);
  assert.equal(sugerirLicencia(null).puntaje, 1);
});

test('C2 Madurez: años en GitHub, archivado y actividad', () => {
  assert.equal(sugerirMadurez({ creado: haceDias(100), ultimoPush: haceDias(1) }, AHORA).puntaje, 1);
  assert.equal(sugerirMadurez({ creado: haceAnios(1.5), ultimoPush: haceDias(1) }, AHORA).puntaje, 2);
  assert.equal(sugerirMadurez({ creado: haceAnios(4), ultimoPush: haceDias(1) }, AHORA).puntaje, 4);
  assert.equal(sugerirMadurez({ creado: haceAnios(8), ultimoPush: haceDias(10) }, AHORA).puntaje, 5);
  assert.equal(sugerirMadurez({ creado: haceAnios(8), ultimoPush: haceDias(200) }, AHORA).puntaje, 4);
  assert.equal(sugerirMadurez({ creado: haceAnios(8), ultimoPush: haceDias(1), archivado: true }, AHORA).puntaje, 1);
});

test('C3 Comunidad: contribuidores, inactividad y dato ausente', () => {
  const activo = { ultimoPush: haceDias(5) };
  assert.equal(sugerirComunidad({ ...activo, contribuidores: 1 }, AHORA).puntaje, 1);
  assert.equal(sugerirComunidad({ ...activo, contribuidores: 9 }, AHORA).puntaje, 2);
  assert.equal(sugerirComunidad({ ...activo, contribuidores: 50 }, AHORA).puntaje, 3);
  assert.equal(sugerirComunidad({ ...activo, contribuidores: 2948 }, AHORA).puntaje, 4);
  assert.equal(sugerirComunidad({ ...activo, contribuidores: 12000 }, AHORA).puntaje, 5);
  assert.equal(sugerirComunidad({ contribuidores: 12000, ultimoPush: haceDias(200) }, AHORA).puntaje, 1);
  assert.equal(sugerirComunidad({ ...activo, contribuidores: null }, AHORA).puntaje, null);
});

test('respaldo sin conexión (LibreOffice/core, 2026-11-10) → C1 5, C2 5, C3 4', () => {
  const s = sugerirDesdeRepo(GITHUB_RESPALDO, Date.parse(`${GITHUB_RESPALDO.fecha}T20:00:00Z`));
  assert.deepEqual([s.C1.puntaje, s.C2.puntaje, s.C3.puntaje], [5, 5, 4]);
});

// --- consultarRepo con un fetch falso ---
const respuesta = (status, cuerpo, cabeceras = {}) => ({
  status, ok: status >= 200 && status < 300,
  headers: { get: (k) => cabeceras[k.toLowerCase()] ?? null },
  json: async () => cuerpo,
});

test('consultarRepo normaliza la respuesta y cuenta contribuidores', async () => {
  const llamadas = [];
  const fetchFalso = async (url) => {
    llamadas.push(url);
    if (url.includes('/contributors')) return respuesta(200, [{}], { link: '<https://x/contributors?per_page=1&anon=1&page=37>; rel="last"' });
    return respuesta(200, { full_name: 'a/b', html_url: 'https://github.com/a/b', license: { spdx_id: 'MIT', name: 'MIT License' }, created_at: '2020-01-01T00:00:00Z', pushed_at: '2026-11-01T00:00:00Z', archived: false, stargazers_count: 10, forks_count: 2 });
  };
  const d = await consultarRepo({ dueno: 'a', repo: 'b' }, fetchFalso);
  assert.equal(d.licenciaSpdx, 'MIT');
  assert.equal(d.contribuidores, 37);
  assert.equal(llamadas.length, 2);
  assert.ok(llamadas[0].startsWith('https://api.github.com/repos/a/b'));
});

test('consultarRepo explica los errores: 404, límite de 60/h y red caída', async () => {
  await assert.rejects(consultarRepo({ dueno: 'a', repo: 'b' }, async () => respuesta(404, {})), (e) => e instanceof ErrorGithub && e.tipo === 'no-existe');
  await assert.rejects(
    consultarRepo({ dueno: 'a', repo: 'b' }, async () => respuesta(403, {}, { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': '1794000000' })),
    (e) => e.tipo === 'limite' && /60 consultas/.test(e.message),
  );
  await assert.rejects(consultarRepo({ dueno: 'a', repo: 'b' }, async () => { throw new TypeError('Failed to fetch'); }), (e) => e.tipo === 'red');
});

test('consultarRepo sigue si falla el conteo de contribuidores', async () => {
  const fetchFalso = async (url) => (url.includes('/contributors')
    ? respuesta(403, {})
    : respuesta(200, { full_name: 'a/b', license: null, created_at: '2020-01-01T00:00:00Z', pushed_at: '2026-11-01T00:00:00Z', stargazers_count: 0, forks_count: 0 }));
  const d = await consultarRepo({ dueno: 'a', repo: 'b' }, fetchFalso);
  assert.equal(d.contribuidores, null);
  assert.equal(d.licenciaSpdx, null);
});
