import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ArrowLeft, Copy, Check, MessageSquare, Send, CheckCircle2, Loader2 } from "lucide-react";
import { blogPosts, type BlogPost } from "../data/blogs";
import SpotlightCard from "./SpotlightCard";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

// Lightweight, zero-dependency stateful Markdown-to-HTML Parser for custom styled text
function renderMarkdownContent(text: string) {
  const lines = text.split('\n');
  const blocks: Array<{
    type: 'code' | 'h2' | 'h3' | 'h4' | 'hr' | 'ol' | 'ul' | 'p';
    language?: string;
    content: string;
    items?: string[];
  }> = [];

  let inCodeBlock = false;
  let currentCodeLanguage = "";
  let currentCodeLines: string[] = [];
  
  let currentListType: 'ol' | 'ul' | null = null;
  let currentListItems: string[] = [];

  let shouldStartNewParagraph = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("### Feedback")) {
      break; // Skip the plain text feedback section from markdown rendering
    }

    if (inCodeBlock) {
      if (trimmedLine.startsWith("```")) {
        // End of code block
        blocks.push({
          type: 'code',
          language: currentCodeLanguage,
          content: currentCodeLines.join('\n')
        });
        inCodeBlock = false;
        currentCodeLines = [];
        currentCodeLanguage = "";
      } else {
        currentCodeLines.push(line);
      }
      continue;
    }

    if (trimmedLine.startsWith("```")) {
      // Start of code block
      // If we were building a list, flush it first
      if (currentListType) {
        blocks.push({
          type: currentListType,
          content: '',
          items: currentListItems
        });
        currentListType = null;
        currentListItems = [];
      }
      inCodeBlock = true;
      currentCodeLanguage = trimmedLine.replace("```", "").trim();
      continue;
    }

    // List items check
    const isNumList = /^\d+\.\s+/.test(trimmedLine);
    const isBulletList = trimmedLine.startsWith("* ") || trimmedLine.startsWith("- ");

    if (isNumList) {
      if (currentListType && currentListType !== 'ol') {
        blocks.push({
          type: currentListType,
          content: '',
          items: currentListItems
        });
        currentListItems = [];
      }
      currentListType = 'ol';
      currentListItems.push(trimmedLine.replace(/^\d+\.\s+/, ""));
      continue;
    }

    if (isBulletList) {
      if (currentListType && currentListType !== 'ul') {
        blocks.push({
          type: currentListType,
          content: '',
          items: currentListItems
        });
        currentListItems = [];
      }
      currentListType = 'ul';
      currentListItems.push(trimmedLine.replace(/^[*-]\s+/, ""));
      continue;
    }

    // If we reach here, it's not a list item, so flush any list we were building
    if (currentListType) {
      blocks.push({
        type: currentListType,
        content: '',
        items: currentListItems
      });
      currentListType = null;
      currentListItems = [];
    }

    if (trimmedLine === "---") {
      blocks.push({ type: 'hr', content: '' });
      continue;
    }

    if (trimmedLine.startsWith("#### ")) {
      blocks.push({ type: 'h4', content: trimmedLine.substring(5) });
      continue;
    }

    if (trimmedLine.startsWith("### ")) {
      blocks.push({ type: 'h3', content: trimmedLine.substring(4) });
      continue;
    }

    if (trimmedLine.startsWith("## ")) {
      blocks.push({ type: 'h2', content: trimmedLine.substring(3) });
      continue;
    }

    if (trimmedLine === "") {
      shouldStartNewParagraph = true;
      continue;
    }

    const lastBlock = blocks[blocks.length - 1];
    if (lastBlock && lastBlock.type === 'p' && !shouldStartNewParagraph) {
      lastBlock.content += '\n' + line;
    } else {
      blocks.push({ type: 'p', content: line });
      shouldStartNewParagraph = false;
    }
  }

  // Flush remaining lists or code blocks
  if (inCodeBlock) {
    blocks.push({
      type: 'code',
      language: currentCodeLanguage,
      content: currentCodeLines.join('\n')
    });
  }
  if (currentListType) {
    blocks.push({
      type: currentListType,
      content: '',
      items: currentListItems
    });
  }

  return blocks.map((block, index) => {
    switch (block.type) {
      case 'hr':
        return (
          <hr key={index} className="my-8 border-t border-white/10" />
        );
      
      case 'code':
        return (
          <div key={index} className="my-6 rounded-2xl overflow-hidden border border-white/5 bg-[#05080c]/85 shadow-lg relative group w-full">
            <div className="px-4 py-2 bg-white/[0.01] border-b border-white/5 flex items-center justify-between">
              <span className="font-Spline_Sans_Mono text-[9px] text-accent/35 uppercase tracking-widest">{block.language || "code"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-mint/50 shadow-[0_0_6px_rgba(143,255,209,0.3)]" />
            </div>
            <pre className="p-4 overflow-x-auto font-Spline_Sans_Mono text-[11px] md:text-xs text-mint/85 leading-relaxed max-w-full">
              <code>{block.content}</code>
            </pre>
          </div>
        );

      case 'h4':
        return (
          <h4 key={index} className="font-serif-display text-white/95 text-[15px] md:text-base font-semibold mt-6 mb-3 tracking-tight leading-snug">
            {parseInlineElements(block.content)}
          </h4>
        );

      case 'h3':
        return (
          <h3 key={index} className="font-serif-display text-white/95 text-lg md:text-xl font-medium mt-8 mb-4 tracking-tight leading-snug">
            {parseInlineElements(block.content)}
          </h3>
        );

      case 'h2':
        return (
          <h2 key={index} className="font-serif-display text-white/95 text-xl md:text-2xl font-medium mt-10 mb-5 tracking-tight leading-snug">
            {parseInlineElements(block.content)}
          </h2>
        );

      case 'ol':
        return (
          <ol key={index} className="my-4 flex flex-col gap-2.5 pl-5 list-decimal">
            {block.items?.map((item, itemIdx) => (
              <li key={itemIdx} className="text-accent/75 text-[14px] md:text-[15px] font-normal leading-relaxed pl-1">
                {parseInlineElements(item)}
              </li>
            ))}
          </ol>
        );

      case 'ul':
        return (
          <ul key={index} className="my-4 flex flex-col gap-2.5 pl-2">
            {block.items?.map((item, itemIdx) => (
              <li key={itemIdx} className="text-accent/75 text-[14px] md:text-[15px] font-normal leading-relaxed flex items-start gap-3">
                <span className="text-mint mt-1.5 shrink-0 text-[8px]">▪</span>
                <span>{parseInlineElements(item)}</span>
              </li>
            ))}
          </ul>
        );

      case 'p':
        return (
          <p key={index} className="text-accent/75 text-[14px] md:text-[15px] font-normal leading-[1.8] my-3.5 max-w-[75ch]">
            {parseInlineElements(block.content)}
          </p>
        );

      default:
        return null;
    }
  });
}

// Helper to parse bold, inline code, and markdown links
function parseInlineElements(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let currentText = text;
  let keyIdx = 0;

  // Regex patterns
  const boldRegex = /\*\*([^*]+)\*\*/;
  const codeRegex = /`([^`]+)`/;
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/;

  while (currentText.length > 0) {
    const boldMatch = boldRegex.exec(currentText);
    const codeMatch = codeRegex.exec(currentText);
    const linkMatch = linkRegex.exec(currentText);

    // Find the earliest match
    const matches = [
      { type: "bold", index: boldMatch ? boldMatch.index : -1, match: boldMatch },
      { type: "code", index: codeMatch ? codeMatch.index : -1, match: codeMatch },
      { type: "link", index: linkMatch ? linkMatch.index : -1, match: linkMatch }
    ].filter(m => m.index !== -1);

    if (matches.length === 0) {
      parts.push(<span key={keyIdx++}>{currentText}</span>);
      break;
    }

    matches.sort((a, b) => a.index - b.index);
    const earliest = matches[0];

    // Push preceding text
    if (earliest.index > 0) {
      parts.push(<span key={keyIdx++}>{currentText.substring(0, earliest.index)}</span>);
    }

    // Push formatted element
    if (earliest.type === "bold" && earliest.match) {
      parts.push(<strong key={keyIdx++} className="text-white/90 font-semibold">{parseInlineElements(earliest.match[1])}</strong>);
      currentText = currentText.substring(earliest.index + earliest.match[0].length);
    } else if (earliest.type === "code" && earliest.match) {
      parts.push(
        <code key={keyIdx++} className="px-1.5 py-0.5 bg-white/[0.04] border border-white/5 text-mint font-Spline_Sans_Mono text-[11px] rounded">
          {earliest.match[1]}
        </code>
      );
      currentText = currentText.substring(earliest.index + earliest.match[0].length);
    } else if (earliest.type === "link" && earliest.match) {
      parts.push(
        <a 
          key={keyIdx++} 
          href={earliest.match[2]} 
          target="_blank" 
          rel="noreferrer" 
          className="text-mint hover:underline hover:text-highlight transition-colors duration-200"
        >
          {parseInlineElements(earliest.match[1])}
        </a>
      );
      currentText = currentText.substring(earliest.index + earliest.match[0].length);
    }
  }

  return parts;
}

function FeedbackWidget({ blogTitle, blogSlug }: { blogTitle: string; blogSlug: string }) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [reaction, setReaction] = useState<string | null>(null);
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const reactions = [
    { label: "Mindblown", emoji: "💡", id: "mindblown" },
    { label: "Aha Moment", emoji: "🚀", id: "aha" },
    { label: "Super Useful", emoji: "🛠️", id: "useful" },
    { label: "Bookmark", emoji: "🧠", id: "bookmark" }
  ];

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !note || !reaction) return;
    setState('submitting');

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
          name: name,
          email: "sxmxd.1825@gmail.com",
          subject: `Blog Feedback [${reaction.toUpperCase()}] - ${blogTitle}`,
          message: `Article: ${blogTitle} (${blogSlug})\nReaction: ${reaction}\nUser: ${name}\n\nFeedback:\n${note}`,
          from_name: "Samad Portfolio Blog Bot",
        }),
      });

      const result = await response.json();
      if (result.success) {
        setState('success');
        setName("");
        setNote("");
        setReaction(null);
      } else {
        setState('error');
      }
    } catch (err) {
      console.error(err);
      setState('error');
    }
  };

  return (
    <SpotlightCard
      className="w-full mt-16 p-6 md:p-8 rounded-3xl border border-white/5 bg-white/[0.01] backdrop-blur-xl relative overflow-hidden group spotlight-card-glow"
      glowColor="rgba(var(--theme-mint-rgb), 0.08)"
      hoverBorderColor="rgba(var(--theme-mint-rgb), 0.45)"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-2xl bg-mint/10 border border-mint/20 text-mint">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif-display text-white text-lg md:text-xl font-medium tracking-tight">
            Share Your Decryption Notes
          </h3>
          <p className="text-accent/40 text-[10px] font-Spline_Sans_Mono uppercase tracking-widest mt-0.5">
            // Telemetry feedback protocol
          </p>
        </div>
      </div>

      {state === 'success' ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 rounded-full bg-mint/10 border border-mint/30 flex items-center justify-center text-mint mb-4 shadow-[0_0_15px_rgba(143,255,209,0.2)]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-white font-medium text-base mb-1">Feedback Packet Encrypted & Sent!</h4>
          <p className="text-accent/60 text-xs max-w-[34ch] leading-relaxed">
            Your telemetry has been successfully routed. Thanks for contributing to the knowledge base.
          </p>
          <button 
            type="button"
            onClick={() => setState('idle')} 
            className="mt-6 px-4 py-2 rounded-xl border border-white/10 hover:border-mint/30 hover:bg-mint/5 text-accent/60 hover:text-mint text-[10px] font-Spline_Sans_Mono uppercase tracking-wider transition-all duration-300 cursor-pointer hover:shadow-[0_0_15px_rgba(143,255,209,0.2)]"
          >
            Send Another Packet
          </button>
        </div>
      ) : (
        <form onSubmit={handleSendFeedback} className="flex flex-col gap-6">
          {/* Reaction Tag Pills */}
          <div>
            <label className="text-[10px] font-Spline_Sans_Mono text-accent/35 uppercase tracking-wider block mb-3">
              How do you rate this decryption?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {reactions.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setReaction(r.id)}
                  className={`flex items-center justify-center gap-2 px-3 py-3 rounded-2xl border text-xs font-light transition-all duration-300 cursor-pointer
                    ${reaction === r.id 
                      ? "bg-mint/10 border-mint/50 text-mint shadow-[0_0_15px_rgba(143,255,209,0.15)] font-normal" 
                      : "bg-white/[0.01] border-white/5 text-accent/50 hover:text-white hover:border-white/10 hover:bg-white/[0.02]"
                    }`}
                >
                  <span className="text-sm">{r.emoji}</span>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Identity Info */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-Spline_Sans_Mono text-accent/35 uppercase tracking-wider">
                Identity Handle
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. developer_404"
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-mint/50 focus:shadow-[0_0_15px_rgba(143,255,209,0.1)] text-xs font-light transition-all duration-300 focus:bg-black/60"
                required
              />
            </div>

            {/* Note Area */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-Spline_Sans_Mono text-accent/35 uppercase tracking-wider">
                Feedback Message
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                placeholder="Share your thoughts, questions, or optimization findings..."
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-mint/50 focus:shadow-[0_0_15px_rgba(143,255,209,0.1)] text-xs font-light leading-relaxed resize-none transition-all duration-300 focus:bg-black/60"
                required
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-5 mt-2">
            <p className="text-[11px] text-accent/35 font-light text-center sm:text-left leading-relaxed">
              Verify credentials on my <a href="https://samadshaikh.me" target="_blank" rel="noreferrer" className="text-mint hover:underline font-normal">Resume Portal</a> or contact me directly in the <a href="https://linkedin.com/in/samad-ai" target="_blank" rel="noreferrer" className="text-mint hover:underline font-normal">Connect page</a>.
            </p>
            
            <button
              type="submit"
              disabled={state === 'submitting' || !reaction || !name || !note}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-mint/20 bg-mint/5 hover:bg-mint hover:text-black hover:shadow-[0_0_20px_rgba(143,255,209,0.35)] text-mint text-[11px] font-Spline_Sans_Mono uppercase tracking-wider transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            >
              {state === 'submitting' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Streaming Data...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Feedback</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </SpotlightCard>
  );
}

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const contentRef = useRef<HTMLDivElement>(null);

  // Filter Categories
  const categories = ["All", "AI", "WebDev", "Backend", "SEO", "AppSec", "DevOps"];
  const filteredPosts = activeCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  // Dynamic SEO & Structured Data Schema Injection
  useEffect(() => {
    if (selectedPost) {
      // Store original headers
      const prevTitle = document.title;
      let metaDescEl = document.querySelector('meta[name="description"]');
      if (!metaDescEl) {
        metaDescEl = document.createElement("meta");
        metaDescEl.setAttribute("name", "description");
        document.head.appendChild(metaDescEl);
      }
      const prevDesc = metaDescEl.getAttribute("content") || "";

      // Set custom title and description
      document.title = `${selectedPost.title} | Samad Shaikh`;
      metaDescEl.setAttribute("content", selectedPost.metaDescription || selectedPost.excerpt);

      // Dynamic injection of JSON-LD Schema
      let schemaScript = document.getElementById("jsonld-blog-post") as HTMLScriptElement | null;
      if (!schemaScript) {
        schemaScript = document.createElement("script");
        schemaScript.id = "jsonld-blog-post";
        schemaScript.type = "application/ld+json";
        document.head.appendChild(schemaScript);
      }

      // Format date safely for schema markup
      let isoDate = "2026-06-05";
      try {
        const parsedDate = new Date(selectedPost.date);
        if (!isNaN(parsedDate.getTime())) {
          isoDate = parsedDate.toISOString().split("T")[0];
        }
      } catch (e) {
        // Fallback
      }

      const blogSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": selectedPost.title,
        "description": selectedPost.metaDescription || selectedPost.excerpt,
        "datePublished": isoDate,
        "author": {
          "@type": "Person",
          "name": "Samad Shaikh",
          "url": "https://www.samadshaikh.dev"
        },
        "publisher": {
          "@type": "Person",
          "name": "Samad Shaikh",
          "url": "https://www.samadshaikh.dev",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.samadshaikh.dev/Samad_Portrait.jpeg"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${window.location.origin}/?blog=${selectedPost.slug}`
        },
        "keywords": selectedPost.tags.join(", ")
      };

      schemaScript.textContent = JSON.stringify(blogSchema);

      // Cleanup
      return () => {
        document.title = prevTitle;
        if (metaDescEl) {
          metaDescEl.setAttribute("content", prevDesc);
        }
        const scriptToCleanup = document.getElementById("jsonld-blog-post");
        if (scriptToCleanup) {
          scriptToCleanup.remove();
        }
      };
    }
  }, [selectedPost]);

  // Monitor reading scroll progress
  useEffect(() => {
    if (!selectedPost) {
      setScrollProgress(0);
      return;
    }

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress((window.scrollY / docHeight) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedPost]);

  const handleCopyLink = () => {
    if (!selectedPost) return;
    const url = `${window.location.origin}/?blog=${selectedPost.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareSocial = (platform: "linkedin" | "twitter") => {
    if (!selectedPost) return;
    const url = encodeURIComponent(`${window.location.origin}/?blog=${selectedPost.slug}`);
    const title = encodeURIComponent(selectedPost.title);
    
    let shareUrl = "";
    if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    } else if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    }
    
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="w-full max-w-5xl px-4 md:px-6 flex flex-col pb-0 mt-8 gap-0">
      
      {/* Scroll Progress Bar for Active Reader */}
      {selectedPost && (
        <div className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-mint via-highlight to-mint z-[100] transition-all duration-75" style={{ width: `${scrollProgress}%` }} />
      )}

      <AnimatePresence mode="wait">
        {!selectedPost ? (
          /* ══════════════════════════════════════
              BLOGS LIST VIEW
             ══════════════════════════════════════ */
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease }}
            className="w-full flex flex-col"
          >
            {/* Header block */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <p className="font-Spline_Sans_Mono text-[11px] tracking-[0.3em] uppercase text-white/20 mb-4 select-none">
                  // Blogs & Insights
                </p>
                <h1 className="font-serif-display font-medium text-4xl sm:text-5xl md:text-[3.5rem] leading-[1.08] tracking-tight text-white/90">
                  Read My
                  <br />
                  <span className="italic font-light text-white/45">blueprints.</span>
                </h1>
              </div>

              <div className="md:max-w-[38ch] md:pb-1">
                <p className="text-white/35 text-[13px] font-light leading-[1.85]">
                  Factual writeups, problem-solving guidelines, and case studies detailing modern code architectures.
                </p>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-10 border-b border-white/5 pb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full font-Spline_Sans_Mono text-[10px] tracking-wider uppercase border transition-all duration-300 cursor-pointer
                    ${activeCategory === cat 
                      ? "bg-mint/10 border-mint/30 text-mint shadow-[0_0_12px_rgba(143,255,209,0.06)]" 
                      : "bg-white/[0.01] border-white/5 text-accent/40 hover:text-white/80 hover:border-white/10"
                    }`}
                >
                  {cat === "All" ? "All Protocols" : cat}
                </button>
              ))}
              <span className="text-[10px] font-Spline_Sans_Mono text-accent/20 ml-auto tracking-widest hidden sm:inline select-none">
                DECRYPTING: {filteredPosts.length} MODULES
              </span>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-28">
              {filteredPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <SpotlightCard
                    className="h-full"
                    contentClassName="p-6 flex flex-col gap-5 w-full h-full justify-between"
                    glowColor="rgba(var(--theme-mint-rgb), 0.03)"
                    hoverBorderColor="rgba(var(--theme-mint-rgb), 0.35)"
                  >
                    <div className="flex flex-col gap-3">
                      {/* Pill + category */}
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md text-[9px] font-Spline_Sans_Mono tracking-widest text-mint border border-mint/20 bg-mint/[0.03] uppercase">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-accent/30 text-[10px] font-Spline_Sans_Mono">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="font-serif-display text-white/90 text-lg md:text-xl font-medium tracking-tight mt-1 leading-snug group-hover:text-glow-mint transition-colors duration-300">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-accent/45 text-xs font-light leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Metadata & Trigger */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                      <span className="text-[10px] font-Spline_Sans_Mono text-accent/25 tracking-widest uppercase">
                        {post.date}
                      </span>
                      <span className="text-xs font-Spline_Sans_Mono text-mint tracking-wider flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                        Read Blueprint <span className="translate-x-0 group-hover:translate-x-1 transition-transform duration-200">→</span>
                      </span>
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ══════════════════════════════════════
              BLOG DETAIL READING VIEW
             ══════════════════════════════════════ */
          <motion.article
            key="reader"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease }}
            className="w-full flex flex-col mb-32"
          >
            {/* Return navigation breadcrumb */}
            <button
              onClick={() => setSelectedPost(null)}
              className="flex items-center gap-2.5 text-mint/60 hover:text-mint text-[11px] font-Spline_Sans_Mono tracking-wider uppercase mr-auto mb-10 group bg-transparent border-0 cursor-pointer outline-none"
            >
              <ArrowLeft className="w-4 h-4 translate-x-0 group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Back to Blueprints</span>
            </button>

            {/* Article header details */}
            <header className="flex flex-col gap-4 mb-8">
              <div className="flex flex-wrap items-center gap-4">
                <span className="px-3 py-1 rounded-md text-[10px] font-Spline_Sans_Mono tracking-widest text-mint border border-mint/20 bg-mint/[0.03] uppercase">
                  {selectedPost.category}
                </span>
                <div className="flex items-center gap-1.5 text-accent/30 text-xs font-Spline_Sans_Mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedPost.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-accent/30 text-xs font-Spline_Sans_Mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedPost.readTime}</span>
                </div>
              </div>

              <h1 className="font-serif-display text-white/95 text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-[1.15] max-w-[28ch] mt-2">
                {selectedPost.title}
              </h1>
            </header>

            {/* Card separator divider with neon accent */}
            <div className="w-full h-px relative overflow-hidden mb-10">
              <div className="absolute inset-0 bg-gradient-to-r from-mint/20 via-white/10 to-transparent" />
            </div>

            {/* Grid Layout: Left Column = Article text, Right Column = floating share toolbox */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Primary Article Body */}
              <div ref={contentRef} className="lg:col-span-9 flex flex-col font-sans">
                {renderMarkdownContent(selectedPost.content)}
                <FeedbackWidget blogTitle={selectedPost.title} blogSlug={selectedPost.slug} />
              </div>

              {/* Sidebar toolbox (Social share and link copy) */}
              <div className="lg:col-span-3 lg:sticky lg:top-28 flex flex-col gap-4 p-5 rounded-2xl border border-white/5 bg-black/35 backdrop-blur-xl">
                <p className="font-Spline_Sans_Mono text-[10px] text-accent/30 tracking-widest uppercase mb-1">
                  Share Protocol
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleShareSocial("linkedin")}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:border-mint/20 hover:bg-mint/[0.02] text-accent/60 hover:text-white text-xs font-light transition-all duration-300 cursor-pointer outline-none"
                  >
                    <svg className="w-4 h-4 text-mint/60 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    <span>LinkedIn</span>
                  </button>
                  <button
                    onClick={() => handleShareSocial("twitter")}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:border-mint/20 hover:bg-mint/[0.02] text-accent/60 hover:text-white text-xs font-light transition-all duration-300 cursor-pointer outline-none"
                  >
                    <svg className="w-4 h-4 text-mint/60 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>Twitter / X</span>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:border-mint/20 hover:bg-mint/[0.02] text-accent/60 hover:text-white text-xs font-light transition-all duration-300 cursor-pointer outline-none"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-mint animate-scaleIn" />
                        <span className="text-mint font-medium">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-mint/60" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom floating helper trigger */}
            <div className="w-full h-px relative overflow-hidden mt-16 mb-10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <button
              onClick={() => {
                setSelectedPost(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-full border border-mint/20 bg-mint/5 hover:bg-mint hover:text-black hover:shadow-[0_0_15px_rgba(143,255,209,0.12)] text-mint text-xs font-Spline_Sans_Mono uppercase tracking-wider transition-all duration-300 cursor-pointer outline-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Blueprints</span>
            </button>
          </motion.article>
        )}
      </AnimatePresence>

    </div>
  );
}
