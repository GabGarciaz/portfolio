export interface Capability {
  title: string;
  text: string;
  stack: string[];
  /** Projeto real que mostra a capacidade na prática. */
  example: { label: string; slug: string };
}

export const capabilities: Capability[] = [
  {
    title: "Produto e web",
    text: "Apps e sites do zero ao ar: app instalável com assinatura, jornada de reserva, landing pages de conversão e loja online. Framework quando ajuda, código puro quando é mais leve, e testes automáticos antes de publicar.",
    stack: ["PHP", "JavaScript", "Next.js", "SQLite", "PostgreSQL", "PWA", "Mercado Pago", "Playwright"],
    example: { label: "InterMedFit, o app com a Nina", slug: "intermedfit-app" },
  },
  {
    title: "Automação e agentes de IA",
    text: "Assistentes de IA com ferramentas e voz, robôs de WhatsApp e leitura de documentos. Vários agentes trabalhando em paralelo com o Claude Code, sempre com aprovação humana e trilha de auditoria onde um erro custa caro.",
    stack: ["API Claude", "Claude Code", "Python", "Docker", "Evolution API", "Cron e systemd"],
    example: { label: "Cometa, o assistente de marketing", slug: "intermed-cometa" },
  },
  {
    title: "Marketing e tráfego",
    text: "Lançamento de produto digital e funil de assinatura, campanhas em grupos de WhatsApp com lançamento por etapas, Meta Ads e atribuição de vendas por anúncio. Tudo dentro das regras do CFM e da LGPD.",
    stack: ["Meta Ads", "Meta Graph API", "Google Sheets", "Landing pages", "Calendário editorial", "CFM e LGPD"],
    example: { label: "Tráfego e atribuição de vendas", slug: "intermed-trafego" },
  },
  {
    title: "Conteúdo e motion",
    text: "Motion graphics feitos por código, vídeo com IA e mascote animada, 3D na web com versão leve no celular. Roteiro de reels, ganchos, carrossel e legenda pensados para o algoritmo e para a regra de saúde.",
    stack: ["GSAP", "FFmpeg", "Three.js", "Veo e Flow", "edge-tts", "Figma e Canva"],
    example: { label: "Fábrica de vídeos com IA", slug: "intermed-motion" },
  },
];
