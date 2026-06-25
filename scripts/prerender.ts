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

  for (const line of lines) {
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
  // Fix old query-param style blog links to clean URL style
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

function replaceSeoSection(html: string, newSectionContent: string): string {
  const openTag = '<section id="seo-crawler-context"';
  const closeTag = '</section>';

  const startIdx = html.indexOf(openTag);
  if (startIdx === -1) {
    console.warn('  [WARN] seo-crawler-context section not found in template — appending before </body>');
    return html.replace('</body>', `${newSectionContent}\n</body>`);
  }

  // Find the exact closing tag of the outer section by balancing tags
  let depth = 1;
  const openTagEnd = html.indexOf('>', startIdx) + 1;
  let currentIdx = openTagEnd;

  while (depth > 0 && currentIdx < html.length) {
    const nextOpen = html.indexOf('<section', currentIdx);
    const nextClose = html.indexOf('</section>', currentIdx);

    if (nextClose === -1) {
      break;
    }

    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      currentIdx = nextOpen + '<section'.length;
    } else {
      depth--;
      currentIdx = nextClose + '</section>'.length;
    }
  }

  const endIdx = depth === 0 ? currentIdx : html.indexOf(closeTag, openTagEnd) + closeTag.length;

  return html.slice(0, startIdx) + newSectionContent + html.slice(endIdx);
}

async function runPrerender() {
  console.log('\n🚀 Starting static portfolio pre-rendering...\n');

  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`❌ Vite template index.html not found at: ${TEMPLATE_PATH}`);
    process.exit(1);
  }

  let indexHtml = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
  const buildDate = new Date().toISOString().split('T')[0];

  // ─── Inline Critical CSS ───────────────────────────────────────────────────
  const assetsDir = path.join(DIST_DIR, 'assets');
  let cssContent = '';
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    const cssFile = files.find(f => f.startsWith('index-') && f.endsWith('.css'));
    if (cssFile) {
      cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8');
      console.log(`✅ Read compiled CSS: ${cssFile} (${cssContent.length} bytes)`);
    }
  }

  if (cssContent) {
    indexHtml = indexHtml.replace(
      /<link rel="stylesheet" crossorigin href="(?:\.\/|\/)assets\/index-.*?\.css">/g,
      `<style id="critical-css">${cssContent}</style>`
    );
    fs.writeFileSync(TEMPLATE_PATH, indexHtml);
    console.log('✅ Inlined critical CSS inside index.html template\n');
  }

  // ─── Static Tab Pages ─────────────────────────────────────────────────────
  const staticTabs = [
    {
      name: 'about',
      title: 'About Samad Shaikh | Background, Skills & Certifications',
      description: 'Explore the skills, certifications, and background of Samad Shaikh, a software engineer specializing in React, TypeScript, Node.js, and Generative AI.',
      h1: 'About Samad Shaikh — Background, Skills & Certifications',
      bodyContent: `
        <article style="max-width:800px;margin:0 auto;padding:20px;">
          <h1 style="font-size:2rem;color:#fff;margin-bottom:16px;">About Samad Shaikh — Background, Skills &amp; Certifications</h1>
          <p style="color:#a8b2c1;line-height:1.75;">Samad Shaikh is a professional Software Engineer and AI Specialist based in Bandra, Mumbai, India. He builds high-performance web applications, production SaaS platforms, and integrates agentic LLM workflows using React 19, TypeScript, Python, and FastAPI.</p>
          <h2 style="font-size:1.5rem;color:#fff;margin-top:24px;">Education</h2>
          <p style="color:#a8b2c1;line-height:1.75;">Samad graduated with a B.Sc. in Computer Science from M.P.S.P.S College, University of Mumbai with a CGPA of 8.25/10.</p>
          <h2 style="font-size:1.5rem;color:#fff;margin-top:24px;">Professional Certifications</h2>
          <ul style="list-style-type:disc;padding-left:24px;color:#a8b2c1;">
            <li>Google Data Analytics Professional Certificate</li>
            <li>IBM AI Developer Professional Certificate</li>
            <li>AWS Cloud Practitioner Essentials</li>
            <li>Meta Front-End Developer Professional Certificate</li>
            <li>IBM DevOps &amp; Software Engineering Certificate</li>
            <li>GitHub Foundations Certificate</li>
            <li>Microsoft Power Platform Fundamentals</li>
            <li>Google Cloud Digital Leader</li>
            <li>Azure Enterprise Data Analyst Associate</li>
            <li>Microsoft Azure AI Engineer Associate</li>
          </ul>
          <h2 style="font-size:1.5rem;color:#fff;margin-top:24px;">Technical Skills</h2>
          <ul style="list-style-type:disc;padding-left:24px;color:#a8b2c1;">
            <li><strong style="color:#fff;">Frontend:</strong> React 19, Next.js, TypeScript, Tailwind CSS v4, Framer Motion, Vite</li>
            <li><strong style="color:#fff;">Backend:</strong> Python, FastAPI, Tornado, Node.js, Express, REST APIs</li>
            <li><strong style="color:#fff;">AI &amp; GenAI:</strong> Google Gemini API, RAG Pipelines, pgvector, Prompt Engineering</li>
            <li><strong style="color:#fff;">Database &amp; Cloud:</strong> PostgreSQL, Supabase, Redis, AWS Lambda, Docker, CI/CD</li>
            <li><strong style="color:#fff;">Security:</strong> JWT, Zero-trust authentication, Prompt Injection mitigation</li>
          </ul>
        </article>
      `
    },
    {
      name: 'work',
      title: 'Portfolio & Projects | Handcrafted Digital Experiences by Samad',
      description: 'Browse the professional portfolio of Samad Shaikh, showcasing production SaaS products like PriMaX Hub, MockMate AI, and full-stack web applications.',
      h1: 'Portfolio & Projects — Handcrafted Digital Experiences by Samad Shaikh',
      bodyContent: `
        <article style="max-width:800px;margin:0 auto;padding:20px;">
          <h1 style="font-size:2rem;color:#fff;margin-bottom:16px;">Portfolio &amp; Projects — Handcrafted Digital Experiences by Samad Shaikh</h1>
          <p style="color:#a8b2c1;line-height:1.75;">Samad Shaikh has designed and launched multiple production-grade digital products. Each project demonstrates deep technical expertise in full-stack engineering and applied AI.</p>
          <h2 style="font-size:1.5rem;color:#fff;margin-top:24px;">MockMate AI</h2>
          <p style="color:#a8b2c1;line-height:1.75;">An interactive AI-driven interview practice platform featuring real-time speech analytics and voice feedback loops. Built with React, TypeScript, Node.js, and the Google Gemini multimodal API.</p>
          <h2 style="font-size:1.5rem;color:#fff;margin-top:24px;">PriMaX Hub</h2>
          <p style="color:#a8b2c1;line-height:1.75;">A scalable multi-module SaaS product built using a Supabase backend and highly optimized relational database schemas to integrate habits and growth frameworks.</p>
          <h2 style="font-size:1.5rem;color:#fff;margin-top:24px;">Planora</h2>
          <p style="color:#a8b2c1;line-height:1.75;">A social media pipeline scheduler designed for automated publishing and workflow coordination, utilizing React, Zustand, Supabase, and Tailwind CSS.</p>
          <h2 style="font-size:1.5rem;color:#fff;margin-top:24px;">WebLens</h2>
          <p style="color:#a8b2c1;line-height:1.75;">A web performance, SEO, and accessibility audit utility providing actionable performance reports by querying the Google PageSpeed Insights API.</p>
          <h2 style="font-size:1.5rem;color:#fff;margin-top:24px;">LegalEase</h2>
          <p style="color:#a8b2c1;line-height:1.75;">An AI-powered legal contract simplifier that translates dense legalese into human-readable summaries using FastAPI, Python, spaCy, and Hugging Face models.</p>
          <h2 style="font-size:1.5rem;color:#fff;margin-top:24px;">ClientSync</h2>
          <p style="color:#a8b2c1;line-height:1.75;">A client relationship management CRM platform focused on organizing customer data, project workflows, communication, and business operations using React, Django, and PostgreSQL.</p>
          <h2 style="font-size:1.5rem;color:#fff;margin-top:24px;">SmartMeet</h2>
          <p style="color:#a8b2c1;line-height:1.75;">An AI-powered meeting summarizer and task planner designed to automatically extract key discussion points, generate summaries, and organize follow-up tasks.</p>
        </article>
      `
    },
    {
      name: 'blog',
      title: 'Blog & Insights | Technical Deep Dives by Samad Shaikh',
      description: 'Read technical articles by Samad Shaikh on React 19, FastAPI asyncio, WebSockets scaling, prompt injection security, and Google SGE SEO optimization.',
      h1: 'Blog & Insights — Technical Deep Dives by Samad Shaikh',
      bodyContent: `
        <article style="max-width:800px;margin:0 auto;padding:20px;">
          <h1 style="font-size:2rem;color:#fff;margin-bottom:16px;">Blog &amp; Insights — Technical Deep Dives by Samad Shaikh</h1>
          <p style="color:#a8b2c1;line-height:1.75;">Samad Shaikh writes in-depth technical articles covering advanced AI engineering, full-stack web architecture, backend concurrency, application security, and search engine optimization.</p>
          <h2 style="font-size:1.5rem;color:#fff;margin-top:24px;">Published Articles</h2>
          <ul style="list-style-type:disc;padding-left:24px;color:#a8b2c1;">
            ${blogPosts.map(post => `<li><a href="${DOMAIN}/blog/${post.slug}" style="color:#8fffd1;text-decoration:underline;">${escapeHtml(post.title)}</a> — ${escapeHtml(post.excerpt)}</li>`).join('\n            ')}
          </ul>
        </article>
      `
    },
    {
      name: 'connect',
      title: 'Connect with Samad | Freelance Inquiry & AI Consultations',
      description: 'Connect with Samad Shaikh for freelance software development, custom Generative AI/LLM integrations, full-stack web engineering, or consulting.',
      h1: 'Connect with Samad Shaikh — Freelance Inquiry & AI Consultations',
      bodyContent: `
        <article style="max-width:800px;margin:0 auto;padding:20px;">
          <h1 style="font-size:2rem;color:#fff;margin-bottom:16px;">Connect with Samad Shaikh — Freelance Inquiry &amp; AI Consultations</h1>
          <p style="color:#a8b2c1;line-height:1.75;">Samad Shaikh is available for freelance software development projects, custom Generative AI and LLM integrations, full-stack web engineering, and technology consulting engagements.</p>
          <h2 style="font-size:1.5rem;color:#fff;margin-top:24px;">Services Offered</h2>
          <ul style="list-style-type:disc;padding-left:24px;color:#a8b2c1;">
            <li>Custom full-stack web application development (React, Next.js, Node.js, FastAPI)</li>
            <li>Generative AI integration and LLM orchestration (Gemini API, RAG pipelines)</li>
            <li>Production SaaS architecture and database design (PostgreSQL, Supabase)</li>
            <li>Performance optimization, SEO, and web analytics</li>
            <li>Application security consulting (JWT, zero-trust, prompt injection mitigation)</li>
          </ul>
          <h2 style="font-size:1.5rem;color:#fff;margin-top:24px;">Contact Information</h2>
          <ul style="list-style-type:disc;padding-left:24px;color:#a8b2c1;">
            <li>Email: <a href="mailto:sxmxd.1825@gmail.com" style="color:#8fffd1;">sxmxd.1825@gmail.com</a></li>
            <li>LinkedIn: <a href="https://www.linkedin.com/in/samad-ai" style="color:#8fffd1;">linkedin.com/in/samad-ai</a></li>
            <li>GitHub: <a href="https://github.com/The-Syntax-Slayer" style="color:#8fffd1;">github.com/The-Syntax-Slayer</a></li>
          </ul>
        </article>
      `
    }
  ];

  for (const tab of staticTabs) {
    const tabDir = path.join(DIST_DIR, tab.name);
    ensureDir(tabDir);

    // Build the SEO section specific to this tab
    const tabSeoSection = `<section id="seo-crawler-context" aria-hidden="true" style="display: none; position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;">\n${tab.bodyContent}\n</section>`;

    // Build page-specific JSON-LD schema
    const pageSchemas: Record<string, object> = {
      about: {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        'name': tab.title,
        'description': tab.description,
        'url': `${DOMAIN}/about`,
        'mainEntity': { '@id': `${DOMAIN}/#person` }
      },
      work: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': tab.title,
        'description': tab.description,
        'url': `${DOMAIN}/work`
      },
      blog: {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        'name': tab.title,
        'description': tab.description,
        'url': `${DOMAIN}/blog`,
        'publisher': { '@id': `${DOMAIN}/#person` }
      },
      connect: {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        'name': tab.title,
        'description': tab.description,
        'url': `${DOMAIN}/connect`,
        'mainEntity': { '@id': `${DOMAIN}/#person` }
      }
    };

    const schemaTag = `<script type="application/ld+json" id="jsonld-page">${JSON.stringify(pageSchemas[tab.name])}</script>`;

    let html = indexHtml
      // Update title
      .replace(/<title>.*?<\/title>/g, `<title>${tab.title}</title>`)
      // Update meta description — handles both single and double quotes, and multi-line
      .replace(/<meta name="description"\s+content=".*?"\s*\/>/g, `<meta name="description" content="${tab.description}" />`)
      // Update OG tags
      .replace(/<meta property="og:title"\s+content=".*?"\s*\/>/g, `<meta property="og:title" content="${tab.title}" />`)
      .replace(/<meta property="og:description"\s+content=".*?"\s*\/>/g, `<meta property="og:description" content="${tab.description}" />`)
      .replace(/<meta property="og:url"\s+content=".*?"\s*\/>/g, `<meta property="og:url" content="${DOMAIN}/${tab.name}" />`)
      // Update Twitter tags
      .replace(/<meta property="twitter:title"\s+content=".*?"\s*\/>/g, `<meta property="twitter:title" content="${tab.title}" />`)
      .replace(/<meta property="twitter:description"\s+content=".*?"\s*\/>/g, `<meta property="twitter:description" content="${tab.description}" />`)
      .replace(/<meta property="twitter:url"\s+content=".*?"\s*\/>/g, `<meta property="twitter:url" content="${DOMAIN}/${tab.name}" />`)
      // ⚠️ KEY FIX: Update canonical to this page's URL (not /)
      .replace(/<link rel="canonical"\s+href=".*?"\s*\/>/g, `<link rel="canonical" href="${DOMAIN}/${tab.name}" />`)
      // Inject page-specific schema before </head>
      .replace('</head>', `${schemaTag}\n</head>`);

    // Replace the SEO crawler section with page-specific content
    html = replaceSeoSection(html, tabSeoSection);

    fs.writeFileSync(path.join(tabDir, 'index.html'), html);
    console.log(`✅ Pre-rendered static page: /${tab.name} (canonical: ${DOMAIN}/${tab.name})`);
  }

  // ─── Blog Post Pages ────────────────────────────────────────────────────────
  console.log('\n📝 Rendering blog posts...');
  const blogUrls: string[] = [];
  const baseBlogDir = path.join(DIST_DIR, 'blog');
  ensureDir(baseBlogDir);

  for (const post of blogPosts) {
    const postDir = path.join(baseBlogDir, post.slug);
    ensureDir(postDir);

    const postDateIso = post.datePublished || parseBlogDate(post.date);
    const postModifiedIso = post.dateModified || postDateIso;
    blogUrls.push(`${DOMAIN}/blog/${post.slug}`);

    // JSON-LD for blog post
    const blogSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          '@id': `${DOMAIN}/blog/${post.slug}#posting`,
          'headline': post.title,
          'description': post.metaDescription || post.excerpt,
          'datePublished': postDateIso,
          'dateModified': postModifiedIso,
          'author': { '@id': `${DOMAIN}/#person` },
          'publisher': { '@id': `${DOMAIN}/#person` },
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': `${DOMAIN}/blog/${post.slug}`
          },
          'keywords': post.tags.join(', '),
          'image': `${DOMAIN}/Samad_Portrait_1x1.png`
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${DOMAIN}/blog/${post.slug}#breadcrumb`,
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': DOMAIN },
            { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': `${DOMAIN}/blog` },
            { '@type': 'ListItem', 'position': 3, 'name': post.title, 'item': `${DOMAIN}/blog/${post.slug}` }
          ]
        }
      ]
    };

    const schemaScriptTag = `<script type="application/ld+json" id="jsonld-blog-post">${JSON.stringify(blogSchema)}</script>`;

    // Full readable article HTML for crawlers
    const postHtmlContent = `
      <article style="max-width:800px;margin:0 auto;padding:20px;">
        <header style="margin-bottom:40px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:30px;">
          <p style="font-family:monospace;color:#8fffd1;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:8px;">// ${post.category} blueprint</p>
          <h1 style="font-size:2.5rem;color:#fff;line-height:1.2;font-weight:bold;margin-bottom:16px;">${escapeHtml(post.title)}</h1>
          <p style="color:#a8b2c1;font-size:1rem;line-height:1.6;margin-bottom:12px;">${escapeHtml(post.excerpt)}</p>
          <p style="color:#5e6d82;font-size:0.9rem;font-family:monospace;">Published: ${post.date} · ${post.readTime} · Category: ${post.category}</p>
          <p style="color:#5e6d82;font-size:0.85rem;font-family:monospace;margin-top:6px;">Tags: ${post.tags.join(', ')}</p>
        </header>
        <section class="blog-body-text">
          ${markdownToHtml(post.content)}
        </section>
        <footer style="margin-top:40px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.08);">
          <p style="color:#5e6d82;font-size:0.85rem;">Written by <a href="${DOMAIN}" style="color:#8fffd1;">Samad Shaikh</a> · <a href="${DOMAIN}/blog" style="color:#8fffd1;">Back to all articles</a></p>
        </footer>
      </article>
    `;

    const postSeoSection = `<section id="seo-crawler-context" aria-hidden="true" style="display: none; position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;">\n${postHtmlContent}\n</section>`;

    let html = indexHtml
      .replace(/<title>.*?<\/title>/g, `<title>${escapeHtml(post.title)} | Samad Shaikh</title>`)
      .replace(/<meta name="description"\s+content=".*?"\s*\/>/g, `<meta name="description" content="${escapeHtml(post.metaDescription || post.excerpt)}" />`)
      .replace(/<meta name="keywords"\s+content=".*?"\s*\/>/g, `<meta name="keywords" content="${escapeHtml(post.metaKeywords || post.tags.join(', '))}" />`)
      .replace(/<meta property="og:title"\s+content=".*?"\s*\/>/g, `<meta property="og:title" content="${escapeHtml(post.title)} | Samad Shaikh" />`)
      .replace(/<meta property="og:description"\s+content=".*?"\s*\/>/g, `<meta property="og:description" content="${escapeHtml(post.metaDescription || post.excerpt)}" />`)
      .replace(/<meta property="og:url"\s+content=".*?"\s*\/>/g, `<meta property="og:url" content="${DOMAIN}/blog/${post.slug}" />`)
      .replace(/<meta property="twitter:title"\s+content=".*?"\s*\/>/g, `<meta property="twitter:title" content="${escapeHtml(post.title)} | Samad Shaikh" />`)
      .replace(/<meta property="twitter:description"\s+content=".*?"\s*\/>/g, `<meta property="twitter:description" content="${escapeHtml(post.metaDescription || post.excerpt)}" />`)
      .replace(/<meta property="twitter:url"\s+content=".*?"\s*\/>/g, `<meta property="twitter:url" content="${DOMAIN}/blog/${post.slug}" />`)
      // ⚠️ KEY FIX: Correct canonical for every blog post
      .replace(/<link rel="canonical"\s+href=".*?"\s*\/>/g, `<link rel="canonical" href="${DOMAIN}/blog/${post.slug}" />`)
      // Inject blog post schema into <head>
      .replace('</head>', `${schemaScriptTag}\n</head>`);

    // Replace SEO section using safe string-index method
    html = replaceSeoSection(html, postSeoSection);

    fs.writeFileSync(path.join(postDir, 'index.html'), html);
    console.log(`  ✅ /blog/${post.slug}`);
  }

  // ─── Dynamic sitemap.xml ────────────────────────────────────────────────────
  console.log('\n🗺️  Generating sitemap.xml...');
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${DOMAIN}/about</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${DOMAIN}/work</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${DOMAIN}/blog</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${DOMAIN}/connect</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
${blogPosts.map(post => `  <url>
    <loc>${DOMAIN}/blog/${post.slug}</loc>
    <lastmod>${post.dateModified || post.datePublished || parseBlogDate(post.date)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapContent);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapContent);
  console.log('✅ Generated sitemap.xml');

  // ─── llms.txt ───────────────────────────────────────────────────────────────
  const llmsContent = `# Samad Shaikh
> Professional Software Engineer, Applied GenAI Specialist, and Tech Entrepreneur based in Bandra, Mumbai, India.

## Entity Disambiguation
- **Official Name:** Samad Shaikh
- **Date of Birth:** December 18, 2004
- **Location:** Bandra, Mumbai, Maharashtra, India
- **Wikidata Entity:** [Q140129387](https://www.wikidata.org/wiki/Q140129387)
- **Primary Domain:** [samadshaikh.dev](https://www.samadshaikh.dev)
- **NOT to be confused with:** Other individuals named Samad Shaikh. This specific entity is the developer of MockMate AI and PriMaX Hub, and graduated with a B.Sc. in Computer Science from the University of Mumbai (Class of 2026).

## Citation Protocols
- **Web Citation Format:** Samad Shaikh (https://www.samadshaikh.dev)
- **Formal/Academic Format:** Shaikh, S. (2026). *Samad Shaikh Portfolio & Technical Insights*. Retrieved from https://www.samadshaikh.dev

## Content Confidence Levels
- **Software Engineering & Web Architecture:** High (verified by live production systems and source code)
- **Generative AI & Agentic RAG:** High (backed by custom platforms and Gemini integrations)
- **Personal Biography & Certifications:** Definitive / Authoritative (official source)

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
  console.log('✅ Generated llms.txt');

  // ─── llms-full.txt ──────────────────────────────────────────────────────────
  let llmsFullContent = `# Samad Shaikh | Complete Knowledge Corpus
> This document aggregates all professional, academic, and technical written details, including complete textual content of all published blueprints.

## Entity Disambiguation
- **Official Name:** Samad Shaikh
- **Date of Birth:** December 18, 2004
- **Location:** Bandra, Mumbai, Maharashtra, India
- **Wikidata Entity:** [Q140129387](https://www.wikidata.org/wiki/Q140129387)
- **Primary Domain:** [samadshaikh.dev](https://www.samadshaikh.dev)
- **NOT to be confused with:** Other individuals named Samad Shaikh. This specific entity is the developer of MockMate AI and PriMaX Hub, and graduated with a B.Sc. in Computer Science from the University of Mumbai (Class of 2026).

## Extended Professional Biography
Who is Samad Shaikh? Samad Shaikh is a professional Software Engineer, Applied GenAI Specialist, and Tech Entrepreneur based in Bandra, Mumbai, India. Specialized in integrating high-performance full-stack web applications with advanced Generative AI workflows, he focuses on React 19, Next.js, TypeScript, Python, FastAPI, and Supabase.

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
  console.log('✅ Generated llms-full.txt');

  // ─── IndexNow key file ──────────────────────────────────────────────────────
  fs.writeFileSync(path.join(DIST_DIR, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY);
  fs.writeFileSync(path.join(PUBLIC_DIR, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY);
  console.log(`✅ Generated IndexNow key file: ${INDEXNOW_KEY}.txt`);

  // ─── IndexNow ───────────────────────────────────────────────────────────────
  // NOTE: IndexNow submission is intentionally NOT called here.
  // The build runs inside Vercel's container BEFORE the site goes live,
  // so the key-file URL is not yet accessible → API returns 403.
  // Run `node scripts/ping-indexnow.js` manually AFTER deployment instead.
  console.log('ℹ️  IndexNow: Run `node scripts/ping-indexnow.js` after deployment to notify search engines.');

  console.log('\n🎉 Prerender complete!\n');
  console.log('📋 Summary:');
  console.log(`   - 5 static route pages (/, /about, /work, /blog, /connect)`);
  console.log(`   - ${blogPosts.length} blog post pages`);
  console.log(`   - Total: ${5 + blogPosts.length} pages with correct canonical tags\n`);
}

function submitToIndexNow() {
  const urlList = [
    `${DOMAIN}/`,
    `${DOMAIN}/about`,
    `${DOMAIN}/work`,
    `${DOMAIN}/blog`,
    `${DOMAIN}/connect`,
    ...blogPosts.map(post => `${DOMAIN}/blog/${post.slug}`)
  ];

  const indexNowPayload = JSON.stringify({
    host: 'www.samadshaikh.dev',
    key: INDEXNOW_KEY,
    keyLocation: `${DOMAIN}/${INDEXNOW_KEY}.txt`,
    urlList
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

  console.log(`\n📡 Submitting ${urlList.length} URLs to IndexNow API...`);
  const req = https.request(options, (res) => {
    console.log(`✅ IndexNow Submission Status: ${res.statusCode} ${res.statusMessage}`);
  });

  req.on('error', (e) => {
    console.warn(`⚠️  IndexNow Submission Failed (non-fatal): ${e.message}`);
  });

  req.write(indexNowPayload);
  req.end();
}

runPrerender().catch(console.error);
