"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  PerformanceMonitor,
  Text,
} from "@react-three/drei";
import * as THREE from "three";

/**
 * Palco fixo atrás da página inteira. Um único contexto WebGL com:
 *  - os textos marcados com `data-gl-text` no HTML, redesenhados aqui na
 *    mesma posição e tamanho, para o vidro refratar as letras de verdade;
 *  - um objeto de vidro iridescente que muda de pose conforme a seção.
 * O HTML continua sendo a fonte do texto (SEO, leitor de tela, seleção);
 * quando o 3D fica pronto, a classe `gl-ready` deixa as letras HTML
 * transparentes e o canvas assume o desenho.
 */

const FONT = "/fonts/Anton-Regular.ttf";
const BG = "#060606";

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

/** Pose do vidro por seção, misturada pela visibilidade de cada uma. */
function GlassObject({ quality }: { quality: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const { viewport, size } = useThree();
  const toWorld = useDomToWorld();
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useFrame((state, delta) => {
    const g = group.current;
    const m = mesh.current;
    if (!g || !m) return;
    const vh = window.innerHeight;
    const vis = (sel: string) => {
      const el = document.querySelector(sel);
      if (!el) return { w: 0, r: null as DOMRect | null };
      const r = el.getBoundingClientRect();
      const w = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0)) / vh;
      return { w, r };
    };

    const hero = vis("#hero");
    const about = vis("#sobre");
    const contact = vis("[data-gl-anchor='contato']");
    const narrow = size.width < 768;
    const base = Math.min(viewport.width, viewport.height);

    // poses: [x, y, escala]
    const poses: [number, number, number, number][] = [];
    if (hero.r) {
      const c = toWorld(hero.r);
      // no celular o nome fica embaixo; o vidro ocupa o vazio de cima sem cobrir o texto
      poses.push([hero.w, 0, c.y * 0.35 + (narrow ? viewport.height * 0.14 : 0), base * (narrow ? 0.26 : 0.24)]);
    }
    // no celular o retrato ocupa a largura toda: o vidro só volta no contato
    if (about.r && !narrow)
      poses.push([about.w * 0.9, viewport.width * 0.3, -viewport.height * 0.05, base * 0.13]);
    if (contact.r) {
      const c = toWorld(contact.r);
      poses.push([contact.w * 1.4, c.x + viewport.width * 0.12, c.y, base * (narrow ? 0.2 : 0.17)]);
    }
    const total = poses.reduce((a, p) => a + p[0], 0);
    let tx = 0, ty = 0, ts = 0;
    if (total > 0.02) {
      for (const [w, x, y] of poses) { tx += (w / total) * x; ty += (w / total) * y; }
      // escala some quando nenhuma seção com vidro está na tela
      ts = poses.reduce((a, p) => a + (p[0] / total) * p[3], 0) * Math.min(1, total * 2.5);
    }

    const k = 1 - Math.pow(0.002, delta);
    g.position.x += (tx - g.position.x) * k;
    g.position.y += (ty - g.position.y) * k;
    const s = g.scale.x + (ts - g.scale.x) * k;
    g.scale.setScalar(Math.max(s, 0.0001));
    g.visible = s > 0.01;

    if (!reduce) {
      const t = state.clock.elapsedTime;
      m.rotation.x = t * 0.18 + state.pointer.y * 0.35;
      m.rotation.y = t * 0.24 + state.pointer.x * 0.5;
      g.position.x += state.pointer.x * 0.15 * k;
      g.position.y += state.pointer.y * 0.1 * k;
    }
  });

  return (
    <group ref={group} scale={0.0001}>
      <mesh ref={mesh}>
        <torusKnotGeometry args={[1, 0.36, 220, 40, 2, 3]} />
        <MeshTransmissionMaterial
          background={new THREE.Color(BG)}
          backside
          backsideThickness={0.4}
          thickness={0.9}
          roughness={0.04}
          ior={1.35}
          chromaticAberration={0.9}
          anisotropicBlur={0.15}
          distortion={0.25}
          distortionScale={0.4}
          temporalDistortion={0.08}
          iridescence={1}
          iridescenceIOR={1.4}
          iridescenceThicknessRange={[100, 900]}
          clearcoat={1}
          samples={quality > 0.5 ? 8 : 4}
          resolution={quality > 0.5 ? 768 : 384}
        />
      </mesh>
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
