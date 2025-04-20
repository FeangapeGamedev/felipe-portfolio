// Scene.jsx
import React, { useEffect, useRef } from "react";
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
  showSurvivorDoor,
  setTrapCharges,
  initialPosition,
  setInitialPosition,
  forceTeleport,
  setForceTeleport,
  selectedTrapType,
  setSelectedTrapType,
  isPlacingTrap,
  setIsPlacingTrap,
  placedTraps,
  setPlacedTraps,
  onEnemyDeath,
  characterRef, 
  isPlayerDead,
  setIsPlayerDead,
  spawnedEnemies, 
  setSpawnedEnemies,
  resetSurvivorGameState,
  loadingManager, // Add loadingManager prop
}) => {
  const { currentRoom, targetPosition, doorDirection, playerPosition } = useGame();

  const handlePlayerDeath = () => {
    if (!isPlayerDead) {
      console.log("☠️ Player has died!");
      characterRef.current?.playDieAnimation?.(); // Call method on Character
      setIsPlayerDead(true);
      // Optionally: reset game, show game over, etc.
    }
  };

  useEffect(() => {
    if (!currentRoom || !targetPosition || typeof targetPosition.clone !== 'function') return;
    setInitialPosition(targetPosition.clone());
    setForceTeleport(true);
  }, [currentRoom, targetPosition]); // Ensure targetPosition is in the dependency array

  useEffect(() => {
    if (currentRoom?.id !== 3) {
      resetSurvivorGameState(); // ✅ reset when leaving Room 3
    }
  }, [currentRoom?.id]);
  

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
        showSurvivorDoor={showSurvivorDoor}
        loadingManager={loadingManager} // Pass loadingManager to Room
      />

      {initialPosition && (
        <Character
          ref={characterRef} // Assign ref
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

            const newTrap = {
              trapId: `trap-${trapType}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, // 👈 renamed to trapId
              type: trapType,
              position,
            };

            setTrapCharges((prev) => ({
              ...prev,
              [trapType]: Math.max(0, prev[trapType] - 1),
            }));

            setPlacedTraps((prev) => [...prev, newTrap]);

            console.log("🪤 Trap created:", newTrap);

            setIsPlacingTrap(false);
            setSelectedTrapType(null);
          }}
          onPlayerDeath={handlePlayerDeath} // Pass handlePlayerDeath
        />
      )}

      <CharacterController isPaused={isPaused || isPlacingTrap} />

      {currentRoom.id === 3 &&
        placedTraps.map((trap) => {
          const position = new THREE.Vector3(trap.position.x, 0.5, trap.position.z);

          return (
            <Trap
              key={trap.trapId}       // Use unique ID as key
              trapId={trap.trapId}    // Pass ID to Trap component
              type={trap.type}
              position={position}
              loadingManager={loadingManager} // Pass loadingManager to Trap
              onTrapConsumed={(trapId) => {
                setPlacedTraps((prevTraps) => {
                  const trapIndex = prevTraps.findIndex((t) => t.trapId === trapId);
                  if (trapIndex === -1) return prevTraps;

                  const newTraps = [...prevTraps];
                  const removedTrap = newTraps.splice(trapIndex, 1)[0];

                  console.log("Current traps:", prevTraps);
                  console.log("Updated traps:", newTraps);
                  console.log(`Removed trap: ${removedTrap.type} with trapId: ${trapId}`);

                  setTrapCharges((charges) => ({
                    ...charges,
                    [removedTrap.type]: (charges[removedTrap.type] || 0) + 1,
                  }));

                  console.log(`🧯 Trap consumed: ${removedTrap.type}, recharging 1 charge.`);

                  return newTraps;
                });
              }}
            />
          );
        })}

      {currentRoom.id === 3 &&
        spawnedEnemies.map((enemy, i) => (
          <EnemyComponent
            key={enemy.id || i}
            id={enemy.id || `enemy-${i}`}
            playerPosition={playerPosition}
            loadingManager={loadingManager} // Pass loadingManager to EnemyComponent
            onDeath={() => {
              // Remove this enemy from the list
              setSpawnedEnemies((prev) =>
                prev.filter((_, index) => index !== i)
              );

              onEnemyDeath?.(); // Notify that an enemy died
            }}
            onPlayerHit={() => {
              if (!isPlayerDead) {
                handlePlayerDeath();
              }
            }}
          />
        ))}
    </>
  );
};

export default Scene;
