"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

const STATS = [
  { value: "08", label: "Projetos entregues" },
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

      // Retrato: a moldura sobe e a imagem contra-move, revelando por baixo.
      // A entrada usa yPercent e o parallax usa y em px, então os dois
      // convivem no mesmo elemento sem se sobrescrever.
      // A escala de repouso deixa uma folga para o parallax correr sem
      // descolar a imagem da borda.
      gsap.set("[data-portrait-img]", { scale: 1.08 });

      const portraitIn = gsap.timeline({
        defaults: { ease: "expo.out", duration: 1.25 },
        scrollTrigger: { trigger: "[data-portrait]", start: "top 82%", once: true },
      });

      portraitIn
        .from("[data-portrait-inner]", { yPercent: 102 })
        .from("[data-portrait-img]", { yPercent: -55, scale: 1.2 }, "<")
        .from("[data-portrait-frame]", { opacity: 0, x: -14, y: 14, duration: 0.9 }, "-=0.75")
        .from("[data-portrait-tag]", { opacity: 0, y: 14, duration: 0.7 }, "-=0.6");

      gsap.fromTo(
        "[data-portrait-img]",
        { y: -14 },
        {
          y: 14,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-portrait]",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        }
      );

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

        <div className="mt-14 grid gap-14 md:mt-20 md:grid-cols-[0.85fr_1.15fr] md:items-center md:gap-20">
          {/* Retrato */}
          <div data-portrait className="relative mx-auto w-full max-w-xs md:mx-0 md:max-w-none">
            {/* moldura dourada deslocada, dá profundidade sem pesar */}
            <div
              data-portrait-frame
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-4 -left-4 h-full w-full rounded-2xl border border-gold/25 md:-bottom-5 md:-left-5"
            />

            <div className="relative overflow-hidden rounded-2xl border border-line bg-bg-card">
              <div data-portrait-inner className="relative aspect-[2/3] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element -- asset local em /public */}
                <img
                  data-portrait-img
                  src="/images/about/gabriel-1100.webp"
                  srcSet="/images/about/gabriel-640.webp 640w, /images/about/gabriel-1100.webp 1100w"
                  sizes="(min-width: 768px) 40vw, 80vw"
                  alt="Gabriel Medeiros Garcia"
                  width={1536}
                  height={2304}
                  className="h-full w-full object-cover object-center"
                />

                {/* funde a parede clara da foto no fundo do site */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(to top, var(--bg-card) 1%, var(--bg-card-fade) 34%)",
                  }}
                />

                {/* vinheta suave: tira o peso da parede clara nas bordas */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(115% 85% at 50% 32%, rgb(4 7 15 / 0) 45%, rgb(4 7 15 / 0.45) 100%)",
                  }}
                />
              </div>

              <div
                data-portrait-tag
                className="flex flex-col gap-1 px-5 py-4 text-[10px] uppercase tracking-[0.1em] text-fg-faint sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:tracking-[0.18em]"
              >
                <span className="text-fg-dim">Gabriel Medeiros Garcia</span>
                <span>Rio de Janeiro</span>
              </div>
            </div>
          </div>

          {/* Texto */}
          <div>
            <Reveal as="p" className="text-base leading-relaxed text-fg-dim md:text-lg">
              {site.about.bio}
            </Reveal>

            <div data-stats className="mt-12 grid grid-cols-3 gap-6 md:mt-16 md:gap-8">
              {STATS.map((s) => (
                <div key={s.label} data-stat>
                  <div className="font-serif text-3xl italic text-gold md:text-4xl">{s.value}</div>
                  <div className="mt-2 text-[10px] uppercase leading-snug tracking-[0.06em] text-fg-faint sm:text-[11px] sm:tracking-[0.15em]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
