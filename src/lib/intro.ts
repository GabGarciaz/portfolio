/**
 * Fase da intro, compartilhada entre o terminal (Intro) e o topo (Hero).
 *  pending → o terminal está digitando
 *  launch  → a tela do terminal sobe e o nome do topo decodifica
 *  done    → site normal
 */
export type IntroPhase = "pending" | "launch" | "done";

const SEEN_KEY = "gg-intro-seen";

function initialPhase(): IntroPhase {
  if (typeof window === "undefined") return "pending";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "done";
  try {
    // a intro roda uma vez por sessão; recarregar a aba vai direto ao site
    if (sessionStorage.getItem(SEEN_KEY)) return "done";
  } catch {}
  return "pending";
}

let phase: IntroPhase = initialPhase();
const listeners = new Set<() => void>();

export function getIntroPhase() {
  return phase;
}

export function getServerIntroPhase(): IntroPhase {
  return "pending";
}

export function setIntroPhase(next: IntroPhase) {
  if (next === phase) return;
  phase = next;
  if (next !== "pending") {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
  }
  listeners.forEach((l) => l());
}

export function subscribeIntro(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** O topo só anima quando o terminal começa a sair da frente. */
export function introReleased(p: IntroPhase = phase) {
  return p === "launch" || p === "done";
}
