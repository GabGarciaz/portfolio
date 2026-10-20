"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

/**
 * Chip de IA em vidro: corpo transparente furta-cor, núcleo escuro com a
 * marca "G.G", pinos cromados nos quatro lados e trilhas de circuito
 * ligando o núcleo aos pinos, com pulsos de luz correndo (os "dados").
 * Medidas em unidades locais; quem posiciona e escala é o GlassStage.
 */

const FONT = "/fonts/Anton-Regular.ttf";
const BODY = 2.2;
const HALF = BODY / 2;
const DEPTH = 0.3;
const DIE = 1.05;
const PINS_PER_SIDE = 9;
const PIN_STEP = 0.21;

export type ChipSignals = {
  /** 0 → 1: quanto das trilhas já acendeu (o "boot"). */
  reveal: number;
  /** multiplicador da velocidade dos pulsos. */
  speed: number;
};

/** Posições dos pinos ao longo de um lado, centradas. */
function pinOffsets() {
  const span = (PINS_PER_SIDE - 1) * PIN_STEP;
  return Array.from({ length: PINS_PER_SIDE }, (_, i) => -span / 2 + i * PIN_STEP);
}

/**
 * Trilhas em estilo de placa: saem da borda do núcleo, andam reto, dobram
 * a 45° e terminam no pino. Cada trilha vira uma faixa fina de quads com
 * `aT` (0 no núcleo, 1 no pino) e `aSeed` para desencontrar os pulsos.
 */
function buildTraces() {
  const pos: number[] = [];
  const t: number[] = [];
  const seed: number[] = [];
  const idx: number[] = [];
  const w = 0.022;
  const z = DEPTH / 2 + 0.004;
  const dieEdge = DIE / 2;
  const elbow = dieEdge + 0.06;
  const end = HALF - 0.02;

  const offsets = pinOffsets();
  for (let side = 0; side < 4; side++) {
    const a = (side * Math.PI) / 2;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    offsets.forEach((p, i) => {
      // ponto de saída no núcleo: abre em leque a partir do centro
      const y0 = THREE.MathUtils.clamp(p * 0.48, -dieEdge + 0.05, dieEdge - 0.05);
      const dy = Math.abs(p - y0);
      const pts = [
        [dieEdge, y0],
        [elbow, y0],
        [elbow + dy, p],
        [end, p],
      ].map(([x, y]) => [x * cos - y * sin, x * sin + y * cos]);

      // comprimento acumulado para normalizar aT
      const lens = [0];
      for (let k = 1; k < pts.length; k++) {
        lens.push(lens[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
      }
      const total = lens[lens.length - 1];
      const s = ((side * PINS_PER_SIDE + i) * 0.6180339) % 1;

      for (let k = 1; k < pts.length; k++) {
        const [x1, y1] = pts[k - 1];
        const [x2, y2] = pts[k];
        const len = Math.hypot(x2 - x1, y2 - y1);
        if (len < 1e-4) continue;
        const nx = (-(y2 - y1) / len) * (w / 2);
        const ny = ((x2 - x1) / len) * (w / 2);
        // estende cada segmento meia largura para fechar as dobras
        const ex = ((x2 - x1) / len) * (w / 2);
        const ey = ((y2 - y1) / len) * (w / 2);
        const base = pos.length / 3;
        pos.push(
          x1 - ex + nx, y1 - ey + ny, z,
          x1 - ex - nx, y1 - ey - ny, z,
          x2 + ex + nx, y2 + ey + ny, z,
          x2 + ex - nx, y2 + ey - ny, z
        );
        const ta = lens[k - 1] / total;
        const tb = lens[k] / total;
        t.push(ta, ta, tb, tb);
        seed.push(s, s, s, s);
        idx.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
      }
    });
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("aT", new THREE.Float32BufferAttribute(t, 1));
  g.setAttribute("aSeed", new THREE.Float32BufferAttribute(seed, 1));
  g.setIndex(idx);
  return g;
}

const traceVertex = /* glsl */ `
  attribute float aT;
  attribute float aSeed;
  varying float vT;
  varying float vSeed;
  void main() {
    vT = aT;
    vSeed = aSeed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const traceFragment = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;
  varying float vT;
  varying float vSeed;

  vec3 iris(float x) {
    vec3 a = vec3(0.478, 0.941, 1.0);   // #7af0ff
    vec3 b = vec3(0.545, 0.482, 1.0);   // #8b7bff
    vec3 c = vec3(1.0, 0.478, 0.851);   // #ff7ad9
    return x < 0.5 ? mix(a, b, x * 2.0) : mix(b, c, x * 2.0 - 1.0);
  }

  void main() {
    // o boot acende do núcleo para fora
    float lit = smoothstep(vT - 0.08, vT, uReveal);
    if (lit <= 0.001) discard;

    // pulso viajando do núcleo até o pino
    float head = fract(uTime * 0.35 + vSeed);
    float d = head - vT;
    float pulse = smoothstep(0.18, 0.0, d) * step(0.0, d);

    vec3 col = iris(fract(vSeed + vT * 0.5));
    float glow = 0.16 + pulse * 1.4;
    gl_FragColor = vec4(col * glow, lit * (0.55 + pulse * 0.45));
  }
`;

export function Chip({ quality, signals }: { quality: number; signals: React.RefObject<ChipSignals> }) {
  const pins = useRef<THREE.InstancedMesh>(null);
  const traces = useMemo(() => buildTraces(), []);
  const traceMat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uReveal: { value: 0 } }), []);
  const bg = useMemo(() => new THREE.Color("#060606"), []);

  useLayoutEffect(() => {
    const m = pins.current;
    if (!m) return;
    const o = new THREE.Object3D();
    let n = 0;
    for (let side = 0; side < 4; side++) {
      const a = (side * Math.PI) / 2;
      for (const p of pinOffsets()) {
        // o pino sai pela borda do corpo
        const x = HALF + 0.07;
        o.position.set(x * Math.cos(a) - p * Math.sin(a), x * Math.sin(a) + p * Math.cos(a), 0);
        o.rotation.set(0, 0, a);
        o.updateMatrix();
        m.setMatrixAt(n++, o.matrix);
      }
    }
    m.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((_, delta) => {
    const s = signals.current;
    const mat = traceMat.current;
    if (!mat) return;
    mat.uniforms.uTime.value += delta * (s?.speed ?? 1);
    mat.uniforms.uReveal.value = 1.1 * (s?.reveal ?? 1);
  });

  return (
    <group>
      {/* corpo de vidro: é ele que refrata o nome atrás */}
      <RoundedBox args={[BODY, BODY, DEPTH]} radius={0.07} smoothness={4}>
        <MeshTransmissionMaterial
          background={bg}
          backside
          backsideThickness={0.3}
          thickness={0.8}
          roughness={0.05}
          ior={1.4}
          chromaticAberration={0.7}
          anisotropicBlur={0.12}
          distortion={0.15}
          distortionScale={0.3}
          temporalDistortion={0.05}
          iridescence={1}
          iridescenceIOR={1.4}
          iridescenceThicknessRange={[100, 900]}
          clearcoat={1}
          samples={quality > 0.5 ? 8 : 4}
          resolution={quality > 0.5 ? 768 : 384}
        />
      </RoundedBox>

      <mesh geometry={traces} renderOrder={2}>
        <shaderMaterial
          ref={traceMat}
          vertexShader={traceVertex}
          fragmentShader={traceFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* núcleo: o die do processador, com a marca */}
      <RoundedBox args={[DIE, DIE, 0.1]} radius={0.03} smoothness={3} position={[0, 0, DEPTH / 2 + 0.05]}>
        <meshPhysicalMaterial
          color="#07070b"
          metalness={0.2}
          roughness={0.45}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
          iridescence={0.5}
          iridescenceIOR={1.6}
        />
      </RoundedBox>
      <Text font={FONT} fontSize={0.42} position={[0, 0.06, DEPTH / 2 + 0.105]} color="#f2f2f0" anchorX="center" anchorY="middle">
        G.G
      </Text>
      <Text
        font={FONT}
        fontSize={0.07}
        letterSpacing={0.2}
        position={[0, -0.3, DEPTH / 2 + 0.105]}
        color="#8a8a86"
        anchorX="center"
        anchorY="middle"
      >
        GG-26 · AI CORE
      </Text>

      {/* pinos cromados */}
      <instancedMesh ref={pins} args={[undefined, undefined, PINS_PER_SIDE * 4]}>
        <boxGeometry args={[0.16, 0.07, 0.05]} />
        <meshStandardMaterial color="#e9e9f0" metalness={1} roughness={0.22} />
      </instancedMesh>
    </group>
  );
}
