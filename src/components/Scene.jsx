import React, { useState } from "react";
import { OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Room } from "./Room";
import { CharacterController } from "./CharacterController";
import { Character } from "./Character";

export const Scene = ({ isPaused }) => {  // ✅ Accept isPaused as a prop
  const [targetPosition, setTargetPosition] = useState(null);

  return (
    <group>
      {/* Orthographic Camera */}
      <OrthographicCamera
        makeDefault
        position={[5, 5, 10]}
        rotation={[-Math.PI / 10, Math.PI / 5, 0.2]}
        zoom={60}
      />

      {/* Lights */}
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight position={[10, 10, 10]} intensity={0.7} castShadow />

      {/* Physics world */}
      <Physics>
        <Room width={15} depth={15} height={5} />
        <Character targetPosition={targetPosition} />
        <CharacterController isPaused={isPaused} setTargetPosition={setTargetPosition} /> {/* ✅ Pass isPaused */}
      </Physics>
    </group>
  );
};
