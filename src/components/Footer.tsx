import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import cloudBg from "../assets/cloud.webp";

interface FooterProps {
  setActiveTab?: (tab: "home" | "about" | "work" | "connect") => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const [copied, setCopied] = useState(false);
  const email = "contact@samadshaikh.dev";

  // Mouse move state for atmospheric parallax (using MotionValues to prevent re-renders)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for smooth movement
  const springX = useSpring(mouseX, { stiffness: 100, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 25 });

  // Transforms for parallax layers to run on the GPU
  const cloudX = useTransform(springX, (x) => x * -12);
  const cloudY = useTransform(springY, (y) => y * -12);

  const leak1X = useTransform(springX, (x) => x * 20);
  const leak1Y = useTransform(springY, (y) => y * 20);

  const leak2X = useTransform(springX, (x) => x * -20);
  const leak2Y = useTransform(springY, (y) => y * -20);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set((clientX / window.innerWidth) * 2 - 1);
      mouseY.set((clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <footer className="w-screen min-h-[50vh] md:min-h-[90vh] bg-[#050505] relative flex flex-col items-center justify-between overflow-hidden px-4 md:px-8 pt-16 md:pt-24 pb-32 select-none border-t border-[#181F2F]/30 mt-16 md:mt-20">
      
      {/* 1. CINEMATIC BACKGROUND LAYER */}
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(143,255,209,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(143,255,209,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />
      
      {/* Atmospheric Soft Clouds */}
      <motion.div
        style={{
          x: cloudX,
          y: cloudY,
          willChange: "transform",
        }}
        className="absolute inset-0 z-0 pointer-events-none opacity-[11%] mix-blend-screen scale-105"
      >
        <img
          src={cloudBg}
          alt="Atmospheric Clouds"
          className="w-full h-full object-cover"
          draggable="false"
        />
      </motion.div>

      {/* Mint Glowing Nodes */}
      <motion.div
        style={{
          x: leak1X,
          y: leak1Y,
          willChange: "transform",
        }}
        className="absolute w-[500px] h-[500px] rounded-full bg-[#8FFFD1]/4 blur-[120px] pointer-events-none z-0 -left-[10%] top-[20%]"
      />
      <motion.div
        style={{
          x: leak2X,
          y: leak2Y,
          willChange: "transform",
        }}
        className="absolute w-[400px] h-[400px] rounded-full bg-[#8FFFD1]/3 blur-[100px] pointer-events-none z-0 -right-[5%] bottom-[10%]"
      />

      {/* Massive Background Typography: "BUILDER" */}
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans font-black tracking-[0.25em] text-[18vw] leading-none uppercase text-white/[0.02] select-none pointer-events-none z-0 select-none">
        BUILDER
      </div>

      {/* Technical Corner Brackets */}
      <div className="absolute inset-x-6 inset-y-6 pointer-events-none z-10 border border-white/[0.02]">
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#8FFFD1]/30" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#8FFFD1]/30" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#8FFFD1]/30" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#8FFFD1]/30" />
      </div>

      {/* 2. CORE FOOTER CONTENT CONTAINER */}
      <div className="w-full max-w-5xl z-10 flex flex-col justify-between flex-grow gap-12 md:gap-20">
        
        {/* TOP SECTION: Massive Headline & Orbital System */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          
          {/* Headline & Email CTA (Stretched Left) */}
          <div className="lg:col-span-8 flex flex-col items-start text-left gap-8">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8FFFD1] animate-pulse shadow-[0_0_6px_#8FFFD1]" />
              <span className="font-Spline_Sans_Mono text-[9px] tracking-[0.3em] text-[#8FFFD1] uppercase font-semibold">
                THE FINAL CHAPTER
              </span>
            </div>

            {/* Large Interactive Email CTA */}
            <div className="relative mt-0 flex flex-col items-start group">
              <a
                href={`mailto:${email}`}
                className="font-serif-display text-2xl sm:text-4xl text-white hover:text-[#8FFFD1] flex items-center gap-2 transition-colors duration-300 relative py-1"
              >
                <span>{email}</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  →
                </span>
                {/* Underline fill animation */}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#8FFFD1] to-transparent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </a>
              <button 
                onClick={handleCopyEmail}
                className="font-Spline_Sans_Mono text-[10px] text-accent/40 hover:text-[#8FFFD1]/80 mt-2 tracking-widest uppercase cursor-pointer transition-colors"
              >
                [ Copy Email Address ]
              </button>

              {/* Copied toast absolute position */}
              <AnimatePresence>
                {copied && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute -bottom-10 left-0 px-3 py-1 bg-[#111622] rounded border border-[#8FFFD1]/20 z-30"
                  >
                    <p className="text-[10px] font-Spline_Sans_Mono text-[#8FFFD1] tracking-wide">
                      ✓ Copied to clipboard
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Premium Orbital Blueprint (Right Side) */}
          <div className="lg:col-span-4 hidden lg:flex items-center justify-center relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="relative w-56 h-56 flex items-center justify-center"
            >
              {/* Outer tick circle */}
              <div className="absolute inset-0 rounded-full border border-white/[0.04] border-dashed scale-100" />
              {/* Middle navigation ring */}
              <div className="absolute inset-6 rounded-full border border-[#8FFFD1]/10 flex items-center justify-center">
                <div className="absolute inset-4 rounded-full border border-dashed border-[#8FFFD1]/5" />
              </div>
              {/* Fine technical radial lines */}
              <div className="absolute w-full h-[1px] bg-white/[0.02]" />
              <div className="absolute w-[1px] h-full bg-white/[0.02]" />
              <div className="absolute w-full h-[1px] bg-white/[0.02] rotate-45" />
              <div className="absolute w-full h-[1px] bg-white/[0.02] -rotate-45" />
            </motion.div>

            {/* Glowing Star in center */}
            <div className="absolute z-10 flex items-center justify-center">
              <span className="absolute w-3 h-3 rounded-full bg-[#8FFFD1]/20 animate-ping" />
              <span className="text-[#8FFFD1] text-xs font-bold shadow-[0_0_12px_#8FFFD1] block select-none">✦</span>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: Personal Brand, Availability Card, and Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 border-t border-white/[0.04] pt-10 md:pt-16">
          
          {/* Brand Info (Cols 4) */}
          <div className="md:col-span-4 flex flex-col items-start text-left gap-4">
            <div className="flex items-center gap-2">
              <span className="font-serif-display text-xl font-semibold tracking-wider text-white">[S]</span>
              <span className="font-Spline_Sans_Mono text-sm font-semibold tracking-widest text-white uppercase">Samad Shaikh</span>
            </div>
            <p className="font-Spline_Sans_Mono text-[10px] text-[#8FFFD1] uppercase tracking-widest">
              Software Engineer • Full-Stack Developer • AI Specialist
            </p>
            <p className="text-accent/50 text-xs font-light leading-relaxed max-w-[28ch] mt-1">
              Creating AI products, digital experiences, and startup ideas in Bandra, Mumbai.
            </p>
          </div>

          {/* Availability Card (Cols 3) */}
          <div className="md:col-span-3 hidden md:flex items-start justify-start md:justify-center">
            <div className="glass-panel p-5 rounded-2xl border border-[#181F2F] bg-[#0B0F19]/45 hover:border-[#8FFFD1]/35 hover:shadow-[0_0_15px_rgba(143,255,209,0.03)] transition-all duration-300 w-full max-w-[260px] text-left">
              <div className="flex items-center gap-2 text-[#8FFFD1] text-[9px] font-Spline_Sans_Mono font-bold uppercase tracking-wider mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8FFFD1] animate-ping shrink-0" />
                <span>Available for collaboration</span>
              </div>
              <p className="text-accent/60 text-[11px] font-light leading-relaxed">
                Open to freelance projects, AI products, startup ideas, and creative partnerships.
              </p>
            </div>
          </div>

          {/* Social Links (Cols 2) */}
          <div className="md:col-span-2 flex flex-col items-start text-left gap-4">
            <span className="font-Spline_Sans_Mono text-[9px] text-white/30 uppercase tracking-widest">
              SOCIAL CHANNELS
            </span>
            <div className="flex flex-row md:flex-col flex-wrap gap-4 md:gap-2.5">
              {[
                { name: "GitHub", url: "https://github.com/The-Syntax-Slayer" },
                { name: "LinkedIn", url: "https://linkedin.com/in/samad-ai" },
                { name: "Resume", url: "https://samadshaikh.me" },
                { name: "Wikidata", url: "https://www.wikidata.org/wiki/Q140129387" },
                { name: "Email", url: `mailto:${email}` },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center text-xs font-Spline_Sans_Mono text-accent/60 hover:text-[#8FFFD1] transition-colors relative duration-300 py-0.5"
                >
                  <span className="mr-0.5">{link.name}</span>
                  <span className="text-[10px] text-accent/30 group-hover:text-[#8FFFD1] transition-colors duration-300">↗</span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#8FFFD1]/60 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links (Cols 3) */}
          <div className="md:col-span-3 hidden md:flex flex-col items-start text-left gap-4 md:items-end md:text-right">
            <span className="font-Spline_Sans_Mono text-[9px] text-white/30 uppercase tracking-widest md:mr-1">
              NAVIGATION
            </span>
            <div className="flex flex-col gap-2.5 md:items-end">
              {[
                { label: "Home", tab: "home" as const },
                { label: "About", tab: "about" as const },
                { label: "Work", tab: "work" as const },
                { label: "Skills", tab: "about" as const },
                { label: "Contact", tab: "connect" as const },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setActiveTab?.(item.tab)}
                  className="group text-xs font-Spline_Sans_Mono text-accent/60 hover:text-[#8FFFD1] cursor-pointer transition-colors relative duration-300 py-0.5"
                >
                  <span>{item.label}</span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#8FFFD1]/60 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM BAR: Copyright, Coordinates, Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/[0.04] pt-8 text-[11px] font-Spline_Sans_Mono text-accent/40 select-none">
          {/* Left copyright */}
          <div className="flex items-center gap-1.5">
            <span>© 2026 Samad Shaikh.</span>
            <span className="text-white/10">|</span>
            <span className="text-[10px] text-accent/25">All rights reserved</span>
          </div>

          {/* Center Coordinates */}
          <div className="flex items-center gap-1.5 group cursor-pointer hover:text-[#8FFFD1] transition-colors duration-300">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8FFFD1]/40 group-hover:bg-[#8FFFD1] animate-pulse" />
            <span>Bandra, Mumbai, India (19.0596° N, 72.8295° E)</span>
          </div>

          {/* Right Back to Top */}
          <button
            onClick={handleBackToTop}
            className="flex items-center gap-1.5 group cursor-pointer text-accent/40 hover:text-[#8FFFD1] transition-all duration-300 uppercase tracking-widest text-[10px]"
          >
            <span>Back To Top</span>
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
          </button>
        </div>

      </div>

    </footer>
  );
}
