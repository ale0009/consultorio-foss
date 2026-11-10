import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CATALOGO, normalizar, filtrarCatalogo, puntuarEntrada, buscarPorRepo, sugerirCategoria } from '../js/catalogo.js';
import { CATEGORIAS } from '../js/datos.js';
import { parsearRepo } from '../js/github.js';

test('normalizar quita tildes, mayúsculas y signos', () => {
  assert.equal(normalizar('  Ofimática  y  PRODUCTIVIDAD '), 'ofimatica y productividad');
  assert.equal(normalizar('Rocket.Chat'), 'rocket chat');
  assert.equal(normalizar('Notepad++'), 'notepad plus plus');
  assert.equal(normalizar('Diseño 3D'), 'diseno 3d');
  assert.equal(normalizar(null), '');
});

test('el catálogo cubre las 11 categorías con datos completos y repos válidos', () => {
  const ids = new Set(CATEGORIAS.map((c) => c.id));
  for (const id of ids) assert.ok(CATALOGO.some((e) => e.cat === id), `falta ${id}`);
  const nombres = new Set();
  for (const e of CATALOGO) {
    assert.ok(ids.has(e.cat), `${e.n}: categoría ${e.cat}`);
    assert.ok(e.n && e.que && e.lic && e.url, `${e.n}: campos`);
    assert.ok(e.que.length <= 120, `${e.n}: «para qué sirve» debe caber en una línea`);
    assert.ok(e.repo === null || parsearRepo(e.repo), `${e.n}: repo ${e.repo}`);
    assert.ok(!nombres.has(normalizar(e.n)), `${e.n} repetido`);
    nombres.add(normalizar(e.n));
  }
  // La semilla del catálogo de Mario y David está incluida.
  assert.ok(CATALOGO.filter((e) => e.s).length >= 40);
});

test('filtrarCatalogo: coincidencia exacta primero, sin tildes ni mayúsculas', () => {
  assert.equal(filtrarCatalogo('krita')[0].n, 'Krita');
  assert.equal(filtrarCatalogo('BLENDER')[0].n, 'Blender');
  assert.equal(filtrarCatalogo('artcraft')[0].n, 'ArtCraft');
  assert.equal(filtrarCatalogo('art craft')[0].n, 'ArtCraft');
  assert.equal(filtrarCatalogo('libre office')[0].n, 'LibreOffice');
  assert.equal(filtrarCatalogo('Nóxt')[0], undefined);
  assert.deepEqual(filtrarCatalogo(''), []);
  assert.deepEqual(filtrarCatalogo('   '), []);
});

test('filtrarCatalogo: prefijo, alias y límite', () => {
  const m = filtrarCatalogo('m').map((e) => e.n);
  assert.ok(m.length <= 6);
  assert.ok(m.every((n) => /m/i.test(n)));
  assert.equal(filtrarCatalogo('photoshop')[0].n, 'GIMP');
  assert.equal(filtrarCatalogo('docker')[0].n, 'Docker Engine (Moby)');
  assert.equal(filtrarCatalogo('next')[0].n, 'Nextcloud');
  assert.equal(filtrarCatalogo('o', CATALOGO, 3).length, 3);
});

test('filtrarCatalogo busca palabras en «para qué sirve» solo con 3 letras o más', () => {
  const contables = filtrarCatalogo('contabilidad', CATALOGO, 20).map((e) => e.n);
  assert.ok(contables.includes('GnuCash'));
  assert.equal(puntuarEntrada(CATALOGO[0], 'de'), 0);
});

test('buscarPorRepo ignora mayúsculas', () => {
  assert.equal(buscarPorRepo('kde/KRITA').n, 'Krita');
  assert.equal(buscarPorRepo('nadie/nada'), null);
  assert.equal(buscarPorRepo(null), null);
});

test('sugerirCategoria usa descripción y temas (que valen doble)', () => {
  const artcraft = sugerirCategoria({
    nombre: 'artcraft',
    descripcion: 'ArtCraft is an intentional crafting engine for artists, designers, and filmmakers',
    temas: ['3d-graphics', 'ai', 'aivideo', 'filmmaking', 'imagegeneration'],
  });
  assert.equal(artcraft.id, 'CAT7');
  assert.ok(artcraft.coincidencias.includes('artist'));
  assert.equal(sugerirCategoria({ descripcion: 'Open source CRM for small business sales teams' }).id, 'CAT10');
  assert.equal(sugerirCategoria({ descripcion: 'A personal finances manager', temas: ['budget', 'accounting'] }).id, 'CAT9');
  assert.equal(sugerirCategoria({ descripcion: 'xyz' }), null);
  // «ide» es una clave corta: no debe encajar dentro de «identity».
  assert.notEqual(sugerirCategoria({ descripcion: 'identity provider with SSO' }).id, 'CAT5');
  assert.equal(sugerirCategoria(), null);
});
