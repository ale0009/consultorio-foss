import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  puntajeDesdePorcentaje, clasificar, validarPesos, calcularPtotal,
  desviacionEstandar, indiceCumplimiento, evaluar, recomendarCategoria, UMBRALES,
} from '../js/motor.js';
import { CATEGORIAS, CRITERIOS, EJEMPLO_LIBREOFFICE, PREGUNTAS_DIAGNOSTICO } from '../js/datos.js';

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
