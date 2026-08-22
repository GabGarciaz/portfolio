import type { SkillCategory } from "@/types/content";

export const skills: SkillCategory[] = [
  {
    id: "linguagens",
    label: "Linguagens",
    tags: ["Python", "JavaScript", "Node.js"],
  },
  {
    id: "frameworks",
    label: "Frameworks",
    tags: ["Next.js", "React"],
  },
  {
    id: "bancos",
    label: "Bancos de Dados",
    tags: ["PostgreSQL"],
  },
  {
    id: "integracoes",
    label: "Integrações & IA",
    tags: ["API Claude (Anthropic)", "IA multimodal", "API Mercado Pago", "Automação de processos"],
  },
  {
    id: "infra",
    label: "Infraestrutura & Deploy",
    tags: ["Vercel"],
  },
  {
    id: "design",
    label: "Design & Marketing",
    tags: ["Canva", "Identidade visual", "Marketing de conteúdo", "Design gráfico"],
  },
];
