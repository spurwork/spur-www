# Review copy (staging)

A private copy of the site for review before anything is published. It runs on Fly.io behind one shared access code and tells search engines not to index it.

- `./staging/build.sh` builds the review copy into `staging/site/`. It adds a ribbon, reviewer notes and content that still needs sign-off (`STAGING=1`). The public pages in the repository root are not changed.
- `cd staging && fly deploy` publishes it to the `spur-education-staging` app.
- The access code is a Fly secret: `fly secrets set ACCESS_CODE=... -a spur-education-staging`. It is never stored in this repository.
- Tour and demo forms on the review copy post to `/__lead`, which only writes the entry to the app log (`fly logs -a spur-education-staging`). Nothing is emailed.

`server.mjs` is a small static file server with the access-code page. It is not a security boundary for real data.
