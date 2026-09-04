"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * Núcleo central: esfera distorcida com material metálico dourado.
 * A distorção é animada, então a peça nunca fica parada.
 */
function Core() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.18;
    ref.current.rotation.z = Math.sin(t * 0.25) * 0.12;
  });

  return (
    <mesh ref={ref} scale={0.92}>
      <icosahedronGeometry args={[1, 64]} />
      <MeshDistortMaterial
        color="#d9b26a"
        metalness={1}
        roughness={0.16}
        distort={0.32}
        speed={1.4}
        envMapIntensity={2.4}
      />
    </mesh>
  );
}

/** Anéis finos orbitando o núcleo, em inclinações diferentes. */
function Ring({
  radius,
  tilt,
  speed,
  color,
  thickness = 0.006,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  color: string;
  thickness?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * speed;
  });

  return (
    <mesh ref={ref} rotation={tilt}>
      <torusGeometry args={[radius, thickness, 16, 220]} />
      <meshStandardMaterial
        color={color}
        metalness={0.9}
        roughness={0.25}
        emissive={color}
        emissiveIntensity={0.35}
      />
    </mesh>
  );
}

/** Partículas douradas suspensas, dando profundidade ao fundo. */
function makeDustPositions(count: number) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 3.2 + Math.random() * 3.4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55;
    arr[i * 3 + 2] = r * Math.cos(phi);
  }
  return arr;
}

function Dust({ count = 90 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  // Inicializador preguiçoso do useState: roda uma única vez, no mount —
  // é o mecanismo sancionado pelo React para setup impuro pontual.
  const [positions] = useState(() => makeDustPositions(count));

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.035;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#f0d9a0"
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** Todo o conjunto acompanha o mouse com suavização — parallax 3D real. */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    const { x, y } = state.pointer;
    // damping manual: aproxima do alvo a cada frame, independente do FPS
    const k = 1 - Math.pow(0.001, delta);
    group.current.rotation.y += (x * 0.32 - group.current.rotation.y) * k;
    group.current.rotation.x += (-y * 0.22 - group.current.rotation.x) * k;
  });

  return <group ref={group}>{children}</group>;
}

/**
 * Enquadra a cena pela proporção da tela. Com FOV fixo, uma viewport em
 * retrato enxerga uma faixa horizontal estreita e os anéis (raio até 3)
 * estouram para fora. Aqui a câmera recua o quanto for preciso para caber.
 */
function ResponsiveFraming() {
  const get = useThree((s) => s.get);
  const size = useThree((s) => s.size);

  useEffect(() => {
    const cam = get().camera as THREE.PerspectiveCamera;
    const aspect = size.width / Math.max(size.height, 1);
    const halfFov = (cam.fov * Math.PI) / 360;
    // meia-largura visível desejada: raio do maior anel mais uma folga
    const distance = 4.2 / (Math.tan(halfFov) * Math.max(aspect, 0.3));
    cam.position.z = Math.min(Math.max(distance, 9.5), 26);
    cam.updateProjectionMatrix();
  }, [get, size]);

  return null;
}

/** Em retrato, desce o conjunto para não ficar exatamente atrás do nome. */
function VerticalOffset({ children }: { children: React.ReactNode }) {
  const size = useThree((s) => s.size);
  const isPortrait = size.width / Math.max(size.height, 1) < 0.9;

  return <group position={[0, isPortrait ? -2 : 0, 0]}>{children}</group>;
}

function Scene() {
  return (
    <>
      <ResponsiveFraming />
      <ambientLight intensity={0.35} />
      <spotLight position={[6, 7, 5]} angle={0.4} penumbra={1} intensity={90} color="#ffffff" />
      <pointLight position={[-6, -3, -4]} intensity={40} color="#2f6bff" />

      <VerticalOffset>
        <Rig>
          <Float speed={1.5} rotationIntensity={0.35} floatIntensity={0.7}>
            <Core />
          </Float>

          <Ring radius={2.05} tilt={[Math.PI / 2.4, 0.35, 0]} speed={0.28} color="#d9b26a" />
          <Ring radius={2.55} tilt={[Math.PI / 1.75, -0.5, 0.4]} speed={-0.2} color="#6d9bff" thickness={0.004} />
          <Ring radius={3.05} tilt={[Math.PI / 2.9, 0.9, -0.3]} speed={0.14} color="#d9b26a" thickness={0.003} />

          <Dust />
        </Rig>
      </VerticalOffset>

      {/* Iluminação de estúdio montada à mão — sem baixar HDRI de CDN externo */}
      <Environment resolution={256}>
        <Lightformer intensity={5} position={[0, 4, 3]} scale={[10, 4, 1]} color="#ffffff" />
        <Lightformer intensity={3} position={[-5, 1, 2]} scale={[6, 6, 1]} color="#d9b26a" />
        <Lightformer intensity={2.4} position={[5, -2, 1]} scale={[6, 6, 1]} color="#2f6bff" />
        <Lightformer intensity={1.6} position={[0, -5, -2]} scale={[10, 4, 1]} color="#ffffff" />
      </Environment>
    </>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9.5], fov: 38 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
