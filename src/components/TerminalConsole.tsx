import { useState, useRef, useEffect } from "react";
import { Terminal, CornerDownLeft } from "lucide-react";

interface LogEntry {
  type: "input" | "output" | "error";
  text: string;
}

const commandsList = {
  help: "Show all available terminal commands.",
  about: "Display a summary bio of Samad Shaikh.",
  skills: "Render a text-based grid of technical capabilities.",
  projects: "List key developed projects and case studies.",
  contact: "Output social links and email details.",
  resume: "Open Samad's official PDF resume in a new tab.",
  secret: "Activate secret system matrix override.",
  clear: "Clear the terminal log history.",
};

const skillOutput = `
===================================================
             TECHNICAL SKILL SPECIFICATION
===================================================
1. FRONTEND:       React 19, Next.js, TypeScript, Tailwind
                   CSS v4, Zustand, Framer Motion, Vite
2. BACKEND & API:  Python, FastAPI, Asyncio, Tornado, Node.js
3. AI & AGENTS:    LLM Integration, RAG, Prompt Engineering
4. DATABASES:      PostgreSQL, Relational Design, SQL Opt
5. CLOUD & DEVOPS: AWS, Azure, GCP, Docker, CI/CD, Git
6. SECURITY:       AppSec, SOLID, OOP, Design Patterns
===================================================
`;

const aboutOutput = `
Samad Shaikh is a Software Engineer, Full-Stack Developer, and
AI Specialist based in Mumbai, India.
He specializes in merging high-performance full-stack architectures
with advanced Generative AI and LLM workflows.
`;

const projectsOutput = `
Key Developed Case Studies:
- [01] MockMate AI: AI Interview practice platform
- [02] Planora: Social media content scheduler
- [03] WebLens: Developer site speed validator
- [04] LegalEase: AI legal language simplification SaaS
- [05] ClientSync: CRM project workflow console
- [06] SmartMeet: AI meeting summaries & planner
`;

const contactOutput = `
Connect with Samad Shaikh:
- Email:    connect@samadshaikh.dev
- GitHub:   github.com/The-Syntax-Slayer
- LinkedIn: linkedin.com/in/samad-ai
`;

export default function TerminalConsole() {
  const [history, setHistory] = useState<LogEntry[]>([
    { type: "output", text: "SYSTEM DIAGNOSTICS: ONLINE" },
    { type: "output", text: "Type 'help' to view available system commands." },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [matrixActive, setMatrixActive] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on console click
  const handleConsoleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Matrix Rain Animation
  useEffect(() => {
    if (!matrixActive) return;
    const canvas = matrixCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 250);

    const columns = Math.floor(width / 12);
    const drops = Array(columns).fill(1);
    const alphabet = "010101XYZ<>!@#$%^&*()_+{}|:<>?";

    const draw = () => {
      ctx.fillStyle = "rgba(5, 5, 5, 0.08)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#8FFFD1"; // Theme mint green
      ctx.font = "10px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * 12, drops[i] * 12);

        if (drops[i] * 12 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 500;
      height = canvas.height = canvas.parentElement?.clientHeight || 250;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [matrixActive]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const command = inputVal.trim().toLowerCase();
    if (!command) return;

    const newLogs: LogEntry[] = [...history, { type: "input", text: inputVal }];

    switch (command) {
      case "help":
        newLogs.push({ type: "output", text: "Available Commands:" });
        Object.entries(commandsList).forEach(([cmd, desc]) => {
          newLogs.push({ type: "output", text: `  ${cmd.padEnd(12)} - ${desc}` });
        });
        break;

      case "about":
        aboutOutput.trim().split("\n").forEach((line) => {
          newLogs.push({ type: "output", text: line });
        });
        break;

      case "skills":
        skillOutput.trim().split("\n").forEach((line) => {
          newLogs.push({ type: "output", text: line });
        });
        break;

      case "projects":
        projectsOutput.trim().split("\n").forEach((line) => {
          newLogs.push({ type: "output", text: line });
        });
        break;

      case "contact":
        contactOutput.trim().split("\n").forEach((line) => {
          newLogs.push({ type: "output", text: line });
        });
        break;

      case "resume":
        newLogs.push({ type: "output", text: "Accessing online Resume..." });
        setTimeout(() => {
          window.open("https://samadshaikh.me", "_blank");
        }, 300);
        break;

      case "secret":
        setMatrixActive(true);
        newLogs.push({ type: "output", text: "OVERRIDE INITIALIZED. ENTERING MATRIX FLOW..." });
        setTimeout(() => {
          setMatrixActive(false);
          setHistory((prev) => [
            ...prev,
            { type: "output", text: "MATRIX OVERRIDE DISCONNECTED. STANDBY." },
          ]);
        }, 6000);
        break;

      case "clear":
        setHistory([]);
        setInputVal("");
        return;

      default:
        newLogs.push({ type: "error", text: `Command not recognized: '${command}'. Type 'help' to see list.` });
        break;
    }

    setHistory(newLogs);
    setInputVal("");
  };

  return (
    <div 
      onClick={handleConsoleClick}
      className="w-full relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[#050505] h-[320px] flex flex-col font-Spline_Sans_Mono select-text cursor-text group hover:border-[#8FFFD1]/35 hover:shadow-[0_0_25px_rgba(143,255,209,0.04)] transition-all duration-300"
    >
      {/* Matrix Overlay canvas */}
      {matrixActive && (
        <canvas 
          ref={matrixCanvasRef} 
          className="absolute inset-0 w-full h-full z-0 opacity-40 pointer-events-none" 
        />
      )}

      {/* Terminal Title Bar */}
      <div className="w-full h-10 border-b border-white/10 bg-[#0A0A0A] px-4 flex justify-between items-center z-10 select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#8FFFD1]" />
          <span className="text-[10px] text-[#A1A1AA] tracking-wider uppercase">core_system_console</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white/[0.04] border border-white/10" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/[0.04] border border-white/10" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#8FFFD1]/20 border border-[#8FFFD1]/30" />
        </div>
      </div>

      {/* Output Console Log area */}
      <div 
        ref={containerRef}
        className="flex-grow overflow-y-auto p-5 flex flex-col gap-1.5 text-xs text-left z-10 scrollbar-hide select-text"
      >
        {history.map((entry, i) => (
          <div key={i} className="leading-relaxed whitespace-pre-wrap select-text">
            {entry.type === "input" && (
              <span className="text-[#A1A1AA] select-text">
                <span className="text-[#8FFFD1] select-none">visitor@samad:~$ </span>
                {entry.text}
              </span>
            )}
            {entry.type === "output" && (
              <span className="text-accent/90 select-text">{entry.text}</span>
            )}
            {entry.type === "error" && (
              <span className="text-red-400 select-text">{entry.text}</span>
            )}
          </div>
        ))}

        {/* Input prompt form */}
        <form onSubmit={handleCommand} className="flex items-center gap-2 mt-1 w-full select-none">
          <span className="text-[#8FFFD1] shrink-0 font-medium">visitor@samad:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            aria-label="Terminal command input"
            className="flex-grow bg-transparent border-none outline-none text-[#8FFFD1] text-xs font-Spline_Sans_Mono caret-mint"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <CornerDownLeft className="w-3.5 h-3.5 text-accent/20 group-hover:text-mint/40 transition-colors shrink-0 mr-1" />
        </form>
      </div>

      {/* Scanline grid overlay */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none opacity-[3%]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #FFFFFF 2px, #FFFFFF 4px)"
        }}
      />
    </div>
  );
}
