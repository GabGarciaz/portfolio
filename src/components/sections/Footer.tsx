"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useLenis } from "@/hooks/useLenis";
import { site } from "@/data/site";

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const lenisRef = useLenis();

  const toTop = () => {
    const lenis = lenisRef?.current;
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // as duas linhas do título se cruzam enquanto o rodapé entra
      gsap.fromTo(
        "[data-cta-row='0']",
        { xPercent: -8 },
        { xPercent: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: 0.4 } }
      );
      gsap.fromTo(
        "[data-cta-row='1']",
        { xPercent: 8 },
        { xPercent: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: 0.4 } }
      );
    },
    { scope: root }
  );

  return (
    <footer ref={root} id="rodape" className="relative z-10 overflow-hidden px-5 pt-24 md:px-12 md:pt-36">
      <div className="mx-auto max-w-[1600px]">
        <span className="text-[11px] uppercase tracking-[0.3em] text-fg-dim">Contato</span>

        {/* o vidro do palco WebGL pousa sobre este título */}
        <h2 data-gl-anchor="contato" aria-label="Vamos construir" className="mt-6">
          <span data-cta-row="0" aria-hidden="true" className="block">
            <span data-gl-text className="display inline-block text-[24vw] md:text-[17vw]">Vamos</span>
          </span>
          <span data-cta-row="1" aria-hidden="true" className="block text-right">
            <span data-gl-text className="display inline-block text-[24vw] md:text-[17vw]">Construir</span>
          </span>
        </h2>

        <div className="mt-16 flex flex-col gap-12 md:mt-24 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-5">
            <p className="max-w-sm text-base leading-relaxed text-fg-dim">
              Tem um processo manual que come o dia da sua equipe, ou um site que precisa sair do papel? Me chama.
            </p>
            <a
              href="https://wa.me/5521987969097"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-fit items-center gap-4 rounded-full bg-fg px-7 py-4 text-lg font-bold text-bg transition-transform hover:scale-[1.03] md:text-2xl"
            >
              {site.phone}
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:rotate-[-45deg]">
                →
              </span>
            </a>

            <div className="flex gap-6 text-[11px] uppercase tracking-[0.2em]">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg-dim underline-offset-4 transition-colors hover:text-fg hover:underline"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={toTop}
            className="flex w-fit items-center gap-3 rounded-full border border-line px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-fg-dim transition-colors hover:border-fg hover:text-fg"
          >
            Voltar ao topo <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>

      <div className="mx-auto mt-20 flex max-w-[1600px] flex-col gap-2 border-t border-line py-6 text-[10px] uppercase tracking-[0.12em] text-fg-faint sm:flex-row sm:items-center sm:justify-between sm:text-[11px] sm:tracking-[0.2em]">
        <span>© {site.copyrightYear} · {site.name.first} Medeiros Garcia</span>
        <span>Rio de Janeiro · Brasil</span>
      </div>
    </footer>
  );
}
