import type { Project } from "@/types/content";

export const projects: Project[] = [
  {
    slug: "scanner-sti",
    name: "Scanner STI",
    date: "Automação com IA",
    summary:
      "Automação em Python que extrai dados de documentos escaneados usando API de IA multimodal, processando imagens em lote e gravando os resultados em PostgreSQL, com revisão humana antes da confirmação — eliminando a digitação manual foto por foto.",
    stack: ["Python", "API Claude (Anthropic)", "PostgreSQL"],
    thumbnailColor: "#101a3d",
    thumbnailSrc: "/images/projects/scanner-sti.png",
  },
  {
    slug: "tere-ecommerce",
    name: "Terê Sorvetes",
    date: "E-commerce full-stack",
    summary:
      "Aplicação e-commerce full-stack com backend em Node.js e frontend em Next.js, banco PostgreSQL e checkout integrado à API do Mercado Pago. Inclui painel da loja com pedidos em tempo real e gestão de cardápio. Publicada em produção na Vercel.",
    stack: ["Node.js", "Next.js", "PostgreSQL", "Mercado Pago", "Vercel"],
    thumbnailColor: "#4c1d6b",
    thumbnailSrc: "/images/projects/ecommerce-home.png",
  },
  {
    slug: "meridiano",
    name: "Meridiano",
    date: "Site dinâmico",
    summary:
      "Site dinâmico em Next.js para a marca Meridiano, apresentando o produto em sete etapas de construção com renderização dinâmica de conteúdo e navegação dirigida pelo scroll. Publicado na Vercel.",
    stack: ["Next.js", "Vercel"],
    thumbnailColor: "#0d1b3d",
    thumbnailSrc: "/images/projects/meridiano.webp",
  },
  {
    slug: "identidade-tere-delivery",
    name: "Identidade Terê — Delivery",
    date: "Design & Marketing",
    summary:
      "Arte de divulgação para o serviço de entrega da loja, com identidade visual e chamada para pedidos pelo WhatsApp e iFood.",
    stack: ["Canva", "Identidade visual", "Marketing de conteúdo"],
    thumbnailColor: "#6b21a8",
    thumbnailSrc: "/images/projects/arte-acai.png",
  },
  {
    slug: "identidade-tere-milkshake",
    name: "Identidade Terê — Milkshake",
    date: "Design & Marketing",
    summary:
      "Arte de divulgação da linha de milkshakes, reforçando a identidade visual da marca nos canais de venda e redes sociais.",
    stack: ["Canva", "Identidade visual", "Marketing de conteúdo"],
    thumbnailColor: "#6b21a8",
    thumbnailSrc: "/images/projects/arte-milkshake.png",
  },
];
