import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  puntajeDesdePorcentaje, clasificar, validarPesos, calcularPtotal,
  desviacionEstandar, indiceCumplimiento, evaluar, recomendarCategoria, UMBRALES, criterioQueMasFrena,
} from '../js/motor.js';
import { CATEGORIAS, CRITERIOS, EJEMPLO_LIBREOFFICE, PREGUNTAS_DIAGNOSTICO, NIVELES, descriptorNivel } from '../js/datos.js';

const pesosCat = (id) => CATEGORIAS.find((c) => c.id === id).pesos;

test('fórmula 3.2: porcentaje → escala 1–5 en los límites', () => {
  assert.equal(puntajeDesdePorcentaje(1), 5);
  assert.equal(puntajeDesdePorcentaje(0.9), 5);
  assert.equal(puntajeDesdePorcentaje(0.8999), 4);
  assert.equal(puntajeDesdePorcentaje(0.75), 4);
  assert.equal(puntajeDesdePorcentaje(0.5), 3);
  assert.equal(puntajeDesdePorcentaje(0.25), 2);
  assert.equal(puntajeDesdePorcentaje(0.2499), 1);
  assert.equal(puntajeDesdePorcentaje(0), 1);
  assert.throws(() => puntajeDesdePorcentaje(1.2), RangeError);
  assert.throws(() => puntajeDesdePorcentaje(-0.1), RangeError);
});

test('fórmula 3.3: umbrales APTO / CONDICIONAL / NO APTO', () => {
  assert.equal(UMBRALES.apto, 3.75);
  assert.equal(UMBRALES.condicional, 2.5);
  assert.equal(clasificar(5), 'APTO');
  assert.equal(clasificar(3.75), 'APTO');
  assert.equal(clasificar(3.7499999999), 'APTO'); // artefacto de punto flotante
  assert.equal(clasificar(3.74), 'CONDICIONAL');
  assert.equal(clasificar(2.5), 'CONDICIONAL');
  assert.equal(clasificar(2.49), 'NO APTO');
  assert.equal(clasificar(1), 'NO APTO');
});

test('hay 12 criterios y 11 categorías', () => {
  assert.equal(CRITERIOS.length, 12);
  assert.deepEqual(CRITERIOS.map((c) => c.id), Array.from({ length: 12 }, (_, i) => `C${i + 1}`));
  assert.equal(CATEGORIAS.length, 11);
});

test('el banco suma 275 preguntas', () => {
  assert.equal(CATEGORIAS.reduce((a, c) => a + c.preguntas, 0), 275);
});

test('cada vector de ponderación (CAT1–CAT11) suma 1,00', () => {
  for (const cat of CATEGORIAS) {
    assert.ok(validarPesos(cat.pesos), cat.id);
  }
});

test('CAT3 prioriza Seguridad (C9 = 0,15)', () => {
  const w = pesosCat('CAT3');
  assert.equal(w[8], 0.15);
  assert.equal(Math.max(...w), 0.15);
});

test('validarPesos rechaza vectores inválidos', () => {
  assert.throws(() => validarPesos([0.5, 0.5]));
  assert.throws(() => validarPesos(Array(12).fill(0.1)));
  assert.throws(() => validarPesos([...Array(11).fill(0.1), -0.1]));
});

test('fórmula 3.1: P_total con perfil uniforme es igual al puntaje', () => {
  for (const cat of CATEGORIAS) {
    for (const v of [1, 3, 5]) {
      assert.equal(calcularPtotal(Array(12).fill(v), cat.pesos), v);
    }
  }
});

test('P_total rechaza puntajes fuera de 1–5', () => {
  assert.throws(() => calcularPtotal(Array(12).fill(6), pesosCat('CAT1')), RangeError);
  assert.throws(() => calcularPtotal(Array(11).fill(3), pesosCat('CAT1')));
});

test('ejemplo LibreOffice (CAT1): conversión y P_total recalculado', () => {
  const puntajes = EJEMPLO_LIBREOFFICE.porcentajes.map(puntajeDesdePorcentaje);
  assert.deepEqual(puntajes, [5, 4, 4, 5, 4, 4, 3, 4, 4, 3, 4, 3]);
  const r = evaluar(puntajes, pesosCat('CAT1'));
  assert.equal(r.ptotal, 3.93);
  assert.equal(r.clasificacion, 'APTO');
  assert.equal(r.imin, 1);
  assert.equal(r.aportes.length, 12);
});

test('σ e I_min', () => {
  assert.equal(desviacionEstandar(Array(12).fill(4)), 0);
  assert.equal(desviacionEstandar([1, 5, 1, 5, 1, 5, 1, 5, 1, 5, 1, 5]), 2);
  assert.equal(indiceCumplimiento([1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2]), 0.5);
});

test('perfil débil queda NO APTO', () => {
  const r = evaluar([2, 2, 1, 3, 2, 2, 1, 2, 3, 2, 2, 2], pesosCat('CAT1'));
  assert.ok(r.ptotal < 2.5);
  assert.equal(r.clasificacion, 'NO APTO');
});

test('diagnóstico: recomienda la categoría con más puntos y reporta empates', () => {
  assert.equal(PREGUNTAS_DIAGNOSTICO.length, 10);
  let r = recomendarCategoria({}, PREGUNTAS_DIAGNOSTICO);
  assert.deepEqual(r.recomendadas, []);
  r = recomendarCategoria({ P909: 2, P108: 1 }, PREGUNTAS_DIAGNOSTICO);
  assert.deepEqual(r.recomendadas, ['CAT9']);
  assert.equal(r.ranking[1].categoria, 'CAT1');
  r = recomendarCategoria({ P108: 1, P1007: 1 }, PREGUNTAS_DIAGNOSTICO);
  assert.deepEqual(r.recomendadas, ['CAT1', 'CAT10']);
  assert.throws(() => recomendarCategoria({ P108: 3 }, PREGUNTAS_DIAGNOSTICO), RangeError);
});

test('el criterio que más frena es el de mayor pérdida (5 − C_i) × w_i', () => {
  const w = pesosCat('CAT3'); // C9 pesa 0,15
  const puntajes = Array(12).fill(4);
  puntajes[8] = 2; // C9 Seguridad
  puntajes[0] = 1; // C1 Licencia, w = 0,09
  const f = criterioQueMasFrena(puntajes, w);
  assert.equal(CRITERIOS[f.indice].id, 'C9'); // 3 × 0,15 = 0,45 > 4 × 0,09 = 0,36
  assert.equal(f.perdida, 0.45);
  assert.equal(f.puntaje, 2);
  assert.equal(f.ptotalSiSube, calcularPtotal(puntajes.map((c, i) => (i === 8 ? 5 : c)), w));
});

test('el criterio que más frena: empate por peso, y null si todo está en 5', () => {
  const w = pesosCat('CAT1'); // C4, C5, C6 y C9 pesan 0,09; el resto 0,08
  const f = criterioQueMasFrena(Array(12).fill(4), w);
  assert.equal(CRITERIOS[f.indice].id, 'C4'); // mayor peso y primero en el orden
  assert.equal(criterioQueMasFrena(Array(12).fill(5), w), null);
});

test('el ejemplo LibreOffice: lo que más frena y su efecto', () => {
  const puntajes = EJEMPLO_LIBREOFFICE.porcentajes.map(puntajeDesdePorcentaje);
  const f = criterioQueMasFrena(puntajes, pesosCat('CAT1'));
  assert.equal(CRITERIOS[f.indice].id, 'C7'); // C7, C10 y C12 en 3 con w 0,08: gana el primero
  assert.equal(f.ptotalSiSube, 4.09);
  assert.equal(f.clasificacionSiSube, 'APTO');
});

test('descriptores ancla por nivel: extremos de la tesis e interpolación', () => {
  const c9 = CRITERIOS.find((c) => c.id === 'C9');
  assert.match(descriptorNivel(c9, 1), /CVE/);
  assert.match(descriptorNivel(c9, 5), /30 días/);
  assert.match(descriptorNivel(c9, 3), /50 %/);
  assert.equal(NIVELES[4], 'Bueno');
  assert.throws(() => descriptorNivel(c9, 0), RangeError);
  for (const c of CRITERIOS) for (const n of [1, 2, 3, 4, 5]) assert.ok(descriptorNivel(c, n).length > 10);
});

test('criterios automatizables según la Tabla 5.6.2', () => {
  assert.deepEqual(CRITERIOS.filter((c) => c.auto).map((c) => c.id), ['C1', 'C2', 'C3', 'C6', 'C9', 'C11']);
});
