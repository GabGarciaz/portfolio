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
  href?: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  tags: string[];
}
