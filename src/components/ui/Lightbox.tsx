"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/lib/gsap";
import { useLenis } from "@/hooks/useLenis";

export interface LightboxMedia {
  type: "image" | "video";
  src: string;
  title: string;
  caption?: string;
}

/**
 * Visualizador em tela cheia. Vai para o body via portal porque os cards
 * ficam dentro de um contêiner com transform 3D, e um ancestral transformado
 * vira o bloco de contenção de qualquer position: fixed lá dentro.
 *
 * Só existe montado enquanto está aberto: quem usa monta com `key` do
 * projeto, então o índice da galeria recomeça do zero a cada abertura.
 */
export function Lightbox({
  items,
  onClose,
}: {
  items: LightboxMedia[];
  onClose: () => void;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lenisRef = useLenis();
  const [index, setIndex] = useState(0);
  const total = items.length;
  const media = items[index];
  const hasMany = total > 1;

  // Fecha com animação de saída antes de desmontar
  const requestClose = useCallback(() => {
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) {
      onClose();
      return;
    }

    gsap
      .timeline({ onComplete: onClose })
      .to(panel, { opacity: 0, scale: 0.96, y: 10, duration: 0.25, ease: "power2.in" })
      .to(backdrop, { opacity: 0, duration: 0.2, ease: "none" }, "<");
  }, [onClose]);

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + total) % total),
    [total]
  );

  // Trava a rolagem enquanto está aberto
  useEffect(() => {
    const lenis = lenisRef?.current;
    lenis?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      lenis?.start();
      document.body.style.overflow = previousOverflow;
    };
  }, [lenisRef]);

  // Teclado: Escape fecha, setas navegam na galeria
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
      if (hasMany && e.key === "ArrowRight") go(1);
      if (hasMany && e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [requestClose, go, hasMany]);

  // Animação de entrada
  useEffect(() => {
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set([backdrop, panel], { opacity: 1, scale: 1, y: 0 });
      return;
    }

    gsap
      .timeline()
      .fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" })
      .fromTo(
        panel,
        { opacity: 0, scale: 0.94, y: 24 },
        { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "expo.out" },
        "-=0.2"
      );
  }, []);

  // Troca de imagem: fade curto com leve deslize
  useEffect(() => {
    if (!mediaRef.current || index === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      mediaRef.current,
      { opacity: 0, x: 18 },
      { opacity: 1, x: 0, duration: 0.45, ease: "expo.out" }
    );
  }, [index]);

  if (!media || typeof document === "undefined") return null;

  const navBtn =
    "absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg/70 text-fg-dim backdrop-blur transition-colors hover:border-fg hover:text-fg";

  return createPortal(
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-label={media.title}
      onClick={requestClose}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-bg/92 p-4 backdrop-blur-xl md:p-8"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={requestClose}
        aria-label="Fechar"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-line text-fg-dim transition-colors hover:border-fg hover:text-fg md:right-8 md:top-8"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12"></path>
        </svg>
      </button>

      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-full w-full max-w-6xl flex-col items-center gap-4"
      >
        <div ref={mediaRef} key={media.src} className="flex w-full justify-center">
          {media.type === "video" ? (
            <video
              src={media.src}
              controls
              autoPlay
              loop
              playsInline
              className="max-h-[76vh] w-auto max-w-full rounded-xl border border-line shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element -- assets locais em /public */
            <img
              src={media.src}
              alt={media.caption ? `${media.title}: ${media.caption}` : media.title}
              className="max-h-[76vh] w-auto max-w-full rounded-xl border border-line object-contain shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
            />
          )}
        </div>

        {hasMany && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Imagem anterior" className={`${navBtn} left-1 md:-left-4`}>
              <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"></path>
              </svg>
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Próxima imagem" className={`${navBtn} right-1 md:-right-4`}>
              <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </button>
          </>
        )}

        <div className="text-center">
          <p className="text-sm font-bold md:text-base">{media.title}</p>
          {media.caption && (
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-fg-faint">{media.caption}</p>
          )}
          {hasMany && (
            <p className="mt-2 text-[11px] tabular-nums tracking-[0.2em] text-fg-dim" aria-live="polite">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
