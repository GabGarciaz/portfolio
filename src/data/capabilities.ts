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
    text: "Robôs que leem documentos, extraem dados e lançam no sistema, sempre com uma etapa de conferência humana. O objetivo é tirar das pessoas o trabalho de digitar a mesma coisa todo dia.",
    stack: ["Python", "API Claude (Anthropic)", "IA multimodal", "Extração de PDFs", "TOTVS"],
    example: { label: "Scanner STI", slug: "scanner-sti" },
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
    stack: ["Canva", "CapCut", "Avatar com IA", "Identidade visual", "Criativos"],
    example: { label: "Campanha de hidrolipo", slug: "intermed-campanha-hidrolipo" },
  },
];
