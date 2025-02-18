import React, { useState, useEffect } from "react";
import { OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { CharacterController } from "./CharacterController";
import { Room } from "./Room";
import { Character } from "./Character"; // Import the Character component
import { roomData } from "../data/roomData";
import * as THREE from "three";

export const Scene = ({ isPaused, onProjectSelect, onDoorOpen }) => {
  const [targetPosition, setTargetPosition] = useState(null);
  const [currentRoomId, setCurrentRoomId] = useState(1); // Set initial room to Introduction Room
  const [characterKey, setCharacterKey] = useState(0); // Key to force re-render of the character

  const handleDoorOpen = (direction) => {
    const currentRoomIndex = roomData.findIndex(room => room.id === currentRoomId);
    let newRoomIndex = currentRoomIndex;

    if (direction === "forward" && currentRoomIndex < roomData.length - 1) {
      newRoomIndex = currentRoomIndex + 1;
    } else if (direction === "backward" && currentRoomIndex > 0) {
      newRoomIndex = currentRoomIndex - 1;
    }

    if (newRoomIndex !== currentRoomIndex) {
      setCurrentRoomId(roomData[newRoomIndex].id);

      // Calculate the new target position with an offset
      const newPosition = [...roomData[newRoomIndex].spawnPosition];
      if (direction === "forward") {
        newPosition[2] -= 2; // Move backward by 2 units from the door
      } else if (direction === "backward") {
        newPosition[2] += 2; // Move forward by 2 units from the door
      }
      setTargetPosition(new THREE.Vector3(newPosition[0], newPosition[1], newPosition[2]));

      // Force re-render of the character by updating the key
      setCharacterKey(prevKey => prevKey + 1);
    }
  };

  const currentRoom = roomData.find(room => room.id === currentRoomId);

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
        />

        {/* Character */}
        <Character key={characterKey} initialPosition={currentRoom.spawnPosition} targetPosition={targetPosition} isPaused={isPaused} />
        <CharacterController
          isPaused={isPaused}
          setTargetPosition={setTargetPosition}
          onInteract={(object) => {
            if (object.name === "project") {
              onProjectSelect(object.userData.projectId);
            } else if (object.name === "door") {
              handleDoorOpen(object.userData.direction);
            }
          }}
        />
      </Physics>
    </group>
  );
};
