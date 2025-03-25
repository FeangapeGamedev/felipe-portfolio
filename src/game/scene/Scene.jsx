import React, { useEffect, useState } from "react";
import { OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useGame } from "../state/GameContext.jsx";
import { CharacterController } from "./CharacterController.jsx";
import { Character } from "./Character.jsx";
import SpotLightManager from "../state/SpotLightManager.jsx";
import Room from './Room.jsx';
import useTrapPlacement from "../survivor/useTrapPlacement.jsx"; // ✅ Import your hook

const Scene = ({
  isPaused,
  onProjectSelect,
  onShowCodeFrame,
  onRoomChange,
  placementMode,
  setPlacementMode,
  trapCharges,
  setTrapCharges,
  initialPosition,      // ✅ receive from App.jsx
  setInitialPosition,   // ✅ receive this too
  forceTeleport,
  setForceTeleport,
}) => {
  const { currentRoom, targetPosition, doorDirection } = useGame();


  // ✅ Safely use trap placement inside Canvas
  const { TrapPreview } = useTrapPlacement({
    placementMode,
    onPlaced: (trapType, position) => {
      // Decrease trap charge
      setTrapCharges(prev => ({
        ...prev,
        [trapType]: 0
      }));
      // Exit placement mode
      setPlacementMode(null);
    }
  });

  useEffect(() => {
    if (!currentRoom || !targetPosition) return;
    setInitialPosition(targetPosition.clone());
    setForceTeleport(true);
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

      <directionalLight
        position={[7.55, 5, 10]}
        intensity={0.3}
        color="#ffffff"
        castShadow
      />

      {/* Spotlights */}
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
          <Character
            key={`character-${currentRoom.id}-${doorDirection}`}
            initialPosition={initialPosition}
            teleport={forceTeleport}
            onTeleportComplete={() => setForceTeleport(false)}
            isPaused={isPaused}
          />
        )}

        <CharacterController isPaused={isPaused} />
      </Physics>

      {/* ✅ Render trap preview if active */}
      {TrapPreview}
    </group>
  );
};

export default Scene;
