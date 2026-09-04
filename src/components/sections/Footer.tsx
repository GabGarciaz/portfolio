"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useLenis } from "@/hooks/useLenis";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const lenisRef = useLenis();

  const toTop = () => {
    const lenis = lenisRef?.current;
    if (lenis) lenis.scrollTo(0, { duration: 1.1 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // O nome gigante desliza horizontalmente conforme o rodapé entra
      gsap.fromTo(
        "[data-marquee]",
        { xPercent: 6 },
        {
          xPercent: -6,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: 0.4 },
        }
      );
    },
    { scope: root }
  );

  return (
    <footer
      ref={root}
      id="rodape"
      className="relative overflow-hidden border-t border-line px-6 pt-28 md:px-12 md:pt-40"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[40vh] w-[70vw] -translate-x-1/2 rounded-full bg-gold/8 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl">
        <span className="text-[11px] uppercase tracking-[0.3em] text-gold">Contato</span>

        <Reveal
          as="h2"
          className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight md:text-7xl"
        >
          Vamos construir algo juntos.
        </Reveal>

        <div className="mt-14 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <a
              href="https://wa.me/5521987969097"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-fit items-center gap-4 text-2xl font-bold transition-colors hover:text-gold md:text-3xl"
            >
              {site.phone}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
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
                  className="text-fg-dim transition-colors hover:text-gold"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={toTop}
            className="flex w-fit items-center gap-3 rounded-full border border-line px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-fg-dim transition-colors hover:border-gold hover:text-gold"
          >
            Voltar ao topo <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>

      {/* Nome gigante sangrando na base */}
      <div className="relative mt-24 select-none overflow-hidden">
        <div
          data-marquee
          aria-hidden="true"
          className="whitespace-nowrap text-center text-[20vw] font-black leading-[0.78] tracking-tight text-transparent"
          style={{ WebkitTextStroke: "1px rgba(234,238,251,0.14)" }}
        >
          {site.name.first} {site.name.last}
        </div>
      </div>

      <div className="relative flex flex-col gap-2 border-t border-line py-6 text-[10px] uppercase tracking-[0.12em] text-fg-faint sm:flex-row sm:items-center sm:justify-between sm:text-[11px] sm:tracking-[0.2em]">
        <span>© {site.copyrightYear} · {site.name.first} Medeiros Garcia</span>
        <span>Rio de Janeiro · Brasil</span>
      </div>
    </footer>
  );
}
