import React, { useEffect, useState } from "react";
import { OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useGame } from "../state/GameContext";
import { CharacterController } from "./CharacterController";
import { Room } from "./Room";
import { Character } from "./Character";
import { GameManager } from "../state/GameManager";
import * as THREE from "three";

export const Scene = ({ isPaused, onProjectSelect }) => {
  const { currentRoom, targetPosition, setTargetPosition, doorDirection } = useGame();
  const [characterKey, setCharacterKey] = useState(0);
  const [initialPosition, setInitialPosition] = useState(null);

  // ✅ Initialize GameManager with `onProjectSelect`
  const { handleInteraction } = GameManager(onProjectSelect);

  useEffect(() => {
    if (!currentRoom) return;
    const initialPos = doorDirection === "forward" ? currentRoom.spawnPositionForward : currentRoom.spawnPositionBackward;
    console.log(`🔄 Updating Character Spawn Position: ${initialPos}`);
    setInitialPosition(new THREE.Vector3(...initialPos));
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

      <Physics>
        <Room
          key={currentRoom.id}
          isPaused={isPaused}
          onProjectSelect={onProjectSelect}
        />

        {initialPosition && (
          <Character key={characterKey} initialPosition={initialPosition} targetPosition={targetPosition} isPaused={isPaused} />
        )}

        <CharacterController isPaused={isPaused} />
      </Physics>
    </group>
  );
};
