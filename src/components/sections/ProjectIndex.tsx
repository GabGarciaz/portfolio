"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { projects } from "@/data/projects";
import { Lightbox, type LightboxMedia } from "@/components/ui/Lightbox";
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

/**
 * Índice numerado dos projetos. No desktop a capa flutua seguindo o cursor
 * enquanto ele passa pelas linhas; no celular cada linha já mostra a capa.
 * Clicar abre a página do caso: galeria em tela cheia e a ficha do projeto.
 */
export function ProjectIndex() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<ProjectKind | "todos">("todos");
  const [hovered, setHovered] = useState<Project | null>(null);
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
      const el = preview.current;
      if (!el) return;
      gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0.6, opacity: 0 });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-index-title]", {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      });
    },
    { scope: root }
  );

  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = preview.current;
    if (!el || e.pointerType !== "mouse") return;
    if (!xTo.current || !yTo.current) {
      xTo.current = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
      yTo.current = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
    }
    xTo.current(e.clientX);
    yTo.current(e.clientY);
    // inclina a capa conforme a velocidade horizontal do mouse
    gsap.to(el, { rotate: gsap.utils.clamp(-10, 10, e.movementX * 0.6), duration: 0.5, overwrite: "auto" });
  };

  const showPreview = (p: Project, e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    setHovered(p);
    const el = preview.current;
    if (!el) return;
    if (!xTo.current) gsap.set(el, { x: e.clientX, y: e.clientY });
    gsap.to(el, { scale: 1, opacity: 1, duration: 0.45, ease: "expo.out", overwrite: "auto" });
  };

  const hidePreview = () => {
    const el = preview.current;
    if (el) gsap.to(el, { scale: 0.6, opacity: 0, rotate: 0, duration: 0.35, ease: "power2.out", overwrite: "auto" });
  };

  return (
    <section
      ref={root}
      id="projetos"
      className="relative z-10 bg-bg px-5 py-24 md:px-12 md:py-36"
      onPointerMove={onMove}
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-fg-dim">Trabalhos selecionados</span>
            <h2 data-index-title className="display mt-4 text-[22vw] md:text-[11vw]">
              Projetos<sup className="ml-2 align-top font-sans text-[0.18em] font-medium tracking-normal text-fg-dim">({projects.length})</sup>
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
                  onClick={() => setFilter(f.key)}
                  className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition-colors ${
                    active ? "border-fg bg-fg text-bg" : "border-line text-fg-dim hover:border-fg-dim hover:text-fg"
                  }`}
                >
                  {f.label} <span className="opacity-50">{counts[f.key] ?? 0}</span>
                </button>
              );
            })}
          </div>
        </div>

        <ol className="mt-14 border-t border-line md:mt-20" onPointerLeave={hidePreview}>
          {list.map((p) => {
            const n = projects.indexOf(p) + 1;
            return (
              <li key={p.slug} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setZoomed(p)}
                  onPointerEnter={(e) => showPreview(p, e)}
                  className="group grid w-full grid-cols-[auto_1fr] items-center gap-x-4 gap-y-4 py-6 text-left md:grid-cols-[5rem_1fr_16rem_3rem] md:gap-x-8 md:py-8"
                >
                  <span className="self-start pt-1 font-sans text-xs tabular-nums text-fg-faint md:self-center md:pt-0 md:text-sm">
                    {String(n).padStart(2, "0")}
                  </span>

                  <span className="min-w-0">
                    <span className="display hover-iris inline-block text-[11vw] leading-[0.9] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-4 md:text-[4.6vw]">
                      {p.name.replace(/^InterMed · /, "")}
                    </span>
                    <span className="mt-2 block text-[11px] uppercase tracking-[0.16em] text-fg-dim md:hidden">
                      {p.group ?? p.date}
                    </span>
                  </span>

                  <span className="hidden text-[11px] uppercase leading-relaxed tracking-[0.16em] text-fg-dim md:block">
                    {p.group ? (
                      <>
                        {p.group}
                        <br />
                        <span className="text-fg-faint">{p.date}</span>
                      </>
                    ) : (
                      p.date
                    )}
                  </span>

                  <span
                    aria-hidden="true"
                    className="hidden h-12 w-12 items-center justify-center rounded-full border border-line text-lg transition-all duration-300 group-hover:rotate-[-45deg] group-hover:border-fg group-hover:bg-fg group-hover:text-bg md:flex"
                  >
                    →
                  </span>

                  {/* celular: capa sempre visível */}
                  <span className="col-span-2 block overflow-hidden rounded-xl border border-line md:hidden">
                    <Cover project={p} className="aspect-[16/10] w-full object-cover" />
                  </span>
                  <span className="col-span-2 -mt-1 block text-sm leading-relaxed text-fg-dim md:hidden">
                    {p.summary}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* capa flutuante que segue o cursor (só desktop) */}
      <div
        ref={preview}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-40 hidden w-[26vw] max-w-[440px] overflow-hidden rounded-xl border border-line bg-bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)] md:block"
      >
        {hovered && <Cover key={hovered.slug} project={hovered} className="aspect-[4/3] w-full object-cover" />}
        {hovered && (
          <div className="flex flex-wrap gap-1.5 p-3">
            {hovered.stack.slice(0, 4).map((s) => (
              <span key={s} className="rounded-full border border-line px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-fg-dim">
                {s}
              </span>
            ))}
          </div>
        )}
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

/** Ficha do caso, ao lado da galeria. */
function CaseInfo({ project: p }: { project: Project }) {
  const n = projects.indexOf(p) + 1;
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-line bg-bg-card p-6 text-left md:p-7">
      <div className="flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.18em] text-fg-dim">
        <span className="tabular-nums">
          {String(n).padStart(2, "0")} · {KIND_LABEL[p.kind]}
        </span>
        {p.group && <span className="text-right text-fg-faint">{p.group}</span>}
      </div>

      <div>
        <h3 className="display text-[11vw] leading-[1] md:text-5xl">{p.name.replace(/^InterMed · /, "")}</h3>
        <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-fg-faint">{p.date}</p>
      </div>

      <p className="text-sm leading-relaxed text-fg-dim">{p.summary}</p>

      {p.highlights && (
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-fg-faint">O que tem por trás</p>
          <ol className="mt-3 flex flex-col">
            {p.highlights.map((h, i) => (
              <li key={h} className="flex gap-3 border-t border-line py-3 text-sm leading-snug">
                <span className="text-iris shrink-0 font-sans text-[11px] font-bold tabular-nums leading-5">
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
          <span key={s} className="rounded-full border border-line px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-fg-dim">
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
