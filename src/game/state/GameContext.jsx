import React, { createContext, useState, useContext, useEffect } from "react";
import { roomData } from "../data/roomData"; // ✅ Ensure correct import path
import * as THREE from "three";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  console.log("🛠️ GameProvider Initialized");
  console.log("📂 Loaded roomData:", roomData); // ✅ Debugging

  if (!roomData || roomData.length === 0) {
    console.error("🚨 ERROR: roomData is undefined or empty!");
  }

  // **✅ Game State**
  const [currentRoomId, setCurrentRoomId] = useState(roomData[0]?.id || 1);
  const [targetPosition, setTargetPosition] = useState(null);

  // **✅ Get Current Room**
  const currentRoom = roomData.find(room => room.id === currentRoomId) || null;
  if (!currentRoom) console.error(`🚨 ERROR: Room with ID ${currentRoomId} not found!`);

  // **🚀 Function to Change Room**
  const changeRoom = (newRoomId, enteredFromDoor = "forward") => {
    console.log(`🔄 Attempting to Change Room to ID: ${newRoomId}`);

    const newRoom = roomData.find(room => room.id === newRoomId);
    if (!newRoom) {
      console.warn(`🚨 ERROR: Room ID ${newRoomId} does not exist in roomData!`);
      return;
    }

    console.log(`✅ Room Change Successful → Now Entering Room ${newRoom.id}: ${newRoom.name}`);

    setCurrentRoomId(newRoomId);

    // Set new target position based on entry direction
    let newPosition = enteredFromDoor === "forward" ? newRoom.spawnPositionForward : newRoom.spawnPositionBackward;

    if (!newPosition) {
      console.warn(`⚠️ No valid spawn position for room ${newRoomId}, defaulting to [0,0,0]`);
      newPosition = [0, 0, 0]; // Fallback position
    }

    console.log(`📍 Setting New Position: ${newPosition}`);
    setTargetPosition(new THREE.Vector3(...newPosition));
  };

  // **✅ Ensure Character Spawns Correctly**
  useEffect(() => {
    if (!currentRoom) return;

    console.log(`🚪 Entering Room ${currentRoom.id} - Setting Position`);
    const spawnPosition = currentRoom.spawnPositionForward || currentRoom.spawnPositionBackward;
    console.log(`📍 Character Spawn Position: ${spawnPosition}`);

    setTargetPosition(new THREE.Vector3(...spawnPosition));
  }, [currentRoomId]); // ✅ Runs when room changes

  return (
    <GameContext.Provider value={{ roomData, currentRoom, targetPosition, setTargetPosition, changeRoom }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom Hook for Easy Access
export const useGame = () => useContext(GameContext);
