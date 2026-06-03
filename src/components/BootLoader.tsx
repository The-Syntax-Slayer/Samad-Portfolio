import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface BootLoaderProps {
  onComplete: () => void;
}

const bootLogs = [
  "SYSTEM_BOOT: SAMAD_SHAIKH_PORTFOLIO [v1.0.0]",
  "--------------------------------------------------",
  "[OK] INITIALIZING STYLES & GLOW BUFFER...",
  "[OK] PACKAGING COMPONENT CORE...",
  "[OK] BOOTSTRAPPING GENAI AGENTS...",
  "[OK] SYNCHRONIZING GEOMETRIC CROWN CORE...",
  "[OK] ESTABLISHING BANDS WAVE NETWORK...",
  "ACCESS GRANTED. WELCOME S. SHAIKH.",
];

export default function BootLoader({ onComplete }: BootLoaderProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("portfolio-booted")) {
      onComplete();
      return;
    }

    let currentLogIndex = 0;
    const logInterval = setInterval(() => {
      if (currentLogIndex < bootLogs.length) {
        setLogs((prev) => [...prev, bootLogs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 150);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            sessionStorage.setItem("portfolio-booted", "true");
            onComplete();
          }, 400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 4;
      });
    }, 80);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  if (sessionStorage.getItem("portfolio-booted")) return null;

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      exit={{ y: "-100%", opacity: 0.9 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 w-screen h-screen bg-[#050505] z-[9999] flex flex-col justify-center items-center px-6 font-Spline_Sans_Mono select-none"
    >
      <div 
        className="absolute inset-0 z-10 pointer-events-none opacity-[3%]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #FFFFFF 2px, #FFFFFF 4px)"
        }}
      />

      <div className="w-full max-w-lg flex flex-col gap-6 text-left relative z-20">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="text-[10px] text-accent/40 tracking-wider ml-2 uppercase">Terminal Session</span>
        </div>

        <div className="min-h-[160px] flex flex-col gap-1.5 text-xs text-accent/80">
          {logs.map((log, i) => {
            const isSuccess = log.includes("[OK]");
            const isGranted = log.includes("GRANTED");
            return (
              <div 
                key={i} 
                className={isGranted ? "text-mint font-semibold text-glow-mint mt-2" : isSuccess ? "text-[#B0FF92]" : ""}
              >
                {log}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 w-full mt-4">
          <div className="flex justify-between items-center text-[10px] text-accent/60 tracking-wider">
            <span>BOOTING CORE SYSTEM</span>
            <span className="text-mint font-bold">{Math.min(100, progress)}%</span>
          </div>
          
          <div className="w-full h-1 bg-white/[0.04] border border-white/10 rounded-full overflow-hidden p-[1px]">
            <motion.div 
              className="h-full rounded-full bg-mint shadow-[0_0_10px_var(--theme-mint)]"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
