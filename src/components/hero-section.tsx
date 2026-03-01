"use client";

import { AnimatedShaderBackground } from "@/components/animated-shader-background";
import { ExpressCard } from "@/components/express-card";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl min-h-[520px]">
      {/* Shader background */}
      <AnimatedShaderBackground className="rounded-2xl" />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40 z-[1] rounded-2xl" />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-10 flex flex-col justify-center min-h-[520px]">
        <div className="max-w-2xl mx-auto w-full">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
            Прогнозы на сегодня
          </h1>
          <p className="text-sm text-white/60 mb-6">
            AI-анализ на основе Glicko 2 и xG. Автоматический подбор лучших
            событий.
          </p>
          <ExpressCard />
        </div>
      </div>
    </section>
  );
}
