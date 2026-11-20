# Spur public website

This repository contains the static Spur Education website for the hostname in
[`CNAME`](CNAME) (`spureducation.com`). Pages are checked in as HTML, CSS, JavaScript,
images, and other public assets. The Node build scripts generate selected pages
from repository content; there is no application server in this repository.

## Build and content sources

Use `npm ci` and `npm run build` to run all three generators. The scripts in
`package.json` can also be run separately:

| Command | Input and output |
| --- | --- |
| `npm run build:site` | Builds the home, company, service and SpurHR pages from `build-back-office.js` and `build-spur-hr.js`. |
| `npm run build:blog` | Builds blog pages and feeds from `blog/content/`; see the [writing guide](blog/WRITING_GUIDE.md). |
| `npm run build:faq` | Builds `worker-support.html` from `worker-faq/content/`; see the [FAQ guide](worker-faq/README.md). |
| `npm test` | Checks the FAQ generator and browser script, then regenerates the FAQ page. |

Commit generated pages with their source changes, as described in the FAQ guide.
Review worker policy, benefit, background-check, medical, and district-specific
answers with the relevant subject-matter owner before publishing.

## Design system and SpurHR pages

The generated pages use Spur's Homeroom design system: tokens and type in `css/back-office.css`, logos in `brand/`, and self-hosted Literata and Atkinson Hyperlegible Next in `fonts/` (SIL Open Font License). The legal, support and worker-support pages still use the older `css/styles.css` look.

Product screenshots in `images/spurhr/` are captured from the SpurHR prototype with `tools/capture-spurhr-screens.mjs` (serve a sandbox build locally, then run it; `VIEW=1120x700` gives larger UI for the screens shown beside text). Re-run it when the prototype changes.

`build-spur-hr.js` holds the SpurHR product page (`hr.html`) and the tour and demo page (`hr-tour.html`). Its content rules are at the top of the file: every release claim carries a date, illustrations say they use sample data, pricing shows no figures until `pricing` is filled in, and an FAQ entry with a `review` field is left off the public site until that field is removed.

Build options: `LEAD_ENDPOINT` (where the tour and demo forms post; without it they open a pre-addressed email), `SANDBOX_URL` (the SpurHR sandbox link), and `STAGING=1` with `OUT_DIR` for the private review copy. See [staging/README.md](staging/README.md).

## Publishing and ownership

`CNAME` records the custom hostname. Repository Pages metadata reviewed on
2026-11-04 identifies GitHub Pages legacy publishing from `main` at the repository
root for `spureducation.com`. A push or merge to `main` can therefore publish
content without a workflow file. Confirm the exact live artifact, rollback method,
domain/DNS owner and content approver before changing production; see the
[maintenance handoff](docs/maintenance-handoff.md).

The separate [Spur Staffing site](https://github.com/spurwork/spur-staffing) is a
different repository with its own marketing content and contact-form API. Coordinate
shared pages and links across the two sites to avoid diverging worker guidance.
