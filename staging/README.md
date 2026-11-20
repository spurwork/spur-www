# Review copy (staging)

A review copy of the site for feedback before anything is published. It runs on Fly.io and tells search engines not to index it. It is served without an access code (`OPEN = "1"` in `fly.toml`), so anyone with the link can open it.

- `./staging/build.sh` builds the review copy into `staging/site/`. It adds a ribbon, reviewer notes and content that still needs sign-off (`STAGING=1`). The public pages in the repository root are not changed.
- `cd staging && fly deploy` publishes it to the `spur-education-staging` app.
- To put it behind a shared code again, remove `OPEN` from `fly.toml` and set the Fly secret: `fly secrets set ACCESS_CODE=... -a spur-education-staging`.
- Tour and demo forms on the review copy post to `/__lead`, which only writes the entry to the app log (`fly logs -a spur-education-staging`). Nothing is emailed.

`server.mjs` is a small static file server with an optional access-code page. It is not a security boundary for real data.
