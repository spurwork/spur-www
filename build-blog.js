const fs = require('fs');
const path = require('path');
const frontMatter = require('front-matter');
const { marked } = require('marked');
// Feed is ESM-only, so we dynamically import it in buildRSS
let Feed;

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const SITE_URL = 'https://spureducation.com';
const BLOG_URL = `${SITE_URL}/blog`;
const CONTENT_DIR = path.join(__dirname, 'blog', 'content');
const OUTPUT_DIR = path.join(__dirname, 'blog');
const POSTS_DIR = path.join(OUTPUT_DIR, 'posts');
const AUTHORS_DIR = path.join(OUTPUT_DIR, 'authors');
const CATEGORIES_DIR = path.join(OUTPUT_DIR, 'categories');
const TAGS_DIR = path.join(OUTPUT_DIR, 'tags');

// Author metadata
const AUTHORS = {
  'rob-magliano': {
    name: 'Rob Magliano',
    title: 'VP of Sales',
    slug: 'rob-magliano',
    bio: 'Rob works directly with school districts across the country, helping them solve their most pressing staffing challenges. He brings a field-level perspective on what is actually working in K-12 staffing.',
    focus: ['Teacher Recruitment', 'Substitute Teaching', 'Staffing Operations'],
    avatar: '/rob.png',
  },
  'donnie-decker': {
    name: 'Donnie Decker',
    title: 'COO',
    slug: 'donnie-decker',
    bio: 'Donnie oversees operations at Spur and brings a systems-thinking approach to education staffing. He focuses on building frameworks that make complex problems manageable.',
    focus: ['Staffing Operations', 'Leadership and Culture', 'Teacher Retention'],
    avatar: '/donnie.jpg',
  },
  'crystal-difrancesca': {
    name: 'Crystal DiFrancesca',
    title: 'VP of HR',
    slug: 'crystal-difrancesca',
    bio: 'Crystal leads HR at Spur with a focus on worker experience, dignity, and clarity. She writes about what it takes to build staffing systems that treat people well.',
    focus: ['Teacher Retention', 'Substitute Teaching', 'Leadership and Culture'],
    avatar: '/DiFrancesca_800_small-500x500.jpg',
  },
  'gary-henderson': {
    name: 'Gary Henderson',
    title: 'President, ALABS',
    slug: 'gary-henderson',
    bio: 'Gary has spent his career building and running extended learning programs across multiple states. He writes about implementation, program design, and what it takes to make after-school and summer programs work.',
    focus: ['Extended Learning', 'Attendance Recovery', 'Leadership and Culture'],
    avatar: '/gary.jpg',
  },
};

// Category metadata
const CATEGORIES = {
  'teacher-retention': { name: 'Teacher Retention', color: '#8b5cf6' },
  'teacher-recruitment': { name: 'Teacher Recruitment', color: '#ec4899' },
  'substitute-teaching': { name: 'Substitute Teaching', color: '#10b981' },
  'extended-learning': { name: 'Extended Learning', color: '#f59e0b' },
  'staffing-operations': { name: 'Staffing Operations', color: '#6366f1' },
  'leadership-culture': { name: 'Leadership and Culture', color: '#06b6d4' },
  'attendance-recovery': { name: 'Attendance Recovery', color: '#10b981' },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readTemplate(name) {
  const tplPath = path.join(__dirname, 'blog', `_${name}.html`);
  if (fs.existsSync(tplPath)) return fs.readFileSync(tplPath, 'utf-8');
  return null;
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function estimateReadTime(text) {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 250));
}

function getNavHTML() {
  // Read nav from index.html
  const indexPath = path.join(__dirname, 'index.html');
  if (!fs.existsSync(indexPath)) return '';
  const html = fs.readFileSync(indexPath, 'utf-8');
  const navMatch = html.match(/<nav[\s\S]*?<\/nav>/);
  return navMatch ? navMatch[0] : '';
}

function getFooterHTML() {
  const indexPath = path.join(__dirname, 'index.html');
  if (!fs.existsSync(indexPath)) return '';
  const html = fs.readFileSync(indexPath, 'utf-8');
  const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/);
  return footerMatch ? footerMatch[0] : '';
}

function getHeadHTML(title, description, canonicalPath) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Spur Education Blog</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${SITE_URL}${canonicalPath}">
  <link rel="icon" type="image/png" href="/spur-favicon.png">
  <link rel="alternate" type="application/rss+xml" title="Spur Education Blog" href="${BLOG_URL}/feed.xml">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Instrument+Serif:ital@1&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/styles.css">
  <link rel="stylesheet" href="/css/blog.css">
</head>`;
}

// ---------------------------------------------------------------------------
// Parse all posts
// ---------------------------------------------------------------------------
function loadPosts() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log('No content directory found. Creating it.');
    ensureDir(CONTENT_DIR);
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  const posts = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
    const { attributes, body } = frontMatter(raw);
    const slug = file.replace('.md', '');
    const html = marked(body);
    const readTime = estimateReadTime(body);
    const author = AUTHORS[attributes.author] || AUTHORS['rob-magliano'];
    const categorySlug = slugify(attributes.category || 'staffing-operations');
    const category = CATEGORIES[categorySlug] || { name: attributes.category, color: '#8b5cf6' };
    const tags = (attributes.tags || []).map(t => ({ name: t, slug: slugify(t) }));

    posts.push({
      slug,
      title: attributes.title,
      description: attributes.description || '',
      date: attributes.date,
      author,
      category: { ...category, slug: categorySlug },
      tags,
      html,
      readTime,
      body,
    });
  }

  // Sort by date descending
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
}

// ---------------------------------------------------------------------------
// Build post pages
// ---------------------------------------------------------------------------
function buildPostPages(posts) {
  ensureDir(POSTS_DIR);
  const nav = getNavHTML();
  const footer = getFooterHTML();

  for (const post of posts) {
    // Find recommended posts (same category, excluding current)
    const recommended = posts
      .filter(p => p.slug !== post.slug && p.category.slug === post.category.slug)
      .slice(0, 3);
    // If not enough, fill with recent
    if (recommended.length < 3) {
      const more = posts.filter(p => p.slug !== post.slug && !recommended.includes(p)).slice(0, 3 - recommended.length);
      recommended.push(...more);
    }

    const recHTML = recommended.map(r => `
      <a href="/blog/posts/${r.slug}.html" class="blog-card">
        <div class="blog-card-body">
          <span class="blog-card-tag" data-category="${r.category.slug}">${r.category.name}</span>
          <h3 class="blog-card-title">${r.title}</h3>
          <p class="blog-card-summary">${r.description}</p>
          <div class="blog-card-footer">
            <img class="blog-card-avatar" src="${r.author.avatar}" alt="${r.author.name}">
            <span class="blog-card-author-name">${r.author.name}</span>
            <span class="blog-card-footer-sep">&middot;</span>
            <span>${formatDateShort(r.date)}</span>
          </div>
        </div>
      </a>`).join('\n');

    const page = `${getHeadHTML(post.title, post.description, `/blog/posts/${post.slug}.html`)}
<body>
  ${nav}

  <main class="blog-article-page">
    <a href="/blog/" class="blog-back">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      Back to Blog
    </a>

    <header class="blog-article-header">
      <span class="blog-card-tag" data-category="${post.category.slug}">${post.category.name}</span>
      <h1>${post.title}</h1>
      <div class="blog-article-meta">
        <img class="blog-article-meta-avatar" src="${post.author.avatar}" alt="${post.author.name}">
        <div class="blog-article-meta-author">
          <a href="/blog/authors/${post.author.slug}.html" class="blog-article-meta-author-name">${post.author.name}</a>
          <span class="blog-article-meta-author-title">${post.author.title}</span>
        </div>
        <span class="blog-article-meta-sep"></span>
        <span>${formatDate(post.date)}</span>
        <span class="blog-article-meta-sep"></span>
        <span>${post.readTime} min read</span>
      </div>
    </header>

    <article class="blog-content">
      ${post.html}
    </article>

    <!-- Email Capture -->
    <div class="blog-email-capture">
      <h3>Get practical K-12 staffing insights</h3>
      <p class="blog-email-subtitle">One email per week. No fluff. Unsubscribe anytime.</p>
      <form class="blog-email-form" action="#" method="POST">
        <input type="email" placeholder="you@district.org" required>
        <button type="submit">Subscribe</button>
      </form>
    </div>
  </main>

  <!-- Recommended -->
  <section class="blog-recommended">
    <h2>Recommended Reading</h2>
    <div class="blog-recommended-grid">
      ${recHTML}
    </div>
  </section>

  ${footer}

  <script src="/js/main.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(POSTS_DIR, `${post.slug}.html`), page);
  }
}

// ---------------------------------------------------------------------------
// Build blog index
// ---------------------------------------------------------------------------
function buildBlogIndex(posts) {
  const nav = getNavHTML();
  const footer = getFooterHTML();

  const cardsHTML = posts.map(post => `
    <a href="/blog/posts/${post.slug}.html" class="blog-card" data-category="${post.category.slug}" data-tags="${post.tags.map(t => t.slug).join(',')}">
      <div class="blog-card-body">
        <span class="blog-card-tag" data-category="${post.category.slug}">${post.category.name}</span>
        <h3 class="blog-card-title">${post.title}</h3>
        <p class="blog-card-summary">${post.description}</p>
        <div class="blog-card-footer">
          <img class="blog-card-avatar" src="${post.author.avatar}" alt="${post.author.name}">
          <span class="blog-card-author-name">${post.author.name}</span>
          <span class="blog-card-footer-sep">&middot;</span>
          <span>${formatDateShort(post.date)}</span>
          <span class="blog-card-footer-sep">&middot;</span>
          <span>${post.readTime} min read</span>
        </div>
      </div>
    </a>`).join('\n');

  const categoryButtons = Object.entries(CATEGORIES).map(([slug, cat]) =>
    `    <button data-filter="${slug}">${cat.name}</button>`
  ).join('\n');

  const page = `${getHeadHTML('Blog', 'Practical K-12 staffing insights from the field. Research-backed strategies for substitute management, teacher retention, and extended learning.', '/blog/')}
<body>
  ${nav}

  <section class="blog-hero">
    <h1>The Spur <span class="serif">Blog</span></h1>
    <p class="blog-hero-subtitle">Practical insights for K-12 staffing leaders.</p>
  </section>

  <div class="blog-filters">
    <button class="active" data-filter="all">All</button>
${categoryButtons}
  </div>

  <div class="blog-search">
    <div class="blog-search-wrapper">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input type="text" id="blog-search-input" placeholder="Search posts...">
    </div>
  </div>

  <div class="blog-grid" id="blog-grid">
    ${cardsHTML}
  </div>

  <!-- Email Capture -->
  <div class="blog-email-capture" style="margin: 0 auto 4rem;">
    <h3>Get practical K-12 staffing insights</h3>
    <p class="blog-email-subtitle">One email per week. No fluff. Unsubscribe anytime.</p>
    <form class="blog-email-form" action="#" method="POST">
      <input type="email" placeholder="you@district.org" required>
      <button type="submit">Subscribe</button>
    </form>
  </div>

  ${footer}

  <script src="/js/main.js"></script>
  <script>
    // Category filter
    document.querySelectorAll('.blog-filters button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.blog-filters button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.blog-card').forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Search
    const searchInput = document.getElementById('blog-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase();
        document.querySelectorAll('.blog-card').forEach(card => {
          const title = card.querySelector('.blog-card-title').textContent.toLowerCase();
          const summary = card.querySelector('.blog-card-summary').textContent.toLowerCase();
          card.style.display = (title.includes(q) || summary.includes(q)) ? '' : 'none';
        });
      });
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), page);
}

// ---------------------------------------------------------------------------
// Build author pages
// ---------------------------------------------------------------------------
function buildAuthorPages(posts) {
  ensureDir(AUTHORS_DIR);
  const nav = getNavHTML();
  const footer = getFooterHTML();

  for (const [slug, author] of Object.entries(AUTHORS)) {
    const authorPosts = posts.filter(p => p.author.slug === slug);
    const focusTags = author.focus.map(f => `<span class="author-page-focus-tag">${f}</span>`).join('\n          ');

    const cardsHTML = authorPosts.map(post => `
      <a href="/blog/posts/${post.slug}.html" class="blog-card">
        <div class="blog-card-body">
          <span class="blog-card-tag" data-category="${post.category.slug}">${post.category.name}</span>
          <h3 class="blog-card-title">${post.title}</h3>
          <p class="blog-card-summary">${post.description}</p>
          <div class="blog-card-footer">
            <span>${formatDateShort(post.date)}</span>
            <span class="blog-card-footer-sep">&middot;</span>
            <span>${post.readTime} min read</span>
          </div>
        </div>
      </a>`).join('\n');

    const page = `${getHeadHTML(author.name, author.bio, `/blog/authors/${slug}.html`)}
<body>
  ${nav}

  <main class="author-page">
    <a href="/blog/" class="blog-back">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      Back to Blog
    </a>

    <div class="author-page-header">
      <img class="author-page-avatar" src="${author.avatar}" alt="${author.name}">
      <div class="author-page-info">
        <h1 class="author-page-name">${author.name}</h1>
        <p class="author-page-title">${author.title}</p>
        <p class="author-page-bio">${author.bio}</p>
        <div class="author-page-focus">
          ${focusTags}
        </div>
      </div>
    </div>

    <h2 class="author-page-posts-heading">Posts by ${author.name} (${authorPosts.length})</h2>

    <div class="blog-grid">
      ${cardsHTML}
    </div>
  </main>

  ${footer}
  <script src="/js/main.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(AUTHORS_DIR, `${slug}.html`), page);
  }
}

// ---------------------------------------------------------------------------
// Build category pages
// ---------------------------------------------------------------------------
function buildCategoryPages(posts) {
  ensureDir(CATEGORIES_DIR);
  const nav = getNavHTML();
  const footer = getFooterHTML();

  for (const [slug, category] of Object.entries(CATEGORIES)) {
    const catPosts = posts.filter(p => p.category.slug === slug);

    const cardsHTML = catPosts.map(post => `
      <a href="/blog/posts/${post.slug}.html" class="blog-card">
        <div class="blog-card-body">
          <span class="blog-card-tag" data-category="${post.category.slug}">${post.category.name}</span>
          <h3 class="blog-card-title">${post.title}</h3>
          <p class="blog-card-summary">${post.description}</p>
          <div class="blog-card-footer">
            <img class="blog-card-avatar" src="${post.author.avatar}" alt="${post.author.name}">
            <span class="blog-card-author-name">${post.author.name}</span>
            <span class="blog-card-footer-sep">&middot;</span>
            <span>${formatDateShort(post.date)}</span>
          </div>
        </div>
      </a>`).join('\n');

    const page = `${getHeadHTML(category.name, `Articles about ${category.name.toLowerCase()} for K-12 districts.`, `/blog/categories/${slug}.html`)}
<body>
  ${nav}

  <main class="category-page">
    <a href="/blog/" class="blog-back">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      Back to Blog
    </a>

    <div class="category-page-header">
      <h1>${category.name}</h1>
      <p>${catPosts.length} article${catPosts.length !== 1 ? 's' : ''}</p>
    </div>

    <div class="blog-grid">
      ${cardsHTML}
    </div>
  </main>

  ${footer}
  <script src="/js/main.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(CATEGORIES_DIR, `${slug}.html`), page);
  }
}

// ---------------------------------------------------------------------------
// Build tag pages
// ---------------------------------------------------------------------------
function buildTagPages(posts) {
  ensureDir(TAGS_DIR);
  const nav = getNavHTML();
  const footer = getFooterHTML();

  const tagMap = {};
  for (const post of posts) {
    for (const tag of post.tags) {
      if (!tagMap[tag.slug]) tagMap[tag.slug] = { name: tag.name, posts: [] };
      tagMap[tag.slug].posts.push(post);
    }
  }

  for (const [slug, data] of Object.entries(tagMap)) {
    const cardsHTML = data.posts.map(post => `
      <a href="/blog/posts/${post.slug}.html" class="blog-card">
        <div class="blog-card-body">
          <span class="blog-card-tag" data-category="${post.category.slug}">${post.category.name}</span>
          <h3 class="blog-card-title">${post.title}</h3>
          <p class="blog-card-summary">${post.description}</p>
          <div class="blog-card-footer">
            <img class="blog-card-avatar" src="${post.author.avatar}" alt="${post.author.name}">
            <span class="blog-card-author-name">${post.author.name}</span>
            <span class="blog-card-footer-sep">&middot;</span>
            <span>${formatDateShort(post.date)}</span>
          </div>
        </div>
      </a>`).join('\n');

    const page = `${getHeadHTML(data.name, `Posts tagged "${data.name}"`, `/blog/tags/${slug}.html`)}
<body>
  ${nav}

  <main class="category-page">
    <a href="/blog/" class="blog-back">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      Back to Blog
    </a>

    <div class="category-page-header">
      <h1>Tag: ${data.name}</h1>
      <p>${data.posts.length} article${data.posts.length !== 1 ? 's' : ''}</p>
    </div>

    <div class="blog-grid">
      ${cardsHTML}
    </div>
  </main>

  ${footer}
  <script src="/js/main.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(TAGS_DIR, `${slug}.html`), page);
  }
}

// ---------------------------------------------------------------------------
// Generate RSS feed
// ---------------------------------------------------------------------------
async function buildRSS(posts) {
  if (!Feed) {
    const feedModule = await import('feed');
    Feed = feedModule.Feed;
  }
  const feed = new Feed({
    title: 'Spur Education Blog',
    description: 'Practical K-12 staffing insights from the field.',
    id: BLOG_URL,
    link: BLOG_URL,
    language: 'en',
    image: `${SITE_URL}/spur-favicon.png`,
    favicon: `${SITE_URL}/spur-favicon.png`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Spur Education`,
    feedLinks: {
      rss2: `${BLOG_URL}/feed.xml`,
    },
  });

  for (const post of posts.slice(0, 20)) {
    feed.addItem({
      title: post.title,
      id: `${SITE_URL}/blog/posts/${post.slug}.html`,
      link: `${SITE_URL}/blog/posts/${post.slug}.html`,
      description: post.description,
      content: post.html,
      author: [{ name: post.author.name }],
      date: new Date(post.date),
      category: [{ name: post.category.name }],
    });
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, 'feed.xml'), feed.rss2());
  console.log('  RSS feed generated');
}

// ---------------------------------------------------------------------------
// Generate sitemap
// ---------------------------------------------------------------------------
function buildSitemap(posts) {
  const urls = [
    { loc: `${BLOG_URL}/`, priority: '0.9' },
  ];

  for (const post of posts) {
    urls.push({ loc: `${SITE_URL}/blog/posts/${post.slug}.html`, priority: '0.8' });
  }

  for (const slug of Object.keys(AUTHORS)) {
    urls.push({ loc: `${SITE_URL}/blog/authors/${slug}.html`, priority: '0.6' });
  }

  for (const slug of Object.keys(CATEGORIES)) {
    urls.push({ loc: `${SITE_URL}/blog/categories/${slug}.html`, priority: '0.6' });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), xml);
  console.log('  Sitemap generated');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('Building blog...');

  const posts = loadPosts();
  console.log(`  Found ${posts.length} posts`);

  if (posts.length === 0) {
    console.log('  No posts found in blog/content/. Add .md files to build.');
    return;
  }

  buildPostPages(posts);
  console.log('  Post pages built');

  buildBlogIndex(posts);
  console.log('  Blog index built');

  buildAuthorPages(posts);
  console.log('  Author pages built');

  buildCategoryPages(posts);
  console.log('  Category pages built');

  buildTagPages(posts);
  console.log('  Tag pages built');

  await buildRSS(posts);
  buildSitemap(posts);

  console.log('Done!');
}

main();
