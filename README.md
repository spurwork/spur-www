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
| `npm run build:site` | Builds the back-office service pages from `build-back-office.js`. |
| `npm run build:blog` | Builds blog pages and feeds from `blog/content/`; see the [writing guide](blog/WRITING_GUIDE.md). |
| `npm run build:faq` | Builds `worker-support.html` from `worker-faq/content/`; see the [FAQ guide](worker-faq/README.md). |
| `npm test` | Checks the FAQ generator and browser script, then regenerates the FAQ page. |

Commit generated pages with their source changes, as described in the FAQ guide.
Review worker policy, benefit, background-check, medical, and district-specific
answers with the relevant subject-matter owner before publishing.

## Publishing and ownership

`CNAME` records the intended custom hostname, but this checkout does not contain
a publishing workflow or hosting configuration that proves how the live site is
deployed. Confirm the hosting provider, deploy trigger, rollback method, domain/DNS
owner, and content approver before changing production. Document the verified
procedure here when known.

The separate [Spur Staffing site](https://github.com/spurwork/spur-staffing) is a
different repository with its own marketing content and contact-form API. Coordinate
shared pages and links across the two sites to avoid diverging worker guidance.
