"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Reveal } from "@/components/ui/Reveal";
import { skills } from "@/data/skills";

export function Skills() {
  const root = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from("[data-row]", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.06,
        scrollTrigger: { trigger: "[data-rows]", start: "top 85%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="skills" className="relative border-t border-line px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-6xl">
        <span className="text-[11px] uppercase tracking-[0.3em] text-gold">Skills</span>

        <Reveal
          as="h2"
          className="mt-6 max-w-3xl text-3xl font-black leading-[1.12] tracking-tight md:text-5xl"
        >
          Do backend ao pixel final.
        </Reveal>

        <div data-rows className="mt-16 border-t border-line">
          {skills.map((cat) => {
            const isOn = hovered === cat.id;
            return (
              <div
                key={cat.id}
                data-row
                onMouseEnter={() => setHovered(cat.id)}
                onMouseLeave={() => setHovered(null)}
                className="group relative grid grid-cols-1 items-baseline gap-4 border-b border-line py-7 transition-colors md:grid-cols-[minmax(0,20rem)_1fr] md:gap-10"
              >
                {/* preenchimento dourado que sobe no hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 bg-gold/[0.06] transition-[height] duration-500 ease-out"
                  style={{ height: isOn ? "100%" : "0%" }}
                />

                <h3
                  className="text-xl font-bold transition-colors duration-300 md:text-2xl"
                  style={{ color: isOn ? "var(--gold)" : undefined }}
                >
                  {cat.label}
                </h3>

                <ul className="flex flex-wrap gap-x-5 gap-y-2">
                  {cat.tags.map((t) => (
                    <li
                      key={t}
                      className="text-sm text-fg-dim transition-colors duration-300 group-hover:text-fg"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
