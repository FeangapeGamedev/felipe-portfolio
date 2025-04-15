// HealthBar.jsx
import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const HealthBar = ({ position, health, maxHealth = 100, yOffset = 0.5 }) => {
  const ref = useRef();
  const { camera } = useThree();
  const percent = Math.max(0, health / maxHealth); // Clamp value

  useFrame(() => {
    if (ref.current && position) {
      ref.current.position.set(position.x, position.y + yOffset, position.z);
      ref.current.lookAt(camera.position);
    }
  });

  return (
    <group ref={ref} scale={[1.5, 1.5, 1.5]}>
      {/* Background */}
      <mesh>
        <planeGeometry args={[1, 0.1]} />
        <meshBasicMaterial color="black" />
      </mesh>
      {/* Foreground (Health fill) */}
      <mesh position={[-0.5 + percent / 2, 0, 0.01]}>
        <planeGeometry args={[percent, 0.08]} />
        <meshBasicMaterial
          color={
            percent > 0.5 ? "#4caf50" : percent > 0.25 ? "#ff9800" : "#f44336"
          }
        />
      </mesh>
    </group>
  );
};

export default HealthBar;
