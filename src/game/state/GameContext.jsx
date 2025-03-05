import React, { createContext, useState, useContext, useEffect } from "react";
import { roomData } from "../data/roomData"; // ✅ Ensure correct import path
import * as THREE from "three";

// **🗺️ Define Explicit Room Transitions (Placed at the top)**
const roomTransitions = {
  "1-2": "forward",
  "2-1": "backward",
  "2-3": "forward",
  "3-2": "backward"
};

const GameContext = createContext();

const getSpawnPosition = (room, direction) => {
  return direction === "forward" ? room.spawnPositionForward : room.spawnPositionBackward;
};

export const GameProvider = ({ children }) => {
  if (!roomData || roomData.length === 0) {
    console.error("🚨 ERROR: roomData is undefined or empty!");
  }

  // **✅ Game State**
  const [currentRoomId, setCurrentRoomId] = useState(roomData[0]?.id || 1);
  const [targetPosition, setTargetPosition] = useState(null);
  const [doorDirection, setDoorDirection] = useState("forward"); // Track entry direction

  // **✅ Get Current Room**
  const currentRoom = roomData.find(room => room.id === currentRoomId) || null;
  if (!currentRoom) console.error(`🚨 ERROR: Room with ID ${currentRoomId} not found!`);

  // **🚀 Function to Change Room**
  const changeRoom = (newRoomId) => {
    const newRoom = roomData.find(room => room.id === newRoomId);
    if (!newRoom) {
      console.warn(`🚨 ERROR: Room ID ${newRoomId} does not exist in roomData!`);
      return;
    }

    // **Determine movement direction using predefined transitions**
    const movementKey = `${currentRoomId}-${newRoomId}`;
    const direction = roomTransitions[movementKey] || "forward"; // Default to "forward" if not mapped

    setDoorDirection(direction);

    // Get correct spawn position
    const spawnPosition = getSpawnPosition(newRoom, direction);

    console.log(`Changing room to ${newRoomId}. Moving ${direction}. Spawn position: ${spawnPosition}`);

    setCurrentRoomId(newRoomId);
    setTargetPosition(new THREE.Vector3(...spawnPosition));
  };

  // **✅ Ensure Character Spawns Correctly on Load**
  useEffect(() => {
    if (!currentRoom) return;

    const spawnPosition = getSpawnPosition(currentRoom, doorDirection);
    console.log(`Spawning in room ${currentRoomId}. Direction: ${doorDirection}. Spawn position: ${spawnPosition}`);
    setTargetPosition(new THREE.Vector3(...spawnPosition));
  }, [currentRoomId, doorDirection]); // ✅ Runs when room changes

  return (
    <GameContext.Provider value={{ 
      roomData, 
      currentRoom, 
      targetPosition, 
      setTargetPosition, 
      changeRoom, 
      doorDirection 
    }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom Hook for Easy Access
export const useGame = () => useContext(GameContext);
