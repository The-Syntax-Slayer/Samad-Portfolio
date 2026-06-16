import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import { blogPosts } from '../src/data/blogs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

const INDEXNOW_KEY = '8f5b82098b67489ab5ff15e76a6cfb12';
const DOMAIN = 'https://www.samadshaikh.dev';

// Markdown-to-HTML parser helper for crawlers/readers that do not execute JS
function markdownToHtml(md: string): string {
  const lines = md.split('\n');
  let html = '';
  let inList = false;
  let inCode = false;
  let codeBlock = '';

  for (let line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('```')) {
      if (inCode) {
        html += `<pre style="background:#080b11;padding:16px;border-radius:12px;border:1px solid rgba(255,255,255,0.05);overflow-x:auto;"><code style="font-family:monospace;color:#a8b2c1;">${escapeHtml(codeBlock)}</code></pre>\n`;
        codeBlock = '';
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeBlock += line + '\n';
      continue;
    }

    if (trimmedLine.startsWith('### ')) {
      if (inList) { html += '</ul>\n'; inList = false; }
      html += `<h3 style="font-size:1.5rem;color:#fff;margin-top:24px;margin-bottom:12px;">${trimmedLine.slice(4)}</h3>\n`;
    } else if (trimmedLine.startsWith('#### ')) {
      if (inList) { html += '</ul>\n'; inList = false; }
      html += `<h4 style="font-size:1.2rem;color:#fff;margin-top:20px;margin-bottom:8px;">${trimmedLine.slice(5)}</h4>\n`;
    } else if (trimmedLine.startsWith('## ')) {
      if (inList) { html += '</ul>\n'; inList = false; }
      html += `<h2 style="font-size:1.8rem;color:#fff;margin-top:32px;margin-bottom:16px;">${trimmedLine.slice(3)}</h2>\n`;
    } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      if (!inList) { html += '<ul style="list-style-type:disc;padding-left:24px;margin-bottom:16px;color:#a8b2c1;">\n'; inList = true; }
      html += `<li style="margin-bottom:8px;">${parseInlineMarkdown(trimmedLine.slice(2))}</li>\n`;
    } else if (trimmedLine === '---' || trimmedLine === '***') {
      if (inList) { html += '</ul>\n'; inList = false; }
      html += '<hr style="border:0;border-top:1px solid rgba(255,255,255,0.1);margin:32px 0;" />\n';
    } else if (trimmedLine.length > 0) {
      if (inList) { html += '</ul>\n'; inList = false; }
      html += `<p style="margin-bottom:16px;line-height:1.75;color:#a8b2c1;">${parseInlineMarkdown(line)}</p>\n`;
    } else {
      if (inList) { html += '</ul>\n'; inList = false; }
    }
  }
  if (inList) html += '</ul>\n';
  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function parseInlineMarkdown(text: string): string {
  let escaped = escapeHtml(text);
  escaped = escaped.replace(/\/\?blog=/g, '/blog/');
  escaped = escaped.replace(/\/\?tab=blog/g, '/blog');
  escaped = escaped.replace(/\/\?tab=about/g, '/about');
  escaped = escaped.replace(/\/\?tab=work/g, '/work');
  escaped = escaped.replace(/\/\?tab=connect/g, '/connect');

  return escaped
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fff;">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color:#fff;">$1</em>')
    .replace(/`(.*?)`/g, '<code style="font-family:monospace;color:#8fffd1;background:rgba(255,255,255,0.05);padding:2px 6px;border-radius:4px;">$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color:#8fffd1;text-decoration:underline;">$1</a>');
}

function parseBlogDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch (e) {
    // ignore
  }
  return '2026-06-16';
}

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function runPrerender() {
  console.log('Starting static portfolio pre-rendering...');

  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`Vite template index.html not found at: ${TEMPLATE_PATH}`);
    process.exit(1);
  }

  let indexHtml = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
  const buildDate = new Date().toISOString().split('T')[0];

  // Read and inline compiled CSS to eliminate render-blocking external stylesheet
  const assetsDir = path.join(DIST_DIR, 'assets');
  let cssContent = '';
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    const cssFile = files.find(f => f.startsWith('index-') && f.endsWith('.css'));
    if (cssFile) {
      cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8');
      console.log(`Read compiled CSS: ${cssFile} (${cssContent.length} bytes)`);
    }
  }

  if (cssContent) {
    indexHtml = indexHtml.replace(
      /<link rel="stylesheet" crossorigin href="\.\/assets\/index-.*?\.css">/g,
      `<style id="critical-css">${cssContent}</style>`
    );
    fs.writeFileSync(TEMPLATE_PATH, indexHtml);
    console.log('Inlined critical CSS inside index.html template');
  }

  // 1. Pre-render basic tab shells
  const staticTabs = [
    { name: 'about', title: 'About Samad Shaikh | Background, Skills & Certifications', description: 'Explore the professional background, core technical skills, and certifications of Samad Shaikh, a Mumbai-based software engineer specializing in React, TypeScript, Node.js, and GenAI integrations.' },
    { name: 'work', title: 'Portfolio & Projects | Handcrafted Digital Experiences by Samad', description: 'Browse the professional portfolio of Samad Shaikh, showcasing production web applications, SaaS products like PriMaX Hub and MockMate AI, and technical details on engineering solutions.' },
    { name: 'blog', title: 'Blog & Insights | Technical Deep Dives by Samad Shaikh', description: 'Read expert articles by Samad Shaikh on React 19, FastAPI asyncio concurrency, scaling WebSockets, prompt injection security, Google SGE SEO optimization, and web engineering basics.' },
    { name: 'connect', title: 'Connect with Samad | Freelance Inquiry & AI Consultations', description: 'Get in touch with Samad Shaikh for freelance software development projects, custom AI/LLM integrations, full-stack app engineering, or professional consultations.' }
  ];

  for (const tab of staticTabs) {
    const tabDir = path.join(DIST_DIR, tab.name);
    ensureDir(tabDir);

    let html = indexHtml
      .replace(/<title>.*?<\/title>/g, `<title>${tab.title}</title>`)
      .replace(/<meta name="description" content=".*?" \/>/g, `<meta name="description" content="${tab.description}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/g, `<meta property="og:title" content="${tab.title}" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/g, `<meta property="og:description" content="${tab.description}" />`);

    fs.writeFileSync(path.join(tabDir, 'index.html'), html);
    console.log(`Pre-rendered static page: /${tab.name}`);
  }

  // 2. Pre-render individual Blog Posts
  const blogUrls: string[] = [];
  const baseBlogDir = path.join(DIST_DIR, 'blog');
  ensureDir(baseBlogDir);

  for (const post of blogPosts) {
    const postDir = path.join(baseBlogDir, post.slug);
    ensureDir(postDir);

    const postDateIso = parseBlogDate(post.date);
    blogUrls.push(`${DOMAIN}/blog/${post.slug}`);

    // Create custom JSON-LD schema blocks for the article
    const blogSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          '@id': `${DOMAIN}/blog/${post.slug}#posting`,
          'headline': post.title,
          'description': post.metaDescription || post.excerpt,
          'datePublished': postDateIso,
          'dateModified': postDateIso,
          'author': {
            '@id': `${DOMAIN}/#person`
          },
          'publisher': {
            '@id': `${DOMAIN}/#person`
          },
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': `${DOMAIN}/blog/${post.slug}`
          },
          'keywords': post.tags.join(', ')
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${DOMAIN}/blog/${post.slug}#breadcrumb`,
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': DOMAIN
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Blog',
              'item': `${DOMAIN}/blog`
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': post.title,
              'item': `${DOMAIN}/blog/${post.slug}`
            }
          ]
        }
      ]
    };

    const schemaScriptTag = `<script type="application/ld+json" id="jsonld-blog-post">${JSON.stringify(blogSchema)}</script>`;
    const postHtmlContent = `
      <article style="max-width:800px;margin:0 auto;padding:20px;">
        <header style="margin-bottom:40px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:30px;">
          <p style="font-family:monospace;color:#8fffd1;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:8px;">// ${post.category} blueprint</p>
          <h1 style="font-size:2.5rem;color:#fff;line-height:1.2;font-weight:bold;margin-bottom:16px;">${post.title}</h1>
          <p style="color:#5e6d82;font-size:0.9rem;font-family:monospace;">Published: ${post.date} · ${post.readTime}</p>
        </header>
        <section class="blog-body-text">
          ${markdownToHtml(post.content)}
        </section>
      </article>
    `;

    let html = indexHtml
      .replace(/<title>.*?<\/title>/g, `<title>${post.title} | Samad Shaikh</title>`)
      .replace(/<meta name="description" content=".*?" \/>/g, `<meta name="description" content="${post.metaDescription || post.excerpt}" />`)
      .replace(/<meta name="keywords" content=".*?" \/>/g, `<meta name="keywords" content="${post.metaKeywords || post.tags.join(', ')}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/g, `<meta property="og:title" content="${post.title} | Samad Shaikh" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/g, `<meta property="og:description" content="${post.metaDescription || post.excerpt}" />`)
      .replace(/<meta property="og:url" content=".*?" \/>/g, `<meta property="og:url" content="${DOMAIN}/blog/${post.slug}" />`)
      .replace(/<\/head>/, `${schemaScriptTag}\n</head>`)
      .replace(/<section id="seo-crawler-context"[\s\S]*?<\/section>/, `<section id="seo-crawler-context" aria-hidden="true" style="display: none; position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;">\n${postHtmlContent}\n</section>`);

    fs.writeFileSync(path.join(postDir, 'index.html'), html);
    console.log(`Pre-rendered blog page: /blog/${post.slug}`);
  }

  // 3. Generate dynamic sitemap.xml
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${DOMAIN}/about</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${DOMAIN}/work</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${DOMAIN}/blog</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${DOMAIN}/connect</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
${blogPosts.map(post => `  <url>
    <loc>${DOMAIN}/blog/${post.slug}</loc>
    <lastmod>${parseBlogDate(post.date)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapContent);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapContent);
  console.log('Dynamically generated sitemap.xml');

  // 4. Generate llms.txt
  const llmsContent = `# Samad Shaikh
> Professional Software Engineer, Applied GenAI Specialist, and Tech Entrepreneur based in Bandra, Mumbai, India.

## Contact & Social Profiles
- [Portfolio Link](${DOMAIN})
- [Resume Link](https://samadshaikh.me)
- [LinkedIn Profile](https://linkedin.com/in/samad-ai)
- [GitHub Account](https://github.com/The-Syntax-Slayer)
- [Instagram Handle](https://www.instagram.com/x0.sammmm/)
- [about.me Bio](https://about.me/samad_shaikh)
- [Wikidata Entity](https://www.wikidata.org/wiki/Q140129387)

## Core Technical Competencies
- Frontend: React 19, Next.js, TypeScript, Tailwind CSS v4, Zustand, Framer Motion
- Backend: Python (Asyncio), FastAPI, Tornado, Express, Node.js
- Databases: PostgreSQL, Supabase, pgvector, Redis
- GenAI: Google Gemini API, RAG Pipelines, Vector Search, Prompt Engineering

## Main Sections
- [/about](${DOMAIN}/about): Professional background, certifications, and educational achievements.
- [/work](${DOMAIN}/work): Projects portfolio showcasing PriMaX Hub, MockMate AI, Planora, and WebLens.
- [/blog](${DOMAIN}/blog): List of technical articles, architectural deep dives, and tutorials.
- [/connect](${DOMAIN}/connect): Contact details, consulting requests, and scheduling links.

## Published Blueprints
${blogPosts.map(post => `- [/blog/${post.slug}](${DOMAIN}/blog/${post.slug}): ${post.excerpt}`).join('\n')}
`;

  fs.writeFileSync(path.join(DIST_DIR, 'llms.txt'), llmsContent);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), llmsContent);
  console.log('Generated llms.txt');

  // 5. Generate llms-full.txt
  let llmsFullContent = `# Samad Shaikh | Complete Knowledge Corpus
> This document aggregates all professional, academic, and technical written details, including complete textual content of all published blueprints.

## Extended Professional Biography
Who is Samad Shaikh? Samad Shaikh is a professional Software Engineer, Applied GenAI Specialist, and Tech Entrepreneur based in Bandra, Mumbai, India. Specialized in integrating high-performance full-stack web applications with advanced Generative AI workflows, he focuses on React 19, Next.js, TypeScript, Python, FastAPI, and Supabase. Over his engineering career, Samad has designed and launched several digital products including MockMate AI (a speech-analytics interview practice platform featuring real-time speech analytics and voice feedback loops), PriMaX Hub (a multi-module business SaaS built using a Supabase backend and highly optimized databases), Planora (a social media pipeline scheduler), WebLens (web performance, SEO, and accessibility audit utility), and LegalEase.

He graduated with a Bachelor of Science (B.Sc.) in Computer Science from the University of Mumbai with an honors CGPA of 8.25/10, and holds professional certifications from Google, IBM, Microsoft, AWS, and Meta. He maintains active contributions on GitHub (github.com/The-Syntax-Slayer) and LinkedIn (linkedin.com/in/samad-ai).

---

## Detailed Technical Projects
${JSON.stringify([
  { name: 'MockMate AI', category: 'Speech Analytics & Interview platform', description: 'An interactive AI-driven interview practice platform featuring real-time speech analytics and voice feedback loops.' },
  { name: 'PriMaX Hub', category: 'Business SaaS Application', description: 'A scalable multi-module SaaS product built using a Supabase backend and highly optimized relational database schemas.' },
  { name: 'Planora', category: 'Social Scheduler pipeline', description: 'A social media pipeline scheduler designed for automated publishing and workflow coordination.' },
  { name: 'WebLens', category: 'Performance & SEO Audit utility', description: 'A web performance, SEO, and accessibility audit utility providing actionable performance reports.' },
  { name: 'LegalEase', category: 'AI Legal Contract Simplifier', description: 'An AI-powered legal contract simplifier that translates legalese into human-readable summaries.' }
], null, 2)}

---

## Complete Blueprint Collection (All Blog Posts)

`;

  for (const post of blogPosts) {
    llmsFullContent += `
### TITLE: ${post.title}
- **Slug**: /blog/${post.slug}
- **Category**: ${post.category}
- **Date**: ${post.date}
- **Read Time**: ${post.readTime}
- **Meta Description**: ${post.metaDescription}
- **Keywords**: ${post.metaKeywords}

#### Excerpt
${post.excerpt}

#### Content Body
${post.content}

--------------------------------------------------------------------------------
`;
  }

  fs.writeFileSync(path.join(DIST_DIR, 'llms-full.txt'), llmsFullContent);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms-full.txt'), llmsFullContent);
  console.log('Generated llms-full.txt');

  // 6. Write IndexNow key verification file
  fs.writeFileSync(path.join(DIST_DIR, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY);
  fs.writeFileSync(path.join(PUBLIC_DIR, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY);
  console.log(`Generated IndexNow verification file: ${INDEXNOW_KEY}.txt`);

  // 7. Submit to IndexNow API
  submitToIndexNow();
}

function submitToIndexNow() {
  const indexNowPayload = JSON.stringify({
    host: 'www.samadshaikh.dev',
    key: INDEXNOW_KEY,
    keyLocation: `${DOMAIN}/${INDEXNOW_KEY}.txt`,
    urlList: [
      `${DOMAIN}/`,
      `${DOMAIN}/about`,
      `${DOMAIN}/work`,
      `${DOMAIN}/blog`,
      `${DOMAIN}/connect`,
      ...blogPosts.map(post => `${DOMAIN}/blog/${post.slug}`)
    ]
  });

  const options = {
    hostname: 'api.indexnow.org',
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(indexNowPayload)
    }
  };

  console.log('Submitting URLs to IndexNow API...');
  const req = https.request(options, (res) => {
    console.log(`IndexNow Submission Status: ${res.statusCode} ${res.statusMessage}`);
  });

  req.on('error', (e) => {
    console.error(`IndexNow Submission Failed: ${e.message}`);
  });

  req.write(indexNowPayload);
  req.end();
}

runPrerender().catch(console.error);
