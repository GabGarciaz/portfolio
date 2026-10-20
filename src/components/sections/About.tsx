"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

const STATS = [
  { value: "13", label: "Projetos no portfólio" },
  { value: "04", label: "Áreas, do código ao anúncio" },
  { value: "01", label: "Empresa atual: InterMed" },
];

const MANIFESTO = ["Eu construo", "sistemas que tiram", "o trabalho repetitivo", "das pessoas."];

export function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // manifesto sobe linha por linha de dentro da própria máscara
      gsap.from("[data-manifesto-line]", {
        yPercent: 110,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: "[data-manifesto]", start: "top 80%", once: true },
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
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: "[data-stats]", start: "top 90%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="sobre" className="relative z-10 px-5 py-24 md:px-12 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <span className="text-[11px] uppercase tracking-[0.3em] text-fg-dim">Sobre</span>

        <h2 data-manifesto aria-label={MANIFESTO.join(" ")} className="display mt-6 text-[10.4vw] md:text-[7.4vw]">
          {MANIFESTO.map((line, i) => (
            <span key={line} aria-hidden="true" className="block overflow-hidden pb-[0.04em]">
              <span data-manifesto-line className={`block ${i === 2 ? "text-iris" : ""}`}>
                {line}
              </span>
            </span>
          ))}
        </h2>

        <div className="mt-16 grid gap-14 md:mt-24 md:grid-cols-[0.8fr_1.2fr] md:items-end md:gap-20">
          {/* Retrato: preto e branco, ganha cor no hover */}
          <div data-portrait className="group relative mx-auto w-full max-w-xs md:mx-0 md:max-w-md">
            <div className="relative overflow-hidden rounded-2xl border border-line bg-bg-card">
              <div data-portrait-inner className="relative aspect-[2/3] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element -- asset local em /public */}
                <img
                  data-portrait-img
                  src="/images/about/gabriel-1100.webp"
                  srcSet="/images/about/gabriel-640.webp 640w, /images/about/gabriel-1100.webp 1100w"
                  sizes="(min-width: 768px) 32vw, 80vw"
                  alt="Gabriel Medeiros Garcia"
                  width={1536}
                  height={2304}
                  className="h-full w-full object-cover object-center grayscale transition-[filter] duration-700 group-hover:grayscale-0"
                />

                {/* funde a base da foto no fundo do site */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(to top, var(--bg-card) 1%, var(--bg-card-fade) 34%)",
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

          {/* Texto e números */}
          <div>
            <Reveal as="p" className="max-w-xl text-base leading-relaxed text-fg-dim md:text-lg">
              {site.about.bio}
            </Reveal>

            <div data-stats className="mt-14 grid grid-cols-3 border-t border-line md:mt-20">
              {STATS.map((s, i) => (
                <div key={s.label} data-stat className={`pt-6 ${i > 0 ? "border-l border-line pl-4 md:pl-8" : ""}`}>
                  <div className="display text-[16vw] leading-none md:text-[6vw]">{s.value}</div>
                  <div className="mt-3 text-[10px] uppercase leading-snug tracking-[0.06em] text-fg-dim sm:text-[11px] sm:tracking-[0.15em]">
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
