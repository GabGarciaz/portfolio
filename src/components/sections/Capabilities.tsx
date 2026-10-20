"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { capabilities } from "@/data/capabilities";

/** Acordeão de capacidades: uma aberta por vez, cada uma com stack e exemplo real. */
export function Capabilities() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-cap-row]", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="capacidades" className="relative z-10 bg-bg px-5 py-24 md:px-12 md:py-36">
      <div className="mx-auto grid max-w-[1600px] gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-fg-dim">O que eu faço</span>
          <h2 className="display mt-4 text-[16vw] md:sticky md:top-28 md:text-[6.5vw]">
            Do código
            <br />
            <span className="text-iris">ao anúncio</span>
          </h2>
        </div>

        <div className="border-t border-line">
          {capabilities.map((c, i) => {
            const isOpen = open === i;
            const id = `cap-${i}`;
            return (
              <div key={c.title} data-cap-row className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="group flex w-full items-center gap-4 py-6 text-left md:gap-8 md:py-8"
                  >
                    <span className="font-sans text-xs tabular-nums text-fg-faint md:text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`display flex-1 text-[9vw] transition-colors md:text-[3.6vw] ${
                        isOpen ? "text-fg" : "text-fg-dim group-hover:text-fg"
                      }`}
                    >
                      {c.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`relative h-10 w-10 shrink-0 rounded-full border transition-colors md:h-12 md:w-12 ${
                        isOpen ? "border-fg bg-fg" : "border-line"
                      }`}
                    >
                      <span className={`absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 ${isOpen ? "bg-bg" : "bg-fg"}`} />
                      <span
                        className={`absolute left-1/2 top-1/2 h-4 w-px -translate-y-1/2 transition-transform duration-300 ${
                          isOpen ? "scale-y-0 bg-bg" : "bg-fg"
                        }`}
                      />
                    </span>
                  </button>
                </h3>

                {/* grid 0fr → 1fr anima a altura sem medir o conteúdo */}
                <div
                  id={id}
                  role="region"
                  className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-6 pb-8 md:grid-cols-[1.4fr_1fr] md:gap-12 md:pb-10 md:pl-[calc(0.875rem+2rem)]">
                      <p className="text-base leading-relaxed text-fg-dim md:text-lg">{c.text}</p>
                      <div className="flex flex-col gap-5">
                        <div className="flex flex-wrap gap-2">
                          {c.stack.map((s) => (
                            <span key={s} className="rounded-full border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] text-fg-dim">
                              {s}
                            </span>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => window.dispatchEvent(new CustomEvent("open-project", { detail: c.example.slug }))}
                          className="group/ex flex w-fit items-baseline gap-2 text-left text-[11px] uppercase tracking-[0.16em] text-fg"
                        >
                          <span className="shrink-0 text-fg-faint">Na prática:</span>
                          <span className="underline decoration-line underline-offset-4 group-hover/ex:decoration-fg">{c.example.label}</span>
                          <span aria-hidden="true">↗</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
