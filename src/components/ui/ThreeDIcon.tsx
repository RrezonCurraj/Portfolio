"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Float, Environment } from "@react-three/drei";
import { Mesh, Vector3 } from "three";

function Bracket({ position, rotation, color = "#ccff00" }: { position: [number, number, number], rotation: [number, number, number], color?: string }) {
  const mesh = useRef<Mesh>(null);
  
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
        <capsuleGeometry args={[0.15, 1, 4, 8]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      <mesh position={[0, -0.5, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <capsuleGeometry args={[0.15, 1, 4, 8]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
}

function CodeSymbol() {
  const group = useRef<any>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      group.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Bracket position={[-0.8, 0, 0]} rotation={[0, 0, 0]} />
        <Bracket position={[0.8, 0, 0]} rotation={[0, Math.PI, 0]} />
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0.3]}>
           <capsuleGeometry args={[0.12, 2.5, 4, 8]} />
           <meshStandardMaterial 
             color="#ffffff" 
             emissive="#ffffff"
             emissiveIntensity={0.2}
             roughness={0.2}
             metalness={0.8}
           />
        </mesh>
      </Float>
    </group>
  );
}

export function ThreeDIcon() {
  return (
    <div className="w-12 h-12 relative -my-2 cursor-pointer group">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Environment preset="city" />
        <CodeSymbol />
      </Canvas>
    </div>
  );
}
