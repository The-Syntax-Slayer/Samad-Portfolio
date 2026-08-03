import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { 
  Atom, Code, Globe, Terminal, Database, Cloud, Shield, Sparkles, 
  Zap, GitBranch, Lock, Server, Link2, Layers, Cpu, Milestone 
} from "lucide-react";
import SpotlightCard from "./SpotlightCard";
import portraitImg from "../assets/Samad_Portrait.jpeg";
import portraitImgWebp from "../assets/Samad_Portrait.webp";
import portraitImgAvif from "../assets/Samad_Portrait.avif";

/* ─────────────────────────────────────────────
   Shared helpers
───────────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

function RevealBlock({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ElegantDivider({ delay = 0 }: { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className="w-full h-px relative overflow-hidden">
      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, delay, ease }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   About section data
───────────────────────────────────────────── */
const interests = [
  { label: "Product Development", icon: "◈" },
  { label: "Artificial Intelligence", icon: "◈" },
  { label: "UI/UX Design", icon: "◈" },
  { label: "Startups", icon: "◈" },
  { label: "Emerging Technologies", icon: "◈" },
];

const timelineData = {
  experience: [
    {
      role: "Full-Stack Software Engineer",
      company: "Springer Capital, Freelance - Remote",
      period: "Oct 2024 – June 2026",
      points: [
        "Engineered and deployed comprehensive web architectures utilizing React, TypeScript, and Python/Node.js; integrated robust RESTful APIs with PostgreSQL to deliver performance-optimized frontend components, sophisticated backend logic, and durable data persistence layers.",
        "Architected and deployed high-performance RESTful APIs & external service integrations, enforcing rigorous request validation, secure authentication protocols, and fault-tolerant data synchronization across distributed full-stack architectures.",
        "Spearheaded the integration of advanced LLM orchestration layers within core application logic, optimizing model-generated outputs for architectural integrity, fault tolerance, and scalable production deployment.",
        "Developed modular technical assets and managed autonomous troubleshooting across distributed full-stack architectures; utilized version-controlled CI/CD pipelines to ensure architectural integrity and seamless production deployment."
      ]
    },
    {
      role: "Software Developer Intern — AI & Full-Stack",
      company: "Arova Technologies, Mumbai",
      period: "May 2023 – Oct 2024",
      points: [
        "Designed and developed full-stack Python + React applications end-to-end, applying OOP principles and SOLID design patterns to produce clean, production-grade codebases used by real teams daily.",
        "Integrated LLMs into enterprise systems to automate content pipelines, enhance reporting capabilities, and deliver AI-driven decision-support directly analogous to integrating LLMs into financial governance tooling.",
        "Collaborated across cross-functional teams to gather ambiguous requirements, produce technical specs, and iterate rapidly in agile sprints maintaining a risk-and-control mindset on data integrity and system reliability."
      ]
    },
    {
      role: "Data Analytics Specialist",
      company: "Freelance, Mumbai",
      period: "Sep 2022 – April 2023",
      points: [
        "Delivered data entry, cleaning, QA, and structured reporting across a sustained 8-month independent engagement; identified and resolved systemic data integrity errors that improved downstream analytics accuracy for multiple clients.",
        "Developed advanced Excel skills (pivot tables, VLOOKUP, data validation, conditional formatting) building a practical foundation in data management directly applicable to enterprise analytics and governance tooling."
      ]
    }
  ],
  education: [
    {
      degree: "B.Sc. in Computer Science",
      institution: "M.P.S.P.S College — University of Mumbai",
      period: "2023 – 2026 (Graduated)",
      details: "CGPA: 8.25 / 10. Focus on Advanced Software Engineering, Distributed Systems, Algorithms, Database Designs, and Object-Oriented programming architectures."
    },
    {
      degree: "Higher Secondary Certificate (HSC)",
      institution: "RD National College, Maharashtra Board",
      period: "2022 – 2023",
      details: "Science Stream | Score: 50.00%. Completed core curriculum covering biology, physics, chemistry, mathematics, and information technology."
    },
    {
      degree: "Secondary School Certificate (SSC)",
      institution: "K.E.P School, Bandra (Maharashtra Board)",
      period: "2020 – 2021",
      details: "Score: 85.50%. Graduated with honors, demonstrating excellent academic performance and strong foundational skills in science and mathematics."
    }
  ],
  certifications: [
    "Google Data Analytics Professional Certificate — Google",
    "IBM AI Developer Professional Certificate — IBM",
    "IBM DevOps & Software Engineering Certificate — IBM",
    "Meta Front-End Developer Professional Certificate — Meta",
    "AWS Cloud Practitioner Essentials — Amazon Web Services",
    "Google Cloud Digital Leader — Google Cloud",
    "Azure Enterprise Data Analyst Associate — Microsoft",
    "Microsoft Azure AI Engineer Associate — Microsoft",
    "Microsoft Power Platform Fundamentals — Microsoft",
    "GitHub Foundations Certificate — GitHub",
    "Generative AI: Prompt Engineering — Coursera"
  ]
};

/* ─────────────────────────────────────────────
   Skills section data  — portfolio theme tokens
   Card bg : #0B0F19   Border: #181F2F
   Hover   : #39D353/30  Highlight: #B0FF92
───────────────────────────────────────────── */
const skillCards = [
  {
    id: "01",
    category: "Frontend Engineering",
    description: "Building fast, high-performance, and responsive user interfaces.",
    skills: ["React 19", "Next.js", "TypeScript", "Tailwind CSS", "Zustand/Redux", "Framer Motion", "Vite"],
    span: "col-span-1 md:col-span-2",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "02",
    category: "Backend & API Architecture",
    description: "Scalable server-side architecture, microservices, and APIs.",
    skills: ["Python (Asyncio)", "FastAPI", "Tornado", "RESTful API", "Microservices", "Async Programming"],
    span: "col-span-1",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
  },
  {
    id: "03",
    category: "Applied GenAI & Agents",
    description: "Integrating intelligent LLM orchestration and agentic workflows.",
    skills: ["Google Gemini", "LLM Orchestration", "RAG Frameworks", "Prompt Engineering", "AI Workflows"],
    span: "col-span-1",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44A2.5 2.5 0 0 1 5 16.5v-3a2.5 2.5 0 0 1 0-5v-3A2.5 2.5 0 0 1 9.5 2Z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44A2.5 2.5 0 0 0 19 16.5v-3a2.5 2.5 0 0 0 0-5v-3A2.5 2.5 0 0 0 14.5 2Z" />
      </svg>
    ),
  },
  {
    id: "04",
    category: "Data & Database Systems",
    description: "Optimized relational database designs and real-time data sync.",
    skills: ["PostgreSQL", "Relational DB Design", "ETL Pipelines", "Database Optimization", "Real-time Sync"],
    span: "col-span-1",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    id: "05",
    category: "Infrastructure & DevOps",
    description: "Cloud deployment and automated containerization.",
    skills: ["AWS", "Microsoft Azure", "Google Cloud", "Docker", "CI/CD Pipelines", "Git / GitHub"],
    span: "col-span-1",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: "06",
    category: "Cybersecurity & Practices",
    description: "Secure application development and agile software methodologies.",
    skills: ["Application Security (AppSec)", "Identity & Access Management", "SOLID Principles", "OOP & Design Patterns", "Agile / SDLC"],
    span: "col-span-1 md:col-span-2",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

const tickerItems = [
  "React 19", "Next.js", "TypeScript", "Python", "FastAPI", "Google Gemini",
  "PostgreSQL", "Tornado", "RAG Frameworks", "Prompt Engineering", "Zustand",
  "Tailwind CSS", "Framer Motion", "Docker", "AWS", "Azure", "CI/CD",
  "Application Security", "SOLID Principles", "OOP & Design Patterns",
];

/* ─────────────────────────────────────────────
   SkillCard — portfolio native theme
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   SkillCard — portfolio native theme
───────────────────────────────────────────── */
function getSkillIcon(skill: string) {
  const s = skill.toLowerCase();
  if (s.includes("react")) return <Atom className="w-3.5 h-3.5" />;
  if (s.includes("next.js")) return <Globe className="w-3.5 h-3.5" />;
  if (s.includes("typescript")) return <Code className="w-3.5 h-3.5" />;
  if (s.includes("tailwind")) return <Layers className="w-3.5 h-3.5" />;
  if (s.includes("framer motion") || s.includes("zustand") || s.includes("redux")) return <Cpu className="w-3.5 h-3.5" />;
  if (s.includes("vite")) return <Zap className="w-3.5 h-3.5" />;
  
  if (s.includes("python")) return <Terminal className="w-3.5 h-3.5" />;
  if (s.includes("fastapi")) return <Zap className="w-3.5 h-3.5" />;
  if (s.includes("tornado")) return <Cpu className="w-3.5 h-3.5" />;
  if (s.includes("api") || s.includes("restful")) return <Link2 className="w-3.5 h-3.5" />;
  if (s.includes("microservices")) return <Server className="w-3.5 h-3.5" />;
  
  if (s.includes("gemini") || s.includes("llm") || s.includes("rag") || s.includes("prompt") || s.includes("ai")) {
    return <Sparkles className="w-3.5 h-3.5" />;
  }
  
  if (s.includes("postgre") || s.includes("db") || s.includes("database")) return <Database className="w-3.5 h-3.5" />;
  if (s.includes("etl")) return <Layers className="w-3.5 h-3.5" />;
  
  if (s.includes("aws") || s.includes("azure") || s.includes("cloud")) return <Cloud className="w-3.5 h-3.5" />;
  if (s.includes("docker")) return <Server className="w-3.5 h-3.5" />;
  if (s.includes("git")) return <GitBranch className="w-3.5 h-3.5" />;
  if (s.includes("ci/cd")) return <Server className="w-3.5 h-3.5" />;
  
  if (s.includes("security") || s.includes("appsec")) return <Shield className="w-3.5 h-3.5" />;
  if (s.includes("access management") || s.includes("identity")) return <Lock className="w-3.5 h-3.5" />;
  if (s.includes("solid") || s.includes("oop") || s.includes("patterns")) return <Layers className="w-3.5 h-3.5" />;
  if (s.includes("agile") || s.includes("sdlc")) return <Milestone className="w-3.5 h-3.5" />;
  
  return <Code className="w-3.5 h-3.5" />;
}

function SkillCard({
  card,
  index,
}: {
  card: (typeof skillCards)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: index * 0.06, ease }}
      whileHover={{ y: -3, transition: { duration: 0.3, ease } }}
      className={card.span}
    >
      <SpotlightCard
        className="h-full"
        contentClassName="p-6 flex flex-col gap-5 w-full h-full"
        glowColor="rgba(var(--theme-mint-rgb), 0.05)"
        hoverBorderColor="rgba(var(--theme-mint-rgb), 0.35)"
      >
        {/* Header pill — same style as Home bento pills */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-mint/[0.04] border border-mint/20 rounded-full text-[11px] font-Spline_Sans_Mono text-accent flex items-center gap-1.5 w-fit group-hover:border-[rgba(var(--theme-mint-rgb),0.35)] transition-colors duration-300">
            <span className="text-white/70 group-hover:text-highlight transition-colors duration-300">
              {card.icon}
            </span>
            <span className="text-white/70">{card.category}</span>
          </div>
          <span className="font-Spline_Sans_Mono text-[9px] text-accent/25 tracking-widest ml-auto">
            {card.id}
          </span>
        </div>

        {/* Description */}
        <p className="text-accent/45 text-[12px] font-light leading-relaxed">
          {card.description}
        </p>

        {/* Skills badges — match the portfolio's existing tag pill style */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {card.skills.map((skill, i) => (
            <motion.span
              key={i}
              whileHover={{ scale: 1.04, y: -1 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-Spline_Sans_Mono cursor-default select-none
                bg-mint/[0.03] border border-mint/10 text-accent/75
                group-hover:border-mint/25 hover:!border-mint/55 hover:!text-highlight hover:bg-mint/10 hover:shadow-[0_0_12px_rgba(143,255,209,0.12)]
                transition-all duration-200"
            >
              {getSkillIcon(skill)}
              <span>{skill}</span>
            </motion.span>
          ))}
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SkillTicker — portfolio theme
───────────────────────────────────────────── */
function SkillTicker() {
  const doubled = [...tickerItems, ...tickerItems];
  return (
    <div className="relative overflow-hidden py-1">
      {/* Edge fades match the black background */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#07100D] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#07100D] to-transparent z-10 pointer-events-none" />
      <div className="custom-marquee">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 mx-4 font-Spline_Sans_Mono text-[11px] uppercase tracking-[0.2em] text-mint/80 text-glow-mint hover:text-white transition-all duration-300 cursor-default select-none"
          >
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-highlight/50 shadow-[0_0_6px_#B0FF92] shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Export
───────────────────────────────────────────── */
export default function About() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-5xl px-4 md:px-6 flex flex-col pb-0 mt-8 gap-0"
    >
      {/* ══════════════════════════════════════
          ABOUT ME SECTION
      ══════════════════════════════════════ */}

      <RevealBlock delay={0.05}>
        <p className="font-Spline_Sans_Mono text-[11px] tracking-[0.3em] uppercase text-white/20 mb-6 md:mb-14 select-none">
          // About Me
        </p>
      </RevealBlock>

      {/* Hero: Portrait + Headline */}
      <div
        ref={heroRef}
        className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-16 md:mb-28"
      >
        {/* Portrait */}
        <RevealBlock delay={0.1} className="relative">
          <div className="relative overflow-hidden rounded-2xl aspect-square md:aspect-[3/4] max-h-[350px] md:max-h-[600px]">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
            <div className="absolute inset-0 z-20 rounded-2xl ring-1 ring-white/8 pointer-events-none" />
            <motion.div style={{ y: imageY, scale: imageScale }} className="w-full h-full">
              <picture className="w-full h-full">
                <source srcSet={portraitImgAvif} type="image/avif" />
                <source srcSet={portraitImgWebp} type="image/webp" />
                <img
                  src={portraitImg}
                  alt="Samad Shaikh - Innovative Software Developer, AI Engineer & Tech Entrepreneur in Mumbai"
                  className="w-full h-full object-cover object-center"
                  draggable={false}
                  fetchPriority="high"
                  loading="eager"
                  width={600}
                  height={800}
                />
              </picture>
            </motion.div>
            <div className="absolute bottom-0 left-0 right-0 z-30 p-6 flex items-end justify-between">
              <div>
                <p className="font-Spline_Sans_Mono text-[10px] tracking-widest uppercase text-white/35 mb-1">
                  Samad Shaikh
                </p>
                <p className="text-white/50 text-xs font-light italic">
                  Software Engineer · Full-Stack Developer · AI Specialist in Mumbai
                </p>
              </div>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                <span className="text-white/30 text-xs">✦</span>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8, ease }}
            className="absolute -top-3 -right-3 w-6 h-6 border-t border-r border-white/20"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.8, ease }}
            className="absolute -bottom-3 -left-3 w-6 h-6 border-b border-l border-white/20"
          />
        </RevealBlock>

        {/* Headline + intro */}
        <div className="flex flex-col justify-between gap-6 md:gap-10 lg:pt-6">
          <div>
            <RevealBlock delay={0.15}>
              <div className="flex items-start justify-between gap-4 mb-6">
                <h1 className="font-serif-display font-medium text-5xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight text-white/90">
                  About
                  <br />
                  <span className="italic font-light text-white/50">Me.</span>
                </h1>
                <div className="flex flex-wrap gap-2.5 pt-2 sm:pt-4 md:pt-5 justify-end max-w-[180px] sm:max-w-none">
                  <a
                    href="https://github.com/The-Syntax-Slayer"
                    target="_blank"
                    rel="noreferrer"
                    title="GitHub"
                    className="w-9 h-9 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-[#8FFFD1]/5 hover:border-[#8FFFD1]/30 flex items-center justify-center text-accent/60 hover:text-[#8FFFD1] transition-all duration-300 shadow-md group relative cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/samad-ai"
                    target="_blank"
                    rel="noreferrer"
                    title="LinkedIn"
                    className="w-9 h-9 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-[#8FFFD1]/5 hover:border-[#8FFFD1]/30 flex items-center justify-center text-accent/60 hover:text-[#8FFFD1] transition-all duration-300 shadow-md group relative cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a
                    href="https://samadshaikh.me"
                    target="_blank"
                    rel="noreferrer"
                    title="Resume"
                    className="w-9 h-9 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-[#8FFFD1]/5 hover:border-[#8FFFD1]/30 flex items-center justify-center text-accent/60 hover:text-[#8FFFD1] transition-all duration-300 shadow-md group relative cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                      <path d="M10 9H8" />
                      <path d="M16 13H8" />
                      <path d="M16 17H8" />
                    </svg>
                  </a>
                  <a
                    href="mailto:contact@samadshaikh.dev"
                    title="Email"
                    className="w-9 h-9 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-[#8FFFD1]/5 hover:border-[#8FFFD1]/30 flex items-center justify-center text-accent/60 hover:text-[#8FFFD1] transition-all duration-300 shadow-md group relative cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </RevealBlock>
            <ElegantDivider delay={0.2} />
            <RevealBlock delay={0.25} className="mt-5 md:mt-8">
              <p className="font-serif-display text-accent/80 text-base md:text-lg font-light leading-[1.85] max-w-[44ch]">
                I'm{" "}
                <span className="text-white font-normal">Samad Shaikh</span> - a
                software engineer and AI specialist passionate about creating
                meaningful digital experiences.
              </p>
            </RevealBlock>
          </div>

          <RevealBlock delay={0.3}>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {[
                { num: "3+", label: "Years\nLearning" },
                { num: "6+", label: "Products\nBuilt" },
                { num: "∞", label: "Ideas\nExplored" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="font-serif-display text-3xl md:text-4xl font-medium text-white/80 leading-none">
                    {stat.num}
                  </span>
                  <span className="font-Spline_Sans_Mono text-[9px] uppercase tracking-widest text-white/25 whitespace-pre-line">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </RevealBlock>



          <RevealBlock delay={0.35}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-mint/20 bg-mint/5 w-fit shadow-[0_0_15px_rgba(143,255,209,0.05)]">
              <span className="w-1.5 h-1.5 rounded-full bg-mint shadow-[0_0_6px_#8FFFD1] animate-pulse" />
              <span className="font-Spline_Sans_Mono text-[10px] uppercase tracking-[0.25em] text-mint/80">
                Building products that matter
              </span>
            </div>
          </RevealBlock>
        </div>
      </div>

      {/* Story */}
      <ElegantDivider />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mt-16 md:mt-24 mb-16 md:mb-28">
        <RevealBlock delay={0.05} className="lg:col-span-3">
          <p className="font-Spline_Sans_Mono text-[10px] tracking-[0.3em] uppercase text-white/20 lg:pt-1 sticky top-24">
            The Journey
          </p>
        </RevealBlock>
        <div className="lg:col-span-9 flex flex-col gap-10">
          <RevealBlock delay={0.1}>
            <p className="font-serif-display text-accent/70 text-base md:text-lg font-light leading-[2] max-w-[56ch]">
              My journey began with{" "}
              <span className="text-white/80 font-normal italic">curiosity</span>{" "}
              - about how websites, products, and technology work. What started as
              learning to code evolved into designing interfaces, building
              full-stack applications, and launching complete products.
            </p>
          </RevealBlock>
          <RevealBlock delay={0.15}>
            <p className="font-serif-display text-accent/70 text-base md:text-lg font-light leading-[2] max-w-[56ch]">
              Today, I focus on{" "}
              <span className="text-white/80 font-normal">AI-powered tools</span>,{" "}
              <span className="text-white/80 font-normal">SaaS platforms</span>,
              and modern web experiences from my base in Bandra, Mumbai. I enjoy working across the entire product
              lifecycle - from identifying problems and designing solutions to
              building, launching, and improving products.
            </p>
          </RevealBlock>
          <RevealBlock delay={0.2}>
            <div className="relative pl-6 border-l border-white/15 my-4">
              <p className="font-serif-display text-xl md:text-2xl italic font-light text-white/60 leading-[1.7]">
                "I believe great products exist at the intersection of technology,
                design, and purpose."
              </p>
            </div>
          </RevealBlock>
          <RevealBlock delay={0.25}>
            <p className="font-serif-display text-accent/70 text-base md:text-lg font-light leading-[2] max-w-[56ch]">
              Every project I build is an opportunity to learn, solve problems, and
              create something valuable for real people. Not just shipping features
              - but crafting experiences that feel intentional, human, and lasting.
            </p>
          </RevealBlock>
        </div>
      </div>

      {/* Philosophy & Approach */}
      <ElegantDivider />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mt-16 md:mt-24 mb-16 md:mb-28">
        <RevealBlock delay={0.05} className="lg:col-span-3">
          <p className="font-Spline_Sans_Mono text-[10px] tracking-[0.3em] uppercase text-white/20 lg:pt-1 sticky top-24">
            Philosophy
          </p>
        </RevealBlock>
        <div className="lg:col-span-9 flex flex-col gap-6">
          <RevealBlock delay={0.1}>
            <h2 className="font-serif-display text-white text-2xl md:text-3xl font-medium tracking-wide">
              Engineering with <span className="italic font-light text-mint">intent.</span>
            </h2>
          </RevealBlock>
          <RevealBlock delay={0.15}>
            <p className="font-serif-display text-accent/70 text-base md:text-lg font-light leading-[2] max-w-[56ch]">
              I don't just write code; I design systems. I believe that software should be robust, clean, and highly performant, but it should also look and feel exceptional. To me, a visual inconsistency is as critical as an unhandled exception. I bridge technical rigor (using async performance paradigms and strict typing) with meticulous visual craftsmanship (fluid animations and harmonic color spaces) to deliver applications that feel premium and organic.
            </p>
          </RevealBlock>
          <RevealBlock delay={0.2}>
            <p className="font-serif-display text-accent/70 text-base md:text-lg font-light leading-[2] max-w-[56ch]">
              When integrating artificial intelligence, my goal is utility over hype. I design agentic systems and Retrieval-Augmented Generation (RAG) pipelines that solve concrete user problems, ensuring outputs are fast, structured, and secure.
            </p>
          </RevealBlock>
        </div>
      </div>

      {/* Experience & Education Timeline */}
      <ElegantDivider />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mt-16 md:mt-24 mb-16 md:mb-28">
        <RevealBlock delay={0.05} className="lg:col-span-3">
          <p className="font-Spline_Sans_Mono text-[10px] tracking-[0.3em] uppercase text-white/20 lg:pt-1 sticky top-24">
            Timeline
          </p>
        </RevealBlock>
        <div className="lg:col-span-9 flex flex-col gap-14">
          {/* Experience Timeline */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs text-mint">◈</span>
              <h2 className="font-Spline_Sans_Mono text-xs uppercase tracking-widest text-white/80">
                Experience
              </h2>
            </div>
            <div className="relative pl-6 border-l border-white/10 flex flex-col gap-10">
              {timelineData.experience.map((exp, idx) => (
                <div key={idx} className="relative group">
                  {/* Glowing Node */}
                  <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-black border border-mint/40 group-hover:bg-mint group-hover:border-mint transition-colors duration-300 shadow-[0_0_8px_rgba(143,255,209,0.2)]" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                    <h3 className="text-white font-medium text-[15px]">{exp.role}</h3>
                    <span className="font-Spline_Sans_Mono text-[10px] text-mint/60">{exp.period}</span>
                  </div>
                  <p className="text-accent/65 font-light text-xs mb-3 italic">{exp.company}</p>
                  <ul className="flex flex-col gap-2.5">
                    {exp.points.map((pt, pIdx) => (
                      <li key={pIdx} className="text-accent/45 text-xs font-light leading-relaxed flex items-start gap-2">
                        <span className="text-mint/40 mt-1 shrink-0 text-[8px]">▪</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education Timeline */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs text-mint">◈</span>
              <h2 className="font-Spline_Sans_Mono text-xs uppercase tracking-widest text-white/80">
                Education
              </h2>
            </div>
            <div className="relative pl-6 border-l border-white/10 flex flex-col gap-10">
              {timelineData.education.map((edu, idx) => (
                <div key={idx} className="relative group">
                  {/* Glowing Node */}
                  <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-black border border-mint/40 group-hover:bg-mint group-hover:border-mint transition-colors duration-300 shadow-[0_0_8px_rgba(143,255,209,0.2)]" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                    <h3 className="text-white font-medium text-[15px]">{edu.degree}</h3>
                    <span className="font-Spline_Sans_Mono text-[10px] text-mint/60">{edu.period}</span>
                  </div>
                  <p className="text-accent/65 font-light text-xs mb-2 italic">{edu.institution}</p>
                  <p className="text-accent/45 text-xs font-light leading-relaxed">{edu.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Block */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs text-mint">◈</span>
              <h2 className="font-Spline_Sans_Mono text-xs uppercase tracking-widest text-white/80">
                Certifications
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {timelineData.certifications.map((cert, idx) => (
                <span key={idx} className="px-3.5 py-2 rounded-xl border border-white/5 bg-white/[0.01] hover:border-mint/30 hover:bg-mint/[0.02] text-accent/60 hover:text-white text-xs font-light transition-all duration-300 cursor-default select-none">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interests */}
      <ElegantDivider />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mt-16 md:mt-24 mb-16 md:mb-28">
        <RevealBlock delay={0.05} className="lg:col-span-3">
          <p className="font-Spline_Sans_Mono text-[10px] tracking-[0.3em] uppercase text-white/20">
            Interests
          </p>
        </RevealBlock>
        <div className="lg:col-span-9">
          <RevealBlock delay={0.1}>
            <div className="flex flex-wrap gap-3">
              {interests.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i + 0.1, duration: 0.7, ease }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="group flex items-center gap-2.5 px-5 py-3 rounded-full border border-white/8 bg-white/3 hover:border-mint/30 hover:bg-mint/5 hover:shadow-[0_0_15px_rgba(143,255,209,0.1)] transition-all duration-300 cursor-default select-none"
                >
                  <span className="text-mint/50 group-hover:text-mint/80 transition-colors duration-300">
                    {item.icon}
                  </span>
                  <span className="text-white/50 text-sm font-light group-hover:text-white/80 transition-colors duration-300">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </RevealBlock>
        </div>
      </div>

      {/* Closing statement */}
      <ElegantDivider />
      <RevealBlock delay={0.05} className="mt-24 mb-32">
        <div className="relative flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
          <div>
            <p className="font-Spline_Sans_Mono text-[10px] tracking-[0.3em] uppercase text-white/20 mb-6">
              In essence
            </p>
            <h2 className="font-serif-display font-light italic text-4xl sm:text-5xl md:text-6xl text-white/70 leading-[1.15] max-w-[16ch]">
              Building products that make technology feel more{" "}
              <span className="text-white/90 not-italic font-medium">human.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-2 lg:text-right shrink-0">
            {["Software Engineer", "Full-Stack Developer", "AI Specialist"].map((role, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i + 0.2, duration: 0.7, ease }}
                className="flex items-center gap-3 lg:justify-end"
              >
                <span className="w-5 h-px bg-white/15" />
                <span className="font-Spline_Sans_Mono text-xs uppercase tracking-widest text-white/30">
                  {role}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </RevealBlock>

      {/* ══════════════════════════════════════
          SKILLS & EXPERTISE SECTION
      ══════════════════════════════════════ */}

      {/* Section header */}
      <ElegantDivider />

      <div className="mt-20 mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <RevealBlock delay={0.05}>
          <p className="font-Spline_Sans_Mono text-[11px] tracking-[0.3em] uppercase text-white/20 mb-4 select-none">
            // Skills & Expertise
          </p>
          <h2 className="font-serif-display font-medium text-4xl sm:text-5xl md:text-[3.5rem] leading-[1.08] tracking-tight text-white/90">
            What I
            <br />
            <span className="italic font-light text-white/45">know.</span>
          </h2>
        </RevealBlock>

        <RevealBlock delay={0.12} className="md:max-w-[38ch] md:pb-1">
          <p className="text-white/35 text-[13px] font-light leading-[1.85]">
            The tools, technologies, and disciplines I use to transform ideas into products.
          </p>
        </RevealBlock>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-0">
        {skillCards.map((card, i) => (
          <SkillCard key={card.id} card={card} index={i} />
        ))}
      </div>

      {/* Ticker strip — matches portfolio card style */}
      <div className="mt-3 rounded-3xl overflow-hidden py-4 border border-mint/15 bg-[#07100D]/95 hover:border-mint/30 transition-colors duration-300">
        <SkillTicker />
      </div>

      <RevealBlock delay={0.1} className="mt-16 mb-40">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-mint/10 to-transparent" />
          <div className="flex items-center gap-3">
            {["Developer", "•", "Designer", "•", "Builder"].map((w, i) => (
              <span
                key={i}
                className={`font-Spline_Sans_Mono text-[10px] uppercase tracking-widest ${w === "•" ? "text-highlight/40" : "text-accent/25"
                  }`}
              >
                {w}
              </span>
            ))}
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-mint/10 to-transparent" />
        </div>
      </RevealBlock>
    </motion.div>
  );
}
