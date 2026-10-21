export interface SiteConfig {
  name: {
    first: string;
    last: string;
  };
  version: string;
  phone: string;
  copyrightYear: number;
  socials: { label: string; href: string }[];
  nav: { label: string; href: string }[];
  about: {
    bio: string;
  };
}

export type ProjectKind = "web" | "automacao" | "design";

export interface Project {
  slug: string;
  kind: ProjectKind;
  name: string;
  date: string;
  summary: string;
  stack: string[];
  thumbnailColor: string;
  thumbnailSrc?: string;
  /** Quando presente, o card toca este vídeo em loop no lugar da imagem. */
  videoSrc?: string;
  /** Amarra dois cards como partes do mesmo sistema (ex.: "Automação STI · 01/02"). */
  group?: string;
  /** O que tem de engenharia por trás, em frases curtas (página do caso). */
  highlights?: string[];
  /** Telas extras, navegáveis no lightbox depois da capa. */
  gallery?: { src: string; caption: string }[];
  href?: string;
}

