import React, { createContext, useState, useContext, useEffect } from "react";
import { roomData } from "../data/roomData"; // ✅ Ensure correct import path
import * as THREE from "three";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  if (!roomData || roomData.length === 0) {
    console.error("🚨 ERROR: roomData is undefined or empty!");
  }

  // **✅ Game State**
  const [currentRoomId, setCurrentRoomId] = useState(roomData[0]?.id || 1);
  const [previousRoomId, setPreviousRoomId] = useState(null);
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

    // Determine if moving forward or backward
    const isMovingForward = previousRoomId === null || previousRoomId < newRoomId;
    setDoorDirection(isMovingForward ? "forward" : "backward");

    // Get correct spawn position
    const spawnPosition = isMovingForward ? newRoom.spawnPositionForward : newRoom.spawnPositionBackward;

    setPreviousRoomId(currentRoomId);
    setCurrentRoomId(newRoomId);
    setTargetPosition(new THREE.Vector3(...spawnPosition));
  };

  // **✅ Ensure Character Spawns Correctly on Load**
  useEffect(() => {
    if (!currentRoom) return;

    const spawnPosition = doorDirection === "forward" ? currentRoom.spawnPositionForward : currentRoom.spawnPositionBackward;
    setTargetPosition(new THREE.Vector3(...spawnPosition));
  }, [currentRoomId]); // ✅ Runs when room changes

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
