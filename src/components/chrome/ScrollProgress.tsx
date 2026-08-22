"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Barra dourada fina no topo, preenchendo conforme o progresso da página. */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const ctx = gsap.context(() => {
      gsap.set(bar, { scaleX: 0 });
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed left-0 right-0 top-0 z-[150] h-[2px] bg-transparent">
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-gold to-blue"
      />
    </div>
  );
}
