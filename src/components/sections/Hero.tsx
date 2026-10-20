"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { site } from "@/data/site";
import { getIntroPhase, introReleased, subscribeIntro } from "@/lib/intro";

/**
 * Camada HTML do hero. O nome gigante é marcado com `data-gl-text`: o palco
 * WebGL (GlassStage) redesenha cada linha no mesmo lugar e o vidro refrata.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // a entrada fica pronta (escondida) e só toca quando o chip da intro
      // começa a voar para o topo
      const intro = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .from("[data-hero-line]", { y: 80, opacity: 0, duration: 1.4, stagger: 0.14 })
        .from("[data-hero-fade]", { y: 16, opacity: 0, duration: 0.9, stagger: 0.07 }, "-=0.8");
      const play = () => introReleased(getIntroPhase()) && intro.play();
      play();
      const unsubscribe = subscribeIntro(play);

      // ao sair, as linhas se separam: uma vai para a esquerda, outra para a direita
      gsap.to("[data-hero-row='0']", {
        xPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.4 },
      });
      gsap.to("[data-hero-row='1']", {
        xPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.4 },
      });

      return unsubscribe;
    },
    { scope: root }
  );

  const meta = "text-[11px] uppercase tracking-[0.22em] text-fg-dim";

  return (
    <section ref={root} id="hero" className="relative z-10 flex h-[100svh] flex-col justify-between overflow-hidden px-5 pb-6 pt-6 md:px-10 md:pb-8">
      <header className="flex items-start justify-between gap-4">
        <a data-hero-fade href="#hero" className="display text-xl tracking-wide md:text-2xl">
          G<span className="text-fg-dim">.</span>G
        </a>
        <nav data-hero-fade className={`flex gap-5 md:gap-8 ${meta}`}>
          {site.nav.map((n) => (
            <a key={n.label} href={n.href} className="transition-colors hover:text-fg">
              {n.label}
            </a>
          ))}
        </nav>
      </header>

      <div>
        <div data-hero-fade className={`mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 md:mb-6 ${meta}`}>
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7af0ff] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#7af0ff]" />
            </span>
            Disponível para projetos
          </span>
          <span>Rio de Janeiro · BR</span>
        </div>

        <h1 className="sr-only">Gabriel Medeiros Garcia, desenvolvedor, automação com IA e design</h1>
        <div aria-hidden="true" className="select-none">
          {[site.name.first, site.name.last.replace(".", "")].map((word, i) => (
            <div key={word}>
              <div data-hero-row={i} className={i === 1 ? "text-right" : ""}>
                <span data-hero-line className="inline-block">
                  <span data-gl-text className="display inline-block text-[27vw] md:text-[21vw]">
                    {word}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>

        <div data-hero-fade className="mt-4 flex flex-col gap-4 md:mt-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-sm leading-relaxed text-fg-dim md:text-base">
            Desenvolvedor que automatiza processos com inteligência artificial, constrói software de
            ponta a ponta e desenha a marca que o envolve.
          </p>
          <a href="#projetos" className={`group flex items-center gap-3 ${meta} hover:text-fg`}>
            Ver projetos
            <span className="inline-block transition-transform duration-300 group-hover:translate-y-1">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
