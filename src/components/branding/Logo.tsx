import React from "react";

interface LogoProps {
  concept?: "concept1" | "concept2" | "concept3";
  variant?: "full" | "icon" | "monochrome";
  brandNameEn?: string;
  brandNameFa?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showPersian?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  concept = "concept1",
  variant = "full",
  brandNameEn = "Qone Research",
  brandNameFa = "کیو‌وان ریسرچ",
  className = "",
  size = "md",
  showPersian = true,
}) => {
  const sizeMap = {
    sm: { icon: 30, textEn: "text-base", textFa: "text-xs", height: "h-8" },
    md: { icon: 38, textEn: "text-lg", textFa: "text-xs", height: "h-10" },
    lg: { icon: 48, textEn: "text-xl", textFa: "text-sm", height: "h-12" },
    xl: { icon: 64, textEn: "text-2xl", textFa: "text-base", height: "h-16" },
  };

  const currentSize = sizeMap[size];
  const isMono = variant === "monochrome";

  // SVG Definitions for the 3 distinct concepts
  const renderIcon = () => {
    switch (concept) {
      case "concept2":
        // Concept 2: Minimalist Knowledge & Tech Core (Isometric research facets)
        return (
          <svg
            width={currentSize.icon}
            height={currentSize.icon}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 transition-transform duration-300 hover:scale-105"
          >
            <defs>
              <linearGradient id="c2-grad1" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={isMono ? "#0F172A" : "#4F46E5"} />
                <stop offset="100%" stopColor={isMono ? "#334155" : "#06B6D4"} />
              </linearGradient>
              <linearGradient id="c2-grad2" x1="10" y1="80" x2="90" y2="20" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={isMono ? "#1E293B" : "#2563EB"} />
                <stop offset="100%" stopColor={isMono ? "#475569" : "#38BDF8"} />
              </linearGradient>
            </defs>
            {/* Base Left Page */}
            <path
              d="M 50 15 L 20 32 L 20 68 L 50 85 Z"
              fill={isMono ? "#1E293B" : "url(#c2-grad1)"}
              opacity="0.9"
            />
            {/* Right Page with Tech Cutouts */}
            <path
              d="M 50 15 L 80 32 L 80 68 L 50 85 Z"
              fill={isMono ? "#334155" : "url(#c2-grad2)"}
              opacity="0.8"
            />
            {/* Center Quill / Research Axis */}
            <path
              d="M 50 10 L 53 45 L 50 78 L 47 45 Z"
              fill="#FFFFFF"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
            />
            {/* Floating Spark / Scientific Node */}
            <circle cx="50" cy="18" r="4" fill="#FFFFFF" />
            <circle cx="70" cy="45" r="2.5" fill="#FFFFFF" opacity="0.8" />
            <circle cx="30" cy="55" r="2.5" fill="#FFFFFF" opacity="0.8" />
          </svg>
        );

      case "concept3":
        // Concept 3: Futuristic Abstract Research Mark (Quantum Infinity Orbit)
        return (
          <svg
            width={currentSize.icon}
            height={currentSize.icon}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 transition-transform duration-300 hover:scale-105"
          >
            <defs>
              <linearGradient id="c3-orb1" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={isMono ? "#0F172A" : "#6366F1"} />
                <stop offset="50%" stopColor={isMono ? "#1E293B" : "#4F46E5"} />
                <stop offset="100%" stopColor={isMono ? "#334155" : "#06B6D4"} />
              </linearGradient>
              <linearGradient id="c3-glow" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Outer Orbit */}
            <path
              d="M 50 15 C 72 15 88 28 88 50 C 88 72 68 85 46 85 C 24 85 12 72 12 50 C 12 28 32 15 50 15 Z"
              stroke={isMono ? "#1E293B" : "url(#c3-orb1)"}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray="180 30"
            />
            {/* Inner Diagonal Infinity Cross */}
            <path
              d="M 28 28 Q 50 50 72 72 M 72 28 Q 50 50 35 68"
              stroke={isMono ? "#334155" : "url(#c3-orb1)"}
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* Central Node */}
            <circle cx="50" cy="50" r="7" fill={isMono ? "#0F172A" : "#06B6D4"} />
            <circle cx="50" cy="50" r="3.5" fill="#FFFFFF" />
            <circle cx="78" cy="30" r="4" fill={isMono ? "#1E293B" : "#4F46E5"} />
          </svg>
        );

      case "concept1":
      default:
        // Concept 1: Modern Geometric Q with Scientific Research Beam
        return (
          <svg
            width={currentSize.icon}
            height={currentSize.icon}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 transition-transform duration-300 hover:scale-105"
          >
            <defs>
              <linearGradient id="c1-ring" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={isMono ? "#0F172A" : "#4F46E5"} />
                <stop offset="70%" stopColor={isMono ? "#1E293B" : "#2563EB"} />
                <stop offset="100%" stopColor={isMono ? "#334155" : "#06B6D4"} />
              </linearGradient>
              <linearGradient id="c1-core" x1="30" y1="30" x2="70" y2="70" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={isMono ? "#334155" : "#06B6D4"} />
                <stop offset="100%" stopColor={isMono ? "#0F172A" : "#4F46E5"} />
              </linearGradient>
            </defs>
            {/* Outer Geometric Ring of Q */}
            <circle
              cx="48"
              cy="48"
              r="34"
              stroke={isMono ? "#0F172A" : "url(#c1-ring)"}
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Scientific Light Axis / Tail of Q */}
            <path
              d="M 52 52 L 86 86"
              stroke={isMono ? "#0F172A" : "url(#c1-ring)"}
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Internal Scientific Focus / Atom Nucleus */}
            <circle cx="48" cy="48" r="14" fill={isMono ? "#1E293B" : "url(#c1-core)"} opacity="0.9" />
            <circle cx="48" cy="48" r="6" fill="#FFFFFF" />
            {/* Orbiting Satellite Node */}
            <circle cx="28" cy="30" r="3.5" fill={isMono ? "#475569" : "#06B6D4"} />
          </svg>
        );
    }
  };

  if (variant === "icon") {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderIcon()}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {renderIcon()}
      <div className="flex flex-col text-right justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight ${currentSize.textEn} ${
              isMono
                ? "text-slate-900"
                : "bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-800 bg-clip-text text-transparent"
            }`}
          >
            {brandNameEn}
          </span>
        </div>
        {showPersian && (
          <span className={`text-slate-500 font-medium tracking-normal mt-0.5 ${currentSize.textFa}`}>
            {brandNameFa}
          </span>
        )}
      </div>
    </div>
  );
};
