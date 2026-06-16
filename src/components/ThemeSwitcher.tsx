import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette } from "lucide-react";

interface Theme {
  id: string;
  name: string;
  mint: string;
  highlight: string;
  mintRgb: string;
}

const themes: Theme[] = [
  {
    id: "mint",
    name: "Mint Spark",
    mint: "#8FFFD1",
    highlight: "#B0FF92",
    mintRgb: "143, 255, 209",
  },
  {
    id: "pink",
    name: "Cyberpunk Pink",
    mint: "#FF007F",
    highlight: "#FF8F00",
    mintRgb: "255, 0, 127",
  },
  {
    id: "cyan",
    name: "Electric Cyan",
    mint: "#00E5FF",
    highlight: "#9E00FF",
    mintRgb: "0, 229, 255",
  },
  {
    id: "gold",
    name: "Amber Gold",
    mint: "#F59E0B",
    highlight: "#10B981",
    mintRgb: "245, 158, 11",
  },
];

export default function ThemeSwitcher() {
  const [activeTheme, setActiveTheme] = useState("mint");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme");
    if (saved) {
      const found = themes.find((t) => t.id === saved);
      if (found) {
        setActiveTheme(saved);
        applyTheme(found);
      }
    }
  }, []);

  const applyTheme = (theme: Theme) => {
    document.documentElement.style.setProperty("--theme-mint", theme.mint);
    document.documentElement.style.setProperty("--theme-mint-rgb", theme.mintRgb);
    document.documentElement.style.setProperty("--theme-highlight", theme.highlight);
    localStorage.setItem("portfolio-theme", theme.id);
  };

  const handleSelect = (themeId: string) => {
    const found = themes.find((t) => t.id === themeId);
    if (found) {
      setActiveTheme(themeId);
      applyTheme(found);
    }
  };

  return (
    <div className="fixed top-6 right-6 md:right-8 z-40 flex items-center gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 15, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex gap-2.5 px-3 py-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
          >
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleSelect(theme.id)}
                title={theme.name}
                aria-label={`Switch to ${theme.name} theme`}
                className={`w-5 h-5 rounded-full cursor-pointer transition-all duration-300 relative ${
                  activeTheme === theme.id 
                    ? "scale-110 ring-2 ring-white/30 ring-offset-2 ring-offset-black"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: theme.mint }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Customize Accent Color"
        aria-label="Customize Accent Color"
        className="w-9 h-9 rounded-xl border border-white/10 bg-black/40 hover:bg-white/5 hover:border-white/20 flex items-center justify-center text-accent/60 hover:text-white transition-all duration-300 shadow-md cursor-pointer"
        style={{ color: isOpen ? "var(--theme-mint)" : undefined, borderColor: isOpen ? "var(--theme-mint)" : undefined }}
      >
        <Palette className="w-4 h-4" />
      </button>
    </div>
  );
}
