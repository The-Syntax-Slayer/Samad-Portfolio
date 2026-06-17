import { useState, useEffect, useTransition, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home as HomeIcon, Info, Briefcase, Mail, User, BookOpen } from "lucide-react";
import { ReactLenis } from "lenis/react";
import Home from "./components/Home";

const About = lazy(() => import("./components/About"));
const Work = lazy(() => import("./components/Work"));
const Connect = lazy(() => import("./components/Connect"));
const Blog = lazy(() => import("./components/Blog"));
import Footer from "./components/Footer";
import cloudBg from "./assets/cloud.webp";
import ParticleBackground from "./components/ParticleBackground";
import BootLoader from "./components/BootLoader";
import AIAssistant from "./components/AIAssistant";
import CustomCursor from "./components/CustomCursor";
import "lenis/dist/lenis.css";

type Tab = "home" | "about" | "work" | "blog" | "connect";

export default function App() {
  const [, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const pathParts = pathname.split("/").filter(Boolean);
      if (pathParts.length > 0) {
        const primarySegment = pathParts[0].toLowerCase();
        if (["about", "work", "blog", "connect"].includes(primarySegment)) {
          return primarySegment as Tab;
        }
      }
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (params.has("blog")) {
        return "blog";
      }
      if (tabParam && ["home", "about", "work", "blog", "connect"].includes(tabParam)) {
        return tabParam as Tab;
      }
      if (window.history.state && window.history.state.tab) {
        return window.history.state.tab;
      }
    }
    return "home";
  });
  const [hoveredTab, setHoveredTab] = useState<Tab | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isBooted, setIsBooted] = useState(() => {
    if (typeof window !== "undefined") {
      return !!sessionStorage.getItem("portfolio-booted");
    }
    return false;
  });

  const handleTabChange = (tab: Tab) => {
    startTransition(() => {
      setActiveTab(tab);
    });
  };

  // Automatically scroll to top when changing tabs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  // Sync state with browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const pathname = window.location.pathname;
      const pathParts = pathname.split("/").filter(Boolean);
      if (pathParts.length > 0) {
        const primarySegment = pathParts[0].toLowerCase();
        if (["about", "work", "blog", "connect"].includes(primarySegment)) {
          setActiveTab(primarySegment as Tab);
          return;
        }
      }
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (params.has("blog")) {
        setActiveTab("blog");
      } else if (tabParam && ["home", "about", "work", "blog", "connect"].includes(tabParam)) {
        setActiveTab(tabParam as Tab);
      } else if (event.state && event.state.tab) {
        setActiveTab(event.state.tab);
      } else {
        setActiveTab("home");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Push tab transitions to history state with clean, SEO-friendly paths
  useEffect(() => {
    const state = window.history.state;
    const params = new URLSearchParams(window.location.search);
    
    let targetUrl = "/";
    if (activeTab === "blog") {
      const pathname = window.location.pathname;
      const pathParts = pathname.split("/").filter(Boolean);
      let blogSlug = params.get("blog");
      if (pathParts[0] === "blog" && pathParts[1]) {
        blogSlug = pathParts[1];
      }
      if (blogSlug) {
        targetUrl = `/blog/${blogSlug}`;
      } else {
        targetUrl = `/blog`;
      }
    } else if (activeTab !== "home") {
      targetUrl = `/${activeTab}`;
    }

    if (!state || state.tab !== activeTab || window.location.pathname !== targetUrl) {
      if (!state) {
        window.history.replaceState({ tab: activeTab }, "", targetUrl);
      } else {
        window.history.pushState({ tab: activeTab }, "", targetUrl);
      }
    }
  }, [activeTab]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Dynamic Tab-based SEO & Title Updates
  useEffect(() => {
    // If we're on the blog tab and a post is active, let Blog.tsx handle document titles
    if (activeTab === "blog") {
      const isPostActive = document.title.includes(" | Samad Shaikh") && !document.title.startsWith("Blog | ");
      if (isPostActive) return;
    }

    let title = "Samad Shaikh | Innovative Software Developer, AI Engineer & Tech Entrepreneur in Mumbai";
    let description = "Who is Samad Shaikh? He is an Innovative Software Developer, AI Engineer & Tech Entrepreneur in Mumbai building high-performance web apps and Generative AI systems.";
    let path = activeTab === "home" ? "" : activeTab;
    let schemaJson: any = null;

    switch (activeTab) {
      case "home":
        title = "Samad Shaikh | Innovative Software Developer, AI Engineer & Tech Entrepreneur in Mumbai";
        description = "Who is Samad Shaikh? He is an Innovative Software Developer, AI Engineer & Tech Entrepreneur in Mumbai building high-performance web apps and Generative AI systems.";
        break;
      case "about":
        title = "About Samad Shaikh | Background, Skills & Certifications";
        description = "Explore the professional background, core technical skills, and certifications of Samad Shaikh, a Mumbai-based software engineer specializing in React, TypeScript, Node.js, and GenAI integrations.";
        schemaJson = {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": title,
          "description": description,
          "url": "https://www.samadshaikh.dev/about",
          "mainEntity": {
            "@id": "https://www.samadshaikh.dev/#person"
          }
        };
        break;
      case "work":
        title = "Portfolio & Projects | Handcrafted Digital Experiences by Samad";
        description = "Browse the professional portfolio of Samad Shaikh, showcasing production web applications, SaaS products like PriMaX Hub and MockMate AI, and technical details on engineering solutions.";
        schemaJson = {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": title,
          "description": description,
          "url": "https://www.samadshaikh.dev/work",
          "mainEntity": {
            "@type": "ItemList",
            "name": "Samad Shaikh's Software Engineering & AI Projects",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "url": "https://www.samadshaikh.dev/work#primax", "name": "PriMaX Hub" },
              { "@type": "ListItem", "position": 2, "url": "https://www.samadshaikh.dev/work#mockmate", "name": "MockMate AI" },
              { "@type": "ListItem", "position": 3, "url": "https://www.samadshaikh.dev/work#planora", "name": "Planora" },
              { "@type": "ListItem", "position": 4, "url": "https://www.samadshaikh.dev/work#weblens", "name": "WebLens" },
              { "@type": "ListItem", "position": 5, "url": "https://www.samadshaikh.dev/work#legalease", "name": "LegalEase" },
              { "@type": "ListItem", "position": 6, "url": "https://www.samadshaikh.dev/work#clientsync", "name": "ClientSync" },
              { "@type": "ListItem", "position": 7, "url": "https://www.samadshaikh.dev/work#smartmeet", "name": "SmartMeet" }
            ]
          }
        };
        break;
      case "blog":
        title = "Blog & Insights | Technical Deep Dives by Samad Shaikh";
        description = "Read expert articles by Samad Shaikh on React 19, FastAPI asyncio concurrency, scaling WebSockets, prompt injection security, Google SGE SEO optimization, and web engineering basics.";
        schemaJson = {
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": title,
          "description": description,
          "url": "https://www.samadshaikh.dev/blog",
          "publisher": {
            "@id": "https://www.samadshaikh.dev/#person"
          }
        };
        break;
      case "connect":
        title = "Connect with Samad | Freelance Inquiry & AI Consultations";
        description = "Get in touch with Samad Shaikh for freelance software development projects, custom AI/LLM integrations, full-stack app engineering, or professional consultations.";
        schemaJson = {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": title,
          "description": description,
          "url": "https://www.samadshaikh.dev/connect",
          "mainEntity": {
            "@id": "https://www.samadshaikh.dev/#person"
          }
        };
        break;
    }

    document.title = title;
    
    // Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", description);

    // Update Open Graph (OG) Meta Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", `https://www.samadshaikh.dev/${path}`);

    // Update Twitter Meta Tags
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute("content", title);

    const twitterDesc = document.querySelector('meta[property="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute("content", description);

    const twitterUrl = document.querySelector('meta[property="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute("content", `https://www.samadshaikh.dev/${path}`);

    // Update Canonical Link
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute("href", `https://www.samadshaikh.dev/${path}`);
    }

    // Dynamic JSON-LD injection
    let scriptTag = document.getElementById("dynamic-jsonld") as HTMLScriptElement;
    if (schemaJson) {
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = "dynamic-jsonld";
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schemaJson);
    } else {
      if (scriptTag) {
        scriptTag.remove();
      }
    }
  }, [activeTab]);

  const tabs = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "about", label: "About", icon: Info },
    { id: "work", label: "Work", icon: Briefcase },
    { id: "blog", label: "Blog", icon: BookOpen },
    { id: "connect", label: "Connect", icon: Mail },
  ] as const;

  const mobileTabs = [
    { id: "home", label: "HOME", icon: HomeIcon },
    { id: "about", label: "ABOUT", icon: User },
    { id: "work", label: "WORK", icon: Briefcase },
    { id: "blog", label: "BLOG", icon: BookOpen },
    { id: "connect", label: "CONNECT", icon: Mail },
  ] as const;

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.0, smoothWheel: true }}>
      <div className="w-screen min-h-screen relative flex flex-col items-center justify-between text-accent selection:bg-mint selection:text-black">



      {/* Floating AI Chat Assistant */}
      <AIAssistant />

      {/* Sleek Custom Mouse Cursor follower */}
      <CustomCursor />

      {/* Fullscreen System Boot Log Sequence */}
      {!isBooted && (
        <BootLoader onComplete={() => setIsBooted(true)} />
      )}

      {/* 1. Viewport Atmospheric Background */}
      <div
        id="background"
        className="w-screen h-screen fixed top-0 -z-20 flex justify-center pointer-events-none overflow-hidden"
        style={{
          background: "radial-gradient(85% 85% at 50% 50%, #081411 0%, #030806 50%, #000000 100%)",
        }}
      >
        {/* Interactive Neural/Constellation Background */}
        <ParticleBackground />

        {/* Soft Cloud Overlay Asset */}
        <div className="w-full h-full opacity-[10%] relative scale-110 overflow-hidden mix-blend-screen">
          <img
            alt="Cloud background"
            src={cloudBg}
            className="w-full h-full object-cover"
            draggable="false"
          />
        </div>
        {/* Volumetric Glowing Blobs */}
        <div className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-[#8FFFD1]/[0.04] blur-[160px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-15%] w-[65vw] h-[65vw] rounded-full bg-[#B0FF92]/[0.03] blur-[180px] pointer-events-none animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
      </div>

      {/* 2. Scrollable Core Container */}
      <main className="w-full flex flex-col items-center flex-grow pt-10 pb-0">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex justify-center"
            >
              <Home setActiveTab={handleTabChange} />
            </motion.div>
          )}

          {activeTab === "about" && (
            <Suspense fallback={
              <div className="h-[60vh] w-full flex items-center justify-center">
                <span className="text-mint font-Spline_Sans_Mono text-xs tracking-widest uppercase animate-pulse">// Decoding bio...</span>
              </div>
            }>
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex justify-center"
              >
                <About />
              </motion.div>
            </Suspense>
          )}

          {activeTab === "work" && (
            <Suspense fallback={
              <div className="h-[60vh] w-full flex items-center justify-center">
                <span className="text-mint font-Spline_Sans_Mono text-xs tracking-widest uppercase animate-pulse">// Initializing projects telemetry...</span>
              </div>
            }>
              <motion.div
                key="work"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex justify-center"
              >
                <Work />
              </motion.div>
            </Suspense>
          )}

          {activeTab === "blog" && (
            <Suspense fallback={
              <div className="h-[60vh] w-full flex items-center justify-center">
                <span className="text-mint font-Spline_Sans_Mono text-xs tracking-widest uppercase animate-pulse">// Parsing blueprints database...</span>
              </div>
            }>
              <motion.div
                key="blog"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex justify-center"
              >
                <Blog />
              </motion.div>
            </Suspense>
          )}

          {activeTab === "connect" && (
            <Suspense fallback={
              <div className="h-[60vh] w-full flex items-center justify-center">
                <span className="text-mint font-Spline_Sans_Mono text-xs tracking-widest uppercase animate-pulse">// Opening secure uplink...</span>
              </div>
            }>
              <motion.div
                key="connect"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex justify-center"
              >
                <Connect />
              </motion.div>
            </Suspense>
          )}
        </AnimatePresence>

        {/* 3. Persistent Page Footer */}
        <Footer setActiveTab={handleTabChange} />
      </main>

      {/* 4. Fixed Dock Navigation Bar */}
      <nav className="fixed flex justify-center items-end w-full h-20 bottom-6 z-50 pointer-events-none">
        {isMobile ? (
          <div className="mx-4 flex h-14 w-[90%] max-w-[380px] items-center justify-between rounded-full border border-white/5 bg-[#080b11]/70 p-1.5 px-3 backdrop-blur-2xl pointer-events-auto shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
            {mobileTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  aria-label={`Navigate to ${tab.label}`}
                  className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center cursor-pointer transition-colors duration-200 rounded-full"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  {/* Sliding active indicator pill behind */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPillMobile"
                      className="absolute inset-x-1 inset-y-0.5 bg-mint/10 border border-mint/20 rounded-full shadow-[0_0_12px_rgba(143,255,209,0.06)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Icon */}
                  <Icon className={`w-4 h-4 relative z-10 transition-transform duration-200 ${isActive ? "text-mint scale-105" : "text-accent/50"}`} />
                  
                  {/* Text Label */}
                  <span className={`text-[8px] font-semibold font-Spline_Sans_Mono uppercase tracking-wider mt-0.5 relative z-10 transition-colors duration-200 ${isActive ? "text-mint" : "text-white/30"}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mx-3 flex h-16 items-center gap-2 rounded-full border border-white/5 bg-[#080b11]/70 p-2 backdrop-blur-2xl pointer-events-auto shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
            <div className="flex gap-2 relative">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const isHovered = hoveredTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    onMouseEnter={() => setHoveredTab(tab.id)}
                    onMouseLeave={() => setHoveredTab(null)}
                    aria-label={`Navigate to ${tab.label}`}
                    className="relative flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-300 hover:text-white cursor-pointer"
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    {/* Sliding active highlight background */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 bg-mint/10 border border-mint/20 rounded-full shadow-[0_0_15px_rgba(143,255,209,0.08)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}

                    {/* Sliding hover highlight background */}
                    {isHovered && !isActive && (
                      <motion.div
                        layoutId="hoverTabPill"
                        className="absolute inset-0 bg-white/[0.04] rounded-full"
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      />
                    )}

                    {/* Sliding tooltip label above dock */}
                    <AnimatePresence>
                      {isHovered && !isMobile && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: -48, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="px-2.5 py-1 bg-[#0f1422] rounded-lg border border-white/5 pointer-events-none absolute z-50 shadow-xl"
                        >
                          <p className="text-[10px] font-medium font-Spline_Sans_Mono text-mint leading-none uppercase tracking-wider">
                            {tab.label}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Icon */}
                    <Icon className={`w-5 h-5 relative z-10 transition-all duration-300 ${isActive ? "text-mint scale-105 drop-shadow-glow" : "text-accent/50 group-hover:text-white/85"}`} />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </div>
    </ReactLenis>
  );
}
