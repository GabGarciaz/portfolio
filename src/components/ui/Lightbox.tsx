"use client";

import { useCallback, useEffect, useRef } from "react";
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
 */
export function Lightbox({
  media,
  onClose,
}: {
  media: LightboxMedia | null;
  onClose: () => void;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lenisRef = useLenis();
  const isOpen = media !== null;

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

  // Trava a rolagem enquanto está aberto
  useEffect(() => {
    if (!isOpen) return;

    const lenis = lenisRef?.current;
    lenis?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      lenis?.start();
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, lenisRef]);

  // Escape fecha; foco vai para o botão de fechar
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, requestClose]);

  // Animação de entrada
  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen]);

  if (!media || typeof document === "undefined") return null;

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
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-line text-fg-dim transition-colors hover:border-gold hover:text-gold md:right-8 md:top-8"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M18 6 6 18M6 6l12 12"></path>
        </svg>
      </button>

      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full w-full max-w-5xl flex-col items-center gap-4"
      >
        {media.type === "video" ? (
          <video
            src={media.src}
            controls
            autoPlay
            loop
            playsInline
            className="max-h-[78vh] w-auto max-w-full rounded-xl border border-line shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element -- assets locais em /public */
          <img
            src={media.src}
            alt={media.title}
            className="max-h-[78vh] w-auto max-w-full rounded-xl border border-line object-contain shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
          />
        )}

        <div className="text-center">
          <p className="text-sm font-bold md:text-base">{media.title}</p>
          {media.caption && (
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-fg-faint">
              {media.caption}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
