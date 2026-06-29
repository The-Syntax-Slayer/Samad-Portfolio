import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ExternalLink } from "lucide-react";
import primaxImg from "../assets/primax.webp";
import primaxImgSm from "../assets/primax-sm.webp";
import primaxImgMd from "../assets/primax-md.webp";
import mmImg from "../assets/mm.webp";
import mmImgSm from "../assets/mm-sm.webp";
import mmImgMd from "../assets/mm-md.webp";
import planoraImg from "../assets/planora_2.webp";
import planoraImgSm from "../assets/planora_2-sm.webp";
import planoraImgMd from "../assets/planora_2-md.webp";
import wlImg from "../assets/wl.webp";
import wlImgSm from "../assets/wl-sm.webp";
import wlImgMd from "../assets/wl-md.webp";
import legaleaseImg from "../assets/legalease.webp";
import legaleaseImgSm from "../assets/legalease-sm.webp";
import legaleaseImgMd from "../assets/legalease-md.webp";
import clientsyncImg from "../assets/clientsync.webp";
import clientsyncImgSm from "../assets/clientsync-sm.webp";
import clientsyncImgMd from "../assets/clientsync-md.webp";
import smartmeetImg from "../assets/smartmeet.webp";
import smartmeetImgSm from "../assets/smartmeet-sm.webp";
import smartmeetImgMd from "../assets/smartmeet-md.webp";

// AI Projects assets
import octopalImg from "../assets/octopal.png";
import tradingImg from "../assets/trading.png";
import calfkitImg from "../assets/calfkit.png";

// Setup compilation placeholders for Vite build
const octopalImgSm = octopalImg;
const octopalImgMd = octopalImg;
const tradingImgSm = tradingImg;
const tradingImgMd = tradingImg;
const calfkitImgSm = calfkitImg;
const calfkitImgMd = calfkitImg;

import browsermcpImg from "../assets/browsermcp.png";
const browsermcpImgSm = browsermcpImg;
const browsermcpImgMd = browsermcpImg;

import autocoderoverImg from "../assets/autocoderover.png";
const autocoderoverImgSm = autocoderoverImg;
const autocoderoverImgMd = autocoderoverImg;

import langgraphImg from "../assets/langgraph.png";
const langgraphImgSm = langgraphImg;
const langgraphImgMd = langgraphImg;

const projects = [
  {
    id: "01",
    title: "Octopal",
    category: "AI Agent Operator",
    themeColor: "#8FFFD1", // Mint Green
    description: "A local, Docker-sandboxed autonomous AI agent (Octo) that coordinates short-lived specialized workers to perform automation, scheduled workflows, and web research securely.",
    problem: "AI agents with broad host system permissions are highly vulnerable to prompt injections and malicious code execution.",
    solution: "Architected a coordinator-worker model where the thinking loop is split from the execution environment using disposable Docker sandboxes.",
    metrics: [
      { value: "100%", label: "Sandbox Isolation" },
      { value: "12+", label: "Worker Templates" }
    ],
    techStack: ["Python", "FastAPI", "Docker", "Telegram API", "uv"],
    image: octopalImg,
    imageSm: octopalImgSm,
    imageMd: octopalImgMd,
    demoLink: "https://github.com/The-Syntax-Slayer/Octopal",
    githubLink: "https://github.com/The-Syntax-Slayer/Octopal",
  },
  {
    id: "02",
    title: "Autonomous LLM Trading Agents",
    category: "AI Multi-Agent Simulation",
    themeColor: "#F59E0B", // Amber
    description: "A multi-agent quantitative finance system where specialized agents (Traders, Analysts, Risk Managers) coordinate via async message passing to execute mock trades.",
    problem: "Single-agent trading models fail to balance complex market monitoring, deep analyst research, and strict risk limits.",
    solution: "Designed a 5-stage agent pipeline coordinated by an async CommunicationHub, separating research, risk management, and execution roles.",
    metrics: [
      { value: "5+", label: "Cooperating Agents" },
      { value: "100+", label: "Supported Models" }
    ],
    techStack: ["Python", "Asyncio", "OpenRouter", "TOML", "pytest"],
    image: tradingImg,
    imageSm: tradingImgSm,
    imageMd: tradingImgMd,
    demoLink: "https://github.com/The-Syntax-Slayer/autonomous-llm-trading-agents",
    githubLink: "https://github.com/The-Syntax-Slayer/autonomous-llm-trading-agents",
  },
  {
    id: "03",
    title: "Auto-Code-Rover",
    category: "Autonomous Coding Agent",
    themeColor: "#EC4899", // Pink
    description: "An autonomous software engineer that resolves real-world GitHub issues in SWE-bench using AST-level context gathering and iterative edits.",
    problem: "Generic LLM coding helpers lack codebase structure awareness, causing high costs and poor task success rates.",
    solution: "Built an agent that parses codebases into abstract syntax trees (AST) to selectively search classes/methods and execute precise, localized edits.",
    metrics: [
      { value: "37.3%", label: "SWE-bench Lite" },
      { value: "51.6%", label: "SWE-bench Verified" }
    ],
    techStack: ["Python", "AST Parsing", "SWE-bench", "LLM reasoning"],
    image: autocoderoverImg,
    imageSm: autocoderoverImgSm,
    imageMd: autocoderoverImgMd,
    demoLink: "https://github.com/The-Syntax-Slayer/auto-code-rover",
    githubLink: "https://github.com/The-Syntax-Slayer/auto-code-rover",
  },
  {
    id: "04",
    title: "Calfkit SDK",
    category: "AI Agent Framework",
    themeColor: "#A78BFA", // Purple
    description: "An agent-orchestration library enabling decentralized multi-agent collaboration with runtime discovery, dynamic messaging, and tool delegation without hardcoding.",
    problem: "Multi-agent frameworks often require complex, rigid orchestrators and hardcoded routing pipelines, making scaling difficult.",
    solution: "Developed a decentralized framework where agents dynamically advertise capabilities, discover peers, and self-choreograph work.",
    metrics: [
      { value: "0", label: "Hardcoded Routing" },
      { value: "Dynamic", label: "Runtime Discovery" }
    ],
    techStack: ["Python", "Pydantic", "OpenAI API", "PyPI"],
    image: calfkitImg,
    imageSm: calfkitImgSm,
    imageMd: calfkitImgMd,
    demoLink: "https://github.com/The-Syntax-Slayer/calfkit-sdk",
    githubLink: "https://github.com/The-Syntax-Slayer/calfkit-sdk",
  },
  {
    id: "05",
    title: "Browser MCP",
    category: "Developer MCP Tool",
    themeColor: "#06B6D4", // Cyan
    description: "A Playwright-powered Model Context Protocol server enabling LLMs to perform browser automation, CDP sessions, and bookmarking with a React dashboard interface.",
    problem: "Coding agents need a safe, visual, and highly-configurable browser interface to perform research, E2E testing, and scraping.",
    solution: "Built a custom MCP server integrating Chrome CDP sessions, Playwright automation, and a live React dashboard for monitoring.",
    metrics: [
      { value: "Playwright", label: "Browser Engine" },
      { value: "FastMCP", label: "MCP Protocol" }
    ],
    techStack: ["TypeScript", "Playwright", "FastMCP", "React"],
    image: browsermcpImg,
    imageSm: browsermcpImgSm,
    imageMd: browsermcpImgMd,
    demoLink: "https://github.com/The-Syntax-Slayer/browser-mcp",
    githubLink: "https://github.com/The-Syntax-Slayer/browser-mcp",
  },
  {
    id: "06",
    title: "FastAPI LangGraph Template",
    category: "AI Agent Template",
    themeColor: "#10B981", // Emerald
    description: "A production-ready FastAPI template for building scalable AI agent services with LangGraph, including structured routing, background state execution, and JWT authentication.",
    problem: "Moving LangGraph conversational agents from development scripts to production-ready REST APIs requires redundant boilerplate.",
    solution: "Created a template containing pre-built async background task runners, state persistence, structured JSON endpoints, and Docker configs.",
    metrics: [
      { value: "100%", label: "Production Ready" },
      { value: "Async", label: "Execution Loop" }
    ],
    techStack: ["FastAPI", "LangGraph", "Python", "JWT", "Docker"],
    image: langgraphImg,
    imageSm: langgraphImgSm,
    imageMd: langgraphImgMd,
    demoLink: "https://github.com/The-Syntax-Slayer/fastapi-langgraph-agent-production-ready-template",
    githubLink: "https://github.com/The-Syntax-Slayer/fastapi-langgraph-agent-production-ready-template",
  },
  {
    id: "07",
    title: "PriMaX Hub",
    category: "AI Productivity SaaS",
    themeColor: "#3B82F6", // Cyber Blue
    description: "An AI-powered productivity ecosystem that integrates neuroscience growth frameworks to build habits, track performance, and help users crush their daily goals.",
    problem: "Traditional productivity tools lack personalized accountability, leading to an 80% drop-off rate in habit building.",
    solution: "Built an AI productivity ecosystem integrating neuroscience growth frameworks, behavioral habit loops, and automated progress analytics.",
    metrics: [
      { value: "35%+", label: "Habit Retention" },
      { value: "< 100ms", label: "DB Latency" }
    ],
    techStack: ["React", "TypeScript", "Node.js", "MongoDB", "Gemini API"],
    image: primaxImg,
    imageSm: primaxImgSm,
    imageMd: primaxImgMd,
    demoLink: "https://primax-sigma.vercel.app/",
    githubLink: "https://github.com/The-Syntax-Slayer/PriMaX-Hub.git",
  },
  {
    id: "08",
    title: "MockMate AI",
    category: "AI Product",
    themeColor: "#A78BFA", // Purple
    description: "An AI-powered interview preparation platform helping users practice interviews, improve communication skills, analyze resumes, and receive personalized feedback.",
    problem: "Job seekers struggle to get actionable, real-time feedback on speaking pace, tone, and answers during interview practice.",
    solution: "Developed a voice-first speech analytics platform analyzing speech-to-text patterns, pace (WPM), sentiment, and semantic accuracy.",
    metrics: [
      { value: "12k+", label: "Mock Sessions" },
      { value: "94%", label: "Accuracy Score" }
    ],
    techStack: ["React", "TypeScript", "Node.js", "MongoDB", "Gemini Pro"],
    image: mmImg,
    imageSm: mmImgSm,
    imageMd: mmImgMd,
    demoLink: "https://mock-mate-ai-beta.vercel.app",
    githubLink: "https://github.com/The-Syntax-Slayer/MockMate-AI.git",
  },
  {
    id: "09",
    title: "WebLens",
    category: "Developer Tool",
    themeColor: "#06B6D4", // Cyan
    description: "A web analysis platform that provides insights into performance, accessibility, SEO, and overall website quality.",
    problem: "Non-technical developers struggle to interpret long, raw Lighthouse performance audits and SEO reports.",
    solution: "Created a performance auditor that digests Google PageSpeed API responses and displays actionable, visual advice.",
    metrics: [
      { value: "10x", label: "Audit Speed" },
      { value: "99+", label: "Target SEO" }
    ],
    techStack: ["React", "PageSpeed API", "Tailwind CSS v4", "Recharts"],
    image: wlImg,
    imageSm: wlImgSm,
    imageMd: wlImgMd,
    demoLink: "https://web-lens-seven.vercel.app",
    githubLink: "https://github.com/The-Syntax-Slayer/Web-Lens.git",
  },
  {
    id: "10",
    title: "Planora",
    category: "Social Media Planner",
    themeColor: "#F59E0B", // Amber
    description: "A social media planner designed to plan content pipelines, schedule posts, and manage content calendars across various platforms.",
    problem: "Creators waste hours manually scheduling and managing content pipelines across fragmented social platforms.",
    solution: "Designed a pipeline visualizer and scheduler backed by a real-time Supabase database and cron workflows.",
    metrics: [
      { value: "60%", label: "Time Saved" },
      { value: "2.4s", label: "Avg Load Time" }
    ],
    techStack: ["React", "Zustand", "Supabase", "Tailwind CSS", "Vercel"],
    image: planoraImg,
    imageSm: planoraImgSm,
    imageMd: planoraImgMd,
    demoLink: "https://planora-social.vercel.app",
    githubLink: "https://github.com/The-Syntax-Slayer/Planora.git",
  },
  {
    id: "11",
    title: "LegalEase",
    category: "Legal Tech SaaS",
    themeColor: "#2DD4BF", // Teal
    description: "An AI-powered legal contract analysis platform helping users simplify legal language, check compliance, and extract critical clauses.",
    problem: "Complex legal agreements are filled with dense legalese, making them hard to review quickly.",
    solution: "Built a contract summarizer using NLP transformers and spaCy models to extract clauses and highlight high-risk terms.",
    metrics: [
      { value: "80%", label: "Review Speedup" },
      { value: "95%", label: "Recall Rate" }
    ],
    techStack: ["React", "FastAPI", "Python", "spaCy", "Hugging Face"],
    image: legaleaseImg,
    imageSm: legaleaseImgSm,
    imageMd: legaleaseImgMd,
    demoLink: "https://legal-ease-tan.vercel.app/",
    githubLink: "https://github.com/The-Syntax-Slayer/Legal-Ease.git",
  },
  {
    id: "12",
    title: "ClientSync",
    category: "Client CRM SaaS",
    themeColor: "#8FFFD1", // Mint Green
    description: "A client relationship management platform focused on organizing customer data, project workflows, communication, and business operations.",
    problem: "Freelancers and small businesses lose client data and project history in scattered spreadsheets and email chains.",
    solution: "Built a unified CRM SaaS to manage project tasks, invoices, client records, and communications in one relational dashboard.",
    metrics: [
      { value: "45%", label: "Admin Overhead" },
      { value: "100%", label: "Data Security" }
    ],
    techStack: ["React", "Django", "PostgreSQL", "Tailwind CSS", "REST API"],
    image: clientsyncImg,
    imageSm: clientsyncImgSm,
    imageMd: clientsyncImgMd,
    demoLink: "https://client-sync-ddcrm.vercel.app",
    githubLink: "https://github.com/The-Syntax-Slayer",
  },
  {
    id: "13",
    title: "SmartMeet",
    category: "AI Meeting Assistant",
    themeColor: "#10B981", // Emerald
    description: "An AI-powered meeting summarizer and task planner designed to automatically extract key discussion points, generate summaries, and organize follow-up tasks.",
    problem: "Professionals waste hours transcribing meeting recordings and manually drafting summaries and task lists.",
    solution: "Built a meeting assistant using FastAPI and NLP to extract key decisions, summarize discussions, and format task items.",
    metrics: [
      { value: "75%", label: "Time Saved" },
      { value: "98%", label: "Precision Rate" }
    ],
    techStack: ["React", "FastAPI", "Python", "spaCy", "TypeScript"],
    image: smartmeetImg,
    imageSm: smartmeetImgSm,
    imageMd: smartmeetImgMd,
    demoLink: "https://smart-meet.vercel.app",
    githubLink: "https://github.com/The-Syntax-Slayer/Smart-Meet.git",
  }
];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex flex-col gap-8 lg:gap-16 lg:flex-row items-center py-12 lg:py-20 relative"
    >
      {/* Background radial glow matching project theme */}
      <div
        className="absolute w-[240px] h-[240px] md:w-[350px] md:h-[350px] rounded-full blur-[120px] -z-10 pointer-events-none opacity-10 transition-opacity duration-700 hover:opacity-20"
        style={{
          background: `radial-gradient(circle, ${project.themeColor} 0%, transparent 70%)`,
          left: isEven ? 'auto' : '15%',
          right: isEven ? '15%' : 'auto',
          top: '15%'
        }}
      />

      {/* Image Showcase Container */}
      <div className={`w-full lg:w-[58%] aspect-[16/10] rounded-2xl overflow-hidden relative border border-white/[0.06] bg-neutral-900/40 flex items-center justify-center group/img ${isEven ? "lg:order-1" : "lg:order-2"
        }`}>
        {/* Glow backdrop inside the image border */}
        <div
          className="absolute inset-0 opacity-5 mix-blend-screen transition-opacity duration-500 group-hover/img:opacity-15"
          style={{
            background: `radial-gradient(circle at center, ${project.themeColor} 0%, transparent 85%)`
          }}
        />

        {/* Landscape Image */}
        <motion.img
          src={project.image}
          srcSet={`${project.imageSm} 400w, ${project.imageMd} 800w, ${project.image} 1200w`}
          sizes="(max-width: 768px) 100vw, 600px"
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/img:scale-[1.03]"
        />
      </div>

      {/* Project Info Panel */}
      <div className={`w-full lg:w-[42%] flex flex-col justify-between ${isEven ? "lg:order-2 lg:pl-12" : "lg:order-1 lg:pr-12"
        }`}>
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-3 mb-4 select-none">
            <span className="font-Spline_Sans_Mono text-xs text-accent/35">
              {project.id}
            </span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.themeColor }} />
            <span className="font-Spline_Sans_Mono text-[10px] uppercase tracking-wider text-accent/50">
              {project.category}
            </span>
          </div>

          <h3 className="text-white font-Spline_Sans_Mono text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight uppercase mb-4">
            {project.title}
          </h3>

          <div className="flex flex-col gap-4 text-left mb-6">
            <p className="text-accent/80 font-light text-sm sm:text-base leading-relaxed">
              {project.description}
            </p>
            <div className="text-xs font-light leading-relaxed border-l-2 border-accent/20 pl-3 py-0.5">
              <span className="font-semibold text-white/70 block uppercase tracking-wider text-[9px] mb-1 font-Spline_Sans_Mono">The Problem</span>
              <span className="text-accent/60">{project.problem}</span>
            </div>
            <div className="text-xs font-light leading-relaxed border-l-2 border-mint/40 pl-3 py-0.5">
              <span className="font-semibold text-mint block uppercase tracking-wider text-[9px] mb-1 font-Spline_Sans_Mono">The Solution</span>
              <span className="text-accent/80">{project.solution}</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="flex gap-6 border-b border-white/[0.04] pb-5 mb-5">
            {project.metrics.map((metric, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-lg font-Spline_Sans_Mono text-mint font-bold leading-none">{metric.value}</span>
                <span className="text-[9px] uppercase tracking-wider text-accent/40 mt-1 font-light">{metric.label}</span>
              </div>
            ))}
          </div>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-[10px] font-Spline_Sans_Mono text-accent/70 border border-white/[0.06] rounded-full bg-white/[0.02]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Dynamic Action Bar */}
        <div className="flex flex-wrap gap-3 mt-auto">
          <a
            href={project.demoLink}
            target="_blank"
            rel="noreferrer"
            className="flex-1 min-w-[110px]"
          >
            <button className="w-full h-11 bg-white/[0.02] hover:bg-white/[0.06] transition-all duration-200 rounded-xl flex justify-center items-center gap-2 border border-white/[0.06] text-white hover:border-[#8FFFD1]/35 hover:text-[#8FFFD1] cursor-pointer text-xs font-light tracking-wide">
              <span>Live Demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </a>
          <a
            href={project.githubLink}
            target="_blank"
            rel="noreferrer"
            className="flex-1 min-w-[110px]"
          >
            <button className="w-full h-11 bg-white/[0.02] hover:bg-white/[0.06] transition-all duration-200 rounded-xl flex justify-center items-center gap-2 border border-white/[0.06] text-white hover:border-[#8FFFD1]/35 hover:text-[#8FFFD1] cursor-pointer text-xs font-light tracking-wide">
              <span>GitHub</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </button>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function HorizontalProjectCard({ project }: { project: typeof projects[0] }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="w-full h-full glass-panel p-8 rounded-3xl border border-white/[0.06] bg-[#070b13]/65 backdrop-blur-md flex flex-row items-center gap-10 relative overflow-hidden group hover:border-[#8FFFD1]/35 hover:shadow-[0_0_35px_rgba(143,255,209,0.06)] transition-all duration-500"
    >
      {/* Background radial glow matching project theme */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full blur-[100px] -z-10 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle, ${project.themeColor} 0%, transparent 70%)`,
          right: '-5%',
          top: '-5%'
        }}
      />

      {/* Image Showcase Container */}
      <div className="w-[52%] aspect-[16/10] rounded-xl overflow-hidden relative border border-white/[0.06] bg-neutral-900/40 flex items-center justify-center group/img shrink-0">
        <div
          className="absolute inset-0 opacity-5 mix-blend-screen transition-opacity duration-500 group-hover/img:opacity-15"
          style={{
            background: `radial-gradient(circle at center, ${project.themeColor} 0%, transparent 85%)`
          }}
        />
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/img:scale-[1.03]"
        />
      </div>

      {/* Project Info Panel */}
      <div className="w-[48%] flex flex-col justify-between h-full py-2 text-left">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-3 select-none">
            <span className="font-Spline_Sans_Mono text-xs text-accent/35">
              {project.id}
            </span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.themeColor }} />
            <span className="font-Spline_Sans_Mono text-[9px] uppercase tracking-wider text-accent/50">
              {project.category}
            </span>
          </div>

          <h3 className="text-white font-Spline_Sans_Mono text-xl sm:text-2xl font-bold tracking-tight uppercase mb-3 group-hover:text-mint transition-colors">
            {project.title}
          </h3>

          <div className="flex flex-col gap-3 text-left mb-4">
            <p className="text-accent/80 font-light text-xs sm:text-sm leading-relaxed line-clamp-2">
              {project.description}
            </p>
            <div className="text-[11px] font-light leading-relaxed border-l border-accent/20 pl-2">
              <span className="text-accent/60"><strong className="text-white/60 font-medium font-Spline_Sans_Mono uppercase tracking-wider text-[8px]">Problem:</strong> {project.problem}</span>
            </div>
            <div className="text-[11px] font-light leading-relaxed border-l border-mint/40 pl-2">
              <span className="text-accent/80"><strong className="text-mint font-medium font-Spline_Sans_Mono uppercase tracking-wider text-[8px]">Solution:</strong> {project.solution}</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="flex gap-5 border-b border-white/[0.04] pb-3 mb-3">
            {project.metrics.map((metric, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-base font-Spline_Sans_Mono text-mint font-bold leading-none">{metric.value}</span>
                <span className="text-[8px] uppercase tracking-wider text-accent/40 mt-0.5 font-light">{metric.label}</span>
              </div>
            ))}
          </div>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-0.5 text-[9px] font-Spline_Sans_Mono text-accent/70 border border-white/[0.06] rounded-full bg-white/[0.02]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto">
          <a
            href={project.demoLink}
            target="_blank"
            rel="noreferrer"
            className="flex-1"
          >
            <button className="w-full h-10 bg-white/[0.02] hover:bg-white/[0.06] transition-all duration-200 rounded-xl flex justify-center items-center gap-1.5 border border-white/[0.06] text-white hover:border-[#8FFFD1]/35 hover:text-[#8FFFD1] cursor-pointer text-xs font-light tracking-wide">
              <span>Demo</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </a>
          <a
            href={project.githubLink}
            target="_blank"
            rel="noreferrer"
            className="flex-1"
          >
            <button className="w-full h-10 bg-white/[0.02] hover:bg-white/[0.06] transition-all duration-200 rounded-xl flex justify-center items-center gap-1.5 border border-white/[0.06] text-white hover:border-[#8FFFD1]/35 hover:text-[#8FFFD1] cursor-pointer text-xs font-light tracking-wide">
              <span>GitHub</span>
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

function HorizontalProjects() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // 13 projects. Total translation is -91.5% of inner content width
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-91.5%"]);

  return (
    <section ref={targetRef} className="relative w-full h-[900vh] bg-transparent hidden lg:block">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* Subtle background tech guide line */}
        <div className="absolute top-[18%] left-[5%] right-[5%] h-[1px] bg-gradient-to-r from-mint/0 via-mint/10 to-mint/0 pointer-events-none" />
        
        <motion.div style={{ x }} className="flex gap-16 pl-[calc((100vw-min(100vw,1024px))/2+2rem)] pr-24">
          {projects.map((project) => (
            <div key={project.id} className="w-[80vw] max-w-[950px] shrink-0 flex items-center h-[68vh] min-h-[520px] relative">
              <HorizontalProjectCard project={project} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default function Work() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full mt-12 flex flex-col items-center gap-12 pb-48"
    >
      {/* 1. Page Header */}
      <div className="w-full max-w-5xl px-4 flex flex-col pt-8 md:pt-16 select-none text-left">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 0.35, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-Spline_Sans_Mono text-[11px] uppercase tracking-[0.3em] text-accent/80 mb-4 block"
        >
          // Case Studies
        </motion.span>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end border-b border-white/[0.06] pb-12">
          <div className="md:col-span-8">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-white font-Spline_Sans_Mono text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter uppercase leading-[0.9]"
            >
              WORK
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif-display font-light italic text-3xl sm:text-4xl md:text-5xl text-white/80 mt-6 leading-[1.15]"
            >
              Products built <br className="hidden sm:inline" />
              to solve <span className="not-italic font-medium text-[#8FFFD1]">real problems.</span>
            </motion.h2>
          </div>
          <div className="md:col-span-4 md:pl-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.5, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-accent text-sm sm:text-base font-light leading-relaxed"
            >
              A collection of products where design, technology, and user experience come together to form functional digital platforms.
            </motion.p>
          </div>
        </div>
      </div>

      {/* 2. Projects List - Mobile/Tablet */}
      <div className="lg:hidden w-full max-w-5xl px-4 flex flex-col gap-16 md:gap-24">
        {projects.map((project, index) => (
          <div key={project.id} className="border-b border-white/[0.04] pb-16 md:pb-24 last:border-b-0">
            <ProjectCard project={project} index={index} />
          </div>
        ))}
      </div>

      {/* 3. Projects Showcase - Desktop Horizontal Scroll */}
      <HorizontalProjects />
    </motion.div>
  );
}
