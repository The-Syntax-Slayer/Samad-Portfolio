import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import logoImg from "../assets/logo.svg";
import cloudBg from "../assets/cloud.webp";

export default function Connect() {
  const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

  // Mouse move state for atmospheric parallax (using MotionValues to prevent re-renders)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for smooth movement
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  // Transforms for parallax layers to run on the GPU
  const cloudX = useTransform(springX, (x) => x * -15);
  const cloudY = useTransform(springY, (y) => y * -15);

  const leak1X = useTransform(springX, (x) => x * 25);
  const leak1Y = useTransform(springY, (y) => y * 25);

  const leak2X = useTransform(springX, (x) => x * -25);
  const leak2Y = useTransform(springY, (y) => y * -25);

  const orbitX = useTransform(springX, (x) => x * -8);
  const orbitY = useTransform(springY, (y) => y * -8);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Form State
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);

    try {
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "YOUR_ACCESS_KEY_HERE";
      
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          subject: formData.subject || "Portfolio Inquiry from " + formData.name,
          message: formData.message,
          from_name: "Samad Portfolio Bot",
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        console.error("Web3Forms Submission Error:", result);
        alert("Submission failed. Please check if VITE_WEB3FORMS_ACCESS_KEY is set in your .env file.");
      }
    } catch (err) {
      console.error("Submission Network Error:", err);
      alert("Something went wrong while sending the message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full relative select-none flex flex-col items-center overflow-hidden bg-[#050505] text-white px-4 pt-10"
    >
      {/* 1. Cinematic Background Layer */}
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(143,255,209,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(143,255,209,0.035)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Pulsing Grid Intersections */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]">
        <span className="absolute w-[3px] h-[3px] rounded-full bg-[#8FFFD1] shadow-[0_0_8px_3px_rgba(143,255,209,0.4)] left-[20%] top-[15%] animate-pulse" />
        <span className="absolute w-[3px] h-[3px] rounded-full bg-[#8FFFD1] shadow-[0_0_8px_3px_rgba(143,255,209,0.4)] right-[25%] top-[40%] animate-pulse" style={{ animationDelay: '0.6s' }} />
        <span className="absolute w-[3px] h-[3px] rounded-full bg-[#8FFFD1] shadow-[0_0_8px_3px_rgba(143,255,209,0.4)] left-[30%] bottom-[45%] animate-pulse" style={{ animationDelay: '1.2s' }} />
        <span className="absolute w-[3px] h-[3px] rounded-full bg-[#8FFFD1] shadow-[0_0_8px_3px_rgba(143,255,209,0.4)] right-[15%] bottom-[20%] animate-pulse" style={{ animationDelay: '0.8s' }} />
      </div>

      {/* Volumetric cloud overlay with parallax */}
      <motion.div
        style={{
          x: cloudX,
          y: cloudY,
          willChange: "transform",
        }}
        className="absolute inset-0 z-0 pointer-events-none scale-105 opacity-[14%] mix-blend-screen"
      >
        <img
          src={cloudBg}
          alt="Clouds backdrop"
          className="w-full h-full object-cover"
          draggable="false"
        />
      </motion.div>

      {/* Soft atmospheric mint glowing nodes */}
      <motion.div
        style={{
          x: leak1X,
          y: leak1Y,
          willChange: "transform",
        }}
        className="absolute w-[450px] h-[450px] rounded-full bg-[#8FFFD1]/6 blur-[100px] pointer-events-none z-0 left-[15%] top-[10%]"
      />
      <motion.div
        style={{
          x: leak2X,
          y: leak2Y,
          willChange: "transform",
        }}
        className="absolute w-[350px] h-[350px] rounded-full bg-[#8FFFD1]/4 blur-[80px] pointer-events-none z-0 right-[20%] bottom-[30%]"
      />

      {/* Dashed blueprint graphic circles */}
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
        style={{
          x: orbitX,
          y: orbitY,
          willChange: "transform",
        }}
        className="absolute w-[700px] h-[700px] rounded-full border border-[#8FFFD1]/8 border-dashed pointer-events-none z-0 flex items-center justify-center top-[5%]"
      >
        <div className="w-[500px] h-[500px] rounded-full border border-[#8FFFD1]/6 border-dashed" />
        <div className="w-[300px] h-[300px] rounded-full border border-[#8FFFD1]/6" />
      </motion.div>

      {/* Floating particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: Math.random() * 0.4 + 0.3,
            opacity: Math.random() * 0.3 + 0.15,
          }}
          animate={{
            y: ["0%", "-10%", "0%"],
            x: ["0%", "2%", "0%"],
          }}
          transition={{
            duration: 12 + Math.random() * 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-1 h-1 rounded-full bg-[#8FFFD1] pointer-events-none z-0"
        />
      ))}

      {/* Viewport Corner brackets */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-6 left-6 w-3.5 h-3.5 border-t border-l border-[#8FFFD1]/35" />
        <div className="absolute top-6 right-6 w-3.5 h-3.5 border-t border-r border-[#8FFFD1]/35" />
        <div className="absolute bottom-6 left-6 w-3.5 h-3.5 border-b border-l border-[#8FFFD1]/35" />
        <div className="absolute bottom-6 right-6 w-3.5 h-3.5 border-b border-r border-[#8FFFD1]/35" />
      </div>


      {/* 2. Core Page Content Container */}
      <div className="w-full max-w-5xl z-10 flex flex-col gap-24 mt-8">

        {/* A. PAGE HEADER */}
        <div className="flex flex-col items-start text-left gap-4 max-w-3xl">
          <motion.div
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease }}
            className="flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#8FFFD1] animate-pulse shadow-[0_0_6px_#8FFFD1]" />
            <span className="font-Spline_Sans_Mono text-[10px] tracking-[0.25em] text-[#8FFFD1] uppercase font-semibold">
              Let's Connect ✦
            </span>
          </motion.div>

          <motion.h1
            initial={{ y: 35, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 1, ease }}
            className="font-serif-display text-5xl sm:text-7xl md:text-8xl font-medium tracking-tight text-white leading-[0.9] mt-2"
          >
            Let's Build <br />
            <span className="italic text-accent/50 font-normal">Something</span> <br />
            Meaningful.
          </motion.h1>

          <motion.p
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 0.8 }}
            transition={{ delay: 0.3, duration: 0.8, ease }}
            className="text-accent/80 text-sm md:text-base font-light mt-6 leading-relaxed max-w-[50ch]"
          >
            Whether it's an ambitious startup idea, an AI product, a SaaS platform, or a creative collaboration, I'm always open to discussing meaningful opportunities.
          </motion.p>
        </div>


        {/* B. LAYOUT - TWO COLUMN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* LEFT SIDE: Contact Information Panel */}
          <div className="lg:col-span-5 flex flex-col gap-8 text-left">
            <h2 className="font-serif-display text-2xl md:text-3xl text-white italic tracking-wide">
              I'd love to hear from you.
            </h2>

            <div className="flex flex-col gap-4">
              {contactCards.map((card, i) => (
                <motion.a
                  key={card.label}
                  href={card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ x: -25, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease }}
                  className="glass-panel p-5 rounded-2xl border border-[#1A1A1A] bg-[#111111]/45 flex items-center justify-between group hover:border-[#8FFFD1]/35 hover:bg-[#111111]/80 hover:shadow-[0_4px_30px_rgba(143,255,209,0.02)] transition-all duration-500 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {/* Minimal Icon */}
                    <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.04] group-hover:border-[#8FFFD1]/20 flex items-center justify-center text-accent/60 group-hover:text-[#8FFFD1] transition-all duration-300">
                      {card.icon}
                    </div>
                    <div>
                      <span className="text-[9px] font-Spline_Sans_Mono tracking-widest text-accent/40 uppercase block mb-0.5">
                        {card.label}
                      </span>
                      <span className="text-white font-light text-xs md:text-sm tracking-wide">
                        {card.value}
                      </span>
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="w-5 h-5 flex items-center justify-center text-accent/30 group-hover:text-[#8FFFD1] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>


          {/* RIGHT SIDE: Premium Contact Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ y: 35, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1, ease }}
              className="glass-panel p-6 md:p-8 rounded-3xl border border-[#1A1A1A] bg-[#111111]/45 backdrop-blur-md shadow-2xl relative overflow-hidden text-left"
            >
              {/* Card reflective overlay line */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="form-name" className="text-[9px] font-Spline_Sans_Mono tracking-widest text-[#A1A1AA] uppercase">
                      Name
                    </label>
                    <input
                      type="text"
                      id="form-name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#050505]/40 border border-[#1A1A1A] focus:border-[#8FFFD1] rounded-xl px-4 py-3.5 text-[16px] md:text-xs text-white placeholder-white/15 focus:outline-none focus:ring-4 focus:ring-[#8FFFD1]/5 hover:border-white/10 transition-all duration-300 font-light"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="form-email" className="text-[9px] font-Spline_Sans_Mono tracking-widest text-[#A1A1AA] uppercase">
                      Email
                    </label>
                    <input
                      type="email"
                      id="form-email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#050505]/40 border border-[#1A1A1A] focus:border-[#8FFFD1] rounded-xl px-4 py-3.5 text-[16px] md:text-xs text-white placeholder-white/15 focus:outline-none focus:ring-4 focus:ring-[#8FFFD1]/5 hover:border-white/10 transition-all duration-300 font-light"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Subject field */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="form-subject" className="text-[9px] font-Spline_Sans_Mono tracking-widest text-[#A1A1AA] uppercase">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="form-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#050505]/40 border border-[#1A1A1A] focus:border-[#8FFFD1] rounded-xl px-4 py-3.5 text-[16px] md:text-xs text-white placeholder-white/15 focus:outline-none focus:ring-4 focus:ring-[#8FFFD1]/5 hover:border-white/10 transition-all duration-300 font-light"
                    placeholder="What project are you building?"
                  />
                </div>

                {/* Message field */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="form-message" className="text-[9px] font-Spline_Sans_Mono tracking-widest text-[#A1A1AA] uppercase">
                    Message
                  </label>
                  <textarea
                    id="form-message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#050505]/40 border border-[#1A1A1A] focus:border-[#8FFFD1] rounded-xl px-4 py-3.5 text-[16px] md:text-xs text-white placeholder-white/15 focus:outline-none focus:ring-4 focus:ring-[#8FFFD1]/5 hover:border-white/10 transition-all duration-300 font-light resize-none leading-relaxed"
                    placeholder="Tell me about your product details, launch timeline..."
                  />
                </div>

                {/* Submit button with status feedback */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-4 border border-[#8FFFD1]/25 hover:border-[#8FFFD1]/60 bg-[#8FFFD1]/5 hover:bg-[#8FFFD1]/10 disabled:opacity-50 rounded-xl text-xs font-Spline_Sans_Mono tracking-widest text-white hover:text-[#8FFFD1] transition-all duration-500 cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(143,255,209,0.2)] flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {isSuccess ? (
                      <motion.span
                        key="success"
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -15, opacity: 0 }}
                        className="text-[#8FFFD1]"
                      >
                        Message Transmitted ✦
                      </motion.span>
                    ) : isSubmitting ? (
                      <motion.span
                        key="submitting"
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -15, opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Transmitting...
                      </motion.span>
                    ) : (
                      <span className="flex items-center gap-1">
                        Send Message <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">↗</span>
                      </span>
                    )}
                  </AnimatePresence>
                </button>
              </form>
            </motion.div>
          </div>
        </div>


        {/* C. BELOW CONTACT SECTION: Availability Card */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="glass-panel p-8 md:p-10 rounded-3xl border border-[#1A1A1A] bg-gradient-to-r from-[#111111]/30 to-[#0A0A0A]/30 w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-left relative overflow-hidden shadow-xl"
        >
          {/* Card subtle neon highlight indicator */}
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#8FFFD1]/[0.02] blur-[50px] rounded-full pointer-events-none" />

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 bg-[#8FFFD1]/5 border border-[#8FFFD1]/20 px-3 py-1 rounded-full w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8FFFD1] animate-ping" />
              <span className="font-Spline_Sans_Mono text-[9px] tracking-widest text-[#8FFFD1] uppercase font-medium">
                ● Available for new opportunities
              </span>
            </div>
            <h3 className="font-serif-display text-2xl md:text-3xl text-white font-medium italic mt-2">
              Freelance Projects & Collaborations
            </h3>
            <p className="text-[#A1A1AA] text-xs md:text-sm font-light max-w-[50ch] leading-relaxed">
              Open to building AI products, SaaS platforms, modern web applications, and meaningful digital experiences.
            </p>
          </div>

          <a
            href="mailto:sxmxd.1825@gmail.com"
            className="px-6 py-3 border border-[#8FFFD1]/25 hover:border-[#8FFFD1]/60 bg-[#8FFFD1]/5 hover:bg-[#8FFFD1]/10 rounded-full text-xs font-Spline_Sans_Mono tracking-widest text-white hover:text-[#8FFFD1] transition-all duration-500 cursor-pointer shadow-md hover:shadow-[0_0_15px_rgba(143,255,209,0.15)] shrink-0 flex items-center gap-1 group"
          >
            Let's Work Together <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">↗</span>
          </a>
        </motion.div>


        {/* D. FOOTER */}
        <div className="w-full border-t border-[#1A1A1A] pt-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 text-left pb-12 select-none">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="S Monogram" className="h-8 w-auto object-contain" />
              <div className="font-Spline_Sans_Mono text-[10px] tracking-wider leading-relaxed text-[#A1A1AA]">
                <span className="text-white block font-medium uppercase">Samad Shaikh</span>
                <span className="font-light">Software Engineer • Full-Stack Developer • AI Specialist</span>
              </div>
            </div>
            <p className="text-accent/40 text-[10px] font-Spline_Sans_Mono tracking-widest uppercase">
              Crafting digital experiences that make an impact.
            </p>
          </div>

          <button
            onClick={handleBackToTop}
            className="text-[10px] font-Spline_Sans_Mono tracking-widest text-accent/60 hover:text-[#8FFFD1] transition-colors cursor-pointer uppercase flex items-center gap-1"
          >
            Back To Top <span className="animate-bounce">↑</span>
          </button>
        </div>

      </div>
    </motion.div>
  );
}

// Contact cards data structure with premium SVGs
const contactCards = [
  {
    label: "Email",
    value: "sxmxd.1825@gmail.com",
    href: "mailto:sxmxd.1825@gmail.com",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/samad-ai",
    href: "https://linkedin.com/in/samad-ai",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    value: "github.com/The-Syntax-Slayer",
    href: "https://github.com/The-Syntax-Slayer",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
      </svg>
    ),
  },
  {
    label: "Location",
    value: "Mumbai, India",
    href: "https://maps.app.goo.gl/rk8Xks8DkqZuDZi4A",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a3 3 0 016 0z" />
      </svg>
    ),
  },
];
