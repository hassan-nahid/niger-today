import React from "react";
import { Link } from "react-router";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showText = true,
  className = "",
}) => {
  const sizeConfig = {
    sm: {
      box: "h-7 w-7",
      iconSize: 28,
      textSize: "text-base",
      subText: "text-[9px]",
    },
    md: {
      box: "h-9 w-9",
      iconSize: 36,
      textSize: "text-lg",
      subText: "text-[10px]",
    },
    lg: {
      box: "h-12 w-12",
      iconSize: 48,
      textSize: "text-2xl",
      subText: "text-xs",
    },
  };

  const { box, textSize, subText } = sizeConfig[size];

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Premium Geometric Gradient Emblem */}
      <div
        className={`${box} relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-105`}
      >
        <div className="h-full w-full rounded-[10px] bg-background/90 backdrop-blur-sm flex items-center justify-center p-1.5 transition-colors group-hover:bg-background/80">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
          >
            {/* Modern Interlocking Tech Shield / Prism Node */}
            <path
              d="M12 2L3 7V12C3 17.5228 6.84924 22.4892 12 23.95C17.1508 22.4892 21 17.5228 21 12V7L12 2Z"
              fill="url(#shield-gradient)"
              opacity="0.15"
            />
            <path
              d="M12 2.5L3.5 7.22222V12C3.5 17.2471 7.15678 21.9648 12 23.3524C16.8432 21.9648 20.5 17.2471 20.5 12V7.22222L12 2.5Z"
              stroke="url(#shield-gradient)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 7V17M8.5 10.5L15.5 13.5M15.5 10.5L8.5 13.5"
              stroke="url(#shield-gradient)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="2" fill="url(#shield-gradient)" />
            <defs>
              <linearGradient id="shield-gradient" x1="3" y1="2" x2="21" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366F1" />
                <stop offset="0.5" stopColor="#8B5CF6" />
                <stop offset="1" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className={`font-bold tracking-tight text-foreground ${textSize} leading-none flex items-center`}>
            <span>Auth</span>
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-extrabold ml-0.5">
              Nexus
            </span>
          </div>
          <span className={`text-muted-foreground font-medium uppercase tracking-widest ${subText} mt-0.5`}>
            Secure Identity
          </span>
        </div>
      )}
    </Link>
  );
};
