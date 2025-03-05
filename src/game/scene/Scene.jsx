import React, { useEffect, useState } from "react";
import { OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useGame } from "../state/GameContext";
import { CharacterController } from "./CharacterController";
import { Room } from "./Room";
import { Character } from "./Character";

export const Scene = ({ isPaused, onProjectSelect }) => {
  const { currentRoom, targetPosition, doorDirection } = useGame();
  const [initialPosition, setInitialPosition] = useState(null);

  useEffect(() => {
    if (!currentRoom || !targetPosition) return;
    setInitialPosition(targetPosition.clone());
    console.log(`Initial position in room ${currentRoom.id}: ${targetPosition.toArray()}`);
  }, [currentRoom]);

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
          key={`room-${currentRoom.id}`}
          isPaused={isPaused}
          onProjectSelect={onProjectSelect}
        />

        {initialPosition && (
          <Character key={`character-${currentRoom.id}-${doorDirection}`} initialPosition={initialPosition} isPaused={isPaused} />
        )}

        <CharacterController isPaused={isPaused} />
      </Physics>
    </group>
  );
};
