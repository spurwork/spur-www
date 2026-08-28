# Worker Support FAQ content

The Worker Support page is intentionally Git-based. Each answer lives in its own Markdown file under `worker-faq/content`, so content changes are readable in pull requests and can be reviewed by Support, HR, or Legal before publishing.

## Content folders

- `content/core`: concise answers from the Spur Staffing Help Center FAQ.
- `content/reference`: detailed articles from the FAQ website export, including state- and district-specific requirements.

Each file needs front matter with a `title` and `category`, followed by Markdown content:

```md
---
title: How do I update my password?
category: Profile & Account Management
---

Open your profile, choose Settings, and select Change Password.
```

Use `review: true` and a quoted `notice` when a supplied article contains dated steps or conflicts with another source. The generated page will display a visible “Confirm current process” label and warning.

## Build and preview

Run `npm run build:faq` after editing content. This regenerates `worker-support.html`, which is committed alongside its source content so the static site can publish it directly.

Run `npm test` to check the generator and browser JavaScript, then rebuild the FAQ page.

## Publishing workflow

1. Edit or add the relevant Markdown file.
2. Have the subject-matter owner review policy, benefit, background-check, medical, and district-specific changes.
3. Run `npm test`.
4. Commit both the Markdown change and regenerated `worker-support.html` in the same pull request.

This setup is a good fit while updates are occasional and already flow through Git. If nontechnical Support staff need frequent same-day publishing, the same Markdown model can later be moved behind a lightweight headless CMS without redesigning the page.
