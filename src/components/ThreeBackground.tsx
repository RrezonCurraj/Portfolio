"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import { useRef, useState } from "react";
import * as random from "maath/random/dist/maath-random.esm";
import { useMode } from "@/components/Providers";
import type { Points as ThreePoints } from "three";

function Particles({ color }: { color: string }) {
  const ref = useRef<ThreePoints>(null);
  // Reduced particle count from 6000 (2000 particles) to 3000 (1000 particles).
  // Note: Float32Array length must be a multiple of 3 because of stride={3} (x, y, z).
  const [sphere] = useState(() => random.inSphere(new Float32Array(3000), { radius: 1.5 }));

  useFrame((state, delta) => {
    if (ref.current) {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
            <PointMaterial
              transparent
              color={color}
              size={0.005}
              sizeAttenuation={true}
              depthWrite={false}
            />
          </Points>
      </Float>
    </group>
  );
}

export function ThreeBackground() {
  const { theme } = useMode();

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]}>
        <Particles color={theme === "light" ? "#bef264" : "#22c55e"} />
      </Canvas>
    </div>
  );
}
