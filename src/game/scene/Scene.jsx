import React, { useEffect, useState } from "react";
import { OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useGame } from "../state/GameContext.jsx";
import { CharacterController } from "./CharacterController.jsx";
import { Character } from "./Character.jsx";
import SpotLightManager from "../state/SpotLightManager.jsx"; // Update import
import Room from './Room.jsx'; // Ensure correct import

const Scene = ({ isPaused, onProjectSelect, onShowCodeFrame }) => {
  const { currentRoom, targetPosition, doorDirection } = useGame();
  const [initialPosition, setInitialPosition] = useState(null);

  useEffect(() => {
    if (!currentRoom || !targetPosition) return;
    setInitialPosition(targetPosition.clone());
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

      {/* Directional Light */}
      <directionalLight
        position={[7.55, 5, 10]}
        intensity={0.3}
        color="#ffffff"
        castShadow
      />

      {/* Spot Lights */}
      {currentRoom.lights.map((light, index) => (
        <SpotLightManager
          key={index}
          position={light.position}
          targetPosition={light.targetPosition}
          intensity={light.intensity}
          color={light.color}
        />
      ))}

      <Physics>
        <Room
          key={`room-${currentRoom.id}`}
          isPaused={isPaused}
          onProjectSelect={onProjectSelect}
          onShowCodeFrame={onShowCodeFrame}
        />

        {initialPosition && (
          <Character key={`character-${currentRoom.id}-${doorDirection}`} initialPosition={initialPosition} isPaused={isPaused} />
        )}

        <CharacterController isPaused={isPaused} />
      </Physics>
    </group>
  );
};

export default Scene;
