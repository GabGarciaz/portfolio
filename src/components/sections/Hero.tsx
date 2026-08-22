"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import { site } from "@/data/site";

// O canvas WebGL só existe no cliente e não deve bloquear o primeiro paint.
const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => m.HeroScene),
  { ssr: false }
);

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const firstNameRef = useRef<HTMLSpanElement>(null);
  const lastNameRef = useRef<HTMLSpanElement>(null);
  const canvasWrap = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set("[data-hero-fade]", { opacity: 1 });
        return;
      }

      const splitFirst = new SplitText(firstNameRef.current, {
        type: "chars",
        charsClass: "inline-block",
      });
      // Split separado: o gradiente dourado só clipa texto renderizado
      // diretamente pelo elemento, então cada char precisa reganhar a classe.
      const splitLast = new SplitText(lastNameRef.current, {
        type: "chars",
        charsClass: "inline-block text-gold-gradient",
      });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.from([...splitFirst.chars, ...splitLast.chars], {
        yPercent: 120,
        opacity: 0,
        rotateX: -80,
        duration: 1,
        stagger: 0.035,
      })
        .from("[data-hero-fade]", { y: 22, opacity: 0, duration: 0.8, stagger: 0.09 }, "-=0.65")
        .from(canvasWrap.current, { opacity: 0, scale: 0.88, duration: 1.4 }, 0);

      // Ao rolar, o 3D e o título saem em ritmos diferentes (profundidade)
      gsap.to(canvasWrap.current, {
        yPercent: 18,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.4 },
      });
      gsap.to("[data-hero-copy]", {
        yPercent: -30,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.4 },
      });

      return () => {
        splitFirst.revert();
        splitLast.revert();
      };
    },
    { scope: root }
  );

  return (
    <section ref={root} id="hero" className="relative h-[100svh] w-full overflow-hidden">
      {/* Brilhos de fundo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue/20 blur-[130px]" />
        <div className="absolute right-[12%] top-[18%] h-[36vh] w-[36vh] rounded-full bg-gold/12 blur-[110px]" />
      </div>

      {/* Cena 3D */}
      <div ref={canvasWrap} className="absolute inset-0">
        <HeroScene />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 flex h-full flex-col justify-between px-6 py-8 md:px-12 md:py-10">
        <div className="flex items-start justify-between">
          <span
            data-hero-fade
            className="text-[11px] uppercase tracking-[0.25em] text-fg-dim"
          >
            {site.version}
          </span>
          <nav data-hero-fade className="flex gap-6 text-[11px] uppercase tracking-[0.2em]">
            {site.nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-fg-dim transition-colors hover:text-gold"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div data-hero-copy className="pointer-events-none relative mx-auto max-w-5xl text-center">
          {/* véu escuro atrás do texto: garante contraste contra o brilho da esfera */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[85vh] w-[130vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg/55 blur-[70px]"
          />

          <p data-hero-fade className="mb-7 text-[11px] uppercase tracking-[0.35em] text-gold">
            Desenvolvedor · Automação com IA · Design
          </p>

          <h1
            className="flex flex-col items-center gap-1 tracking-tight md:gap-2"
            style={{ perspective: 800 }}
          >
            <span ref={firstNameRef} className="text-[13vw] font-black leading-none md:text-[7.5vw]">
              {site.name.first}
            </span>
            <span
              ref={lastNameRef}
              className="text-gold-gradient text-[13vw] font-serif font-normal italic leading-none md:text-[7.5vw]"
            >
              {site.name.last}
            </span>
          </h1>

          <p
            data-hero-fade
            className="mx-auto mt-10 max-w-xl text-balance text-sm leading-relaxed text-fg-dim md:mt-12 md:text-base"
          >
            Automatizo processos com inteligência artificial, construo software
            de ponta a ponta e desenho a marca que o envolve.
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div data-hero-fade className="flex gap-5 text-[11px] uppercase tracking-[0.2em]">
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg-dim transition-colors hover:text-gold"
              >
                {s.label}
              </a>
            ))}
          </div>

          <a
            data-hero-fade
            href="#projetos"
            className="group flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-fg-dim transition-colors hover:text-gold"
          >
            Ver projetos
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-line transition-colors group-hover:border-gold">
              <span className="block h-2 w-2 translate-y-0 animate-bounce rounded-full bg-gold" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
