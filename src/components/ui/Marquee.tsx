"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Faixa de texto correndo sem fim. A velocidade acelera com a rolagem e o
 * sentido acompanha a direção do scroll.
 */
export function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const el = track.current;
      if (!el) return;

      // o conteúdo é duplicado: andar -50% volta exatamente ao começo
      const loop = gsap.to(el, {
        xPercent: reverse ? 0 : -50,
        startAt: { xPercent: reverse ? -50 : 0 },
        duration: 28,
        ease: "none",
        repeat: -1,
      });

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = Math.min(Math.abs(self.getVelocity()) / 300, 6);
          gsap.to(loop, { timeScale: (self.direction || 1) * (1 + v), duration: 0.3, overwrite: true });
          gsap.to(loop, { timeScale: self.direction || 1, duration: 1.2, delay: 0.3, overwrite: false });
        },
      });
      return () => st.kill();
    },
    { scope: root }
  );

  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="display px-6 text-[13vw] md:text-[7vw]">{t}</span>
          <span aria-hidden="true" className="text-iris display text-[8vw] md:text-[4vw]">✳</span>
        </span>
      ))}
    </div>
  );

  return (
    <div ref={root} aria-label={items.join(", ")} className="relative z-10 overflow-hidden border-y border-line bg-bg py-4 md:py-6">
      <div ref={track} aria-hidden="true" className="flex w-max">
        {row}
        {row}
      </div>
    </div>
  );
}
