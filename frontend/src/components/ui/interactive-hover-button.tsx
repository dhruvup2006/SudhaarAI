import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: "primary" | "secondary" | "outline" | "emerald";
  icon?: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary:
    "bg-white text-zinc-950 border-white hover:bg-zinc-100 shadow-xl hover:shadow-white/10 active:scale-[0.98]",
  secondary:
    "bg-zinc-900/90 text-zinc-100 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 shadow-md active:scale-[0.98]",
  outline:
    "bg-zinc-950/60 text-zinc-300 border-zinc-800 hover:bg-zinc-900 hover:text-white hover:border-zinc-700 active:scale-[0.98]",
  emerald:
    "bg-emerald-500 text-zinc-950 border-emerald-400/60 hover:bg-emerald-400 shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98]",
};

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text, variant = "primary", icon, className, children, ...props }, ref) => {
  const content = children || text || "Button";
  const selectedStyle = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      ref={ref}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2.5 rounded-full border px-6 py-3 text-sm font-semibold tracking-tight transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none",
        selectedStyle,
        className,
      )}
      {...props}
    >
      <span className="inline-flex items-center gap-2 font-sans">{content}</span>
      {icon ? (
        <span className="transition-transform duration-200 group-hover:translate-x-1 shrink-0">
          {icon}
        </span>
      ) : (
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
      )}
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
