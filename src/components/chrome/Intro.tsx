"use client";

import { useRef, useSyncExternalStore } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { projects } from "@/data/projects";
import {
  getIntroPhase,
  getServerIntroPhase,
  setIntroPhase,
  subscribeIntro,
} from "@/lib/intro";

/**
 * Intro de terminal. Um comando é digitado, o sistema "sobe" linha por
 * linha com o que o Gabriel faz, e a tela inteira do terminal desliza para
 * cima revelando o topo, onde o nome termina de decodificar.
 *
 * Tudo é HTML com transform e opacity: nada de canvas, nada que precise
 * compilar ou carregar antes de animar. Roda uma vez por sessão e qualquer
 * clique ou tecla pula.
 */

const COMMAND = "./iniciar --portfolio";

const LINES = [
  { label: "projetos", value: `${projects.length} carregados` },
  { label: "automações", value: "4 em produção" },
  { label: "stack", value: "next.js · python · ia" },
  { label: "base", value: "rio de janeiro, br" },
];

const OPEN = 1.0;

export function Intro() {
  const phase = useSyncExternalStore(subscribeIntro, getIntroPhase, getServerIntroPhase);
  const root = useRef<HTMLDivElement>(null);
  const skipRef = useRef<(() => void) | null>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || getIntroPhase() !== "pending") return;

      // A rolagem fica presa enquanto o terminal roda. Os eventos são barrados
      // na captura, antes do Lenis, sem mexer em overflow (que muda a largura
      // da página e faz tudo pular).
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
      const release = () => {
        window.removeEventListener("wheel", block, opts);
        window.removeEventListener("touchmove", block, opts);
        window.removeEventListener("keydown", block, opts);
      };

      const cmd = el.querySelector<HTMLElement>("[data-cmd]");
      const pct = el.querySelector<HTMLElement>("[data-pct]");
      const typed = { n: 0 };
      const progress = { v: 0 };

      // Saída: o terminal sobe inteiro, a linha furta-cor na borda de baixo
      // varre o topo como um scanner, e o nome decodifica por baixo.
      const open = (fast = false) => {
        setIntroPhase("launch");
        gsap.to(el, {
          yPercent: -100,
          duration: fast ? 0.6 : OPEN,
          ease: "expo.inOut",
          onComplete: () => {
            release();
            setIntroPhase("done");
          },
        });
      };

      const t = gsap.timeline({ delay: 0.25 });
      t.to(typed, {
        n: COMMAND.length,
        duration: 0.6,
        ease: "none",
        onUpdate: () => {
          if (cmd) cmd.textContent = COMMAND.slice(0, Math.round(typed.n));
        },
      })
        .to(
          progress,
          {
            v: 100,
            duration: 1.75,
            ease: "power2.inOut",
            onUpdate: () => {
              if (pct) pct.textContent = String(Math.round(progress.v)).padStart(3, "0");
            },
          },
          0.1
        )
        .fromTo("[data-bar]", { scaleX: 0 }, { scaleX: 1, duration: 1.75, ease: "power2.inOut" }, 0.1);

      el.querySelectorAll<HTMLElement>("[data-line]").forEach((line, i) => {
        const at = 0.75 + i * 0.2;
        t.fromTo(line, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }, at).to(
          line.querySelector("[data-value]"),
          { duration: 0.45, scrambleText: { text: "{original}", chars: "01#$%&*+<>/", speed: 0.6 } },
          at
        );
      });

      t.fromTo("[data-ready]", { opacity: 0 }, { opacity: 1, duration: 0.25 }, ">-0.05")
        .call(() => open(), [], "+=0.12");

      skipRef.current = () => {
        if (getIntroPhase() !== "pending") return;
        t.kill();
        open(true);
      };
      const skipOnKey = (e: KeyboardEvent) => {
        if (e.key === "Escape" || e.key === "Enter" || e.key === " ") skipRef.current?.();
      };
      window.addEventListener("keydown", skipOnKey);

      return () => {
        window.removeEventListener("keydown", skipOnKey);
        release();
      };
    },
    { scope: root }
  );

  if (phase === "done") return null;

  return (
    <div
      ref={root}
      onClick={() => skipRef.current?.()}
      className="fixed inset-0 z-[60] flex flex-col justify-between bg-bg px-5 py-5 font-mono text-[13px] text-fg-dim will-change-transform md:px-10 md:py-8 md:text-lg lg:text-xl"
    >
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em]">
        <span>gabriel@portfolio: ~</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            skipRef.current?.();
          }}
          className="rounded-full border border-line px-4 py-2 transition-colors hover:border-fg hover:text-fg"
        >
          Pular ↵
        </button>
      </div>

      <div className="w-full max-w-3xl">
        <p className="text-fg">
          <span className="text-iris">~ $</span> <span data-cmd className="caret" />
        </p>
        <ul className="mt-6 flex flex-col gap-2.5 md:mt-8 md:gap-3">
          {LINES.map((l) => (
            <li key={l.label} data-line className="flex items-baseline gap-3 opacity-0">
              <span className="text-fg-faint">→</span>
              <span>{l.label}</span>
              <span aria-hidden="true" className="mb-[0.3em] flex-1 border-b border-dotted border-fg-faint" />
              <span data-value className="text-fg">
                {l.value}
              </span>
            </li>
          ))}
        </ul>
        <p data-ready className="mt-6 text-fg opacity-0 md:mt-8">
          <span className="text-iris">✓</span> pronto, abrindo
        </p>
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between">
          <span className="text-[11px] uppercase tracking-[0.2em]">carregando</span>
          <span data-pct className="display text-5xl tabular-nums text-fg md:text-7xl">
            000
          </span>
        </div>
        <div className="h-px w-full bg-line">
          <div data-bar className="h-full origin-left scale-x-0" style={{ backgroundImage: "var(--iris)" }} />
        </div>
      </div>

      {/* borda de baixo furta-cor: varre o topo quando o terminal sobe */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px]"
        style={{ backgroundImage: "var(--iris)", boxShadow: "0 0 24px 2px rgba(139,123,255,.55)" }}
      />
    </div>
  );
}
