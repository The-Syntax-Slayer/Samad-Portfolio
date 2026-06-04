import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ExternalLink } from "lucide-react";
import primaxImg from "../assets/primax.webp";
import mmImg from "../assets/mm.webp";
import planoraImg from "../assets/planora_2.webp";
import wlImg from "../assets/wl.webp";
import legaleaseImg from "../assets/legalease.webp";
import clientsyncImg from "../assets/clientsync.webp";
import smartmeetImg from "../assets/smartmeet.webp";

const projects = [
  {
    id: "01",
    title: "PriMaX Hub",
    category: "AI Productivity SaaS",
    themeColor: "#3B82F6", // Cyber Blue
    description: "An AI-powered productivity ecosystem that integrates neuroscience growth frameworks to build habits, track performance, and help users crush their daily goals.",
    techStack: ["React", "TypeScript", "Node.js", "MongoDB", "Gemini API"],
    image: primaxImg,
    demoLink: "https://primax-sigma.vercel.app/",
    githubLink: "https://github.com/The-Syntax-Slayer/PriMaX-Hub.git",
  },
  {
    id: "02",
    title: "MockMate AI",
    category: "AI Product",
    themeColor: "#A78BFA", // Purple
    description: "An AI-powered interview preparation platform helping users practice interviews, improve communication skills, analyze resumes, and receive personalized feedback.",
    techStack: ["React", "TypeScript", "Node.js", "MongoDB", "Gemini Pro"],
    image: mmImg,
    demoLink: "https://mock-mate-ai-beta.vercel.app",
    githubLink: "https://github.com/The-Syntax-Slayer/MockMate-AI.git",
  },
  {
    id: "03",
    title: "Planora",
    category: "Social Media Planner",
    themeColor: "#F59E0B", // Amber
    description: "A social media planner designed to plan content pipelines, schedule posts, and manage content calendars across various platforms.",
    techStack: ["React", "Zustand", "Supabase", "Tailwind CSS", "Vercel"],
    image: planoraImg,
    demoLink: "https://planora-social.vercel.app",
    githubLink: "https://github.com/The-Syntax-Slayer/Planora.git",
  },
  {
    id: "04",
    title: "WebLens",
    category: "Developer Tool",
    themeColor: "#06B6D4", // Cyan
    description: "A web analysis platform that provides insights into performance, accessibility, SEO, and overall website quality.",
    techStack: ["React", "PageSpeed API", "Tailwind CSS v4", "Recharts"],
    image: wlImg,
    demoLink: "https://web-lens-seven.vercel.app",
    githubLink: "https://github.com/The-Syntax-Slayer/Web-Lens.git",
  },
  {
    id: "05",
    title: "LegalEase",
    category: "Legal Tech SaaS",
    themeColor: "#2DD4BF", // Teal
    description: "An AI-powered legal contract analysis platform helping users simplify legal language, check compliance, and extract critical clauses.",
    techStack: ["React", "FastAPI", "Python", "spaCy", "Hugging Face"],
    image: legaleaseImg,
    demoLink: "https://legal-ease-tan.vercel.app/",
    githubLink: "https://github.com/The-Syntax-Slayer/Legal-Ease.git",
  },
  {
    id: "06",
    title: "ClientSync",
    category: "Client CRM SaaS",
    themeColor: "#8FFFD1", // Mint Green
    description: "A client relationship management platform focused on organizing customer data, project workflows, communication, and business operations.",
    techStack: ["React", "Django", "PostgreSQL", "Tailwind CSS", "REST API"],
    image: clientsyncImg,
    demoLink: "https://client-sync-ddcrm.vercel.app",
    githubLink: "https://github.com/The-Syntax-Slayer",
  },
  {
    id: "07",
    title: "SmartMeet",
    category: "AI Meeting Assistant",
    themeColor: "#10B981", // Emerald
    description: "An AI-powered meeting summarizer and task planner designed to automatically extract key discussion points, generate summaries, and organize follow-up tasks.",
    techStack: ["React", "FastAPI", "Python", "spaCy", "TypeScript"],
    image: smartmeetImg,
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

          <p className="text-accent/80 font-light text-sm sm:text-base leading-relaxed mb-6">
            {project.description}
          </p>

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

          <p className="text-accent/80 font-light text-xs sm:text-sm leading-relaxed mb-4 line-clamp-4">
            {project.description}
          </p>

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

  // 7 projects. Total translation is -84% of inner content width
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-84%"]);

  return (
    <section ref={targetRef} className="relative w-full h-[500vh] bg-transparent hidden lg:block">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* Subtle background tech guide line */}
        <div className="absolute top-[18%] left-[5%] right-[5%] h-[1px] bg-gradient-to-r from-mint/0 via-mint/10 to-mint/0 pointer-events-none" />
        
        <motion.div style={{ x }} className="flex gap-16 pl-[calc((100vw-min(100vw,1024px))/2+2rem)] pr-24">
          {projects.map((project) => (
            <div key={project.id} className="w-[80vw] max-w-[950px] shrink-0 flex items-center h-[58vh] relative">
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
