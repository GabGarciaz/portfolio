"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { site } from "@/data/site";
import { getIntroPhase, introReleased, subscribeIntro } from "@/lib/intro";

// O que está rodando sozinho hoje (ver os projetos da InterMed e o monitor).
const RUNNING = [
  { name: "robo-grupos", detail: "WhatsApp · VPS" },
  { name: "reativacao-leads", detail: "15 por dia" },
  { name: "leitura-ia", detail: "8h às 18h" },
  { name: "monitor-ofertas", detail: "de hora em hora" },
];

/**
 * Topo. Atrás do nome, uma aurora furta-cor (gradientes que derivam sozinhos
 * e seguem o mouse de leve) e uma grade de pontos. Quando a intro libera, o
 * nome decodifica de caracteres soltos até virar GABRIEL GARCIA.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const aurora = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const entrance = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .from("[data-hero-line]", { yPercent: 40, opacity: 0, duration: 1.2, stagger: 0.12 })
        .to(
          "[data-hero-word]",
          {
            duration: 1.1,
            stagger: 0.12,
            ease: "none",
            scrambleText: { text: "{original}", chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", revealDelay: 0.25, speed: 0.5 },
          },
          0
        )
        .from("[data-hero-fade]", { y: 16, opacity: 0, duration: 0.9, stagger: 0.06 }, 0.35)
        .from(aurora.current, { opacity: 0, scale: 0.85, duration: 2, ease: "power2.out" }, 0);

      const play = () => introReleased(getIntroPhase()) && entrance.play();
      play();
      const unsubscribe = subscribeIntro(play);

      // a aurora segue o mouse de leve (só transform, sem repintar)
      const xTo = gsap.quickTo(aurora.current, "x", { duration: 1.6, ease: "power3" });
      const yTo = gsap.quickTo(aurora.current, "y", { duration: 1.6, ease: "power3" });
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        xTo((e.clientX / window.innerWidth - 0.5) * 120);
        yTo((e.clientY / window.innerHeight - 0.5) * 80);
      };
      window.addEventListener("pointermove", onMove);

      // ao sair, as linhas se separam e a aurora afunda
      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.4 };
      gsap.to("[data-hero-row='0']", { xPercent: -10, ease: "none", scrollTrigger: st });
      gsap.to("[data-hero-row='1']", { xPercent: 10, ease: "none", scrollTrigger: st });
      gsap.to("[data-aurora-wrap]", { yPercent: 25, opacity: 0.3, ease: "none", scrollTrigger: st });

      return () => {
        unsubscribe();
        window.removeEventListener("pointermove", onMove);
      };
    },
    { scope: root }
  );

  const meta = "font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim";

  return (
    <section
      ref={root}
      id="hero"
      className="relative z-10 flex h-[100svh] min-h-[640px] flex-col overflow-hidden px-5 pb-6 pt-5 md:px-10 md:pb-8 md:pt-7"
    >
      {/* fundo: aurora + grade */}
      <div data-aurora-wrap aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div ref={aurora} className="absolute inset-0 opacity-70">
          <div
            className="aurora-blob -left-[15vmax] -top-[20vmax]"
            style={{ background: "radial-gradient(closest-side, rgba(122,240,255,.55), transparent)", animation: "drift-a 18s ease-in-out infinite" }}
          />
          <div
            className="aurora-blob -right-[20vmax] top-[0vmax]"
            style={{ background: "radial-gradient(closest-side, rgba(139,123,255,.6), transparent)", animation: "drift-b 22s ease-in-out infinite" }}
          />
          <div
            className="aurora-blob bottom-[-35vmax] left-[20vw]"
            style={{ background: "radial-gradient(closest-side, rgba(255,122,217,.45), transparent)", animation: "drift-c 26s ease-in-out infinite" }}
          />
        </div>
        <div className="dot-grid absolute inset-0" />
        {/* funde a base no fundo da página */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-bg to-transparent" />
      </div>

      <header className="flex items-center justify-between gap-4">
        <a data-hero-fade href="#hero" className="display text-xl tracking-wide md:text-2xl">
          G<span className="text-iris">.</span>G
        </a>
        <nav data-hero-fade className={`flex gap-5 md:gap-8 ${meta}`}>
          {site.nav.map((n) => (
            <a key={n.label} href={n.href} className="transition-colors hover:text-fg">
              {n.label}
            </a>
          ))}
        </nav>
      </header>

      {/* no celular o painel ocupa o alto da tela, acima do nome */}
      <RunningPanel className="mt-8 md:hidden" />
      <div className="flex-1" />

      <div>
        <div data-hero-fade className={`mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 md:mb-6 ${meta}`}>
          <span className="flex items-center gap-2 text-fg">
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
            <div key={word} data-hero-row={i} className={i === 1 ? "text-right" : ""}>
              <span data-hero-line className="inline-block">
                <span data-hero-word className="display inline-block text-[25vw] md:text-[19.5vw]">
                  {word}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-6 md:mt-7 md:flex-row md:items-end md:justify-between">
          <div data-hero-fade className="max-w-md">
            <p className="text-sm leading-relaxed text-fg-dim md:text-base">
              Desenvolvedor que automatiza processos com inteligência artificial, constrói software de ponta a
              ponta e desenha a marca que o envolve.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="#projetos"
                className="group flex items-center gap-3 rounded-full bg-fg px-5 py-3 text-sm font-bold text-bg transition-transform hover:scale-[1.03]"
              >
                Ver projetos
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
              </a>
              <a
                href="https://wa.me/5521987969097"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-line px-5 py-3 text-sm text-fg-dim transition-colors hover:border-fg hover:text-fg"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>

          <RunningPanel className="hidden w-[340px] md:block" />
        </div>
      </div>
    </section>
  );
}

/** Painel "em produção", na linguagem do terminal da intro. */
function RunningPanel({ className }: { className: string }) {
  return (
    <div data-hero-fade className={`rounded-xl border border-line bg-bg/80 p-4 font-mono text-[11px] ${className}`}>
      <p className="flex items-center justify-between uppercase tracking-[0.18em] text-fg-dim">
        <span>em produção</span>
        <span className="text-fg-faint">~/automacoes</span>
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {RUNNING.map((r) => (
          <li key={r.name} className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#5ff2a0] shadow-[0_0_8px_#5ff2a0]" />
            <span className="text-fg">{r.name}</span>
            <span aria-hidden="true" className="mb-[0.3em] flex-1 border-b border-dotted border-fg-faint" />
            <span className="text-fg-dim">{r.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
