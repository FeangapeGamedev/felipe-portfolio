import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";


export default function TrapTimerBar({ startTime, totalTime = 1000, position }) {
  const groupRef = useRef();
  const fillRef = useRef();
  const { camera } = useThree();

  useFrame(() => {
    const elapsed = Date.now() - startTime;
    const percent = Math.min(elapsed / totalTime, 1);

    // Keep the bar centered and facing the camera
    if (groupRef.current && position) {
      groupRef.current.position.copy(position);
      groupRef.current.quaternion.copy(camera.quaternion);
    }

    // Animate fill
    if (fillRef.current) {
      const width = Math.max(0.01, percent); // avoid zero width
      fillRef.current.scale.x = width;
      fillRef.current.position.x = -0.5 + width / 2; // stay centered inside background
    }
  });

  return (
    <group ref={groupRef} scale={[1, 1, 1]}>
      {/* Background Bar */}
      <mesh position={[0, 2, 0]}>
        <planeGeometry args={[1, 0.1]} />
        <meshBasicMaterial color="#111" />
      </mesh>

      {/* Fill Bar */}
      <mesh ref={fillRef} position={[-0.5, 2, 0.01]}>
        <planeGeometry args={[1, 0.08]} />
        <meshBasicMaterial color="purple" />
      </mesh>
    </group>
  );
}
