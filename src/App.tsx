import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home as HomeIcon, Info, Briefcase, Mail, User } from "lucide-react";
import { ReactLenis } from "lenis/react";
import Home from "./components/Home";
import About from "./components/About";
import Work from "./components/Work";
import Connect from "./components/Connect";
import Footer from "./components/Footer";
import cloudBg from "./assets/cloud.png";
import ThemeSwitcher from "./components/ThemeSwitcher";
import ParticleBackground from "./components/ParticleBackground";
import BootLoader from "./components/BootLoader";
import AIAssistant from "./components/AIAssistant";
import "lenis/dist/lenis.css";

type Tab = "home" | "about" | "work" | "connect";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const hash = typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";
    return ["home", "about", "work", "connect"].includes(hash) ? (hash as Tab) : "home";
  });
  const [hoveredTab, setHoveredTab] = useState<Tab | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isBooted, setIsBooted] = useState(() => {
    if (typeof window !== "undefined") {
      return !!sessionStorage.getItem("portfolio-booted");
    }
    return false;
  });

  // Automatically scroll to top when changing tabs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  // Sync state with browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.tab) {
        setActiveTab(event.state.tab);
      } else {
        const hash = window.location.hash.replace("#", "");
        if (hash && ["home", "about", "work", "connect"].includes(hash)) {
          setActiveTab(hash as Tab);
        } else {
          setActiveTab("home");
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Sync activeTab with URL hash and history state
  useEffect(() => {
    const currentHash = window.location.hash.replace("#", "");
    if (currentHash !== activeTab) {
      if (currentHash === "" && activeTab === "home") {
        window.history.replaceState({ tab: activeTab }, "", `#${activeTab}`);
      } else {
        window.history.pushState({ tab: activeTab }, "", `#${activeTab}`);
      }
    } else {
      const state = window.history.state;
      if (!state || state.tab !== activeTab) {
        window.history.replaceState({ tab: activeTab }, "", `#${activeTab}`);
      }
    }
  }, [activeTab]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const tabs = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "about", label: "About", icon: Info },
    { id: "work", label: "Work", icon: Briefcase },
    { id: "connect", label: "Connect", icon: Mail },
  ] as const;

  const mobileTabs = [
    { id: "home", label: "HOME", icon: HomeIcon },
    { id: "about", label: "ABOUT", icon: User },
    { id: "work", label: "WORK", icon: Briefcase },
    { id: "connect", label: "CONNECT", icon: Mail },
  ] as const;

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothWheel: true }}>
      <div className="w-screen min-h-screen relative flex flex-col items-center justify-between text-accent overflow-x-hidden selection:bg-mint selection:text-black">

      {/* Theme Customization Floating Panel */}
      <ThemeSwitcher />

      {/* Floating AI Chat Assistant */}
      <AIAssistant />

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
      <div className="w-full flex flex-col items-center flex-grow pt-10 pb-0">
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
              <Home setActiveTab={setActiveTab} />
            </motion.div>
          )}

          {activeTab === "about" && (
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
          )}

          {activeTab === "work" && (
            <motion.div
              key="work"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex justify-center"
            >
              <Work />
            </motion.div>
          )}

          {activeTab === "connect" && (
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
          )}
        </AnimatePresence>

        {/* 3. Persistent Page Footer */}
        <Footer setActiveTab={setActiveTab} />
      </div>

      {/* 4. Fixed Dock Navigation Bar */}
      <nav className="fixed flex justify-center items-end w-full h-20 bottom-6 z-50 pointer-events-none">
        {isMobile ? (
          <div className="mx-4 flex h-fit w-[90%] max-w-[380px] items-center justify-between rounded-[28px] border border-[#404040]/70 bg-[#000000a6] p-2 px-3 backdrop-blur-xl pointer-events-auto shadow-2xl">
            {mobileTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center cursor-pointer transition-colors duration-200"
                >
                  {/* Icon */}
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "text-mint scale-105" : "text-accent/60"}`} />
                  
                  {/* Text Label */}
                  <span className={`text-[9px] font-semibold font-Spline_Sans_Mono uppercase tracking-wider mt-1.5 transition-colors duration-200 ${isActive ? "text-mint" : "text-white/40"}`}>
                    {tab.label}
                  </span>

                  {/* Active Indicator Dot below text label */}
                  <div className="h-1.5 w-1.5 mt-1 flex justify-center items-center">
                    {isActive && (
                      <motion.div
                        layoutId="active-indicator-mobile"
                        className="h-1 w-1 rounded-full bg-mint shadow-[0_0_6px_#8FFFD1]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mx-3 flex h-fit w-fit items-end gap-3 rounded-[24px] border border-[#404040]/70 bg-[#000000a6] p-2.5 backdrop-blur-xl transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-auto shadow-2xl">
            <div className="flex gap-2.5 relative">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const isHovered = hoveredTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    onMouseEnter={() => setHoveredTab(tab.id)}
                    onMouseLeave={() => setHoveredTab(null)}
                    className={`group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border transition-all duration-300 hover:-translate-y-1 cursor-pointer ${isActive
                        ? "border-mint/40 bg-[#191919] text-mint shadow-[0_4px_12px_rgba(143,255,209,0.15),inset_0_1px_3px_rgba(0,0,0,0.4)]"
                        : "border-[#404040]/40 bg-[#191919] text-accent/60 hover:bg-[#222222] hover:text-accent hover:border-accent/20 hover:shadow-[0_4px_12px_rgba(255,255,255,0.02)]"
                      }`}
                  >
                    {/* Sliding tooltip label above dock */}
                    <AnimatePresence>
                      {isHovered && !isMobile && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: -45, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="px-2.5 py-1 bg-[#222222] rounded-lg absolute border border-accent/10 pointer-events-none z-50 shadow-xl"
                        >
                          <p className="text-[10px] font-light font-Spline_Sans_Mono text-mint leading-none uppercase tracking-wider">
                            {tab.label}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Icon */}
                    <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />

                    {/* Active Indicator Dot */}
                    {isActive && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-mint shadow-sm shadow-mint/50"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
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
