# Consultorio FOSS · versión de muestra

> **Proyecto de muestra sin mantenimiento.** Es una versión nueva, independiente y reimplementada desde cero de nuestra investigación de grado. El sistema original pertenece a la Universidad ECCI; este repositorio no contiene su código.

[English version](README.en.md)

Sitio estático de una sola página que presenta la investigación **«Propuesta de implementación de un Consultorio de Informática en la Universidad ECCI, basado en software libre»** (Ingeniería de Sistemas, 2026, semillero SigestECCI) y una **demo funcional** de sus dos instrumentos centrales:

- **Motor RCI (Rúbrica Científica Integral):** el visitante puntúa un software en 12 criterios (C1–C12) y ve en vivo el puntaje ponderado `P_total = Σ(C_i × w_i)`, la desviación estándar σ, el índice de cumplimiento I_min y la clasificación **APTO** (≥ 3,75), **CONDICIONAL** (2,50–3,75) o **NO APTO** (< 2,50). Incluye los 11 vectores de pesos por categoría y un ejemplo precargado (LibreOffice, valores ilustrativos).
- **Diagnóstico rápido:** 10 preguntas reales del Banco de Preguntas Diagnósticas (275 preguntas, 11 categorías) que sugieren la categoría tecnológica por la que empezar y conectan con el motor.

Además resume el problema, los objetivos, la metodología, el estado del arte, la arquitectura (React + Supabase/PostgreSQL con RLS y auditoría inmutable), las pruebas (Gherkin, IEEE 829), el OWASP Top 10, la matriz de trazabilidad, los resultados y las conclusiones.

## Capturas

| Vista | Descripción |
|---|---|
| Portada (1440 px) | Título «Elegir software libre con método, no a ciegas», tres viñetas con las cifras del DANE (68 %, 71 %, 12 %) y un globo de diálogo con la idea central. |
| Motor RCI | Formulario con 12 deslizadores 1–5 y, al lado, el resultado: medidor con umbrales, puntaje grande, sello APTO/CONDICIONAL/NO APTO, σ e I_min. |
| Diagnóstico (390 px) | Preguntas con opciones No / Sí / Sí, es prioritario; la categoría sugerida aparece con un botón para evaluar con su vector de pesos. |
| Arquitectura | Diagrama SVG propio: actores → SPA React → Supabase (GoTrue, PostgREST, Realtime, PostgreSQL 15 con RLS y tabla de logs inmutable). |

Estilo «Tinta y trama»: viñetas con borde de tinta, trama de puntos y acento rojo, inspirado en el manga. Modo claro y oscuro, accesible con teclado y respetuoso de `prefers-reduced-motion`.

## Cómo correrlo

No requiere instalación ni compilación.

```bash
python3 -m http.server 8000   # o: npm start
# abrir http://localhost:8000
```

Pruebas del motor (Node 20 o superior):

```bash
node --test   # o: npm test
```

Se puede publicar tal cual en GitHub Pages (rama `main`, carpeta raíz).

## Estructura

```
index.html          página única
css/styles.css      estilos y temas
js/datos.js         criterios, pesos por categoría y preguntas (datos de la investigación)
js/motor.js         funciones puras del motor RCI y del diagnóstico
js/app.js           interfaz
test/motor.test.js  pruebas con node:test
```

## Créditos

- **Mario Puerta** (Mario Alejandro Puerta Alarcón): coautor de la investigación y el desarrollo.
- **David Rincón «Kuronoma»** (David Alexander Rincón Corredor): coautor de la investigación y el desarrollo. [LinkedIn](https://www.linkedin.com/in/davidalexanderrinconcorredorkuronoma/)

Investigación original: trabajo de grado, Universidad ECCI (2026), semillero SigestECCI. Esta es una versión de muestra, independiente, creada por Mario Puerta y David Rincón «Kuronoma»; no se mantiene activamente.

## Licencia

Código bajo [MIT](LICENSE) © 2026 Mario Alejandro Puerta Alarcón y David Alexander Rincón Corredor.
