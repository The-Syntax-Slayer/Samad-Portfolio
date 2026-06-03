import { useState, useEffect, useRef } from "react";
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
  const [isRedirecting, setIsRedirecting] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const progressIntervalRef = useRef<any>(null);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    let currentLogIndex = 0;
    const logInterval = setInterval(() => {
      if (currentLogIndex < bootLogs.length) {
        setLogs((prev) => [...prev, bootLogs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 220);

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 4) + 2;
        return next >= 100 ? 100 : next;
      });
    }, 95);

    return () => {
      clearInterval(logInterval);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Safe progress monitoring side-effects outside of setState callback
  useEffect(() => {
    if (progress >= 100) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setIsRedirecting(true);
      const timer = setTimeout(() => {
        sessionStorage.setItem("portfolio-booted", "true");
        onCompleteRef.current();
      }, 1500); // 1.5 second decryption visual animation
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      exit={{ y: "-100%", opacity: 0.9 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
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

      {/* Spectacular Decryption Scan Visual on Redirect */}
      {isRedirecting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-[#020504] flex flex-col justify-center items-center z-30"
        >
          {/* Scanning Line sweep */}
          <motion.div
            initial={{ y: "-100vh" }}
            animate={{ y: "100vh" }}
            transition={{ duration: 1.4, ease: "linear", repeat: Infinity }}
            className="w-full h-[3px] bg-gradient-to-r from-transparent via-mint to-transparent shadow-[0_0_15px_#8FFFD1] absolute left-0"
          />
          
          {/* Pulse text */}
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center gap-3 text-center px-4"
          >
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
              className="font-Spline_Sans_Mono text-mint text-xs md:text-sm tracking-[0.4em] font-semibold text-glow-mint uppercase"
            >
              ✦ ACCESS GRANTED ✦
            </motion.span>
            
            <motion.span 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6, ease: "easeOut" }}
              className="font-Spline_Sans_Mono text-white text-base md:text-xl tracking-[0.2em] font-bold uppercase my-1"
              style={{ textShadow: "0 0 10px rgba(255, 255, 255, 0.25)" }}
            >
              WELCOME TO SAMAD'S WORKSPACE
            </motion.span>

            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              transition={{ delay: 0.85, duration: 0.5 }}
              className="font-Spline_Sans_Mono text-accent text-[9px] uppercase tracking-[0.25em]"
            >
              INITIALIZING DECRYPTED INTERFACE
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
