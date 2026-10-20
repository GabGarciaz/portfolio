"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor, Text } from "@react-three/drei";
import * as THREE from "three";
import { Chip, type ChipSignals } from "./Chip";
import { getIntroPhase, markStageReady } from "@/lib/intro";

/**
 * Palco fixo atrás da página inteira. Um único contexto WebGL com:
 *  - os textos marcados com `data-gl-text` no HTML, redesenhados aqui na
 *    mesma posição e tamanho, para o vidro refratar as letras de verdade;
 *  - um chip de IA em vidro que liga na intro e muda de pose conforme a seção.
 * O HTML continua sendo a fonte do texto (SEO, leitor de tela, seleção);
 * quando o 3D fica pronto, a classe `gl-ready` deixa as letras HTML
 * transparentes e o canvas assume o desenho.
 */

const FONT = "/fonts/Anton-Regular.ttf";

type Anchor = { el: HTMLElement; text: string; key: string };

function useAnchors() {
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  useEffect(() => {
    const collect = () =>
      setAnchors(
        [...document.querySelectorAll<HTMLElement>("[data-gl-text]")].map((el, i) => ({
          el,
          text: (el.textContent || "").trim().toUpperCase(),
          key: `${i}-${el.textContent}`,
        }))
      );
    collect();
    // a página monta seções em momentos diferentes; recolhe uma vez depois
    const t = setTimeout(collect, 800);
    return () => clearTimeout(t);
  }, []);
  return anchors;
}

/** Converte o retângulo de um elemento da tela para o plano z=0 da cena. */
function useDomToWorld() {
  const { size, viewport } = useThree();
  return (r: DOMRect) => {
    const u = viewport.width / size.width;
    return {
      x: (r.left + r.width / 2 - size.width / 2) * u,
      y: -(r.top + r.height / 2 - size.height / 2) * u,
      u,
    };
  };
}

function DomText({ anchor, onReady }: { anchor: Anchor; onReady: () => void }) {
  const ref = useRef<THREE.Mesh>(null);
  const toWorld = useDomToWorld();

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const r = anchor.el.getBoundingClientRect();
    const { x, y, u } = toWorld(r);
    mesh.position.set(x, y, 0);
    const px = parseFloat(getComputedStyle(anchor.el).fontSize) || 100;
    // fontSize do troika é a altura em unidades de mundo
    (mesh as unknown as { fontSize: number }).fontSize = px * u;
    mesh.visible = r.bottom > -200 && r.top < window.innerHeight + 200;
    // copia a opacidade do HTML (o elemento e até 3 ancestrais), para as
    // animações de entrada feitas no DOM valerem também para o 3D
    let o = 1;
    let node: HTMLElement | null = anchor.el;
    for (let i = 0; i < 4 && node; i++, node = node.parentElement) {
      o *= parseFloat(getComputedStyle(node).opacity || "1");
    }
    (mesh as unknown as { fillOpacity: number }).fillOpacity = o;
  });

  return (
    <Text
      ref={ref}
      font={FONT}
      anchorX="center"
      anchorY="middle"
      color="#f2f2f0"
      letterSpacing={-0.01}
      lineHeight={0.86}
      onSync={onReady}
    >
      {anchor.text}
    </Text>
  );
}

/** Pose do chip por seção, misturada pela visibilidade de cada uma. */
function GlassObject({ quality }: { quality: number }) {
  const tilt = useRef<THREE.Group>(null);
  const group = useRef<THREE.Group>(null);
  const signals = useRef<ChipSignals>({ reveal: getIntroPhase() === "done" ? 1 : 0, speed: 1 });
  const { viewport, size } = useThree();
  const toWorld = useDomToWorld();
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const frames = useRef(0);

  useFrame((state, delta) => {
    const g = group.current;
    const m = tilt.current;
    if (!g || !m) return;
    // o primeiro quadro compila os shaders; no terceiro o chip já está na tela
    if (++frames.current === 3) markStageReady();
    const vh = window.innerHeight;
    const vis = (sel: string) => {
      const el = document.querySelector(sel);
      if (!el) return { w: 0, r: null as DOMRect | null };
      const r = el.getBoundingClientRect();
      const w = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0)) / vh;
      return { w, r };
    };

    const phase = getIntroPhase();
    const hero = vis("#hero");
    const about = vis("#sobre");
    const contact = vis("[data-gl-anchor='contato']");
    const narrow = size.width < 768;
    const base = Math.min(viewport.width, viewport.height);

    // poses: [peso, x, y, escala]
    const poses: [number, number, number, number][] = [];
    if (phase === "boot") {
      // intro: o chip liga no centro, grande e de frente
      poses.push([1, 0, 0, base * (narrow ? 0.3 : 0.24)]);
    } else if (phase !== "pending") {
      if (hero.r) {
        const c = toWorld(hero.r);
        // no celular o nome fica embaixo; o chip ocupa o vazio de cima sem cobrir o texto
        poses.push([hero.w, 0, c.y * 0.35 + (narrow ? viewport.height * 0.14 : 0), base * (narrow ? 0.24 : 0.2)]);
      }
      // no celular o retrato ocupa a largura toda: o chip só volta no contato
      if (about.r && !narrow)
        poses.push([about.w * 0.9, viewport.width * 0.3, -viewport.height * 0.05, base * 0.11]);
      if (contact.r) {
        const c = toWorld(contact.r);
        poses.push([contact.w * 1.4, c.x + viewport.width * 0.12, c.y, base * (narrow ? 0.18 : 0.15)]);
      }
    }
    const total = poses.reduce((a, p) => a + p[0], 0);
    let tx = 0, ty = 0, ts = 0;
    if (total > 0.02) {
      for (const [w, x, y] of poses) { tx += (w / total) * x; ty += (w / total) * y; }
      // escala some quando nenhuma seção com o chip está na tela
      ts = poses.reduce((a, p) => a + (p[0] / total) * p[3], 0) * Math.min(1, total * 2.5);
    }

    // o voo da intro até o topo é um pouco mais lento que o resto
    const k = 1 - Math.pow(phase === "launch" ? 0.02 : 0.002, delta);
    g.position.x += (tx - g.position.x) * k;
    g.position.y += (ty - g.position.y) * k;
    const s = g.scale.x + (ts - g.scale.x) * k;
    g.scale.setScalar(Math.max(s, 0.0001));
    // na espera da intro o chip fica desenhado em escala mínima, para os
    // shaders já compilarem antes de ele aparecer
    g.visible = s > 0.01 || phase === "pending";

    // sinais do circuito: acende no boot, pulsa mais rápido no contato
    const sig = signals.current;
    if (phase === "pending") sig.reveal = 0;
    else sig.reveal = Math.min(1, sig.reveal + delta * (phase === "boot" ? 0.9 : 2));
    sig.speed = reduce ? 0 : 1 + contact.w * 2.5 + (phase === "boot" ? 1.5 : 0);

    // inclinação: de frente na intro; no site, levemente deitado, segue o
    // mouse e balança de um lado para o outro ao longo da página (sem nunca
    // ficar de perfil, onde o chip vira uma linha)
    const doc = document.documentElement;
    const progress = window.scrollY / Math.max(1, doc.scrollHeight - vh);
    const t = state.clock.elapsedTime;
    const intro = phase === "boot" || phase === "pending";
    const rx = intro ? 0 : -0.45 + (reduce ? 0 : Math.sin(t * 0.6) * 0.06 - state.pointer.y * 0.3);
    const ry = intro ? 0 : 0.35 + (reduce ? 0 : Math.sin(progress * Math.PI * 2) * 0.5 + state.pointer.x * 0.35);
    const rz = intro ? 0 : -0.12;
    const kr = 1 - Math.pow(0.01, delta);
    m.rotation.x += (rx - m.rotation.x) * kr;
    m.rotation.y += (ry - m.rotation.y) * kr;
    m.rotation.z += (rz - m.rotation.z) * kr;
    if (!reduce && !intro) {
      g.position.y += Math.sin(t * 0.8) * 0.0015;
      g.position.x += state.pointer.x * 0.15 * k;
      g.position.y += state.pointer.y * 0.1 * k;
    }
  });

  return (
    <group ref={group} scale={0.0001}>
      <group ref={tilt}>
        <Chip quality={quality} signals={signals} />
      </group>
    </group>
  );
}

function Scene() {
  const anchors = useAnchors();
  const [quality, setQuality] = useState(1);
  const ready = useRef(0);

  const markReady = () => {
    ready.current += 1;
    if (ready.current >= anchors.length) document.documentElement.classList.add("gl-ready");
  };

  useEffect(() => () => document.documentElement.classList.remove("gl-ready"), []);

  return (
    <>
      <PerformanceMonitor onDecline={() => setQuality(0.3)} />
      {anchors.map((a) => (
        <DomText key={a.key} anchor={a} onReady={markReady} />
      ))}
      <GlassObject quality={quality} />
      <Environment resolution={256}>
        <Lightformer intensity={4} position={[0, 5, 2]} scale={[12, 3, 1]} color="#ffffff" />
        <Lightformer intensity={3} position={[-6, 0, 3]} scale={[4, 8, 1]} color="#8b7bff" />
        <Lightformer intensity={3} position={[6, 0, 3]} scale={[4, 8, 1]} color="#7af0ff" />
        <Lightformer intensity={2} position={[0, -5, 2]} scale={[12, 3, 1]} color="#ff7ad9" />
      </Environment>
    </>
  );
}

export function GlassStage() {
  // só roda no cliente (ssr: false no loader), então dá para testar na inicialização
  const [webgl] = useState(() => {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  });
  useEffect(() => {
    if (!webgl) markStageReady();
  }, [webgl]);
  if (!webgl) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 35 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
