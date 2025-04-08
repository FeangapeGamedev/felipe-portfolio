import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const Explosion = ({ position, onComplete }) => {
  const meshRef = useRef();
  const clock = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    clock.current += delta;
    const scale = 1 + clock.current * 8; // Expand effect
    meshRef.current.scale.set(scale, scale, scale);

    const fade = 1 - clock.current * 1.2;
    meshRef.current.material.opacity = Math.max(0, fade);

    if (clock.current > 1) {
      if (onComplete) onComplete();
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial
        color="orange"
        emissive="red"
        emissiveIntensity={2}
        transparent
        opacity={1}
      />
    </mesh>
  );
};

export default Explosion;
