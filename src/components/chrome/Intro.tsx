"use client";

import { useRef, useSyncExternalStore } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import {
  getIntroPhase,
  getServerIntroPhase,
  setIntroPhase,
  subscribeIntro,
  whenStageReady,
} from "@/lib/intro";

/**
 * Boot do chip. Trilhas de circuito acendem das bordas até o centro, o
 * chip (desenhado no GlassStage, atrás desta camada) liga e depois voa
 * para o topo, onde fica em cima do nome.
 */

// Trilhas num quadro 0–100 esticado na tela. Só retas horizontais e
// verticais, para não entortar quando a proporção da tela muda. Sem
// vector-effect: o Chrome quebra o tracejado quando ele vem junto do pathLength.
const TRACES = [
  "M0 18 H22 V38 H40",
  "M0 50 H40",
  "M0 82 H18 V62 H40",
  "M100 14 H80 V40 H60",
  "M100 50 H60",
  "M100 86 H76 V60 H60",
  "M30 0 V20 H44 V38",
  "M56 0 V38",
  "M70 100 V78 H56 V62",
  "M44 100 V62",
];

const LOG = [
  "GG-26 inicializando",
  "automações .......... ok",
  "software ............ ok",
  "tráfego e dados ..... ok",
  "design .............. ok",
];

export function Intro() {
  const phase = useSyncExternalStore(subscribeIntro, getIntroPhase, getServerIntroPhase);
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const releaseRef = useRef<(() => void) | null>(null);

  useGSAP(
    () => {
      if (getIntroPhase() !== "pending") return;

      // A rolagem fica presa enquanto o chip liga. Nada de overflow: hidden no
      // html: tirar a barra de rolagem redimensiona o canvas e o WebKit perde
      // o desenho do WebGL. Os eventos são barrados na captura, antes do Lenis.
      const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]);
      const block = (e: Event) => {
        if (e instanceof KeyboardEvent && !SCROLL_KEYS.has(e.key)) return;
        e.preventDefault();
        e.stopPropagation();
      };
      const opts = { capture: true, passive: false } as const;
      window.addEventListener("wheel", block, opts);
      window.addEventListener("touchmove", block, opts);
      window.addEventListener("keydown", block, opts);
      let locked = true;
      const release = () => {
        if (!locked) return;
        locked = false;
        window.removeEventListener("wheel", block, opts);
        window.removeEventListener("touchmove", block, opts);
        window.removeEventListener("keydown", block, opts);
      };
      releaseRef.current = release;

      const count = { v: 0 };
      const counter = root.current?.querySelector<HTMLElement>("[data-intro-count]");

      const t = gsap.timeline({ defaults: { ease: "power3.inOut" } });
      tl.current = t;
      t.fromTo(
        "[data-intro-trace]",
        { strokeDashoffset: 100 },
        { strokeDashoffset: 0, duration: 1.1, stagger: 0.04 }
      )
        .from("[data-intro-log]", { opacity: 0, x: -8, duration: 0.3, stagger: 0.16, ease: "power2.out" }, 0.1)
        .to(
          count,
          {
            v: 100,
            duration: 2.3,
            ease: "power1.inOut",
            onUpdate: () => {
              if (counter) counter.textContent = String(Math.round(count.v)).padStart(3, "0");
            },
          },
          0
        )
        // as trilhas chegaram: se o chip ainda não desenhou (vidro compilando),
        // a intro segura aqui até ele ficar pronto, no máximo 2,5 s
        .addPause(1.05, () => {
          let stopWaiting = () => {};
          let timer = 0;
          const resume = () => {
            clearTimeout(timer);
            stopWaiting();
            // fora do callback da pausa, para o resume não ser engolido por ela
            requestAnimationFrame(() => t.resume());
          };
          timer = window.setTimeout(resume, 2500);
          stopWaiting = whenStageReady(resume);
        })
        // o fundo abre e o chip aparece por trás
        .call(() => setIntroPhase("boot"), [], 1.05)
        .to("[data-intro-bg]", { opacity: 0, duration: 0.7, ease: "power2.out" }, 1.05)
        .fromTo(
          "[data-intro-pulse]",
          { strokeDashoffset: 100 },
          { strokeDashoffset: -20, duration: 0.9, stagger: 0.05, ease: "none", repeat: 1 },
          1.05
        )
        // lançamento: o chip sobe, as trilhas recolhem para as bordas
        .call(() => setIntroPhase("launch"), [], 2.45)
        .to("[data-intro-trace]", { strokeDashoffset: -100, duration: 0.7, stagger: 0.02, ease: "power2.in" }, 2.45)
        .to("[data-intro-ui]", { opacity: 0, duration: 0.4 }, 2.45)
        .call(() => {
          release();
          setIntroPhase("done");
        }, [], 3.25);

      return release;
    },
    { scope: root }
  );

  const skip = () => {
    tl.current?.kill();
    releaseRef.current?.();
    if (getIntroPhase() === "pending") setIntroPhase("boot");
    setIntroPhase("done");
  };

  if (phase === "done") return null;

  return (
    <div ref={root} className="fixed inset-0 z-50">
      <div data-intro-bg className="absolute inset-0 bg-bg" />

      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="intro-iris" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7af0ff" />
            <stop offset="0.5" stopColor="#8b7bff" />
            <stop offset="1" stopColor="#ff7ad9" />
          </linearGradient>
        </defs>
        {TRACES.map((d) => (
          <g key={d}>
            <path
              data-intro-trace
              d={d}
              pathLength={100}
              strokeDasharray="100 100"
              strokeDashoffset={100}
              stroke="rgba(242,242,240,0.22)"
              strokeWidth={0.14}
            />
            <path
              data-intro-pulse
              d={d}
              pathLength={100}
              strokeDasharray="14 120"
              strokeDashoffset={100}
              stroke="url(#intro-iris)"
              strokeWidth={0.32}
            />
          </g>
        ))}
      </svg>

      <div data-intro-ui aria-hidden="true" className="pointer-events-none absolute inset-x-5 bottom-6 flex items-end justify-between gap-6 md:inset-x-10 md:bottom-8">
        <ul className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-fg-dim md:text-[11px]">
          {LOG.map((l) => (
            <li key={l} data-intro-log>
              <span className="text-fg-faint">&gt; </span>
              {l}
            </li>
          ))}
        </ul>
        <span data-intro-count className="display text-5xl tabular-nums md:text-7xl">
          000
        </span>
      </div>

      <button
        type="button"
        onClick={skip}
        className="absolute right-5 top-5 rounded-full border border-line px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-fg-dim transition-colors hover:border-fg hover:text-fg md:right-10 md:top-6"
      >
        Pular intro
      </button>
    </div>
  );
}
