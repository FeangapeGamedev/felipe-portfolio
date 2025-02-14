import React, { useState } from "react";
import { OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Room } from "./Room";
import { CharacterController } from "./CharacterController";
import { Character } from "./Character";
import InteractiveObject from "./InteractiveObject"; // ✅ Correct import

export const Scene = ({ isPaused, onProjectSelect, onDoorOpen }) => {
  const [targetPosition, setTargetPosition] = useState(null);

  return (
    <group>
      <OrthographicCamera
        makeDefault
        position={[7.55, 5, 10]}
        rotation={[-Math.PI / 10, Math.PI / 5, 0.2]}
        zoom={90}
      />

      <ambientLight intensity={0.7} color="#ffffff" />
      <directionalLight position={[10, 10, 10]} intensity={0.8} castShadow />

      <Physics>
        {/* Room */}
        <Room width={15} depth={15} height={5} />

        {/* Character */}
        <Character targetPosition={targetPosition} />
        <CharacterController
          isPaused={isPaused}
          setTargetPosition={setTargetPosition}
          onInteract={(object) => {
            if (object.name === "project") {
              onProjectSelect(object.userData.projectId);
            } else if (object.name === "door") {
              onDoorOpen(object.userData.level);
            }
          }}
        />

        {/* ✅ Capsule with Collider */}
        <InteractiveObject
          position={[2, 1, 0]}
          onClick={() => console.log("Capsule clicked!")}
        />
      </Physics>

    </group>
  );
};
