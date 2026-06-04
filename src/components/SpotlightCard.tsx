import { useRef, type MouseEvent } from "react";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  glowColor?: string; // e.g. "rgba(143, 255, 209, 0.06)"
  borderColor?: string; // e.g. "rgba(24, 31, 47, 0.8)"
  hoverBorderColor?: string; // e.g. "rgba(143, 255, 209, 0.4)"
}

export default function SpotlightCard({
  children,
  className = "",
  contentClassName = "",
  glowColor = "rgba(var(--theme-mint-rgb), 0.05)",
  borderColor = "rgba(24, 31, 47, 0.8)",
  hoverBorderColor = "rgba(var(--theme-mint-rgb), 0.3)",
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden rounded-3xl border border-mint/15 hover:border-mint/50 bg-[#07100D]/95 backdrop-blur-md transition-all duration-500 spotlight-card-glow ${className}`}
      style={{
        ...props.style
      }}
      {...props}
    >
      {/* Cursor-Following Spotlight Background Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{
          background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${glowColor}, transparent 80%)`,
        }}
      />

      {/* Cursor-Following Spotlight Border Glow (Double Mask Border Glow) */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 rounded-3xl"
        style={{
          padding: "1px",
          background: `radial-gradient(250px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${hoverBorderColor}, transparent 80%)`,
          mask: "linear-gradient(#fff 0 0) content-box exclude, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box exclude, linear-gradient(#fff 0 0)",
        }}
      />

      {/* Card Content Wrapper */}
      <div className={`relative z-10 w-full h-full ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
}
