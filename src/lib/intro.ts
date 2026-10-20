/**
 * Fase da intro, compartilhada entre a camada HTML (Intro, Hero) e o palco
 * WebGL (que lê a fase dentro do useFrame, sem re-render).
 *  pending → as trilhas desenham, chip escondido
 *  boot    → o chip liga no centro da tela
 *  launch  → o chip voa para o topo e o hero entra
 *  done    → site normal
 */
export type IntroPhase = "pending" | "boot" | "launch" | "done";

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
  if (next === "boot") {
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

/** O hero (e o que mais precisar) só entra quando o chip começa a voar. */
export function introReleased(p: IntroPhase = phase) {
  return p === "launch" || p === "done";
}

// O palco WebGL avisa quando o chip já desenhou de verdade (o vidro leva um
// tempo para compilar no primeiro carregamento). A intro espera por isso.
let stageReady = false;
const readyListeners = new Set<() => void>();

export function markStageReady() {
  if (stageReady) return;
  stageReady = true;
  readyListeners.forEach((l) => l());
}

export function whenStageReady(cb: () => void) {
  if (stageReady) {
    cb();
    return () => {};
  }
  readyListeners.add(cb);
  return () => {
    readyListeners.delete(cb);
  };
}
