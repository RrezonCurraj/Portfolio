"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import { useRef, useState } from "react";
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm";

function Particles(props: any) {
  const ref = useRef<any>(null);
  const [sphere] = useState(() => random.inSphere(new Float32Array(6000), { radius: 1.5 }));

  useFrame((state, delta) => {
    if (ref.current) {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
            <PointMaterial
              transparent
              color="#ccff00" // Lime green from your theme
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
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Particles />
      </Canvas>
    </div>
  );
}
