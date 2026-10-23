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
    bio: "Meu nome é Gabriel Medeiros Garcia. Trabalho com marketing e produto digital na InterMed Day Hospital da Plástica e construo os próprios produtos com inteligência artificial: projeto, coordeno a construção com IA e coloco no ar. Lancei um app de emagrecimento com assistente de IA, um painel de marketing com assistente de voz, robôs de WhatsApp e a atribuição de vendas por anúncio, sempre dentro das regras de comunicação em saúde. Curso Análise e Desenvolvimento de Sistemas.",
  },
};
