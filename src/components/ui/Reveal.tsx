"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";

type As = "h1" | "h2" | "h3" | "p" | "div" | "span";

/**
 * Revelação por linha com máscara. Rápida por padrão (0.75s / expo.out) e
 * disparada cedo (top 88%) — quando a seção entra no campo de visão o
 * movimento já está acontecendo, em vez de começar depois.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  stagger = 0.07,
  type = "lines",
  start = "top 88%",
}: {
  children: React.ReactNode;
  as?: As;
  className?: string;
  delay?: number;
  stagger?: number;
  type?: "lines" | "words" | "chars";
  start?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { opacity: 1 });
        return;
      }

      const split = new SplitText(el, {
        type: type === "lines" ? "lines" : type === "words" ? "lines,words" : "lines,words,chars",
        linesClass: "line-mask",
      });

      const targets =
        type === "lines" ? split.lines : type === "words" ? split.words : split.chars;

      gsap.set(el, { opacity: 1 });
      gsap.from(targets, {
        yPercent: 115,
        opacity: 0,
        duration: 0.75,
        ease: "expo.out",
        stagger,
        delay,
        scrollTrigger: { trigger: el, start, once: true },
      });

      return () => split.revert();
    },
    { scope: ref }
  );

  return (
    // @ts-expect-error -- Tag dinâmica; o ref é sempre de um HTMLElement
    <Tag ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </Tag>
  );
}
