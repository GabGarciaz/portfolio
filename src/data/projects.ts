import type { Project } from "@/types/content";

export const projects: Project[] = [
  {
    slug: "intermed-site",
    name: "InterMed · Site institucional",
    date: "Trabalho atual",
    summary:
      "Site da InterMed Day Hospital da Plástica, feito em HTML, CSS e JavaScript puros, sem framework. Abertura animada, catálogo de procedimentos, página da estrutura hospitalar, área de cursos, programa de indicação com moeda própria e uma página de links para as redes.",
    stack: ["HTML", "CSS", "JavaScript", "PHP", "SEO"],
    thumbnailColor: "#f4ece2",
    thumbnailSrc: "/images/projects/intermed/home.webp",
    group: "InterMed · 01 / 03",
    gallery: [
      { src: "/images/projects/intermed/intro-mobile.webp", caption: "Abertura animada no celular" },
      { src: "/images/projects/intermed/home-mobile.webp", caption: "Página inicial no celular" },
      { src: "/images/projects/intermed/estrutura.webp", caption: "Estrutura hospitalar" },
      { src: "/images/projects/intermed/embaixadores.webp", caption: "Círculo InterMed, programa de indicação" },
      { src: "/images/projects/intermed/links.webp", caption: "Página de links das redes" },
    ],
  },
  {
    slug: "intermed-projeto",
    name: "InterMed · Jornada de reserva",
    date: "Produto digital",
    summary:
      "O paciente monta o próprio projeto: escolhe os procedimentos num carrinho, responde um quiz de anamnese, uma pergunta por tela, e reserva a avaliação. O servidor recalcula a estimativa e guarda os dados de saúde separados do contato, e a agenda consulta os horários livres pela API do Feegow.",
    stack: ["JavaScript", "PHP", "API Feegow", "LGPD"],
    thumbnailColor: "#f4ece2",
    thumbnailSrc: "/images/projects/intermed/montar-destaques.webp",
    group: "InterMed · 02 / 03",
    gallery: [
      { src: "/images/projects/intermed/wizard-1.webp", caption: "Etapa 1 do wizard, com a estimativa" },
    ],
  },
  {
    slug: "intermed-lps",
    name: "InterMed · Landing pages",
    date: "Tráfego pago",
    summary:
      "Sete landing pages de procedimentos para as campanhas de anúncio, geradas a partir de um molde único por script. Cada formulário grava o lead e já encaminha a pessoa para o grupo de WhatsApp do procedimento que ela escolheu.",
    stack: ["HTML", "CSS", "Python", "Meta Ads", "Google Ads"],
    thumbnailColor: "#0e0e0e",
    thumbnailSrc: "/images/projects/intermed/lp-hidrolipo.webp",
    group: "InterMed · 03 / 03",
    gallery: [
      { src: "/images/projects/intermed/lp-mobile.webp", caption: "Landing page no celular" },
      { src: "/images/projects/intermed/procedimentos-cards.webp", caption: "Vitrine de procedimentos do site" },
    ],
  },
  {
    slug: "scanner-sti",
    name: "Scanner STI",
    date: "Automação com IA",
    summary:
      "Automação em Python que extrai dados de documentos escaneados usando API de IA multimodal. Processa as imagens em lote, grava os resultados em PostgreSQL e passa por revisão humana antes da confirmação, acabando com a digitação manual foto por foto.",
    stack: ["Python", "API Claude (Anthropic)", "PostgreSQL"],
    thumbnailColor: "#101a3d",
    thumbnailSrc: "/images/projects/scanner-sti.png",
    group: "Automação STI · 01 / 02",
  },
  {
    slug: "documentos-andrews",
    name: "Documentos do Andrews",
    date: "Aplicativo desktop",
    summary:
      "Aplicativo desktop em Python que vigia a pasta de entrada, lê os PDFs escaneados e extrai os dados de cada documento numa fila de conferência. Depois de aprovados, os registros são lançados direto no banco de dados do TOTVS, fechando o ciclo entre o papel digitalizado e o sistema do colégio.",
    stack: ["Python", "App desktop", "Extração de PDFs", "TOTVS"],
    thumbnailColor: "#0e1a33",
    thumbnailSrc: "/images/projects/documentos-andrews.png",
    group: "Automação STI · 02 / 02",
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
    slug: "edicao-video",
    name: "Edição de Vídeo",
    date: "CapCut & IA",
    summary:
      "Edição de vídeos de divulgação no CapCut, combinando cortes dinâmicos, legendas e efeitos com ferramentas de IA para acelerar o processo de produção.",
    stack: ["CapCut", "Edição de vídeo", "Ferramentas de IA"],
    thumbnailColor: "#1a1a2e",
    videoSrc: "/images/projects/edicao-video.mp4",
  },
  {
    slug: "avatar-ia",
    name: "Avatar com IA",
    date: "Vídeo para marketing",
    summary:
      "Vídeo de divulgação para a Terê Sorvetes com apresentadora gerada por inteligência artificial, do roteiro à edição final. Formato vertical pronto para redes sociais: uma forma de a loja manter conteúdo com apresentador próprio sem depender de gravação, elenco ou estúdio.",
    stack: ["Avatar com IA", "Geração de vídeo", "CapCut", "Marketing"],
    thumbnailColor: "#241a3a",
    videoSrc: "/images/projects/avatar-ia.mp4",
  },
  {
    slug: "identidade-tere-divulgacao",
    name: "Identidade Terê · Divulgação",
    date: "Design & Marketing",
    summary:
      "Arte de divulgação da linha de milkshakes, com chamada para pedidos pelo WhatsApp e presença nas redes sociais da loja.",
    stack: ["Canva", "Identidade visual", "Marketing de conteúdo"],
    thumbnailColor: "#4a1d5e",
    thumbnailSrc: "/images/projects/arte-milkshake-produto.jpeg",
  },
  {
    slug: "identidade-tere-milkshake",
    name: "Identidade Terê · Milkshake",
    date: "Design & Marketing",
    summary:
      "Arte de divulgação da linha de milkshakes, reforçando a identidade visual da marca nos canais de venda e redes sociais.",
    stack: ["Canva", "Identidade visual", "Marketing de conteúdo"],
    thumbnailColor: "#6b21a8",
    thumbnailSrc: "/images/projects/arte-milkshake.png",
  },
];
