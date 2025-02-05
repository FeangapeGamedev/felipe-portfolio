import React, { useState } from "react";
import { useGLTF, OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Room } from "./Room";
import { CharacterController } from "./CharacterController";
import { Character } from "./Character";

export const Scene = () => {
  const [targetPosition, setTargetPosition] = useState(null);

  const handleFloorClick = (event) => {
    event.stopPropagation();
    if (event.point) {
      setTargetPosition(event.point);
    }
  };

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
        <Room width={15} depth={15} height={5} onClick={handleFloorClick} /> {/* Room with Walls + Floor */}
        <Character targetPosition={targetPosition} />
        <CharacterController setTargetPosition={setTargetPosition} />
      </Physics>
    </group>
  );
};
