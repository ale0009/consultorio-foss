// Motor de decisión multicriterio (MCDA) de la Rúbrica Científica Integral (RCI).
// Reimplementación demostrativa, desde cero, de las fórmulas de la investigación:
//   Fórmula 3.1  P_total = Σ (C_i × w_i),  con Σ w_i = 1
//   Fórmula 3.2  porcentaje de respuestas "Sí" → escala Likert 1–5
//   Fórmula 3.3  P_total ≥ 3,75 → APTO · 2,50 ≤ P_total < 3,75 → CONDICIONAL · < 2,50 → NO APTO
// Además: desviación estándar σ e índice de cumplimiento I_min = (#criterios con C_i ≥ 3) / 12.
// Todas las funciones son puras (sin DOM) para poder probarlas con `node --test`.

export const UMBRALES = Object.freeze({ apto: 3.75, condicional: 2.5 });
export const NUM_CRITERIOS = 12;
export const TOLERANCIA_PESOS = 0.001;

/** Redondeo para evitar artefactos de punto flotante (p. ej. 3.7499999999). */
const redondear = (x, decimales = 6) => {
  const f = 10 ** decimales;
  return Math.round(x * f) / f;
};

/** Fórmula 3.2: porcentaje de respuestas afirmativas (0–1) → puntaje 1–5. */
export function puntajeDesdePorcentaje(porcentaje) {
  if (typeof porcentaje !== 'number' || Number.isNaN(porcentaje) || porcentaje < 0 || porcentaje > 1) {
    throw new RangeError('El porcentaje debe ser un número entre 0 y 1');
  }
  if (porcentaje >= 0.9) return 5;
  if (porcentaje >= 0.75) return 4;
  if (porcentaje >= 0.5) return 3;
  if (porcentaje >= 0.25) return 2;
  return 1;
}

/** Fórmula 3.3: clasificación según los umbrales sobre P_total. */
export function clasificar(ptotal) {
  const p = redondear(ptotal);
  if (p >= UMBRALES.apto) return 'APTO';
  if (p >= UMBRALES.condicional) return 'CONDICIONAL';
  return 'NO APTO';
}

/** Comprueba que el vector tenga 12 pesos no negativos que sumen 1 (± 0,001). */
export function validarPesos(pesos) {
  if (!Array.isArray(pesos) || pesos.length !== NUM_CRITERIOS) {
    throw new Error(`Se esperaban ${NUM_CRITERIOS} pesos`);
  }
  if (pesos.some((w) => typeof w !== 'number' || w < 0)) {
    throw new Error('Los pesos deben ser números no negativos');
  }
  const suma = pesos.reduce((a, b) => a + b, 0);
  if (Math.abs(suma - 1) > TOLERANCIA_PESOS) {
    throw new Error(`La suma de pesos es ${suma.toFixed(3)} y debe ser 1,00`);
  }
  return true;
}

function validarPuntajes(puntajes) {
  if (!Array.isArray(puntajes) || puntajes.length !== NUM_CRITERIOS) {
    throw new Error(`Se esperaban ${NUM_CRITERIOS} puntajes`);
  }
  if (puntajes.some((c) => typeof c !== 'number' || c < 1 || c > 5)) {
    throw new RangeError('Cada puntaje debe estar entre 1 y 5');
  }
}

/** Fórmula 3.1: P_total = Σ (C_i × w_i). */
export function calcularPtotal(puntajes, pesos) {
  validarPuntajes(puntajes);
  validarPesos(pesos);
  return redondear(puntajes.reduce((acc, c, i) => acc + c * pesos[i], 0));
}

/** Desviación estándar poblacional σ de los 12 puntajes (homogeneidad del perfil). */
export function desviacionEstandar(puntajes) {
  validarPuntajes(puntajes);
  const media = puntajes.reduce((a, b) => a + b, 0) / puntajes.length;
  const varianza = puntajes.reduce((a, x) => a + (x - media) ** 2, 0) / puntajes.length;
  return redondear(Math.sqrt(varianza));
}

/** Índice de cumplimiento mínimo I_min = criterios con C_i ≥ 3 / 12. */
export function indiceCumplimiento(puntajes) {
  validarPuntajes(puntajes);
  return redondear(puntajes.filter((c) => c >= 3).length / NUM_CRITERIOS);
}

/** Evaluación completa: P_total, clasificación, σ, I_min y aporte de cada criterio. */
export function evaluar(puntajes, pesos) {
  const ptotal = calcularPtotal(puntajes, pesos);
  return {
    ptotal,
    clasificacion: clasificar(ptotal),
    sigma: desviacionEstandar(puntajes),
    imin: indiceCumplimiento(puntajes),
    aportes: puntajes.map((c, i) => redondear(c * pesos[i])),
  };
}

/**
 * Diagnóstico simplificado: cada respuesta vale 0 (no), 1 (sí) o 2 (sí, prioritario)
 * y suma a la categoría de su pregunta. Devuelve las categorías ordenadas por puntaje
 * (empates en el orden del banco) y las recomendadas (las de puntaje máximo > 0).
 */
export function recomendarCategoria(respuestas, preguntas) {
  const puntos = new Map();
  for (const p of preguntas) {
    const v = respuestas[p.codigo] ?? 0;
    if (![0, 1, 2].includes(v)) throw new RangeError(`Respuesta inválida para ${p.codigo}`);
    puntos.set(p.categoria, (puntos.get(p.categoria) ?? 0) + v);
  }
  const ranking = [...puntos.entries()]
    .map(([categoria, puntaje], orden) => ({ categoria, puntaje, orden }))
    .sort((a, b) => b.puntaje - a.puntaje || a.orden - b.orden)
    .map(({ categoria, puntaje }) => ({ categoria, puntaje }));
  const maximo = ranking.length ? ranking[0].puntaje : 0;
  const recomendadas = maximo > 0 ? ranking.filter((r) => r.puntaje === maximo).map((r) => r.categoria) : [];
  return { ranking, recomendadas };
}
