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

export interface Project {
  slug: string;
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
  href?: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  tags: string[];
}
