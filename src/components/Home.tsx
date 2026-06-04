import { useState, useEffect, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MapPin, Minus, Plus, Briefcase, ArrowRight, Layers, ArrowUpRight, Flame, FileText } from "lucide-react";
import planoraImg from "../assets/planora.webp";
import weblensImg from "../assets/weblens.webp";
import mockmateImg from "../assets/mockmate.webp";
import cloudBg from "../assets/cloud.webp";
import logoImg from "../assets/logo.svg";
import TerminalConsole from "./TerminalConsole";
import SpotlightCard from "./SpotlightCard";

interface HomeProps {
  setActiveTab?: (tab: "home" | "about" | "work" | "connect") => void;
}

export default function Home({ setActiveTab }: HomeProps) {
  const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

  const [isMobile, setIsMobile] = useState(false);
  // Live IST Clock
  const [timeString, setTimeString] = useState("");
  // Mouse coordinates for parallax/lighting (using MotionValues to prevent re-renders)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Typewriter effect for roles
  const roles = useMemo(() => ["Software Engineer", "Full-Stack Developer", "AI Specialist"], []);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    let timer: any;
    const activeRole = roles[currentRoleIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
        setTypingSpeed(40);
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText(activeRole.slice(0, currentText.length + 1));
        setTypingSpeed(100);
      }, typingSpeed);
    }

    if (!isDeleting && currentText === activeRole) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
      setTypingSpeed(200);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentRoleIndex, roles, typingSpeed]);

  // Springs for smooth movement
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  // Transforms for parallax layers to run on the GPU
  const cloudX = useTransform(springX, (x) => x * -20);
  const cloudY = useTransform(springY, (y) => y * -20);

  const leak1X = useTransform(springX, (x) => x * 30);
  const leak1Y = useTransform(springY, (y) => y * 30);

  const leak2X = useTransform(springX, (x) => x * -30);
  const leak2Y = useTransform(springY, (y) => y * -30);

  const orbitX = useTransform(springX, (x) => x * -10);
  const orbitY = useTransform(springY, (y) => y * -10);

  const rightCardX = useTransform(springX, (x) => x * -10);
  const rightCardY = useTransform(springY, (y) => y * -10);

  // Map Zoom State
  const [mapZoom, setMapZoom] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);


  // Stable GitHub contributions grid color map
  const githubGrid = useMemo(() => {
    return Array.from({ length: 27 }, () =>
      Array.from({ length: 7 }, () => {
        const rand = Math.random();
        if (rand > 0.90) return "bg-[#8FFFD1]";
        if (rand > 0.75) return "bg-[#5EE6B3]";
        if (rand > 0.55) return "bg-[#2ea67c]/60";
        if (rand > 0.35) return "bg-[#1f4a3c]/35";
        return "bg-[#161B22]";
      })
    );
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Calculate India Standard Time (UTC + 5:30)
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const ist = new Date(utc + 3600000 * 5.5);

      const hours = ist.getHours().toString().padStart(2, "0");
      const minutes = ist.getMinutes().toString().padStart(2, "0");
      const seconds = ist.getSeconds().toString().padStart(2, "0");
      setTimeString(`${hours} : ${minutes} : ${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full flex flex-col items-center"
    >
      {/* 1. Cinematic Hero Section (Above the fold - occupies exactly full viewport) */}
      <div className="w-screen min-h-screen flex flex-col justify-between items-center relative select-none overflow-hidden pt-6 pb-12 mt-[-40px]">

        {/* A. Atmospheric Background Layer */}
        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(143,255,209,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(143,255,209,0.035)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

        {/* Neon light nodes at grid intersections */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]">
          <span className="absolute w-[3px] h-[3px] rounded-full bg-[#8FFFD1] shadow-[0_0_8px_3px_rgba(143,255,209,0.5)] left-[25%] top-[30%] animate-pulse" />
          <span className="absolute w-[3px] h-[3px] rounded-full bg-[#8FFFD1] shadow-[0_0_8px_3px_rgba(143,255,209,0.5)] right-[30%] top-[45%] animate-pulse" style={{ animationDelay: '0.5s' }} />
          <span className="absolute w-[3px] h-[3px] rounded-full bg-[#8FFFD1] shadow-[0_0_8px_3px_rgba(143,255,209,0.5)] left-[20%] bottom-[35%] animate-pulse" style={{ animationDelay: '1.2s' }} />
          <span className="absolute w-[3px] h-[3px] rounded-full bg-[#8FFFD1] shadow-[0_0_8px_3px_rgba(143,255,209,0.5)] right-[20%] top-[25%] animate-pulse" style={{ animationDelay: '0.8s' }} />
        </div>

        {/* Technical Corner Lights & Bracket Graphic Elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Top-Left */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#8FFFD1]/[0.03] blur-[40px] rounded-br-full" />
          <div className="absolute top-6 left-6 w-3 h-3 border-t border-l border-[#8FFFD1]/30" />
          {/* Top-Right */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8FFFD1]/[0.03] blur-[40px] rounded-bl-full" />
          <div className="absolute top-6 right-6 w-3 h-3 border-t border-r border-[#8FFFD1]/30" />
          {/* Bottom-Left */}
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#8FFFD1]/[0.03] blur-[40px] rounded-tr-full" />
          <div className="absolute bottom-6 left-6 w-3 h-3 border-b border-l border-[#8FFFD1]/30" />
          {/* Bottom-Right */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#8FFFD1]/[0.03] blur-[40px] rounded-tl-full" />
          <div className="absolute bottom-6 right-6 w-3 h-3 border-b border-r border-[#8FFFD1]/30" />
        </div>

        {/* Cloud Backdrop Parallax */}
        <motion.div
          style={{
            x: cloudX,
            y: cloudY,
            willChange: "transform",
          }}
          className="absolute inset-0 z-0 pointer-events-none scale-105 opacity-[18%] mix-blend-screen"
        >
          <img
            src={cloudBg}
            alt="Atmospheric Clouds"
            className="w-full h-full object-cover"
            draggable="false"
          />
        </motion.div>

        {/* Volumetric Mint Green Light Leaks */}
        <motion.div
          style={{
            x: leak1X,
            y: leak1Y,
            willChange: "transform",
          }}
          className="absolute w-[500px] h-[500px] rounded-full bg-[#8FFFD1]/8 blur-[120px] pointer-events-none z-0 left-[10%] top-[20%]"
        />
        <motion.div
          style={{
            x: leak2X,
            y: leak2Y,
            willChange: "transform",
          }}
          className="absolute w-[400px] h-[400px] rounded-full bg-[#8FFFD1]/5 blur-[100px] pointer-events-none z-0 right-[15%] bottom-[15%]"
        />

        {/* Orbital Path / Blueprint graphics */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          style={{
            x: orbitX,
            y: orbitY,
            willChange: "transform",
          }}
          className="absolute w-[600px] h-[600px] rounded-full border border-[#8FFFD1]/12 border-dashed pointer-events-none z-0 flex items-center justify-center"
        >
          <div className="w-[450px] h-[450px] rounded-full border border-[#8FFFD1]/12 border-dashed" />
          <div className="w-[300px] h-[300px] rounded-full border border-[#8FFFD1]/12" />
          {/* Orbiting star node */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-2 h-2 rounded-full bg-[#8FFFD1]/40 shadow-[0_0_8px_#8FFFD1]"
            style={{ transform: "translateY(-150px)" }}
          />
        </motion.div>

        {/* Floating background particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              scale: Math.random() * 0.4 + 0.3,
              opacity: Math.random() * 0.3 + 0.1,
            }}
            animate={{
              y: ["0%", "-15%", "0%"],
              x: ["0%", "3%", "0%"],
            }}
            transition={{
              duration: 10 + Math.random() * 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-1 h-1 rounded-full bg-[#8FFFD1] pointer-events-none z-0"
          />
        ))}

        {/* B. Top Navigation Bar */}
        <div className="w-full max-w-6xl px-6 md:px-8 flex justify-between items-center z-10 pt-4">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Samad Shaikh - Best Software Developer & AI Specialist in Bandra, Mumbai" className="h-8 w-auto object-contain" />
            <span className="text-white text-xs font-Spline_Sans_Mono tracking-widest font-light uppercase">
              Samad Shaikh
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full border border-mint/30 bg-black/40 backdrop-blur-md shadow-[0_0_18px_rgba(143,255,209,0.2),inset_0_1px_1px_rgba(255,255,255,0.05)] select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse shadow-[0_0_10px_2px_#8FFFD1]" />
            <span className="text-[10px] font-Spline_Sans_Mono tracking-[0.2em] text-[#8FFFD1] uppercase font-semibold">
              India <span className="text-white/40 mx-1">✦</span> {timeString}
            </span>
          </div>

          {/* Connect CTA Button */}
          {!isMobile && (
            <button
              onClick={() => {
                // Trigger navigation tab update
                const el = document.querySelector('button[title="Connect"]');
                if (el instanceof HTMLElement) el.click();
              }}
              className="px-4 py-1.5 border border-white/10 hover:border-[#8FFFD1]/30 bg-black/20 hover:bg-[#8FFFD1]/5 rounded-full text-[10px] font-Spline_Sans_Mono tracking-widest text-white hover:text-[#8FFFD1] transition-all duration-300 cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(143,255,209,0.1)] hover:-translate-y-0.5"
            >
              Let's Connect ↗
            </button>
          )}
        </div>

        {/* C. Centered Luxury Typography */}
        <div className="flex flex-col justify-center items-center text-center select-none z-10 py-16 relative -translate-y-32 md:-translate-y-16">

          {/* Centered mobile-only clock */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 mb-4"
            >
              <span className="text-[11px] font-Spline_Sans_Mono tracking-[0.25em] text-white/90 uppercase font-light">
                INDIA <span className="text-[#8FFFD1] mx-1">✦</span> {timeString}
              </span>
            </motion.div>
          )}

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1.2, ease }}
            className="flex flex-col gap-1 items-center relative"
          >
            {/* Background ambient glow behind typography */}
            <div className="absolute w-[300px] h-[120px] bg-[#8FFFD1]/5 blur-[50px] rounded-full pointer-events-none -z-10" />

            <h1 className="font-serif-display font-medium text-[16vw] md:text-[9vw] leading-[0.85] tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white/95 to-white/45 filter drop-shadow-[0_0_30px_rgba(143,255,209,0.15)]">
              Samad
            </h1>
            <h1 className="font-serif-display font-medium text-[16vw] md:text-[9vw] leading-[0.85] tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white/95 to-white/45 filter drop-shadow-[0_0_30px_rgba(143,255,209,0.15)] mt-1">
              Shaikh
            </h1>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8, ease }}
            className="mt-5 md:mt-8 px-5 py-1.5 border border-mint/20 bg-mint/5 backdrop-blur-md rounded-full shadow-[0_0_20px_rgba(143,255,209,0.15),inset_0_1px_1px_rgba(255,255,255,0.05)] flex items-center justify-center w-[200px] sm:w-[240px] md:w-[260px] mx-auto select-none shrink-0"
          >
            <span className="text-[9px] md:text-[10px] font-Spline_Sans_Mono tracking-[0.15em] text-[#8FFFD1] uppercase font-semibold text-glow-mint whitespace-nowrap">
              {currentText}
              <span className="animate-pulse ml-0.5 font-bold">|</span>
            </span>
          </motion.div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.8 }}
            transition={{ delay: 1, duration: 0.8, ease }}
            className="text-accent/80 text-xs md:text-sm font-light mt-4 md:mt-6 font-serif-display italic tracking-wide max-w-[41ch] md:max-w-[45ch] px-4 md:px-0 leading-relaxed md:leading-normal text-center"
          >
            Integrating high-performance Full-Stack applications with advanced Generative AI. Based in Bandra, Mumbai.
          </motion.p>

          {/* Centered mobile-only scroll indicator in flow */}
          {isMobile && (
            <div className="flex flex-col items-center gap-2.5 mt-8 pointer-events-none select-none">
              <span className="text-[9px] font-Spline_Sans_Mono tracking-[0.25em] text-white/40 uppercase">
                Scroll to explore
              </span>
              <span className="w-1 h-1 bg-[#8FFFD1] rounded-full shadow-[0_0_6px_#8FFFD1]" />
              <div className="w-5 h-8 border border-[#8FFFD1]/25 bg-black/10 rounded-full flex justify-center p-1 mt-1">
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-1 h-1.5 bg-[#8FFFD1] rounded-full shadow-[0_0_4px_#8FFFD1]"
                />
              </div>
            </div>
          )}
        </div>

        {/* D. Floating HUD Panels & Controls */}
        {/* Left Social Rail */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8, ease }}
          className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 z-10 hidden md:flex flex-col items-center gap-6"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent to-white/10" />
          <div className="flex flex-col gap-4">
            <a
              href="https://github.com/The-Syntax-Slayer"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-xl border border-white/5 bg-black/40 hover:bg-[#8FFFD1]/5 hover:border-[#8FFFD1]/30 flex items-center justify-center text-accent/60 hover:text-[#8FFFD1] transition-all duration-300 shadow-md group relative cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
              </svg>
              <div className="absolute -left-1 w-1.5 h-1.5 rounded-full bg-[#8FFFD1] scale-0 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_6px_#8FFFD1]" />
            </a>

            <a
              href="https://www.linkedin.com/in/samad-ai"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-xl border border-white/5 bg-black/40 hover:bg-[#8FFFD1]/5 hover:border-[#8FFFD1]/30 flex items-center justify-center text-accent/60 hover:text-[#8FFFD1] transition-all duration-300 shadow-md group relative cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <div className="absolute -left-1 w-1.5 h-1.5 rounded-full bg-[#8FFFD1] scale-0 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_6px_#8FFFD1]" />
            </a>

            <a
              href="mailto:sxmxd.1825@gmail.com"
              className="w-9 h-9 rounded-xl border border-white/5 bg-black/40 hover:bg-[#8FFFD1]/5 hover:border-[#8FFFD1]/30 flex items-center justify-center text-accent/60 hover:text-[#8FFFD1] transition-all duration-300 shadow-md group relative cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <div className="absolute -left-1 w-1.5 h-1.5 rounded-full bg-[#8FFFD1] scale-0 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_6px_#8FFFD1]" />
            </a>

            {/* Resume / CV Link — Replace with your real Google Drive / Dropbox / online PDF link */}
            <a
              href="https://samadshaikh.me"
              target="_blank"
              rel="noreferrer"
              title="Download Resume"
              className="w-9 h-9 rounded-xl border border-white/5 bg-black/40 hover:bg-[#8FFFD1]/5 hover:border-[#8FFFD1]/30 flex items-center justify-center text-accent/60 hover:text-[#8FFFD1] transition-all duration-300 shadow-md group relative cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M10 9H8" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
              </svg>
              <div className="absolute -left-1 w-1.5 h-1.5 rounded-full bg-[#8FFFD1] scale-0 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_6px_#8FFFD1]" />
            </a>
          </div>
          <div className="w-[1px] h-16 bg-gradient-to-t from-transparent to-white/10" />
        </motion.div>

        {/* Bottom Left Globe */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8, ease }}
          className="absolute left-6 md:left-8 bottom-12 z-10 hidden lg:flex items-center gap-4 text-left pointer-events-none"
        >
          <div className="w-10 h-10 border border-white/10 bg-black/20 rounded-full flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
            <svg className="w-7 h-7 text-[#8FFFD1]/20 animate-spin" style={{ animationDuration: '25s' }} viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />
              <ellipse cx="50" cy="50" rx="45" ry="12" stroke="currentColor" strokeWidth="0.5" />
              <ellipse cx="50" cy="50" rx="12" ry="45" stroke="currentColor" strokeWidth="0.5" />
              <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.5" />
              <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" />
            </svg>
            <span className="absolute w-1.5 h-1.5 rounded-full bg-[#8FFFD1] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_6px_#8FFFD1] animate-pulse" />
          </div>
          <div className="font-Spline_Sans_Mono text-[9px] md:text-[10px] tracking-wider leading-relaxed">
            <span className="text-white block font-medium uppercase">MUMBAI, IN</span>
            <span className="text-[#8FFFD1] font-light">19.0569° N, 72.8442° E</span>
          </div>
        </motion.div>

        {/* Right Focus Card */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8, ease }}
          className="absolute right-6 md:right-8 top-1/3 -translate-y-1/2 z-10 w-64 hidden xl:block text-left"
        >
          <motion.div
            style={{
              x: rightCardX,
              y: rightCardY,
              willChange: "transform",
            }}
            className="glass-panel p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-mint/15 hover:border-mint/35 transition-all duration-500 hover:shadow-[0_0_25px_rgba(143,255,209,0.08)]"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse shadow-[0_0_8px_2px_rgba(143,255,209,0.5)]" />
              <span className="font-Spline_Sans_Mono text-[9px] tracking-[0.2em] text-mint uppercase font-semibold text-glow-mint">
                Current Focus
              </span>
            </div>
            <p className="text-white text-xs leading-relaxed font-light mb-1">
              Building SaaS Platforms
            </p>
            <p className="text-accent/65 text-[11px] leading-relaxed font-light">
              Developing state-of-the-art AI applications, clean design systems, and responsive full-stack solutions.
            </p>
          </motion.div>
        </motion.div>

        {/* Right "Building in Public" label */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8, ease }}
          className="absolute right-6 md:right-8 top-2/3 -translate-y-1/2 z-10 hidden lg:block"
        >
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg border border-[#181F2F] bg-black/40 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8FFFD1] animate-pulse shadow-[0_0_6px_#8FFFD1]" />
            <span className="font-Spline_Sans_Mono text-[9px] tracking-widest text-accent/60 uppercase font-light">
              Building In Public &lt;/&gt;
            </span>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8, ease }}
          className="absolute right-6 md:right-8 bottom-12 z-10 hidden lg:flex items-center gap-4 text-right pointer-events-none"
        >
          <div className="font-Spline_Sans_Mono text-[9px] md:text-[10px] tracking-wider leading-relaxed">
            <span className="text-white block font-medium uppercase">EXPLORE</span>
            <span className="text-[#8FFFD1] font-light">SCROLL TO DISCOVER</span>
          </div>
          <div className="w-10 h-10 border border-white/10 bg-black/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="w-5 h-8 border border-[#8FFFD1]/25 bg-black/10 rounded-full flex justify-center p-1">
              <motion.div
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-1 h-1.5 bg-[#8FFFD1] rounded-full shadow-[0_0_4px_#8FFFD1]"
              />
            </div>
          </div>
        </motion.div>

        {/* Mobile-only Resume floating button (absolute within Hero Section, scrolls with the page) */}
        <a
          href="https://samadshaikh.me"
          target="_blank"
          rel="noreferrer"
          title="View Resume"
          className="absolute bottom-12 left-6 z-45 w-9 h-9 rounded-xl border border-white/10 bg-black/40 hover:bg-white/5 hover:border-white/20 flex items-center justify-center text-accent/60 hover:text-mint hover:-translate-y-0.5 transition-all duration-300 shadow-md cursor-pointer md:hidden shrink-0"
        >
          <FileText className="w-4 h-4" />
        </a>

      </div>

      {/* 2. Bento Grid Section (Below the fold - only visible when scrolled down) */}
      <motion.div
        id="bento-grid-section"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease }}
        className="w-full max-w-5xl px-4 pb-24 grid grid-cols-1 md:grid-cols-3 gap-3 text-left z-10"
      >
        {/* Column 1: Map & Socials */}
        <div className="flex flex-col gap-3">
          {/* Map Card — Blueprint Style */}
          <SpotlightCard
            className="h-[302px]"
            glowColor="rgba(var(--theme-mint-rgb), 0.04)"
            hoverBorderColor="rgba(var(--theme-mint-rgb), 0.45)"
          >
            {/* Real OpenStreetMap — Blueprint Filter (strictly blue and mint green) */}
            <iframe
              src="https://maps.google.com/maps?q=19.056892,72.844176&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="absolute inset-0 w-full h-full z-0 border-none transition-opacity duration-500 opacity-80 group-hover:opacity-100"
              style={{
                filter: "invert(0.9) hue-rotate(180deg) saturate(2) brightness(0.9) contrast(1.2)",
                pointerEvents: mapZoom ? "auto" : "none",
                backgroundColor: "#071019",
              }}
              loading="lazy"
              title="Mumbai Blueprint Map"
              data-darkreader-ignore="true"
            />

            {/* Blueprint SVG overlays: grid, crosshairs, corner brackets */}
            <svg
              className="absolute inset-0 w-full h-full z-10 pointer-events-none"
              viewBox="0 0 320 302"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              {/* Blueprint grid lines */}
              {[40, 80, 120, 160, 200, 240, 280].map((x) => (
                <line key={`vg-${x}`} x1={x} y1="0" x2={x} y2="302" stroke="#3BE8B0" strokeWidth="0.3" strokeOpacity="0.12" />
              ))}
              {[40, 80, 120, 160, 200, 240].map((y) => (
                <line key={`hg-${y}`} x1="0" y1={y} x2="320" y2={y} stroke="#3BE8B0" strokeWidth="0.3" strokeOpacity="0.12" />
              ))}

              {/* Center crosshair */}
              <line x1="160" y1="121" x2="160" y2="161" stroke="var(--theme-mint)" strokeWidth="0.8" strokeOpacity="0.6" />
              <line x1="140" y1="141" x2="180" y2="141" stroke="var(--theme-mint)" strokeWidth="0.8" strokeOpacity="0.6" />
              <circle cx="160" cy="141" r="14" stroke="var(--theme-mint)" strokeWidth="0.7" strokeOpacity="0.35" strokeDasharray="3 2" />
              <circle cx="160" cy="141" r="24" stroke="var(--theme-mint)" strokeWidth="0.4" strokeOpacity="0.18" strokeDasharray="2 3" />

              {/* Corner brackets — TL */}
              <path d="M 10 22 L 10 10 L 22 10" stroke="var(--theme-mint)" strokeWidth="1.2" strokeOpacity="0.55" />
              {/* Corner brackets — TR */}
              <path d="M 298 10 L 310 10 L 310 22" stroke="var(--theme-mint)" strokeWidth="1.2" strokeOpacity="0.55" />
              {/* Corner brackets — BL */}
              <path d="M 10 280 L 10 292 L 22 292" stroke="var(--theme-mint)" strokeWidth="1.2" strokeOpacity="0.55" />
              {/* Corner brackets — BR */}
              <path d="M 298 292 L 310 292 L 310 280" stroke="var(--theme-mint)" strokeWidth="1.2" strokeOpacity="0.55" />

              {/* Coordinate tick labels */}
              <text x="10" y="8" fill="var(--theme-mint)" fontSize="4.5" opacity="0.4" fontFamily="monospace">72.78°E</text>
              <text x="270" y="8" fill="var(--theme-mint)" fontSize="4.5" opacity="0.4" fontFamily="monospace">72.98°E</text>
              <text x="2" y="148" fill="var(--theme-mint)" fontSize="4.5" opacity="0.4" fontFamily="monospace" writingMode="tb">19.08°N</text>
            </svg>

            {/* Scan-line texture */}
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,20,40,0.18) 2px, rgba(0,20,40,0.18) 4px)",
              }}
            />

            {/* Top vignette */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#071019]/70 to-transparent z-20 pointer-events-none" />
            {/* Bottom gradient for label */}
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#071019] via-[#071019]/80 to-transparent z-20 pointer-events-none" />

            {/* Header Pill */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-[#071019]/90 backdrop-blur-sm border border-mint/20 rounded-full text-[11px] font-Spline_Sans_Mono flex items-center gap-1.5 w-fit z-30">
              <MapPin className="w-3.5 h-3.5 text-mint" />
              <span className="text-mint/80 tracking-wider uppercase text-[9px]">Location</span>
            </div>

            {/* Pulsing dot — always centered */}
            <div className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none" style={{ zIndex: 25 }}>
              <div className="relative">
                <span className="absolute -inset-4 rounded-full bg-mint/10 animate-ping" style={{ animationDuration: "2s" }} />
                <span className="absolute -inset-1.5 rounded-full bg-mint/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-mint shadow-[0_0_14px_4px_rgba(var(--theme-mint-rgb),0.7)] block" />
              </div>
            </div>

            {/* Location label */}
            <div className="absolute bottom-4 left-5 z-30 select-none">
              <h3 className="text-[15px] font-semibold text-white tracking-wide">Mumbai</h3>
              <p className="text-[10px] text-mint/60 font-light mt-0.5 font-Spline_Sans_Mono tracking-widest uppercase">19.0569° N · 72.8442° E</p>
            </div>

            {/* Zoom toggle */}
            <button
              onClick={() => setMapZoom(!mapZoom)}
              title={mapZoom ? "Lock map" : "Interact with map"}
              className="absolute bottom-4 right-5 w-7 h-7 rounded-full bg-[#0D1E30]/90 border border-mint/25 flex items-center justify-center text-mint/70 hover:text-mint cursor-pointer select-none z-30 hover:border-mint/60 hover:shadow-[0_0_8px_rgba(var(--theme-mint-rgb),0.3)] transition-all duration-200"
            >
              {mapZoom ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            </button>
          </SpotlightCard>

          {/* Socials Card */}
          <div className="grid grid-cols-3 gap-3">
            <a
              href="https://github.com/The-Syntax-Slayer"
              target="_blank"
              rel="noreferrer"
              className="h-[90px] block rounded-2xl"
            >
              <SpotlightCard
                className="h-full !rounded-2xl group hover:shadow-[0_0_12px_rgba(var(--theme-mint-rgb),0.04)]"
                contentClassName="flex items-center justify-center w-full h-full"
              >
                <svg className="w-5 h-5 text-white/90 group-hover:text-mint transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                </svg>
              </SpotlightCard>
            </a>
            <a
              href="https://linkedin.com/in/samad-ai"
              target="_blank"
              rel="noreferrer"
              className="h-[90px] block rounded-2xl"
            >
              <SpotlightCard
                className="h-full !rounded-2xl group hover:shadow-[0_0_12px_rgba(var(--theme-mint-rgb),0.04)]"
                contentClassName="flex items-center justify-center w-full h-full"
              >
                <svg className="w-5 h-5 text-white/90 group-hover:text-mint transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </SpotlightCard>
            </a>
            <a
              href="mailto:sxmxd.1825@gmail.com"
              className="h-[90px] block rounded-2xl"
            >
              <SpotlightCard
                className="h-full !rounded-2xl group hover:shadow-[0_0_12px_rgba(var(--theme-mint-rgb),0.04)]"
                contentClassName="flex items-center justify-center w-full h-full"
              >
                <svg className="w-5 h-5 text-white/90 group-hover:text-mint transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </SpotlightCard>
            </a>
          </div>
        </div>

        {/* Column 2: Projects & Apps */}
        <div className="flex flex-col gap-3">
          {/* MockMate AI Card */}
          <SpotlightCard
            onClick={() => setActiveTab?.("work")}
            className="h-[200px] cursor-pointer"
            contentClassName="p-6 flex justify-between w-full h-full"
            glowColor="rgba(var(--theme-mint-rgb), 0.05)"
            hoverBorderColor="rgba(var(--theme-mint-rgb), 0.35)"
          >
            <div className="flex flex-col justify-between z-10 w-1/2 text-left">
              <div className="px-3 py-1 bg-mint/5 border border-mint/20 rounded-full text-[11px] font-Spline_Sans_Mono text-mint text-glow-mint flex items-center gap-1.5 w-fit">
                <Briefcase className="w-3.5 h-3.5 text-mint animate-pulse" />
                <span className="text-[#8FFFD1] font-semibold uppercase tracking-wider text-[9px]">AI Product</span>
              </div>
              <div className="mb-2">
                <h3 className="text-base font-medium text-white">MockMate AI</h3>
                <p className="text-[11px] text-accent/60 font-light mt-1 leading-relaxed">
                  AI-powered interview practice platform with feedback.
                </p>
              </div>
            </div>

            {/* Glowing target rings visual */}
            <div className="w-1/2 h-[200px] absolute -bottom-6 -right-4 flex justify-end items-end z-0">
              <div className="w-24 h-24 rounded-full border border-[#8FFFD1]/20 bg-[#8FFFD1]/5 flex items-center justify-center animate-pulse mr-4 mb-4">
                <div className="w-16 h-16 rounded-full border border-[#8FFFD1]/30 bg-[#8FFFD1]/10 flex items-center justify-center">
                  <span className="text-[#8FFFD1] font-Spline_Sans_Mono text-[10px] font-bold">AI</span>
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* ClientSync Card */}
          <SpotlightCard
            onClick={() => setActiveTab?.("work")}
            className="h-[90px] !rounded-2xl cursor-pointer"
            contentClassName="p-4 flex items-center justify-between w-full h-full"
            glowColor="rgba(var(--theme-mint-rgb), 0.05)"
            hoverBorderColor="rgba(var(--theme-mint-rgb), 0.35)"
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-[#8FFFD1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              <div className="text-left">
                <span className="text-[9px] text-accent/40 font-Spline_Sans_Mono block uppercase tracking-wider">Active Workspace</span>
                <span className="text-xs font-semibold text-white group-hover:text-[#8FFFD1] transition-colors">ClientSync portal</span>
              </div>
            </div>
            {/* Sync loop graphic */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8FFFD1]/20 to-[#5EE6B3]/40 p-1 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:rotate-12">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
          </SpotlightCard>

          {/* Discover Projects Card */}
          <SpotlightCard
            onClick={() => setActiveTab?.("work")}
            className="h-[90px] !rounded-2xl cursor-pointer"
            contentClassName="p-4 flex items-center justify-between w-full h-full"
            glowColor="rgba(var(--theme-mint-rgb), 0.05)"
            hoverBorderColor="rgba(var(--theme-mint-rgb), 0.35)"
          >
            <span className="text-xs font-medium text-white group-hover:text-[#8FFFD1] transition-colors font-Spline_Sans_Mono">Discover more projects</span>
            <ArrowRight className="w-4 h-4 text-accent/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </SpotlightCard>
        </div>

        {/* Column 3: Spotify & Typing Speed */}
        <div className="flex flex-col gap-3">
          {/* Apple Music Card */}
          <a
            href="https://music.apple.com"
            target="_blank"
            rel="noreferrer"
            className="h-[90px] block rounded-3xl"
          >
            <SpotlightCard
              className="h-full group hover:shadow-[0_0_12px_rgba(252,60,68,0.06)] hover:!border-[#FC3C44]/45"
              contentClassName="p-4 flex items-center justify-between w-full h-full"
              glowColor="rgba(252, 60, 68, 0.08)"
              hoverBorderColor="rgba(252, 60, 68, 0.45)"
            >
              <div className="flex items-center gap-3">
                {/* Disc Cover Art */}
                <div className="w-12 h-12 rounded-full bg-[#1b1c22] border border-[#2a2c35] relative overflow-hidden flex items-center justify-center shadow-inner group-hover:rotate-45 transition-transform duration-500">
                  {/* Album center design art */}
                  <div className="w-5 h-5 rounded-full bg-[#3d3a34] border border-white/5 flex items-center justify-center relative">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#000]" />
                  </div>
                  <div className="absolute inset-0 border border-dashed border-[#505465]/40 rounded-full scale-90" />
                </div>

                <div className="text-left">
                  <span className="text-[9px] text-[#FC3C44] font-Spline_Sans_Mono uppercase tracking-wider block font-medium">On Apple Music</span>
                  <span className="text-xs font-medium text-white block mt-0.5 group-hover:text-[#FC3C44] transition-colors">Gratitude</span>
                  <span className="text-[10px] text-accent/50 font-light block">Brandon Lake</span>
                </div>
              </div>

              {/* Apple Music Brand Logo */}
              <svg className="w-5 h-5 text-[#FC3C44] opacity-80 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.365 3.32a1.86 1.86 0 00-1.777-.384l-11.2 2.8A1.866 1.866 0 007 7.552v8.528A3.498 3.498 0 005.5 16C3.57 16 2 17.57 2 19.5S3.57 23 5.5 23s3.5-1.57 3.5-3.5v-8.15l10.5-2.625v4.35A3.498 3.498 0 0018 13c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5V4.654a1.86 1.86 0 00-.635-1.334z" />
              </svg>
            </SpotlightCard>
          </a>

          {/* Coding Streak Card */}
          <SpotlightCard
            className="h-[302px]"
            contentClassName="p-6 flex flex-col justify-between w-full h-full"
            glowColor="rgba(var(--theme-mint-rgb), 0.05)"
            hoverBorderColor="rgba(var(--theme-mint-rgb), 0.35)"
          >
            <div className="px-3 py-1 bg-mint/5 border border-mint/20 rounded-full text-[11px] font-Spline_Sans_Mono text-mint text-glow-mint flex items-center gap-1.5 w-fit">
              <Flame className="w-3.5 h-3.5 text-mint animate-pulse" />
              <span className="text-[#8FFFD1] font-semibold uppercase tracking-wider text-[9px]">Coding streak</span>
            </div>

            <div className="relative my-auto flex flex-col justify-center select-none">
              <div className="absolute text-[8.5rem] font-bold text-[#1E2533]/25 font-Spline_Sans_Mono leading-none -left-2 z-0 group-hover:scale-105 transition-transform duration-500">
                128
              </div>
              <div className="z-10 flex items-baseline gap-1.5">
                <span className="text-6xl font-bold font-Spline_Sans_Mono text-white">128</span>
                <span className="text-xs font-light text-accent/60 uppercase tracking-widest font-Spline_Sans_Mono">days</span>
              </div>
            </div>

            <div className="flex gap-4 border-t border-mint/10 pt-4 text-[10px] font-Spline_Sans_Mono text-[#8FFFD1]/60 z-10">
              <span className="flex items-center gap-1"><span className="text-[#8FFFD1]">🔥</span> Current</span>
              <span className="flex items-center gap-1"><span className="text-white">⚡</span> 156d Max</span>
              <span className="flex items-center gap-1"><span className="text-white">💻</span> Daily Push</span>
            </div>
          </SpotlightCard>
        </div>

        {/* Row 2: Github Activity (spans 2) & Tech Stack (spans 1) */}
        {/* Github Activity */}
        <a
          href="https://github.com/The-Syntax-Slayer"
          target="_blank"
          rel="noreferrer"
          className="md:col-span-2 h-[270px] block rounded-3xl"
        >
          <SpotlightCard
            className="h-full cursor-pointer"
            contentClassName="p-6 flex flex-col justify-between w-full h-full"
            glowColor="rgba(var(--theme-mint-rgb), 0.05)"
            hoverBorderColor="rgba(var(--theme-mint-rgb), 0.35)"
          >
            <div className="flex items-center justify-between">
              <div className="px-3 py-1 bg-mint/5 border border-mint/20 rounded-full text-[11px] font-Spline_Sans_Mono text-mint text-glow-mint flex items-center gap-1.5 w-fit">
                <svg className="w-3.5 h-3.5 text-mint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <span className="text-[#8FFFD1] font-semibold uppercase tracking-wider text-[9px]">Github activity</span>
              </div>
              <span className="text-[10px] text-accent/45 font-Spline_Sans_Mono">859 contributions in the last year</span>
            </div>

            <div className="overflow-x-auto scrollbar-hide py-2 my-auto">
              <div className="grid grid-flow-col auto-cols-max gap-1">
                {githubGrid.map((column, colIndex) => (
                  <div key={colIndex} className="grid grid-rows-7 gap-1">
                    {column.map((colorClass, rowIndex) => (
                      <div
                        key={rowIndex}
                        className={`w-2.5 h-2.5 rounded-[2px] ${colorClass} transition-transform duration-300 hover:scale-125`}
                      />
                    ))}
                  </div>
                ))}
              </div>
              {/* Scroll indicator block */}
              <div className="w-full h-1 bg-[#161B22] rounded-full mt-3 relative overflow-hidden">
                <div className="w-1/3 h-full bg-[#30363D] rounded-full absolute left-1/4" />
              </div>
            </div>

            <p className="text-[10px] font-Spline_Sans_Mono text-accent/40">
              Last pushed on Friday, May 29th 2026
            </p>
          </SpotlightCard>
        </a>

        {/* Tech Stack */}
        <SpotlightCard
          className="md:col-span-1 h-[270px]"
          contentClassName="p-5 flex flex-col justify-between w-full h-full"
          glowColor="rgba(var(--theme-mint-rgb), 0.05)"
          hoverBorderColor="rgba(var(--theme-mint-rgb), 0.35)"
        >
          <div className="px-3 py-1 bg-mint/5 border border-mint/20 rounded-full text-[11px] font-Spline_Sans_Mono text-mint text-glow-mint flex items-center gap-1.5 w-fit">
            <Layers className="w-3.5 h-3.5 text-mint" />
            <span className="text-[#8FFFD1] font-semibold uppercase tracking-wider text-[9px]">Tech stack</span>
          </div>

          <div className="grid grid-cols-3 gap-3 my-auto items-center justify-items-center opacity-85 group-hover:opacity-100 transition-opacity duration-300">
            {/* React */}
            <div className="flex flex-col items-center justify-center p-1.5 rounded-xl border border-white/[0.04] bg-black/40 hover:border-[#8FFFD1]/35 hover:bg-mint/5 transition-all duration-300 w-[64px] h-[58px] group/tech cursor-pointer">
              <svg className="w-5 h-5 text-white/70 group-hover/tech:text-[#8FFFD1] transition-colors duration-300 animate-spin" style={{ animationDuration: '10s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <ellipse rx="10" ry="4" cx="12" cy="12" transform="rotate(0 12 12)" />
                <ellipse rx="10" ry="4" cx="12" cy="12" transform="rotate(60 12 12)" />
                <ellipse rx="10" ry="4" cx="12" cy="12" transform="rotate(120 12 12)" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              </svg>
              <span className="text-[7.5px] font-Spline_Sans_Mono text-accent/50 group-hover/tech:text-[#8FFFD1] mt-1 select-none transition-colors">REACT</span>
            </div>

            {/* TypeScript */}
            <div className="flex flex-col items-center justify-center p-1.5 rounded-xl border border-white/[0.04] bg-black/40 hover:border-[#8FFFD1]/35 hover:bg-mint/5 transition-all duration-300 w-[64px] h-[58px] group/tech cursor-pointer">
              <div className="w-5 h-5 rounded border border-[#007acc]/30 text-[#007acc] flex items-center justify-center font-bold text-[9px] select-none group-hover/tech:bg-[#007acc] group-hover/tech:text-white group-hover/tech:border-transparent transition-all duration-300">
                TS
              </div>
              <span className="text-[7.5px] font-Spline_Sans_Mono text-accent/50 group-hover/tech:text-[#8FFFD1] mt-1 select-none transition-colors">TYPESCRIPT</span>
            </div>

            {/* Next.js */}
            <div className="flex flex-col items-center justify-center p-1.5 rounded-xl border border-white/[0.04] bg-black/40 hover:border-[#8FFFD1]/35 hover:bg-mint/5 transition-all duration-300 w-[64px] h-[58px] group/tech cursor-pointer">
              <svg className="w-5 h-5 text-white/70 group-hover/tech:text-[#8FFFD1] transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" />
                <path d="M9 15V9l5.5 6V9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[7.5px] font-Spline_Sans_Mono text-accent/50 group-hover/tech:text-[#8FFFD1] mt-1 select-none transition-colors">NEXT.JS</span>
            </div>

            {/* Node.js */}
            <div className="flex flex-col items-center justify-center p-1.5 rounded-xl border border-white/[0.04] bg-black/40 hover:border-[#8FFFD1]/35 hover:bg-mint/5 transition-all duration-300 w-[64px] h-[58px] group/tech cursor-pointer">
              <svg className="w-5 h-5 text-white/70 group-hover/tech:text-[#8FFFD1] transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3L4 7.5v9L12 21l8-4.5v-9L12 3z" />
                <path d="M12 12V3" />
                <path d="M12 12l8-4.5" />
                <path d="M12 12l-8 4.5" />
              </svg>
              <span className="text-[7.5px] font-Spline_Sans_Mono text-accent/50 group-hover/tech:text-[#8FFFD1] mt-1 select-none transition-colors">NODE</span>
            </div>

            {/* Python */}
            <div className="flex flex-col items-center justify-center p-1.5 rounded-xl border border-white/[0.04] bg-black/40 hover:border-[#8FFFD1]/35 hover:bg-mint/5 transition-all duration-300 w-[64px] h-[58px] group/tech cursor-pointer">
              <div className="w-5 h-5 rounded border border-[#ffd43b]/30 text-[#ffd43b] flex items-center justify-center font-bold text-[9px] select-none group-hover/tech:bg-[#ffd43b] group-hover/tech:text-[#306998] group-hover/tech:border-transparent transition-all duration-300">
                PY
              </div>
              <span className="text-[7.5px] font-Spline_Sans_Mono text-accent/50 group-hover/tech:text-[#8FFFD1] mt-1 select-none transition-colors">PYTHON</span>
            </div>

            {/* Tailwind */}
            <div className="flex flex-col items-center justify-center p-1.5 rounded-xl border border-white/[0.04] bg-black/40 hover:border-[#8FFFD1]/35 hover:bg-mint/5 transition-all duration-300 w-[64px] h-[58px] group/tech cursor-pointer">
              <svg className="w-5 h-5 text-white/70 group-hover/tech:text-[#8FFFD1] transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3c-1.2 0-2.4.6-3.2 1.6-1.5 1.8-1.5 4.6 0 6.4.8 1 2 1.6 3.2 1.6s2.4-.6 3.2-1.6c1.5-1.8 1.5-4.6 0-6.4C14.4 3.6 13.2 3 12 3z" />
              </svg>
              <span className="text-[7.5px] font-Spline_Sans_Mono text-accent/50 group-hover/tech:text-[#8FFFD1] mt-1 select-none transition-colors">TAILWIND</span>
            </div>
          </div>

          <div className="text-left">
            <h4 className="text-xs font-medium text-white">Familiar Technologies</h4>
            <p className="text-[10px] text-accent/50 font-light mt-1 leading-relaxed">
              Focused on full-stack development with modern frontend frameworks and scalable backend API layers.
            </p>
          </div>
        </SpotlightCard>
      </motion.div>

      {/* System Terminal Console */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease }}
        className="w-full max-w-5xl px-4 flex flex-col z-10 mt-12 mb-12"
      >
        <div className="flex justify-start items-center mb-6 select-none">
          <h2 className="font-serif-display text-2xl md:text-3xl font-medium tracking-tight text-white">
            System <span className="text-mint font-light italic">console</span>
          </h2>
        </div>
        <TerminalConsole />
      </motion.div>

      {/* 3. Projects Highlight Section (Accordion-style below Bento Grid) */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease }}
        className="w-full max-w-5xl px-4 pb-32 flex flex-col z-10 mt-12"
      >
        {/* Header */}
        <div className="flex justify-start items-center mb-10 select-none">
          <h2 className="font-serif-display text-3xl md:text-4xl font-medium tracking-tight text-white">
            Projects <span className="text-highlight font-light">highlight</span>
          </h2>
        </div>

        {/* Accordion Container */}
        <div className="w-full border-b border-mint/10">
          {projectsList.map((project) => {
            const isExpanded = true;

            return (
              <div
                key={project.id}
                className="group relative w-full border-t border-mint/10 transition-colors duration-300 ease-out cursor-pointer bg-transparent hover:bg-mint/5 hover:border-t-white/10"
              >
                {/* Accordion Row Height Animation */}
                <motion.div
                  animate={{
                    height: isMobile ? "145px" : "260px",
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="w-full flex items-center overflow-hidden px-4 md:px-6 relative"
                >
                  <div className="w-full grid grid-cols-12 items-center h-full">

                    {/* Left Column: Number, Title, Tags */}
                    <div className="col-span-11 md:col-span-5 flex flex-col justify-center h-full pr-4 select-none">
                      <div className="flex items-center gap-3 md:gap-4">
                        <span
                          className={`text-xs font-Spline_Sans_Mono transition-colors duration-300 ${isExpanded ? "text-highlight" : "text-accent/30 group-hover:text-accent/60"
                            }`}
                        >
                          {project.id}
                        </span>
                        <h3
                          className={`text-xl md:text-2xl font-medium tracking-tight transition-all duration-500 ${isExpanded
                            ? "text-white scale-100"
                            : "text-[#9F9FAD]/40 group-hover:text-white/80"
                            }`}
                        >
                          {project.title}
                        </h3>
                      </div>

                      {/* Stack tags pill container */}
                      <motion.div
                        initial={false}
                        animate={{
                          opacity: isExpanded ? 1 : 0,
                          y: isExpanded ? 0 : 10,
                          height: isExpanded ? "auto" : 0,
                        }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-wrap gap-2 mt-4 overflow-hidden"
                      >
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-[10px] font-Spline_Sans_Mono text-accent/70 border border-accent/15 rounded-full bg-[#111622]/40"
                          >
                            {tag}
                          </span>
                        ))}
                      </motion.div>
                    </div>

                    {/* Center Column: Mockup */}
                    <div className="hidden md:flex md:col-span-5 h-full items-center justify-center relative">
                      <motion.div
                        initial={false}
                        animate={{
                          opacity: isExpanded ? 1 : 0,
                          scale: isExpanded ? 1 : 0.85,
                          y: isExpanded ? 0 : 20,
                        }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full max-w-[340px] h-[175px]"
                      >
                        {isExpanded && (
                          <div className="w-full h-full bg-[#07100D] flex flex-col justify-between relative overflow-hidden font-sans border border-white/10 rounded-xl shadow-2xl select-none text-left">
                            {/* Browser Top Bar */}
                            <div className="flex items-center justify-between bg-[#0d1a16] border-b border-white/5 px-3 py-1.5 text-[6px] text-neutral-400 font-sans">
                              <div className="flex items-center gap-1.5">
                                <div className="flex gap-0.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F56]" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFBD2E]" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#27C93F]" />
                                </div>
                                <span className="font-light text-neutral-400">{project.domain}</span>
                              </div>
                              <span className="opacity-60 text-[5px]">Secure Site</span>
                            </div>
                            {/* Screenshot Image */}
                            <div className="flex-1 w-full overflow-hidden bg-[#0C101A] relative">
                              <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                              />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </div>

                    {/* Right Column: Year and Arrow */}
                    <div className="col-span-1 md:col-span-2 flex items-center justify-end font-Spline_Sans_Mono select-none">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs md:text-sm transition-colors duration-300 ${isExpanded ? "text-white" : "text-accent/30 group-hover:text-accent/60"
                            }`}
                        >
                          {project.year}
                        </span>

                        <div className="w-5 h-5 flex items-center justify-center overflow-hidden">
                          <motion.div
                            animate={{
                              x: isExpanded ? 0 : -5,
                              y: isExpanded ? 0 : 5,
                              opacity: isExpanded ? 1 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <ArrowUpRight className="w-4 h-4 text-highlight" />
                          </motion.div>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* View More Projects Button */}
        <div className="w-full flex justify-center mt-10 select-none">
          <button
            onClick={() => setActiveTab?.("work")}
            className="px-6 py-2.5 border border-white/10 hover:border-[#8FFFD1]/30 bg-black/20 hover:bg-[#8FFFD1]/5 rounded-full text-[10px] font-Spline_Sans_Mono tracking-widest text-white hover:text-[#8FFFD1] transition-all duration-300 cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(143,255,209,0.1)] hover:-translate-y-0.5"
          >
            View More Projects ↗
          </button>
        </div>
      </motion.div>

      {/* 4. Stats / Metrics Section (Below Projects Highlight) */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease }}
        className="w-full max-w-5xl px-4 pb-32 flex flex-col z-10 mt-12"
      >
        {/* Header */}
        <div className="flex justify-start items-center mb-10 select-none">
          <h2 className="font-serif-display text-3xl md:text-4xl font-medium tracking-tight text-white">
            Stats <span className="text-highlight font-light">✧ Metrics</span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full">
          {statsData.map((stat, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-3xl border border-mint/15 bg-[#07100D]/25 p-6 md:p-8 flex flex-col justify-between group hover:border-mint/50 transition-all duration-300"
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-mint/0 to-mint/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="z-10 select-none">
                {/* Stat Label */}
                <span className="text-[10px] font-Spline_Sans_Mono text-accent/40 uppercase tracking-widest block mb-4">
                  {stat.label}
                </span>

                {/* Stat Number */}
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl md:text-6xl font-bold font-Spline_Sans_Mono text-white tracking-tight leading-none group-hover:text-highlight transition-colors duration-300">
                    {stat.value}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 5. What I Do Section (Below Stats Section) */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease }}
        className="w-full max-w-5xl px-4 pb-32 flex flex-col z-10 mt-12"
      >
        {/* Header */}
        <div className="flex justify-start items-center mb-10 select-none">
          <h2 className="font-serif-display text-3xl md:text-4xl font-medium tracking-tight text-white">
            What I <span className="text-highlight font-light">Do</span>
          </h2>
        </div>

        {/* Services Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {servicesData.map((service, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-3xl border border-mint/15 bg-[#07100D]/25 p-8 md:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 group hover:border-mint/50 transition-all duration-300 min-h-[220px]"
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-mint/0 to-mint/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Text Area */}
              <div className="flex-1 flex flex-col justify-center select-none text-left z-10">
                <span className="text-[9px] font-Spline_Sans_Mono text-accent/30 uppercase tracking-widest block mb-2">
                  {service.id} // {service.label}
                </span>
                <h3 className="text-xl md:text-2xl font-medium text-white mb-2 group-hover:text-highlight transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-xs text-accent/50 leading-relaxed max-w-[34ch]">
                  {service.description}
                </p>
              </div>

              {/* Graphic Area */}
              <div className="flex-shrink-0 z-10 scale-95 group-hover:scale-105 transition-transform duration-500">
                {service.visual}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Services details and abstract visuals configuration
const servicesData = [
  {
    id: "01",
    label: "Product",
    title: "Product Development",
    description: "Translating complex ideas into production-ready digital products with scalable architectures and seamless user flows.",
    visual: (
      <div className="w-28 h-28 relative flex items-center justify-center">
        <div className="absolute inset-0 bg-[#B0FF92]/5 blur-xl rounded-full" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border border-dashed border-[#B0FF92]/30 rounded-lg flex items-center justify-center relative"
        >
          <div className="w-14 h-14 border border-[#B0FF92]/20 rounded-md transform rotate-45 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#B0FF92]" />
          </div>
          <span className="absolute top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#B0FF92]/60" />
          <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-[#B0FF92]/60" />
        </motion.div>
      </div>
    ),
  },
  {
    id: "02",
    label: "Design",
    title: "UI/UX Design",
    description: "Crafting beautiful interfaces and accessible user experiences that balance aesthetics with engineering functionality.",
    visual: (
      <div className="w-28 h-28 relative flex items-center justify-center">
        <div className="absolute inset-0 bg-mint/5 blur-xl rounded-full" />
        <svg className="w-20 h-20 text-mint/30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.circle
            cx="50" cy="50" r="30"
            stroke="currentColor" strokeWidth="1" strokeDasharray="3,3"
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M 20 50 A 30 30 0 0 1 80 50"
            stroke="#B0FF92" strokeWidth="1.5"
            animate={{ rotate: 360 }}
            style={{ transformOrigin: '50px 50px' }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          <circle cx="50" cy="50" r="4" fill="white" />
        </svg>
      </div>
    ),
  },
  {
    id: "03",
    label: "Intelligence",
    title: "AI Solutions",
    description: "Integrating state-of-the-art machine learning models, LLMs, and intelligent automation into standard web systems.",
    visual: (
      <div className="w-28 h-28 relative flex items-center justify-center">
        <div className="absolute inset-0 bg-purple-500/5 blur-xl rounded-full" />
        <div className="relative w-16 h-16 flex items-center justify-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.7, 0.3],
                rotate: i * 45 + (i % 2 === 0 ? 360 : -360),
              }}
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ border: `1px solid ${i === 0 ? '#8B5CF6' : i === 1 ? '#B0FF92' : '#8FFFD1'}` }}
              className="absolute w-full h-full rounded-full opacity-40 border-dashed"
            />
          ))}
          <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
        </div>
      </div>
    ),
  },
  {
    id: "04",
    label: "Engineering",
    title: "Full Stack Engineering",
    description: "Building robust, end-to-end architectures utilizing modern frameworks, serverless APIs, and database structures.",
    visual: (
      <div className="w-28 h-28 relative flex items-center justify-center">
        <div className="absolute inset-0 bg-[#B0FF92]/5 blur-xl rounded-full" />
        <div className="w-16 h-16 flex flex-col justify-between items-center py-2 relative">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, (i - 1) * 8, 0],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 4,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-12 h-2.5 rounded bg-[#111622] border border-white/10 flex items-center px-1 gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#B0FF92]" />
              <div className="h-[1px] flex-1 bg-white/20" />
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "05",
    label: "Integration",
    title: "API Development & Integration",
    description: "Designing high-performance, secure REST & GraphQL APIs, serverless webhooks, and real-time third-party integrations.",
    visual: (
      <div className="w-28 h-28 relative flex items-center justify-center">
        <div className="absolute inset-0 bg-[#B0FF92]/5 blur-xl rounded-full" />
        <div className="w-20 h-16 relative flex items-center justify-between px-1">
          {/* Left server box */}
          <div className="w-5 h-10 border border-white/10 bg-[#111622] rounded flex flex-col justify-around items-center py-1">
            <span className="w-1 h-1 rounded-full bg-[#B0FF92]" />
            <span className="w-1 h-1 rounded-full bg-[#B0FF92]/40" />
            <span className="w-1 h-1 rounded-full bg-[#B0FF92]/40" />
          </div>
          {/* Connecting data stream path */}
          <div className="flex-1 h-[2px] relative bg-white/5 mx-2 overflow-hidden">
            <motion.div
              animate={{ x: [-20, 40] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 w-3 h-full bg-gradient-to-r from-transparent via-[#B0FF92] to-transparent"
            />
          </div>
          {/* Right cloud/api icon */}
          <div className="w-6 h-6 border border-dashed border-mint/45 rounded-full flex items-center justify-center relative animate-pulse">
            <svg className="w-3.5 h-3.5 text-mint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "06",
    label: "Strategy",
    title: "Product Strategy",
    description: "Identifying problems, validating ideas, and shaping products that deliver real value to users.",
    visual: (
      <div className="w-28 h-28 relative flex items-center justify-center">
        <div className="absolute inset-0 bg-[#B0FF92]/5 blur-xl rounded-full" />
        <div className="w-16 h-16 relative flex items-center justify-center">
          {/* Radar target rings */}
          <motion.div
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-full h-full border border-dashed border-[#B0FF92]/30 rounded-full"
          />
          <motion.div
            animate={{ scale: [1.2, 0.8, 1.2], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-10 h-10 border border-[#B0FF92]/20 rounded-full"
          />
          {/* Crosshairs */}
          <div className="absolute w-[2px] h-12 bg-gradient-to-t from-transparent via-[#B0FF92]/40 to-transparent" />
          <div className="absolute h-[2px] w-12 bg-gradient-to-r from-transparent via-[#B0FF92]/40 to-transparent" />
          {/* Glowing central target node */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#B0FF92] relative flex items-center justify-center">
            <span className="absolute w-4 h-4 rounded-full bg-[#B0FF92]/40 animate-ping" />
          </div>
        </div>
      </div>
    ),
  },
];

// Stats metrics data
const statsData = [
  { label: "Projects Built", value: "06+" },
  { label: "Years Learning", value: "3+" },
  { label: "Git Commits", value: "1000+" },
  { label: "Technologies Used", value: "20+" },
];

// Custom project details list mapping directly to screenshot assets
const projectsList = [
  {
    id: "01",
    title: "Planora",
    year: "2026",
    domain: "planora.ai",
    tags: ["react", "zustand", "supabase", "tailwind"],
    image: planoraImg,
  },
  {
    id: "02",
    title: "WebLens",
    year: "2026",
    domain: "weblens.dev",
    tags: ["react", "pagespeed-api", "tailwind-v4", "recharts"],
    image: weblensImg,
  },
  {
    id: "03",
    title: "MockMate",
    year: "2026",
    domain: "mockmate.ai",
    tags: ["react", "typescript", "node.js", "gemini-pro"],
    image: mockmateImg,
  },
];

