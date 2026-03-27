"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 800 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const [positions, velocities, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Distribute in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 4;

      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);

      vel[i3] = (Math.random() - 0.5) * 0.002;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.002;

      // Emerald to cyan gradient
      const t = Math.random();
      col[i3] = t * 0.0; // R
      col[i3 + 1] = 0.6 + t * 0.4; // G
      col[i3 + 2] = t * 0.5 + 0.3; // B
    }

    return [pos, vel, col];
  }, [count]);

  useFrame(({ clock, pointer }) => {
    if (!mesh.current) return;
    const time = clock.getElapsedTime();
    const geometry = mesh.current.geometry;
    const posArray = geometry.attributes.position.array as Float32Array;

    mouseRef.current.x += (pointer.x * 2 - mouseRef.current.x) * 0.02;
    mouseRef.current.y += (pointer.y * 2 - mouseRef.current.y) * 0.02;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArray[i3] += velocities[i3] + Math.sin(time * 0.3 + i * 0.01) * 0.003;
      posArray[i3 + 1] +=
        velocities[i3 + 1] + Math.cos(time * 0.2 + i * 0.01) * 0.003;
      posArray[i3 + 2] += velocities[i3 + 2];

      // Subtle mouse attraction
      posArray[i3] += mouseRef.current.x * 0.001;
      posArray[i3 + 1] += mouseRef.current.y * 0.001;

      // Keep within bounds
      const dist = Math.sqrt(
        posArray[i3] ** 2 + posArray[i3 + 1] ** 2 + posArray[i3 + 2] ** 2
      );
      if (dist > 8) {
        posArray[i3] *= 0.99;
        posArray[i3 + 1] *= 0.99;
        posArray[i3 + 2] *= 0.99;
      }
    }

    geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = time * 0.05;
    mesh.current.rotation.x = Math.sin(time * 0.03) * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function GlowOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.1);
    meshRef.current.rotation.x = t * 0.1;
    meshRef.current.rotation.z = t * 0.15;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshBasicMaterial
        color="#00ff88"
        wireframe
        transparent
        opacity={0.08}
      />
    </mesh>
  );
}

function FloatingRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.x = t * 0.08;
    groupRef.current.rotation.y = t * 0.12;
  });

  return (
    <group ref={groupRef}>
      {[1.8, 2.4, 3.0].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI * 0.3 * i, Math.PI * 0.2 * i, 0]}>
          <torusGeometry args={[radius, 0.008, 16, 100]} />
          <meshBasicMaterial
            color={i === 0 ? "#00ff88" : i === 1 ? "#00e5ff" : "#00ff88"}
            transparent
            opacity={0.15 - i * 0.03}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ParticleField() {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <Particles count={600} />
        <GlowOrb />
        <FloatingRings />
      </Canvas>
    </div>
  );
}
