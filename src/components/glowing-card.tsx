"use client";

import { ReactNode } from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

interface GlowingCardProps {
  children: ReactNode;
  className?: string;
  spread?: number;
  proximity?: number;
  blur?: number;
  borderWidth?: number;
  glow?: boolean;
  variant?: "default" | "white";
}

export function GlowingCard({
  children,
  className,
  spread = 40,
  proximity = 64,
  blur = 0,
  borderWidth = 2,
  glow = true,
  variant = "default",
}: GlowingCardProps) {
  return (
    <div className={cn("relative rounded-xl", className)}>
      <GlowingEffect
        spread={spread}
        glow={glow}
        disabled={false}
        proximity={proximity}
        inactiveZone={0.01}
        borderWidth={borderWidth}
        blur={blur}
        variant={variant}
      />
      <div className="relative z-10 rounded-xl border border-border bg-card">
        {children}
      </div>
    </div>
  );
}
