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
        <Character targetPosition={targetPosition} isPaused={isPaused} />
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

        {/* ✅ First Capsule with Collider */}
        <InteractiveObject
          id={1} // Pass the project ID
          position={[2, 1, 0]}
          onClick={() => console.log("Capsule 1 clicked!")}
          onProjectClick={onProjectSelect} // Pass the onProjectSelect function
          isPaused={isPaused} // Pass the isPaused prop
          color="blue" // Color for the first capsule
          label="Press Space to view Project One" // Custom label for the first capsule
        />

        {/* ✅ Second Capsule with Collider */}
        <InteractiveObject
          id={2} // Pass the project ID for the second project
          position={[6, 1, 0]} // Different position for the second capsule
          onClick={() => console.log("Capsule 2 clicked!")}
          onProjectClick={onProjectSelect} // Pass the onProjectSelect function
          isPaused={isPaused} // Pass the isPaused prop
          color="brown" // Color for the second capsule
          label="Press Space to view Project Two" // Custom label for the second capsule
        />

        {/* ✅ Door with Collider */}
        <InteractiveObject
          id={3} // Pass the door ID
          position={[0, 1, -7]} // Position near the back wall
          onClick={() => console.log("Door clicked!")}
          onProjectClick={onDoorOpen} // Pass the onDoorOpen function
          isPaused={isPaused} // Pass the isPaused prop
          color="red" // Color for the door
          shape="sphere" // Shape for the door
          label="Press Space to move to next area" // Custom label for the door
        />
      </Physics>
    </group>
  );
};
