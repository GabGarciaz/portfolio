"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { projects } from "@/data/projects";
import { Lightbox, type LightboxMedia } from "@/components/ui/Lightbox";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Project, ProjectKind } from "@/types/content";

const FILTERS: { key: ProjectKind | "todos"; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "web", label: "Web" },
  { key: "automacao", label: "Automação" },
  { key: "design", label: "Design e vídeo" },
];

const KIND_LABEL: Record<ProjectKind, string> = {
  web: "Web",
  automacao: "Automação",
  design: "Design e vídeo",
};

// Ritmo da grade (6 colunas no desktop): dois cards largos, três médios, e repete.
const SPANS = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"];

/**
 * Projetos em grade, com a capa sempre à vista e o número de cada um.
 * Clicar abre a página do caso: galeria em tela cheia e a ficha do projeto.
 */
export function ProjectIndex() {
  const root = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<ProjectKind | "todos">("todos");
  const [zoomed, setZoomed] = useState<Project | null>(null);

  // outras seções pedem para abrir um projeto (ex.: "Na prática" nas capacidades)
  useEffect(() => {
    const open = (e: Event) => {
      const p = projects.find((x) => x.slug === (e as CustomEvent<string>).detail);
      if (p) setZoomed(p);
    };
    window.addEventListener("open-project", open);
    return () => window.removeEventListener("open-project", open);
  }, []);

  const list = useMemo(
    () => (filter === "todos" ? projects : projects.filter((p) => p.kind === filter)),
    [filter]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { todos: projects.length };
    for (const p of projects) c[p.kind] = (c[p.kind] ?? 0) + 1;
    return c;
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-index-title]", {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      });
      // cards entram em lotes conforme aparecem
      gsap.set("[data-card]", { y: 50, opacity: 0 });
      ScrollTrigger.batch("[data-card]", {
        start: "top 92%",
        once: true,
        onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.08 }),
      });
    },
    { scope: root }
  );

  const changeFilter = (key: ProjectKind | "todos") => {
    setFilter(key);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // depois do React trocar a lista, os cards novos entram juntos
    requestAnimationFrame(() =>
      gsap.fromTo(
        root.current?.querySelectorAll("[data-card]") ?? [],
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "expo.out", stagger: 0.04 }
      )
    );
  };

  return (
    <section ref={root} id="projetos" className="relative z-10 bg-bg px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel index={2}>Trabalhos selecionados</SectionLabel>
            <h2 data-index-title className="display mt-4 text-[22vw] md:text-[11vw]">
              Projetos
              <sup className="ml-2 align-top font-mono text-[0.16em] font-medium tracking-normal text-fg-dim">
                ({String(projects.length).padStart(2, "0")})
              </sup>
            </h2>
          </div>

          <div role="tablist" aria-label="Filtrar projetos" className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => changeFilter(f.key)}
                  className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                    active ? "border-fg bg-fg text-bg" : "border-line text-fg-dim hover:border-fg-dim hover:text-fg"
                  }`}
                >
                  {f.label} <span className="opacity-50">{counts[f.key] ?? 0}</span>
                </button>
              );
            })}
          </div>
        </div>

        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          {list.map((p, i) => (
            <li key={p.slug} data-card className={SPANS[i % SPANS.length]}>
              <ProjectCard project={p} onOpen={() => setZoomed(p)} />
            </li>
          ))}
        </ul>
      </div>

      {zoomed && (
        <Lightbox
          key={zoomed.slug}
          items={toMedia(zoomed)}
          onClose={() => setZoomed(null)}
          aside={<CaseInfo project={zoomed} />}
        />
      )}
    </section>
  );
}

function ProjectCard({ project: p, onOpen }: { project: Project; onOpen: () => void }) {
  const n = projects.indexOf(p) + 1;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-line bg-bg-card text-left transition-colors duration-500 hover:border-fg/30"
    >
      <span className="relative block aspect-16/10 overflow-hidden">
        <Cover
          project={p}
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.045]"
        />
        {/* escurece o topo para os selos ficarem legíveis em qualquer capa */}
        <span aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-black/45 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[11px] tabular-nums text-fg">
          {String(n).padStart(2, "0")}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fg">
          {KIND_LABEL[p.kind]}
        </span>
      </span>

      <span className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <span className="flex items-start justify-between gap-4">
          <span className="min-w-0">
            <span className="hover-iris display block text-3xl leading-[0.95] md:text-4xl">
              {p.name.replace(/^InterMed · /, "")}
            </span>
            <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-fg-dim">
              {p.group ?? p.date}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:-rotate-45 group-hover:border-fg group-hover:bg-fg group-hover:text-bg"
          >
            →
          </span>
        </span>
        <span className="line-clamp-2 text-sm leading-relaxed text-fg-dim">{p.summary}</span>
        <span className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {p.stack.slice(0, 4).map((s) => (
            <span key={s} className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-fg-dim">
              {s}
            </span>
          ))}
        </span>
      </span>
    </button>
  );
}

/** Ficha do caso, ao lado da galeria. */
function CaseInfo({ project: p }: { project: Project }) {
  const n = projects.indexOf(p) + 1;
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-line bg-bg-card p-6 text-left md:p-7">
      <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.16em] text-fg-dim">
        <span className="tabular-nums">
          {String(n).padStart(2, "0")} · {KIND_LABEL[p.kind]}
        </span>
        {p.group && <span className="text-right text-fg-faint">{p.group}</span>}
      </div>

      <div>
        <h3 className="display text-[11vw] leading-[1] md:text-5xl">{p.name.replace(/^InterMed · /, "")}</h3>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-faint">{p.date}</p>
      </div>

      <p className="text-sm leading-relaxed text-fg-dim">{p.summary}</p>

      {p.highlights && (
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-faint">O que tem por trás</p>
          <ol className="mt-3 flex flex-col">
            {p.highlights.map((h, i) => (
              <li key={h} className="flex gap-3 border-t border-line py-3 text-sm leading-snug">
                <span className="text-iris shrink-0 font-mono text-[11px] font-medium tabular-nums leading-5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{h}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {p.stack.map((s) => (
          <span key={s} className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-fg-dim">
            {s}
          </span>
        ))}
      </div>

      {p.href && (
        <a
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex w-fit items-center gap-3 rounded-full bg-fg px-5 py-3 text-sm font-bold text-bg transition-transform hover:scale-[1.03]"
        >
          Ver ao vivo
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:-rotate-45">→</span>
        </a>
      )}
    </div>
  );
}

function Cover({ project, className }: { project: Project; className: string }) {
  if (project.videoSrc) {
    return <video src={project.videoSrc} className={className} autoPlay muted loop playsInline preload="metadata" />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- asset local em /public
    <img
      src={project.thumbnailSrc}
      alt=""
      loading="lazy"
      className={className}
      style={{ backgroundColor: project.thumbnailColor }}
    />
  );
}

/** Capa (vídeo ou imagem) seguida das telas extras da galeria. */
function toMedia(project: Project): LightboxMedia[] {
  const items: LightboxMedia[] = [];
  if (project.videoSrc) {
    items.push({ type: "video", src: project.videoSrc, title: project.name, caption: project.date });
  } else if (project.thumbnailSrc) {
    items.push({ type: "image", src: project.thumbnailSrc, title: project.name, caption: project.date });
  }
  for (const g of project.gallery ?? []) {
    items.push({ type: "image", src: g.src, title: project.name, caption: g.caption });
  }
  return items;
}
