import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  isTyping?: boolean;
}

const qaData = [
  {
    keywords: ["skill", "tech", "languages", "frameworks", "stack"],
    answer: `**Samad's Technical Stack Categories:**
1. **Frontend**: React 19, Next.js, TypeScript, Tailwind CSS v4, Zustand.
2. **Backend**: FastAPI, Python Asyncio, Tornado, Node.js, RESTful APIs.
3. **AI & Agents**: Large Language Model Orchestration, Retrieval-Augmented Generation (RAG), Prompt Engineering, Agentic Workflows.
4. **Data & Cloud**: PostgreSQL, AWS, Azure, Google Cloud, Docker, CI/CD.
5. **Security & Practices**: SOLID, OOP, AppSec, Clean Architecture.`,
  },
  {
    keywords: ["mockmate", "interview", "ai product"],
    answer: `**MockMate AI** is an AI-powered interview practice platform built by Samad.
It leverages **Gemini Pro** to conduct mock interviews, evaluate resume relevance, analyze vocal/written communication, and deliver deep, personalized feedback reports to prepare developers for real job trials.`,
  },
  {
    keywords: ["planora", "planner", "social media"],
    answer: `**Planora** is a social media content planner that coordinates content pipelines, calendar schedulers, and post queues. It uses **Zustand** for state, and **Supabase** for database backing.`,
  },
  {
    keywords: ["weblens", "developer tool", "analysis"],
    answer: `**WebLens** is an accessibility and speed analysis platform that hooks into the PageSpeed API. It generates interactive visual reports using **Recharts** to guide developers on site speed, SEO, and quality compliance.`,
  },
  {
    keywords: ["legalease", "legal", "saas"],
    answer: `**LegalEase** is a legal contract analyzer SaaS that translates complex legal language into plain terms. It uses **FastAPI** with **spaCy** NLP models and **Hugging Face** to parse clauses and verify compliance.`,
  },
  {
    keywords: ["clientsync", "crm", "portal"],
    answer: `**ClientSync** is a custom client portal and CRM designed to align customer data, project milestones, and messaging boards. It is built using **React**, **Django**, and **PostgreSQL**.`,
  },
  {
    keywords: ["smartmeet", "assistant", "summarizer"],
    answer: `**SmartMeet** is an AI meeting summarizer and task planner. It automatically processes transcription logs, extracts key action items, and schedules follow-up cards. Powered by **FastAPI** and **spaCy**.`,
  },
  {
    keywords: ["contact", "email", "hire", "github", "linkedin", "social"],
    answer: `**Reach out to Samad Shaikh:**
*   **Email**: [contact@samadshaikh.dev](mailto:contact@samadshaikh.dev)
*   **LinkedIn**: [linkedin.com/in/samad-ai](https://linkedin.com/in/samad-ai)
*   **GitHub**: [github.com/The-Syntax-Slayer](https://github.com/The-Syntax-Slayer)
*   **Availability**: Open for freelance projects, AI integrations, and full-time software engineering roles.`,
  },
  {
    keywords: ["work", "freelance", "opportunity", "job", "status"],
    answer: `Samad is currently **available** for freelance projects, AI integration consulting, and full-time software engineer roles. He specializes in connecting robust Full-Stack apps with LLM workflows.`,
  },
];

const suggestions = [
  "What are your core tech skills?",
  "Tell me about MockMate AI.",
  "Are you open to new projects?",
  "How can I contact you?",
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! I'm Samad's AI Assistant. Ask me anything about his technical skills, projects, resume, or availability!",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: queryText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                ...messages
                  .filter((m) => m.id !== "welcome")
                  .map((m) => ({
                    role: m.sender === "bot" ? "model" : "user",
                    parts: [{ text: m.text }],
                  })),
                {
                  role: "user",
                  parts: [{ text: queryText }],
                },
              ],
              systemInstruction: {
                parts: [
                  {
                    text: `You are SyntaxAgent, Samad's AI Assistant on his developer portfolio. Answer questions briefly (1-3 sentences) and professionally in first-person as Samad's representative.
Here is your professional context:
- Name: Samad Shaikh
- Role: Software Engineer & AI Specialist (Mumbai, India)
- Core stack: React 19, Next.js, TypeScript, Tailwind CSS v4, Python, FastAPI, Asyncio, Tornado, PostgreSQL, AWS, Docker, AppSec.
- Focus: Building SaaS platforms and integrating Generative AI & agentic LLM workflows.
- Projects:
  1. MockMate AI: AI mock interviews & resume feedback platform.
  2. Planora: Social media content scheduler and pipeline planner.
  3. WebLens: Website performance, SEO & quality validator.
  4. LegalEase: AI legal language simplification SaaS.
  5. ClientSync: CRM project workflow console.
  6. SmartMeet: AI meeting summarizer and task planner.
- Contact: Email (contact@samadshaikh.dev), GitHub (github.com/The-Syntax-Slayer), LinkedIn (linkedin.com/in/samad-ai).
- Availability: Open for freelance projects, AI integration consulting, and full-time software engineering roles.`,
                  },
                ],
              },
            }),
          }
        );

        const data = await response.json();
        const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
          "I experienced an issue fetching that response. Please write to Samad at contact@samadshaikh.dev!";

        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: "bot",
            text: botText,
          },
        ]);
        return;
      } catch (err) {
        console.error("Gemini API call failed, falling back to local NLP:", err);
      }
    }

    // Fallback local NLP query matching
    setTimeout(() => {
      const normalized = queryText.toLowerCase();
      let matchedAnswer = "";

      for (const entry of qaData) {
        if (entry.keywords.some((keyword) => normalized.includes(keyword))) {
          matchedAnswer = entry.answer;
          break;
        }
      }

      if (!matchedAnswer) {
        matchedAnswer = "I'm not fully sure about that detail, but I'd be happy to connect you with Samad! You can write to him directly at [contact@samadshaikh.dev](mailto:contact@samadshaikh.dev) or connect on [LinkedIn](https://linkedin.com/in/samad-ai).";
      }

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "bot",
          text: matchedAnswer,
        },
      ]);
    }, 900);
  };

  return (
    <div className="fixed top-auto bottom-24 right-6 md:bottom-auto md:top-12 md:right-8 z-40 flex flex-col gap-3 items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-12 top-auto right-0 md:bottom-auto md:top-12 w-[calc(100vw-3rem)] sm:w-80 h-[480px] bg-black/85 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden font-sans text-left"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-mint/10 border border-mint/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-mint text-glow-mint" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white tracking-wide leading-none">SyntaxAgent</h4>
                  <span className="text-[9px] text-[#B0FF92] font-Spline_Sans_Mono font-medium tracking-wide">● ONLINE</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/[0.04] border border-transparent hover:border-white/10 flex items-center justify-center text-accent/60 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body Logs */}
            <div 
              ref={containerRef}
              className="flex-grow overflow-y-auto p-4 flex flex-col gap-4 scrollbar-hide"
            >
              {messages.map((msg) => {
                const isBot = msg.sender === "bot";
                return (
                  <div 
                    key={msg.id}
                    className={`flex items-start gap-2.5 max-w-[85%] ${isBot ? "self-start" : "self-end flex-row-reverse"}`}
                  >
                    <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center border text-[10px] ${
                      isBot 
                        ? "bg-mint/5 border-mint/20 text-mint" 
                        : "bg-white/5 border-white/10 text-white"
                    }`}>
                      {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>

                    <div className={`p-3 rounded-2xl text-[12px] leading-relaxed font-light ${
                      isBot 
                        ? "bg-white/[0.02] border border-white/5 text-accent/90" 
                        : "bg-mint/5 border border-mint/20 text-white"
                    }`}>
                      {/* Formatted links/bolding styling */}
                      <div 
                        className="prose prose-sm prose-invert select-text"
                        dangerouslySetInnerHTML={{ 
                          __html: formatMarkdown(msg.text) 
                        }} 
                      />
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start gap-2.5 self-start">
                  <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center bg-mint/5 border border-mint/20 text-mint">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-3 px-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-mint animate-bounce" style={{ animationDelay: "0s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-mint animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-mint animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions Chips */}
            <div className="px-4 py-2 flex gap-1.5 overflow-x-auto scrollbar-hide shrink-0 border-t border-white/5 bg-white/[0.01]">
              {suggestions.map((sug) => (
                <button
                  key={sug}
                  onClick={() => handleQuery(sug)}
                  className="px-3 py-1.5 bg-white/[0.02] border border-white/5 hover:border-mint/30 hover:bg-mint/5 rounded-full text-[10px] text-accent/60 hover:text-mint whitespace-nowrap transition-all duration-300 cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Form Input Footer */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleQuery(inputVal);
              }}
              className="p-3 border-t border-white/10 bg-white/[0.02] flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                placeholder="Ask me a question..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                aria-label="Ask a question"
                className="flex-grow bg-white/[0.02] border border-white/5 focus:border-mint rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                aria-label="Submit query"
                className="w-9 h-9 rounded-xl bg-mint/5 border border-mint/20 hover:bg-mint/10 flex items-center justify-center text-mint hover:text-white disabled:opacity-30 disabled:hover:bg-mint/5 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Assistant"
        className={`w-9 h-9 rounded-xl border border-white/10 bg-black/40 hover:bg-white/5 hover:border-white/20 flex items-center justify-center text-accent/60 hover:text-white transition-all duration-300 shadow-md cursor-pointer relative shrink-0 ${
          isOpen
            ? "border-mint bg-mint/5 text-mint rotate-90"
            : "border-white/10 hover:border-white/20 text-accent/80 hover:text-mint hover:-translate-y-0.5"
        }`}
        style={{ color: isOpen ? "var(--theme-mint)" : undefined, borderColor: isOpen ? "var(--theme-mint)" : undefined }}
      >
        {/* Pulsing indicator dot */}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-mint animate-pulse shadow-[0_0_6px_var(--theme-mint)]" />
        )}
        <MessageSquare className="w-4 h-4" />
      </button>
    </div>
  );
}

// Lightweight function to format rich links/markdown syntax to simple HTML
function formatMarkdown(text: string): string {
  let html = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // italic
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-mint hover:underline font-medium">$1</a>'); // links
    
  // Format line breaks
  html = html.replace(/\n/g, "<br />");
  return html;
}
