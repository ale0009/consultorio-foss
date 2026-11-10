# ¿Es APTO? · Evaluador de software libre

> **Proyecto de muestra sin mantenimiento.** Versión nueva, independiente y reimplementada desde cero de nuestra investigación de grado. El sistema original pertenece a la Universidad ECCI; este repositorio no contiene su código.

[English version](README.en.md)

## Qué hace

Una sola cosa: responde **«¿este software libre es APTO para tu organización?»**.

- **`/` — la herramienta.** Escribes el nombre del software, eliges una de las 11 categorías (cada una cambia los pesos) y puntúas 12 criterios con niveles de 1 a 5. Al pasar el cursor (o tocar) un nivel ves su descriptor ancla. En vivo aparecen el veredicto **APTO / CONDICIONAL / NO APTO** como un sello, `P_total = Σ(C_i × w_i)`, la desviación σ, el índice I_min y **el criterio que más te frena** (el que más subiría P_total si llegara a 5). Abre con un ejemplo marcado (LibreOffice).
- **Buscador de software.** El campo «Software» autocompleta desde un catálogo local de 176 proyectos libres repartidos en las 11 categorías (semilla: el catálogo por dominio funcional que armamos para el Consultorio, completado con proyectos verificados en GitHub el 10 de noviembre de 2026). Si el nombre no está, busca en vivo en la API pública de GitHub (sin clave) y muestra nombre, descripción, estrellas, licencia y último cambio para que elijas el correcto. Al elegir, una tarjeta dice **qué es y para qué sirve**, sugiere la categoría y precarga C1–C3 desde GitHub (marcados «sugerido», editables); C4–C12 quedan en 3. GitHub permite 10 búsquedas por minuto sin cuenta: la herramienta lleva la cuenta, avisa cuánto esperar y, sin red, sigue funcionando con el catálogo local.
- **Opcional: datos de GitHub.** Pegas `dueño/repo` o la URL y la API pública de GitHub (sin clave, 60 consultas por hora) trae licencia, fechas y contribuidores; con eso se **sugieren** C1 Licencia, C2 Madurez y C3 Comunidad. Las sugerencias son editables; a mano solo se aplican cuando pulsas «Usar». Si no hay red o se agota el límite, se explica el error y se ofrecen datos de ejemplo marcados «sin conexión: datos de ejemplo del 10 de noviembre de 2026».
- **`/proceso/` — cómo se llegó ahí.** La investigación completa: el problema con cifras del DANE y la CEPAL, el Sistema de Seguimiento Metodológico, la comparación con OpenBRR, QSOS, EvdEN y BasicMet, el banco de preguntas (con un diagnóstico rápido que abre la herramienta con la categoría sugerida), la arquitectura, la calidad y el OWASP Top 10, los resultados, gráficas SVG propias (problema, cobertura de marcos, mapa de los 11 vectores de pesos), las decisiones de diseño y una **fe de erratas** con las cifras de la fuente que no cuadran.

## Cómo usarlo

No requiere instalación ni compilación.

```bash
python3 -m http.server 8000   # o: npm start
# abrir http://localhost:8000  (herramienta) y http://localhost:8000/proceso/
```

Pruebas (Node 20 o superior):

```bash
node --test   # o: npm test
```

Se publica tal cual en GitHub Pages (rama `main`, carpeta raíz).

## Estructura

```
index.html            la herramienta
proceso/index.html    la investigación y el proceso
css/styles.css        paleta «Tinta y trama» (oscuro: línea Jisseki) y componentes comunes
css/herramienta.css   estilos de la herramienta
css/proceso.css       gráficas y muestras de diseño
js/datos.js           criterios, descriptores, pesos por categoría, preguntas y respaldo sin conexión
js/motor.js           funciones puras del motor RCI (P_total, σ, I_min, criterio que más frena, diagnóstico)
js/catalogo.js        catálogo local de software libre, filtro, normalización y categoría sugerida (puras)
js/github.js          lectura y búsqueda de repositorios, sugerencias C1–C3 y límite de búsquedas (puras; fetch inyectable)
js/herramienta.js     interfaz de la herramienta
js/proceso.js         interfaz de /proceso/ y gráficas
js/tema.js            tema claro / oscuro
test/                 pruebas con node:test
```

## De qué trabajo sale

Trabajo de grado **«Propuesta de implementación de un Consultorio de Informática en la Universidad ECCI, basado en software libre»** (Ingeniería de Sistemas, Universidad ECCI, 2026, semillero SigestECCI). Las fórmulas (3.1, 3.2 y 3.3), los 12 criterios con sus descriptores ancla (Tabla 5.6.2) y los 11 vectores de pesos (Tabla 5.6.1 y Anexo H.1) vienen de ahí. Lo calculado en esta versión (el criterio que más frena, los cortes intermedios de las sugerencias de GitHub y los conteos de la fe de erratas) está marcado como tal en `/proceso/`.

## Créditos

- **Mario Puerta** (Mario Alejandro Puerta Alarcón): coautor de la investigación y el desarrollo. [GitHub](https://github.com/ale0009)
- **David Rincón «Kuronoma»** (David Alexander Rincón Corredor): coautor de la investigación y el desarrollo. [LinkedIn](https://www.linkedin.com/in/davidalexanderrinconcorredorkuronoma/)

## Licencia

Código bajo [MIT](LICENSE) © 2026 Mario Alejandro Puerta Alarcón y David Alexander Rincón Corredor.
