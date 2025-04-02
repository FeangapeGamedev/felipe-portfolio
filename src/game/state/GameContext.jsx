// gameContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { roomData } from "../data/roomData.js";
import * as THREE from "three";

const roomTransitions = {
  "1-2": "forward",
  "2-1": "backward",
  "2-3": "forward",
  "3-2": "backward"
};

const getSpawnPosition = (room, direction) =>
  direction === "forward" ? room.spawnPositionForward : room.spawnPositionBackward;

const getSpawnRotation = (direction) =>
  direction === "forward" ? Math.PI : 0;

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [currentRoomId, setCurrentRoomId] = useState(roomData[0]?.id || 1);
  const [targetPosition, setTargetPosition] = useState(null);
  const [doorDirection, setDoorDirection] = useState("forward");
  const [spawnRotationY, setSpawnRotationY] = useState(0);
  // NEW: State to track the player's position.
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 0, 0));

  const currentRoom = roomData.find(room => room.id === currentRoomId) || null;

  const changeRoom = (newRoomId) => {
    const newRoom = roomData.find(room => room.id === newRoomId);
    if (!newRoom) {
      console.warn(`🚨 Room ID ${newRoomId} not found in roomData`);
      return;
    }
  
    const movementKey = `${currentRoomId}-${newRoomId}`;
    const direction = roomTransitions[movementKey] || "forward";
  
    setDoorDirection(direction);
    const rotation = getSpawnRotation(direction);
    setSpawnRotationY(rotation);
  
    const spawnPosition = getSpawnPosition(newRoom, direction);
    setCurrentRoomId(newRoomId);
    setTargetPosition(new THREE.Vector3(...spawnPosition));
  };
  
  useEffect(() => {
    if (!currentRoom) return;
    const spawnPosition = getSpawnPosition(currentRoom, doorDirection);
    const rotation = getSpawnRotation(doorDirection);
    setSpawnRotationY(rotation);
    setTargetPosition(new THREE.Vector3(...spawnPosition));
  }, [currentRoomId, doorDirection]);

  return (
    <GameContext.Provider value={{
      roomData,
      currentRoom,
      targetPosition,
      setTargetPosition,
      changeRoom,
      doorDirection,
      spawnRotationY,
      playerPosition,      // now available to all consumers
      setPlayerPosition,   // so you can update the player's position
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
