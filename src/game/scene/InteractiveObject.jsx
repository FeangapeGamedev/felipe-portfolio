import React, { useRef, useEffect, useState } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useGame } from "../state/GameContext";
import { GameManager } from "../state/GameManager";

const InteractiveObject = ({
  id,
  type,
  position,
  rotation,
  scale,
  model,
  transparency = 1,
  label = "Press Space to activate",
  isPaused,
  onProjectSelect,
}) => {
  const objectRef = useRef();
  const [isNear, setIsNear] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { currentRoom } = useGame();
  const { handleInteraction } = GameManager(onProjectSelect);

  const { scene } = useGLTF(model, true);
  if (!scene) {
    console.error(`❌ Failed to load model for InteractiveObject with ID: ${id}`);
    return null;
  }

  useEffect(() => {
    if (objectRef.current) {
      objectRef.current.userData = { id, label, type };
      console.log(`✅ Interactive Object Initialized - ID: ${id}, Type: ${type}`);
    }
  }, [id, label, type]);

  const handleKeyDown = (event) => {
    if (isNear && event.code === "Space" && !isPaused) {
      console.log(`🔹 Space Pressed on Object ID: ${id}, Type: ${type}`);
      handleInteraction(id, type);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isNear, isPaused]);

  return (
    <RigidBody
      ref={objectRef}
      colliders="cuboid"
      type="fixed"
      position={position}
      rotation={rotation}
      scale={scale}
      onCollisionEnter={(event) => {
        if (event.other.rigidBodyObject?.name === "character") {
          setIsNear(true);
        }
      }}
      onCollisionExit={(event) => {
        if (event.other.rigidBodyObject?.name === "character") {
          setIsNear(false);
        }
      }}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <primitive object={scene} scale={scale} userData={{ raycastable: true, isInteractive: true }} />
      {isNear && !isPaused && <Html position={[0, 1.2, 0]}><div className="object-label">{label}</div></Html>}
    </RigidBody>
  );
};

export default InteractiveObject;
