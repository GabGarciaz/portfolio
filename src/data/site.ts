import type { SiteConfig } from "@/types/content";

export const site: SiteConfig = {
  name: {
    first: "Gabriel",
    last: "Garcia.",
  },
  version: "V2.0",
  phone: "21 98796-9097",
  copyrightYear: 2026,
  socials: [
    { label: "GitHub", href: "https://github.com/GabGarciaz?tab=repositories" },
    { label: "WhatsApp", href: "https://wa.me/5521987969097" },
  ],
  nav: [
    { label: "Projetos", href: "#projetos" },
    { label: "Sobre", href: "#sobre" },
    { label: "Contato", href: "#rodape" },
  ],
  about: {
    bio: "Meu nome é Gabriel Medeiros Garcia. Curso Análise e Desenvolvimento de Sistemas e atuo com automações usando inteligência artificial, desenvolvimento de software, marketing e design, do backend em Python e Node.js até a identidade visual do produto final.",
  },
};
