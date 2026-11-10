# ¿Es APTO? · Free software suitability checker

> **Showcase project, not maintained.** A new, independent version rebuilt from scratch from our undergraduate research. The original system belongs to Universidad ECCI; this repository does not contain its code.

[Versión en español](README.md)

## What it does

One thing: it answers **"is this free software suitable (APTO) for your organisation?"**. The site is in Spanish.

- **`/` — the tool.** Type the software name, pick one of 11 categories (each one changes the weights) and rate 12 criteria on 1–5 levels. Hovering (or tapping) a level shows its anchor descriptor. You get, live, the **APTO / CONDICIONAL / NO APTO** verdict as a stamp, `P_total = Σ(C_i × w_i)`, standard deviation σ, compliance index I_min and **the criterion holding you back most** (the one that would raise P_total the most if it reached 5). It opens with a clearly labelled example (LibreOffice).
- **Software search.** The "Software" field autocompletes from a local catalogue of 176 free software projects across the 11 categories (seeded from the domain catalogue we built for the consulting office, completed with projects verified on GitHub on 10 November 2026). If the name is not there, it searches GitHub's public API live (no key) and lists name, description, stars, licence and last activity so you can pick the right one. Picking one shows a card with **what it is and what it is for**, suggests the category and preloads C1–C3 from GitHub (labelled "sugerido", editable); C4–C12 start at 3. GitHub allows 10 searches per minute without an account: the tool counts them, says how long to wait and, offline, keeps working with the local catalogue.
- **Optional GitHub data.** Paste `owner/repo` or the URL and GitHub's public API (no key, 60 requests per hour) returns licence, dates and contributors, used to **suggest** C1 Licence, C2 Maturity and C3 Community. Suggestions are editable; in this panel they are only applied when you press «Usar». Offline or rate-limited, the error is explained and sample data labelled "offline: sample data from 10 November 2026" is offered.
- **`/proceso/` — how we got there.** The full research: the problem with DANE and CEPAL figures, the methodological tracking system, the comparison with OpenBRR, QSOS, EvdEN and BasicMet, the question bank (with a quick diagnosis that opens the tool with the suggested category), architecture, quality and OWASP Top 10, results, hand-made SVG charts (problem, framework coverage, heat map of the 11 weight vectors), design decisions and an **errata** listing source figures that do not add up.

## How to use it

No install or build step.

```bash
python3 -m http.server 8000   # or: npm start
# open http://localhost:8000 (tool) and http://localhost:8000/proceso/
```

Tests (Node 20+):

```bash
node --test   # or: npm test
```

Deployable as-is on GitHub Pages (`main` branch, root folder).

## Where it comes from

Undergraduate thesis **"Proposal for a university IT consulting office at Universidad ECCI based on free software"** (Systems Engineering, Universidad ECCI, 2026, SigestECCI research group). Formulas 3.1–3.3, the 12 criteria with their anchor descriptors (Table 5.6.2) and the 11 weight vectors (Table 5.6.1 and Annex H.1) come from it. Anything computed in this version (the criterion holding you back, the intermediate cut-offs of the GitHub suggestions, the errata counts) is labelled as such in `/proceso/`.

## Credits

- **Mario Puerta** (Mario Alejandro Puerta Alarcón): co-author of the research and development. [GitHub](https://github.com/ale0009)
- **David Rincón "Kuronoma"** (David Alexander Rincón Corredor): co-author of the research and development. [LinkedIn](https://www.linkedin.com/in/davidalexanderrinconcorredorkuronoma/)

## Licence

Code under [MIT](LICENSE) © 2026 Mario Alejandro Puerta Alarcón and David Alexander Rincón Corredor.
