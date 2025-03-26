// Scene.jsx
import React, { useEffect, useState } from "react";
import { OrthographicCamera } from "@react-three/drei"; // Keep only OrthographicCamera here
import { useThree } from "@react-three/fiber"; // Correct import for useThree
import { Physics } from "@react-three/rapier";
import { useGame } from "../state/GameContext.jsx";
import { CharacterController } from "./CharacterController.jsx";
import { Character } from "./Character.jsx";
import SpotLightManager from "../state/SpotLightManager.jsx";
import Room from './Room.jsx';
import useTrapPlacement from "../survivor/useTrapPlacement.jsx";


// 📐 Responsive zoom adjustment for orthographic camera
const ResponsiveOrthoZoom = () => {
  const { camera, size } = useThree();

  useEffect(() => {
    if (camera.isOrthographicCamera) {
      const DESIGN_WIDTH = 3440;
      const DESIGN_HEIGHT = 1440;
      const designAspect = DESIGN_WIDTH / DESIGN_HEIGHT;
      const currentAspect = size.width / size.height;

      const baseZoom = 90;
      const zoomFactor = currentAspect / designAspect;
      camera.zoom = baseZoom * zoomFactor;

      camera.updateProjectionMatrix();
    }
  }, [camera, size]);

  return null;
};

const Scene = ({
  isPaused,
  onProjectSelect,
  onShowCodeFrame,
  onRoomChange,
  placementMode,
  setPlacementMode,
  trapCharges,
  setTrapCharges,
  initialPosition,
  setInitialPosition,
  forceTeleport,
  setForceTeleport,
}) => {
  const { currentRoom, targetPosition, doorDirection } = useGame();

  const { TrapPreview } = useTrapPlacement({
    placementMode,
    onPlaced: (trapType, position) => {
      setTrapCharges(prev => ({ ...prev, [trapType]: 0 }));
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
        zoom={80}
      />

      <ResponsiveOrthoZoom />

      <ambientLight intensity={0.7} color="#ffffff" />

      <directionalLight
        position={[7.55, 5, 10]}
        intensity={0.3}
        color="#ffffff"
        castShadow
      />

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

      {TrapPreview}
    </group>
  );
};

export default Scene;
