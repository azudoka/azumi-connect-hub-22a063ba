import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InfiniteSliderProps {
  children: ReactNode;
  gap?: number;
  duration?: number;
  reverse?: boolean;
  className?: string;
}

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 40,
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ "--gap": `${gap}px`, "--duration": `${duration}s` } as React.CSSProperties}
    >
      <div
        ref={trackRef}
        className={cn(
          "flex w-max",
          reverse ? "animate-infinite-slide-reverse" : "animate-infinite-slide"
        )}
        style={{ gap: `${gap}px` }}
      >
        {/* Two copies so the loop is seamless */}
        <div className="flex shrink-0" style={{ gap: `${gap}px` }}>
          {children}
        </div>
        <div aria-hidden className="flex shrink-0" style={{ gap: `${gap}px` }}>
          {children}
        </div>
      </div>
    </div>
  );
}
