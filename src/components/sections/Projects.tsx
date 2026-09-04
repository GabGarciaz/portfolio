"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { projects } from "@/data/projects";
import type { Project } from "@/types/content";

/**
 * Seção fixada: a rolagem vertical do mouse vira deslocamento horizontal
 * da trilha de projetos. Cada card entra girado em 3D e se endireita ao
 * chegar no centro, e o painel de descrição troca junto.
 */
export function Projects() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const trackEl = track.current;
      const rootEl = root.current;
      if (!trackEl || !rootEl) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mm = gsap.matchMedia();

      // Desktop: pin + scroll horizontal
      mm.add("(min-width: 768px)", () => {
        if (reduce) return;

        const getDistance = () => trackEl.scrollWidth - window.innerWidth + 96;

        const tween = gsap.to(trackEl, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: rootEl,
            start: "top top",
            end: () => `+=${getDistance()}`,
            pin: true,
            // scrub baixo = o movimento cola no scroll, sem atraso perceptível
            scrub: 0.35,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        // Cada card gira em 3D conforme atravessa a viewport
        const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { rotateY: 22, scale: 0.9, opacity: 0.45 },
            {
              rotateY: -22,
              scale: 1,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: 0.35,
                onUpdate: (self) => {
                  // o card mais próximo do centro define o painel de texto
                  if (self.progress > 0.35 && self.progress < 0.65) setActive(i);
                },
              },
            }
          );
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  const current = projects[active];

  return (
    <section ref={root} id="projetos" className="relative overflow-hidden bg-bg py-20 md:h-[100svh] md:py-0">
      {/* Cabeçalho fixo da seção */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between px-6 pt-10 md:px-12">
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold">Trabalhos</span>
          <h2 className="mt-2 text-2xl font-black md:text-3xl">
            Projetos <span className="font-serif italic font-normal text-fg-dim">selecionados</span>
          </h2>
        </div>
        <span className="hidden text-[11px] uppercase tracking-[0.2em] text-fg-faint md:block">
          {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </span>
      </div>

      {/* Trilha horizontal */}
      <div className="flex h-full items-center md:pt-10">
        <div
          ref={track}
          className="flex flex-col gap-10 px-6 md:flex-row md:items-center md:gap-12 md:px-12"
          style={{ perspective: 1400 }}
        >
          {projects.map((p, i) => (
            <ProjectCard
              key={p.slug}
              project={p}
              innerRef={(el) => {
                cardRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>

      {/* Barra de progresso da trilha */}
      <div className="pointer-events-none absolute inset-x-6 bottom-8 z-20 hidden md:block md:inset-x-12">
        <div className="h-px w-full bg-line">
          <div
            className="h-px bg-gold transition-[width] duration-300 ease-out"
            style={{ width: `${((active + 1) / projects.length) * 100}%` }}
          />
        </div>
        <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-fg-faint">
          Role para navegar · {current.name}
        </p>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  innerRef,
}: {
  project: Project;
  innerRef: (el: HTMLElement | null) => void;
}) {
  return (
    <article
      ref={innerRef}
      className="group relative w-full shrink-0 md:w-[min(58vw,760px)]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-line bg-bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          {project.videoSrc ? (
            <video
              src={project.videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
            />
          ) : project.thumbnailSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element -- assets locais em /public */
            <img
              src={project.thumbnailSrc}
              alt={`Projeto ${project.name}`}
              className="h-full w-full object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ backgroundColor: project.thumbnailColor }}
            >
              <span className="font-serif text-5xl italic text-fg/20">{project.name}</span>
            </div>
          )}
          {/* véu para o texto respirar sobre a imagem */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />
          <span className="absolute left-5 top-5 rounded-full border border-gold/40 bg-bg/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gold backdrop-blur">
            {project.date}
          </span>
        </div>

        <div className="p-6 md:p-7">
          {project.group && (
            <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-gold/80">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="13"
                height="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"></path>
                <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"></path>
              </svg>
              {project.group}
            </div>
          )}
          <h3 className="text-2xl font-bold md:text-3xl">{project.name}</h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg-dim">{project.summary}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((t) => (
              <li
                key={t}
                className="rounded-full border border-line px-3 py-1 text-[11px] text-fg-dim"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
