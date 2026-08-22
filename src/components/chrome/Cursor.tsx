"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Cursor customizado: um ponto que segue o mouse na hora e um anel que
 * persegue com atraso. Cresce sobre elementos interativos.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Só faz sentido em dispositivo com ponteiro fino (mouse)
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    let shown = false;
    const onMove = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const interactive = "a, button, [data-cursor='grow']";
    const onOver = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest?.(interactive)) {
        gsap.to(ring, { scale: 2.1, borderColor: "rgba(217,178,106,0.9)", duration: 0.3 });
        gsap.to(dot, { scale: 0.4, duration: 0.3 });
      }
    };
    const onOut = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest?.(interactive)) {
        gsap.to(ring, { scale: 1, borderColor: "rgba(234,238,251,0.35)", duration: 0.3 });
        gsap.to(dot, { scale: 1, duration: 0.3 });
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200] hidden md:block">
      <div ref={dotRef} className="absolute h-1.5 w-1.5 rounded-full bg-gold opacity-0" />
      <div
        ref={ringRef}
        className="absolute h-9 w-9 rounded-full border opacity-0"
        style={{ borderColor: "rgba(234,238,251,0.35)" }}
      />
    </div>
  );
}
