// Scene.jsx
import React, { useEffect, useRef, useState } from "react";
import { OrthographicCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useGame } from "../state/GameContext.jsx";
import { CharacterController } from "./CharacterController.jsx";
import { Character } from "./Character.jsx";
import SpotLightManager from "../state/SpotLightManager.jsx";
import Room from './Room.jsx';
import * as THREE from 'three';
import Trap from "./Trap";
import EnemyComponent from "./EnemyComponent";

// 📐 Responsive zoom adjustment for orthographic camera
const ResponsiveOrthoZoom = () => {
  const { camera, size } = useThree();
  const lastAspect = useRef(null);

  useEffect(() => {
    if (camera.isOrthographicCamera) {
      const DESIGN_WIDTH = 1920;
      const DESIGN_HEIGHT = 1080;
      const designAspect = DESIGN_WIDTH / DESIGN_HEIGHT;
      const currentAspect = size.width / size.height;

      if (lastAspect.current && Math.abs(lastAspect.current - currentAspect) < 0.01) {
        return;
      }

      // 🔁 Adjust zoom based on resolution as well
      const screenArea = size.width * size.height;
      let baseZoom = 80;

      if (screenArea < 1000000) baseZoom = 75; // smaller screens
      if (screenArea < 700000) baseZoom = 70; // even smaller
      if (screenArea < 500000) baseZoom = 65; // mobile-tier screens

      const zoomFactor = currentAspect / designAspect;
      camera.zoom = baseZoom * zoomFactor;
      camera.updateProjectionMatrix();

      lastAspect.current = currentAspect;
    }
  }, [camera, size]);

  return null;
};

const Scene = ({
  isPaused,
  onProjectSelect,
  onShowCodeFrame,
  setTrapCharges,
  initialPosition,
  setInitialPosition,
  forceTeleport,
  setForceTeleport,
  selectedTrapType,
  setSelectedTrapType,
  isPlacingTrap,
  setIsPlacingTrap,
  restartSurvivorGame,
  placedTraps,
  setPlacedTraps,
  enemySpawned, // Prop to control enemy spawning
}) => {
  const { currentRoom, targetPosition, doorDirection, playerPosition } = useGame();


  useEffect(() => {
    if (!currentRoom || !targetPosition) return;
    setInitialPosition(targetPosition.clone());
    setForceTeleport(true);
  }, [currentRoom]);


  useEffect(() => {
    if (!currentRoom) return;

    if (currentRoom.id !== 3) {
      console.log("🚮 Leaving Survivor Mode. Clearing traps.");
      setPlacedTraps([]); // Clear traps when leaving Survivor Mode
    }
  }, [currentRoom, setPlacedTraps]);

  // ✅ Debug log to check trap count
  return (
    <>
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
          onTeleportComplete={() => {
            console.log("🚀 Teleport complete. Force teleport reset.");
            setForceTeleport(false);
          }}
          isPaused={isPaused}
          selectedTrapType={selectedTrapType}
          isPlacingTrap={isPlacingTrap}
          setIsPlacingTrap={setIsPlacingTrap}
          onTrapPlaced={(trapType, position) => {
            if (currentRoom.id !== 3) return;

            setTrapCharges((prev) => ({
              ...prev,
              [trapType]: Math.max(0, prev[trapType] - 1),
            }));

            setPlacedTraps((prev) => [...prev, { type: trapType, position }]);

            console.log("🚩 Trap placed:", { trapType, position });

            setIsPlacingTrap(false);
            setSelectedTrapType(null);
          }}
        />
      )}

      <CharacterController isPaused={isPaused || isPlacingTrap} />

      {currentRoom.id === 3 && placedTraps.map((trap, i) => {
        const position = new THREE.Vector3(trap.position.x, 0.5, trap.position.z);

        return (
          <Trap key={i} type={trap.type} position={position} />
        );
      })}

      {/* Render EnemyComponent only in room 3 when enemySpawned is true */}
      {currentRoom.id === 3 && enemySpawned && (
        <EnemyComponent playerPosition={playerPosition} />
      )}
    </>
  );
};

export default Scene;
