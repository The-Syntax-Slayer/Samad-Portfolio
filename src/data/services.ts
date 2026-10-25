export interface ServiceFaq {
  q: string;
  a: string;
}

export interface ServicePage {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  problem: string;
  includes: string[];
  price: string;
  priceNote: string;
  process: string[];
  proof: string;
  faqs: ServiceFaq[];
  relatedBlogSlugs: string[];
  relatedBlogTitles: string[];
}

export const services: ServicePage[] = [
  {
    slug: "website-development-mumbai",
    title: "Website Developer in Mumbai | Business Websites from ₹19,999 — Samad Shaikh",
    metaDescription:
      "Need a website for your Mumbai business? Fast, mobile-first business websites built in Bandra, Mumbai from ₹19,999 — with contact form, Google Maps, WhatsApp button and basic SEO included.",
    h1: "Website Development in Mumbai for Small Businesses",
    problem:
      "Most customers search on their phone before they visit or call. If your business has no website, or an old slow one, those customers go to a competitor who looks more trustworthy online.",
    includes: [
      "Mobile-first website that loads fast",
      "Your services, photos, prices and location clearly shown",
      "Contact form + WhatsApp button + Google Maps",
      "Basic SEO so Google can find your business name and services",
      "Training video showing how to change text and photos yourself",
    ],
    price: "From ₹19,999 (one-time)",
    priceNote: "Care plan ₹4,999/month optional — updates, backups, small changes.",
    process: [
      "Free 20-minute demo call — I show a sample based on your business.",
      "You approve design + text.",
      "Website live, usually within 2 weeks, then I show you how to use it.",
    ],
    proof:
      "Built business systems for a tours & travels company and a jewellery business in Mumbai (full case studies on the Work page — names published with permission).",
    faqs: [
      {
        q: "How long does it take?",
        a: "Usually 2 weeks after content is approved.",
      },
      {
        q: "Do I own the website?",
        a: "Yes, domain and content are yours.",
      },
      {
        q: "Will it work on mobile?",
        a: "Yes, most of your customers will open it on mobile, so mobile comes first.",
      },
      {
        q: "What if I need changes later?",
        a: "The Care plan covers small changes every month.",
      },
    ],
    relatedBlogSlugs: [
      "absolute-beginners-guide-to-seo-ranking-higher",
      "introduction-to-html5-semantic-web-accessibility-seo",
      "react-19-production-actions-transitions",
    ],
    relatedBlogTitles: [
      "The Absolute Beginner's Guide to SEO: Ranking Higher on Search Engines",
      "Introduction to HTML5 & Semantic Web: Structuring for Accessibility & SEO",
      "React 19 in Production: Practical Guide to Actions, useActionState, and the Compiler",
    ],
  },
  {
    slug: "business-software-mumbai",
    title: "Business Software in Mumbai | CRM, Billing & Inventory Systems — Samad Shaikh",
    metaDescription:
      "Stop running your Mumbai business on notebooks and WhatsApp. Custom CRM, billing and inventory systems from ₹39,999 — built for shops, clinics, salons, tours and jewellery businesses.",
    h1: "Business Software for Mumbai Shops, Clinics, Salons & Agencies",
    problem:
      "Orders on paper, customer details in different phones, stock counted by memory. Things get lost, follow-ups get missed, and growth stops because the owner is doing everything manually.",
    includes: [
      "Customer records in one place",
      "Billing + payment tracking",
      "Stock / inventory with low-stock alerts",
      "Follow-up reminders so no lead is forgotten",
      "Simple dashboard — today's sales, pending payments, pending follow-ups",
    ],
    price: "From ₹39,999 (one-time, depending on features)",
    priceNote: "Care plan ₹4,999/month optional.",
    process: [
      "I watch how you work today for 30 minutes — no jargon.",
      "I build only what you actually use, nothing extra.",
      "Your team gets a short training, then I stay for fixes in the first month.",
    ],
    proof:
      "A tours & travels business system (bookings + customer follow-up) and a jewellery business banking + inventory system — both built for real Mumbai businesses.",
    faqs: [
      {
        q: "Do my staff need computer training?",
        a: "No, it is built for daily use, with a short training included.",
      },
      {
        q: "Is my data safe?",
        a: "Yes, your data stays in your system with login control.",
      },
      {
        q: "Can it grow later?",
        a: "Yes, start with billing + customers, add stock or reports later.",
      },
      {
        q: "Is this only for big companies?",
        a: "No, this is made for owner-run small businesses.",
      },
    ],
    relatedBlogSlugs: [
      "how-i-built-primax-hub-supabase-architecture",
      "sql-vs-nosql-choosing-right-database",
      "scaling-stateful-websockets-fastapi-broadcast",
    ],
    relatedBlogTitles: [
      "How I Built PriMaX Hub: Scaling a Multi-Module SaaS on Supabase Architecture",
      "SQL vs. NoSQL: Choosing the Right Database for Your Project",
      "Scaling Stateful WebSockets: Event-Driven Real-Time Sync with FastAPI & Redis",
    ],
  },
  {
    slug: "ai-automation-mumbai",
    title: "AI Developer in Mumbai | Chatbots, RAG & Business Automation — Samad Shaikh",
    metaDescription:
      "AI automation for Mumbai businesses: website chatbots that answer customers, document Q&A with your own data (RAG), and follow-up automation. Built with Gemini, FastAPI and PostgreSQL.",
    h1: "AI Automation in Mumbai — Chatbots, RAG & Follow-up Automation",
    problem:
      "The same customer questions come again and again, follow-ups are forgotten, and documents take hours to read. AI can handle the repetitive part, so your team handles the customer.",
    includes: [
      "Website chatbot trained on YOUR business — prices, services, timings",
      "Ask-your-documents system (RAG) — contracts, manuals, price lists",
      "Automatic follow-up reminders and message drafts",
      "Clear limits — the bot hands over to a human when it is unsure",
    ],
    price: "Quoted after a free demo call (depends on data size)",
    priceNote:
      "As a guide: small chatbot projects sit in the same band as a business system (from ₹39,999); the demo call gives a fixed quote before any work starts.",
    process: [
      "Demo call — I show what AI can and cannot do for your business, honestly.",
      "Small pilot on one task (for example, answering FAQs).",
      "Expand only if the pilot saves time.",
    ],
    proof:
      "Production AI work — MockMate AI (real-time speech analytics), Octopal (autonomous agent workflows), Agentic RAG with Gemini + PostgreSQL.",
    faqs: [
      {
        q: "Will AI replace my staff?",
        a: "No, it removes repetitive work; humans still close sales and handle customers.",
      },
      {
        q: "Will it give wrong answers?",
        a: "It only answers from your approved data and hands over when unsure.",
      },
      {
        q: "Do I need technical knowledge?",
        a: "No, you give your documents and FAQs, I build the rest.",
      },
    ],
    relatedBlogSlugs: [
      "architecting-agentic-rag-gemini-postgresql",
      "inside-mockmate-ai-speech-analytics-pipeline",
      "securing-llm-integrations-preventing-prompt-injection",
    ],
    relatedBlogTitles: [
      "Architecting Agentic RAG: Production AI Knowledge Systems with Gemini & PostgreSQL",
      "Inside MockMate AI: Designing a Real-Time Audio & Speech Analytics Pipeline",
      "Securing LLM Integrations: Preventing Prompt Injection in GenAI Workflows",
    ],
  },
  {
    slug: "freelance-developer-bandra",
    title: "Freelance Developer in Bandra, Mumbai | Websites & Software — Samad Shaikh",
    metaDescription:
      "Looking for a freelance developer near Bandra? Samad Shaikh, based in Bandra West, Mumbai, builds websites and business software for nearby businesses — with in-person demos in Bandra, Khar, Santacruz and Andheri.",
    h1: "Freelance Developer in Bandra, Mumbai",
    problem:
      "I am based in Bandra West. Nearby businesses can meet in person, see a live demo, and get support in the same timezone without waiting on an agency queue. Service area: Bandra, Khar, Santacruz, Andheri, and the rest of Mumbai online.",
    includes: [
      "Website from ₹19,999",
      "Business system from ₹39,999",
      "Care plan ₹4,999/month",
      "Free 20-minute demo, in person or on call",
    ],
    price: "Fixed quote after a free demo",
    priceNote: "Website from ₹19,999, business system from ₹39,999, care plan ₹4,999/month.",
    process: [
      "Demo (in person in Bandra or on call).",
      "Fixed quote.",
      "Build + training.",
    ],
    proof:
      "Mumbai client work (tours & travels system, jewellery banking + inventory) + production projects (MockMate AI, PriMaX Hub, Octopal).",
    faqs: [
      {
        q: "Can we meet in Bandra?",
        a: "Yes, demo meetings in Bandra West can be arranged.",
      },
      {
        q: "Do you work with businesses outside Bandra?",
        a: "Yes, across Mumbai and online globally.",
      },
      {
        q: "How fast can we start?",
        a: "Demo this week, build starts after you approve the quote.",
      },
    ],
    relatedBlogSlugs: [
      "absolute-beginners-guide-to-seo-ranking-higher",
      "how-i-built-primax-hub-supabase-architecture",
      "architecting-agentic-rag-gemini-postgresql",
    ],
    relatedBlogTitles: [
      "The Absolute Beginner's Guide to SEO: Ranking Higher on Search Engines",
      "How I Built PriMaX Hub: Scaling a Multi-Module SaaS on Supabase Architecture",
      "Architecting Agentic RAG: Production AI Knowledge Systems with Gemini & PostgreSQL",
    ],
  },
];
