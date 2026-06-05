import type { BlogPost } from "../blogs";

export const blog07: BlogPost = {
  id: "blog-07",
  title: "The Developer's Google Search & SGE Domination Checklist: Schema & Canonicals",
  slug: "seo-sge-domination-checklist-schema-canonical",
  date: "March 22, 2026",
  readTime: "12 min read",
  excerpt: "Resolve canonical conflicts, submit sitemaps, index stable images, and configure JSON-LD schemas to dominate search ranks.",
  category: "SEO",
  tags: ["SEO", "SGE", "Google Search", "JSON-LD", "Robots.txt", "Sitemap"],
  metaDescription: "Optimize your portfolio for Google Search Generative Experience (SGE). Learn canonical verification, Robots.txt configs, and JSON-LD schema graphs.",
  metaKeywords: "Google SGE optimization, JSON-LD Schema Graph, canonical URL SEO, sitemap configuration, crawler budget optimization, tech SEO portfolio",
  content: `### Introduction

How does Google know that the \\"Samad Shaikh\\" on GitHub is the same \\"Samad Shaikh\\" on LinkedIn, and the same one hosting their portfolio at \`samadshaikh.dev\`? In the era of traditional search engines, ranking depended heavily on keyword density, backlink quantities, and basic metadata. Today, the landscape has fundamentally shifted. Google's Search Generative Experience (SGE), along with LLM-powered crawlers (like Googlebot, GPTBot, and ClaudeBot), reads the web to construct an **Entity Knowledge Graph**. They treat people, organizations, concepts, and websites as nodes in a massive, interconnected network.

If your web footprint is fractured—for example, if your portfolio runs on both \`samadshaikh.dev\` and \`www.samadshaikh.dev\` without redirection, or if your name is associated with conflicting email addresses and outdated resumes on multiple platforms—search engines struggle to resolve your identity. They split your link equity, dilute your domain authority, and fail to summarize your skills accurately in AI-generated search results.

To dominate search results and ensure SGE accurately compiles your professional profile, you must establish an authoritative \\"source of truth.\\" This guide details the essential technical SEO steps to achieve this: resolving canonical URL conflicts, injecting a structured JSON-LD Entity Graph into your HTML, configuring crawler directives, and verifying image indexing stability.

---

### SGE and Crawler Discovery Architecture

To understand how structured data and canonical configuration influence rankings, let's look at the pipeline that Googlebot and AI crawlers use to ingest, parse, and index your digital profile:

\`\`\`
                                  [ Public Web & Social Profiles ]
                                   (GitHub, LinkedIn, Medium, etc.)
                                                 │
                                                 ▼
[ Search Crawler Request ] ──> [ f:/PORTFOLIO/index.html ] ──> [ Canonical Header Verification ]
                                                 │                            │
                                                 ▼                            ▼
                                    [ Raw HTML Parsing ]           [ Resolve Domain Split ]
                                                 │                            │
                                                 ▼                            │
                                   [ Parse JSON-LD Graph ] ───────────┐       │
                                     (Identify SameAs Links)          │       │
                                                 │                    ▼       ▼
                                                 ├─────────────> [ Entity Resolution Engine ]
                                                 │                    │
                                                 ▼                    ▼
                                    [ Crawl Control Maps ]    [ Update Google Knowledge Graph ]
                                   (robots.txt / sitemap)             │
                                                 │                    ▼
                                                 └─────────────> [ Generative SGE Summaries ]
\`\`\`

When a crawler hits your site, it performs identity verification. It parses the page structure, checks the canonical tag to ensure it is not indexing duplicate content, matches the JSON-LD schema with third-party social links, and runs entity resolution algorithms to link your portfolio to your external contributions.

---

### Step 1: Resolving Canonical Domain Conflicts

A common mistake developers make is serving the exact same portfolio on multiple URLs, such as:
* \`http://samadshaikh.dev\`
* \`https://samadshaikh.dev\`
* \`https://www.samadshaikh.dev\`

To a human, these represent the same page. To Googlebot, these are three separate, competing documents. This duplication dilutes your page rank because external backlink authority gets split between the variants. Furthermore, search engines waste your \\"crawl budget\\" by analyzing the same content multiple times.

#### 1. HTML Canonical Declarations
You must declare a single authoritative URL. Open your main configuration at [index.html](file:///f:/PORTFOLIO/index.html) and place the canonical link tag in the \`<head>\` section:

\`\`\`html
<!-- Declare the absolute authoritative URL in f:/PORTFOLIO/index.html -->
<head>
  <meta charset=\\"UTF-8\\" />
  <title>Samad Shaikh | Senior Full-Stack Engineer Portfolio</title>
  <link rel=\\"canonical\\" href=\\"https://www.samadshaikh.dev/\\" />
</head>
\`\`\`

#### 2. Server-Level Nginx Redirect Configuration
Do not rely solely on the HTML tag. Hard-redirect all traffic to your canonical domain at the routing layer. Here is a production-grade Nginx redirect configuration that forwards non-WWW traffic to the WWW subdomain over HTTPS:

\`\`\`nginx
# Redirect HTTP traffic to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name samadshaikh.dev www.samadshaikh.dev;
    return 301 https://www.samadshaikh.dev\$request_uri;
}

# Redirect HTTPS non-WWW traffic to WWW canonical URL
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name samadshaikh.dev;

    ssl_certificate /etc/letsencrypt/live/samadshaikh.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/samadshaikh.dev/privkey.pem;

    return 301 https://www.samadshaikh.dev\$request_uri;
}

# Serve the canonical WWW site
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.samadshaikh.dev;

    ssl_certificate /etc/letsencrypt/live/samadshaikh.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/samadshaikh.dev/privkey.pem;

    root /var/www/portfolio/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
\`\`\`

---

### Step 2: Designing an Interlinked Entity Graph via JSON-LD

Search Generative Experience relies on structured data to verify entities. Injecting a structured **JSON-LD (JavaScript Object Notation for Linked Data)** script allows you to declare exactly who you are, what projects you own, and where your professional profiles reside.

By referencing your external profiles (like GitHub and LinkedIn) inside the \`sameAs\` array, you create a bidirectional link that helps Googlebot associate your open-source contributions and professional history with your main website.

Here is the complete JSON-LD schema graph that you should inject into the \`<head>\` of [index.html](file:///f:/PORTFOLIO/index.html):

\`\`\`html
<!-- Inject inside the head of f:/PORTFOLIO/index.html -->
<script type=\\"application/ld+json\\">
{
  \\"@context\\": \\"https://schema.org\\",
  \\"@graph\\": [
    {
      \\"@type\\": \\"Person\\",
      \\"@id\\": \\"https://www.samadshaikh.dev/#person\\",
      \\"name\\": \\"Samad Shaikh\\",
      \\"jobTitle\\": \\"Senior Full-Stack Software Engineer\\",
      \\"url\\": \\"https://www.samadshaikh.dev\\",
      \\"image\\": \\"https://www.samadshaikh.dev/Samad_Portrait.jpeg\\",
      \\"description\\": \\"Senior Full-Stack Engineer specializing in React, TypeScript, Python, and scalable cloud architectures.\\",
      \\"sameAs\\": [
        \\"https://github.com/The-Syntax-Slayer\\",
        \\"https://linkedin.com/in/samad-ai\\",
        \\"https://samadshaikh.me\\"
      ],
      \\"knowsAbout\\": [
        \\"Software Engineering\\",
        \\"React.js\\",
        \\"TypeScript\\",
        \\"FastAPI\\",
        \\"AWS Cloud Services\\",
        \\"Docker Containerization\\",
        \\"PostgreSQL\\",
        \\"Application Security\\"
      ]
    },
    {
      \\"@type\\": \\"WebSite\\",
      \\"@id\\": \\"https://www.samadshaikh.dev/#website\\",
      \\"url\\": \\"https://www.samadshaikh.dev\\",
      \\"name\\": \\"Samad Shaikh Portfolio\\",
      \\"description\\": \\"Explore interactive software engineering projects, deep-dive architectural blog posts, and system design showcases.\\",
      \\"publisher\\": {
        \\"@id\\": \\"https://www.samadshaikh.dev/#person\\"
      }
    },
    {
      \\"@type\\": \\"WebPage\\",
      \\"@id\\": \\"https://www.samadshaikh.dev/#webpage\\",
      \\"url\\": \\"https://www.samadshaikh.dev\\",
      \\"name\\": \\"Samad Shaikh - Portfolio Home\\",
      \\"isPartOf\\": {
        \\"@id\\": \\"https://www.samadshaikh.dev/#website\\"
      },
      \\"about\\": {
        \\"@id\\": \\"https://www.samadshaikh.dev/#person\\"
      }
    }
  ]
}
</script>
\`\`\`

---

### Step 3: Crawler Budget and Crawl Control Configuration

A crawler budget is the limit on how many pages a search bot will scan on your domain during a given period. To ensure the crawler focuses its resources on your indexable pages, configure explicit rules in your static files.

#### 1. Configuring robots.txt
Your robots.txt tells search bots where they are allowed to go. Create this file in your build static root: [robots.txt](file:///f:/PORTFOLIO/public/robots.txt).

\`\`\`ini
# filepath: f:/PORTFOLIO/public/robots.txt
User-agent: *
Allow: /
Allow: /index.html
Allow: /favicon.ico
Allow: /Samad_Portrait.jpeg

# Block scrapers that ignore search guidelines or waste bandwidth
User-agent: Rogerbot
Disallow: /

User-agent: Exabot
Disallow: /

# Point to the primary sitemap file
Sitemap: https://www.samadshaikh.dev/sitemap.xml
\`\`\`

#### 2. Creating sitemap.xml
A sitemap lists all pages that you want indexed. It helps crawlers discover new or updated pages quickly. Create the following file: [sitemap.xml](file:///f:/PORTFOLIO/public/sitemap.xml).

\`\`\`xml
<!-- filepath: f:/PORTFOLIO/public/sitemap.xml -->
<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>
<urlset xmlns=\\"http://www.sitemaps.org/schemas/sitemap/0.9\\">
  <url>
    <loc>https://www.samadshaikh.dev/</loc>
    <lastmod>2026-06-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.samadshaikh.dev/?blog=seo-sge-domination-checklist-schema-canonical</loc>
    <lastmod>2026-06-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.samadshaikh.dev/?blog=programmatic-seo-nextjs-dynamic-sitemaps</loc>
    <lastmod>2026-06-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
\`\`\`

---

### Step 4: Stable Image Indexing and SGE Image Extraction

When Google SGE generates answers for search queries (e.g., \\"Who is Samad Shaikh?\\"), it displays a visual card containing the developer's portrait. However, if your portrait URL changes during every build due to asset bundlers adding file hashes (like \`Samad_Portrait.a8f7d6e.jpeg\`), the search bot has to re-crawl and re-index the image. This can cause your image to disappear from search results.

To prevent this:
1. Store your profile portrait at a static, non-hashed URL path inside the public folder, such as [Samad_Portrait.jpeg](file:///f:/PORTFOLIO/public/Samad_Portrait.jpeg).
2. Set explicit cache-control headers on static images. Instruct cloud storage or web servers to cache the image long-term, but configure it so that the URL remains stable.
3. Explicitly reference this static image URL in both your JSON-LD schema and OpenGraph metadata:

\`\`\`html
<!-- OpenGraph image metadata -->
<meta property=\\"og:image\\" content=\\"https://www.samadshaikh.dev/Samad_Portrait.jpeg\\" />
<meta property=\\"og:image:type\\" content=\\"image/jpeg\\" />
<meta property=\\"og:image:width\\" content=\\"1200\\" />
<meta property=\\"og:image:height\\" content=\\"1200\\" />
<meta property=\\"og:image:alt\\" content=\\"Samad Shaikh - Senior Full-Stack Engineer\\" />
\`\`\`

---

### Step 5: Automating Indexation with the Search Console API

Rather than waiting for search crawlers to find your updated pages, you can programmatically notify Google of changes using the **Google Indexing API** or by sending sitemap pings.

Below is a production-grade Python script that uses the Google Indexing API to submit update requests automatically after a deployment. You can integrate this script into your CI/CD pipelines:

\`\`\`python
# filepath: scripts/ping_index.py
import json
import requests
from google.oauth2 import service_account
from google.auth.transport.requests import AuthorizedSession

def submit_index_request(url: str, request_type: str = \"URL_UPDATED\"):
    \"\"\"
    Submits a URL to the Google Indexing API to request crawling.
    request_type can be 'URL_UPDATED' or 'URL_DELETED'.
    \"\"\"
    # Load credentials from service account JSON
    # Download this JSON from Google Cloud Console -> Service Accounts
    scopes = [\"https://www.googleapis.com/auth/indexing\"]
    key_file_path = \"config/google-service-account.json\"
    
    try:
        credentials = service_account.Credentials.from_service_account_file(
            key_file_path, scopes=scopes
        )
        authed_session = AuthorizedSession(credentials)
        
        endpoint = \"https://indexing.googleapis.com/v3/urlNotifications:publish\"
        payload = {
            \"url\": url,
            \"type\": request_type
        }
        
        response = authed_session.post(
            endpoint, 
            data=json.dumps(payload),
            headers={\"Content-Type\": \"application/json\"}
        )
        
        if response.status_code == 200:
            print(f\"Successfully sent indexing request for {url}. Result: {response.text}\")
        else:
            print(f\"Indexing request failed: {response.status_code} - {response.text}\")
            
    except FileNotFoundError:
        print(f\"Google credentials file not found at {key_file_path}. Skipping API ping.\")
    except Exception as e:
        print(f\"Failed to ping Google Indexing API: {str(e)}\")

if __name__ == \"__main__\":
    # Submit the main domain for crawl indexation
    submit_index_request(\"https://www.samadshaikh.dev/\")
\`\`\`

---

### Reading Recommendations

If you want to scale this beyond a single portfolio page, read **[Programmatic SEO in Next.js: Generating 10k Dynamic Pages](/?blog=programmatic-seo-nextjs-dynamic-sitemaps)** to see how to dynamically generate sitemaps and cache database-driven pages.

If you are concerned about securing the API endpoints that power your frontend applications, explore our guide on **[Zero-Trust API Authentication: Mitigating Token Leakage & Session Hijacking](/?blog=zero-trust-authentication-jwt-security-best-practices)** to secure cookies against token theft.

---

### References & Resources

* Schema.org: **[Person Structured Data Schema Specifications](https://schema.org/Person)**
* Google Search Central: **[Structured Data Policies & Guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)**
* Google Search Console: **[Google Search Console Dashboard](https://search.google.com/search-console/)**
* W3C: **[Canonical Link Relations Standard](https://www.w3.org/TR/html52/document-metadata.html#the-link-element)**

---

### Feedback & Collaboration

What tools do you use to verify your indexation states? Have you tested SGE AI Overviews for your developer profiles? I'd love to hear your findings! Drop your feedback on my **[Resume Portal](https://samadshaikh.me)** or write a note in the Connect tab.`
};
