import React, { useState, useEffect } from "react";
import { OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { CharacterController } from "./CharacterController";
import { Room } from "./Room";
import { Character } from "./Character"; // Import the Character component
import { roomData } from "../data/roomData";
import * as THREE from "three";

export const Scene = ({ isPaused, onProjectSelect }) => {
  const [targetPosition, setTargetPosition] = useState(null);
  const [currentRoomId, setCurrentRoomId] = useState(1); // Set initial room to Introduction Room
  const [characterKey, setCharacterKey] = useState(0); // Key to force re-render of the character
  const [doorDirection, setDoorDirection] = useState("forward"); // Track the direction of the door
  const [initialPosition, setInitialPosition] = useState(null); // Store the initial position

  const handleDoorOpen = (direction) => {
    console.log(`Door opened in direction: ${direction}`);
    setDoorDirection(direction); // Update the door direction
    const currentRoomIndex = roomData.findIndex(room => room.id === currentRoomId);
    let newRoomIndex = currentRoomIndex;

    if (direction === "forward" && currentRoomIndex < roomData.length - 1) {
      newRoomIndex = currentRoomIndex + 1;
    } else if (direction === "backward" && currentRoomIndex > 0) {
      newRoomIndex = currentRoomIndex - 1;
    }

    if (newRoomIndex !== currentRoomIndex) {
      setCurrentRoomId(roomData[newRoomIndex].id);

      // Calculate the new target position based on the direction
      const newPosition = direction === "forward" ? roomData[newRoomIndex].spawnPositionForward : roomData[newRoomIndex].spawnPositionBackward;
      console.log(`New target position: ${newPosition}`);
      setTargetPosition(new THREE.Vector3(newPosition[0], newPosition[1], newPosition[2]));

      // Force re-render of the character by updating the key
      setCharacterKey(prevKey => prevKey + 1);
    }
  };

  const currentRoom = roomData.find(room => room.id === currentRoomId);

  useEffect(() => {
    // Determine the initial position based on the door direction
    const initialPos = doorDirection === "forward" ? currentRoom.spawnPositionForward : currentRoom.spawnPositionBackward;
    setInitialPosition(new THREE.Vector3(initialPos[0], initialPos[1], initialPos[2]));
  }, [currentRoomId, doorDirection]);

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
          room={currentRoom}
          setTargetPosition={setTargetPosition}
          isPaused={isPaused}
          onProjectSelect={onProjectSelect}
          handleDoorOpen={handleDoorOpen}
          doorDirection={doorDirection} // Pass the door direction to the Room component
        />

        {/* Character */}
        {initialPosition && (
          <Character key={characterKey} initialPosition={initialPosition} targetPosition={targetPosition} isPaused={isPaused} />
        )}
        <CharacterController
          isPaused={isPaused}
          setTargetPosition={setTargetPosition}
          onInteract={(object) => {
            if (object.type === "project") {
              onProjectSelect(object.userData.projectId);
            } else if (object.type === "door") {
              handleDoorOpen(object.userData.direction);
            }
          }}
        />
      </Physics>
    </group>
  );
};
