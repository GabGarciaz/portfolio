export interface Capability {
  title: string;
  text: string;
  stack: string[];
  /** Projeto real que mostra a capacidade na prática. */
  example: { label: string; slug: string };
}

export const capabilities: Capability[] = [
  {
    title: "Desenvolvimento web",
    text: "Sites e produtos digitais do zero ao ar: páginas rápidas, jornadas com várias etapas, integrações com APIs e checkout. Uso framework quando ajuda e código puro quando é mais leve.",
    stack: ["Next.js", "React", "Node.js", "JavaScript", "PHP", "PostgreSQL", "Vercel"],
    example: { label: "Jornada de reserva da InterMed", slug: "intermed-projeto" },
  },
  {
    title: "Automação com IA",
    text: "Robôs que trabalham sozinhos: leem documentos e lançam no sistema, cuidam dos grupos de WhatsApp, vigiam os anúncios do mercado. Sempre com uma trava humana onde um erro custa caro, e com freio para não queimar o número nem a cota.",
    stack: ["Python", "API Claude (Anthropic)", "Playwright", "Docker", "GitHub Actions", "WhatsApp"],
    example: { label: "Robôs de WhatsApp da InterMed", slug: "intermed-robos" },
  },
  {
    title: "Tráfego e dados",
    text: "Campanhas no Meta e no Google ligadas a landing pages e a um painel próprio que cruza anúncios, leads e conversas. Cada anúncio recebe um veredito: manter, pausar ou escalar.",
    stack: ["Meta Ads", "Google Ads", "API do Meta", "Landing pages", "Dashboards"],
    example: { label: "Dashboard de tráfego", slug: "intermed-trafego" },
  },
  {
    title: "Design e vídeo",
    text: "Identidade visual, criativos de campanha e vídeos para redes sociais, incluindo apresentadora gerada por IA. Peças feitas para converter, não só para ficar bonitas.",
    stack: ["Criativos em código", "CapCut", "Avatar com IA", "Identidade visual", "Publicidade médica"],
    example: { label: "Campanha de hidrolipo", slug: "intermed-campanha-hidrolipo" },
  },
];
