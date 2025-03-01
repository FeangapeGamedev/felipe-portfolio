import React, { useRef, useEffect, useState } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useGame } from "../state/GameContext"; // ✅ Import GameContext
import vertexShader from "../../shaders/vertexShader.glsl";  // ✅ Ensure correct shader path
import fragmentShader from "../../shaders/fragmentShader.glsl";

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
  const { setTargetPosition, changeRoom, currentRoom } = useGame();

  // ✅ Load the model
  const { scene } = useGLTF(model, true);
  if (!scene) {
    console.error(`❌ Failed to load model for InteractiveObject with ID: ${id}`);
    return null;
  }

  useEffect(() => {
    if (objectRef.current) {
      objectRef.current.userData = {
        id,
        label,
        type,
      };
      console.log(`✅ Interactive Object Initialized - ID: ${id}, Type: ${type}`);
    }
  }, [id, label, type]);

  // ✅ Handle Interactions
  const handleInteraction = () => {
    if (!isNear) return;

    console.log(`🎮 Handling Interaction for ID: ${id}, Type: ${type}`);

    if (type === "project") {
      console.log(`📂 Project Selected: ${id}`);
      if (onProjectSelect) {
        onProjectSelect(id);
      } else {
        console.error(`❌ onProjectSelect is not defined for project ${id}`);
      }
    } else if (type === "door") {
      console.log(`🚪 Door Opened: ${id}`);

      const door = currentRoom.items?.find(item => item.id === id);
      if (!door) return console.error(`❌ Door with ID ${id} not found in current room!`);

      console.log(`🔄 Changing Room to: ${door.targetRoomId}`);
      changeRoom(door.targetRoomId);
    }
  };

  // ✅ Keyboard Interaction (Space Key)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isNear && event.code === "Space" && !isPaused) {
        console.log(`🔹 Space Pressed on Object ID: ${id}, Type: ${type}`);
        handleInteraction();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isNear, isPaused]);

  // ✅ Shader Material for Hover Effect
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      transparency: { value: transparency }, // Keep door transparency
      isHovered: { value: false }, // Toggle on hover
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  });

  // ✅ Apply Shader Effect on Hover
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          if (!child.userData.originalMaterial) {
            child.userData.originalMaterial = child.material;
          }
          child.material = isHovered ? shaderMaterial : child.userData.originalMaterial;
          child.material.transparent = true;
          child.material.opacity = transparency;
        }
      });
    }
  }, [scene, shaderMaterial, isHovered, transparency]);

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
      {/* 🎮 3D Model */}
      <primitive
        object={scene}
        scale={scale}
        userData={{ raycastable: true, isInteractive: true }}
      />

      {/* 🏷 Interaction Label */}
      {isNear && !isPaused && (
        <Html position={[0, 1.2, 0]}>
          <div className="object-label">{label}</div>
        </Html>
      )}
    </RigidBody>
  );
};

export default InteractiveObject;
