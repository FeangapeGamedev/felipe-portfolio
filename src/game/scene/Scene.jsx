import React, { useEffect } from "react";
import { OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useGame } from "../state/GameContext";
import { CharacterController } from "./CharacterController";
import { Room } from "./Room";
import { Character } from "./Character";
import { GameManager } from "../state/GameManager"; // ✅ Import GameManager
import * as THREE from "three";

export const Scene = ({ isPaused, onProjectSelect }) => {
  const { currentRoom, targetPosition, setTargetPosition, doorDirection, changeRoom } = useGame();
  const [characterKey, setCharacterKey] = React.useState(0);
  const [initialPosition, setInitialPosition] = React.useState(null);

  // ✅ Initialize GameManager
  const { handleInteraction } = GameManager(onProjectSelect);

  useEffect(() => {
    if (!currentRoom) return;
    const initialPos = doorDirection === "forward" ? currentRoom.spawnPositionForward : currentRoom.spawnPositionBackward;
    setInitialPosition(new THREE.Vector3(initialPos[0], initialPos[1] + 0.1, initialPos[2]));
  }, [currentRoom, doorDirection]);

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

      <Physics debug>
        <Room
          key={currentRoom.id}
          room={currentRoom}
          setTargetPosition={setTargetPosition}
          isPaused={isPaused}
          onProjectSelect={onProjectSelect}
        />

        {initialPosition && (
          <Character key={characterKey} initialPosition={initialPosition} targetPosition={targetPosition} isPaused={isPaused} />
        )}

        <CharacterController
          isPaused={isPaused}
          setTargetPosition={setTargetPosition}
          onInteract={(object) => {
            console.log("🖱️ Clicked on object:", object);

            if (object.userData?.type) {
              handleInteraction(object.userData.id, object.userData.type);
            } else {
              console.warn("⚠️ Clicked object has no type!");
            }
          }}
        />
      </Physics>
    </group>
  );
};
