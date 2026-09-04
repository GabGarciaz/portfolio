"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

const STATS = [
  { value: "07", label: "Projetos entregues" },
  { value: "IA", label: "Automação de processos" },
  { value: "Full", label: "Stack ponta a ponta" },
];

export function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // linha dourada que se desenha ao entrar
      gsap.from("[data-rule]", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });

      gsap.from("[data-stat]", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.09,
        scrollTrigger: { trigger: "[data-stats]", start: "top 90%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="sobre" className="relative border-t border-line px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-6xl">
        <span className="text-[11px] uppercase tracking-[0.3em] text-gold">Sobre</span>

        <Reveal
          as="h2"
          className="mt-6 max-w-4xl text-3xl font-black leading-[1.12] tracking-tight md:text-5xl"
        >
          Entre automação, código e design, eu construo sistemas que tiram o
          trabalho repetitivo das pessoas.
        </Reveal>

        <div data-rule className="mt-14 h-px w-full bg-gradient-to-r from-gold/70 via-line to-transparent" />

        <div className="mt-14 grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-20">
          <Reveal as="p" className="text-base leading-relaxed text-fg-dim md:text-lg">
            {site.about.bio}
          </Reveal>

          <div data-stats className="grid grid-cols-3 gap-6 self-start md:gap-8">
            {STATS.map((s) => (
              <div key={s.label} data-stat>
                <div className="font-serif text-3xl italic text-gold md:text-4xl">{s.value}</div>
                <div className="mt-2 text-[11px] uppercase leading-snug tracking-[0.15em] text-fg-faint">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
