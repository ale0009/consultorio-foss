# Consultorio FOSS · showcase version

> **Showcase project, not maintained.** A new, independent version rebuilt from scratch from our undergraduate research. The original system belongs to Universidad ECCI; this repository does not contain its code.

[Versión en español](README.md)

A static single-page site presenting the research **"Proposal for a university IT consulting office at Universidad ECCI based on free software"** (Systems Engineering, 2026, SigestECCI research group) plus a **working demo** of its two core instruments:

- **RCI engine (Integral Scientific Rubric):** visitors score a piece of software on 12 criteria (C1–C12) and see, live, the weighted score `P_total = Σ(C_i × w_i)`, standard deviation σ, compliance index I_min and the classification **APTO** / suitable (≥ 3.75), **CONDICIONAL** / conditional (2.50–3.75) or **NO APTO** / not suitable (< 2.50). Includes the 11 per-category weight vectors and a preloaded example (LibreOffice, illustrative values).
- **Quick diagnosis:** 10 real questions from the Diagnostic Question Bank (275 questions, 11 categories) that suggest a technology category and hand it over to the engine.

It also summarises the problem, objectives, methodology, state of the art, architecture (React + Supabase/PostgreSQL with RLS and immutable audit log), testing (Gherkin, IEEE 829), OWASP Top 10, traceability matrix, results and conclusions. The site content is in Spanish.

## Screenshots

| View | Description |
|---|---|
| Hero (1440 px) | Headline, three comic-style panels with the DANE figures (68 %, 71 %, 12 %) and a speech bubble with the core insight. |
| RCI engine | 12 sliders (1–5) next to a result panel: threshold gauge, large score, APTO/CONDICIONAL/NO APTO stamp, σ and I_min. |
| Diagnosis (390 px) | Questions with No / Yes / Yes, priority; the suggested category comes with a button to evaluate using its weight vector. |
| Architecture | Hand-made SVG: actors → React SPA → Supabase (GoTrue, PostgREST, Realtime, PostgreSQL 15 with RLS and an immutable log table). |

"Ink and halftone" style inspired by manga panels. Light and dark themes, keyboard accessible, honours `prefers-reduced-motion`.

## Run it

No install or build step.

```bash
python3 -m http.server 8000   # or: npm start
# open http://localhost:8000
```

Engine tests (Node 20+):

```bash
node --test   # or: npm test
```

Ready for GitHub Pages (branch `main`, root folder).

## Credits

- **Mario Puerta** (Mario Alejandro Puerta Alarcón): co-author of the research and development.
- **David Rincón "Kuronoma"** (David Alexander Rincón Corredor): co-author of the research and development. [LinkedIn](https://www.linkedin.com/in/davidalexanderrinconcorredorkuronoma/)

Original research: undergraduate thesis, Universidad ECCI (2026), SigestECCI research group. This is an independent showcase version created by Mario Puerta and David Rincón "Kuronoma"; it is not actively maintained.

## License

Code under [MIT](LICENSE) © 2026 Mario Alejandro Puerta Alarcón and David Alexander Rincón Corredor.
