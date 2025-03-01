import React, { useRef, useEffect, useState } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useGame } from "../state/GameContext";
import vertexShader from "../../shaders/vertexShader.glsl";
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
  const [isHovered, setIsHovered] = useState(false); // ✅ Track hover state
  const { currentRoom } = useGame();

  // ✅ Load the model
  const { scene } = useGLTF(model, true);
  if (!scene) {
    console.error(`❌ Failed to load model for InteractiveObject with ID: ${id}`);
    return null;
  }

  useEffect(() => {
    if (scene) {
      const userData = {
        id,
        type,
        label,
        raycastable: true,
        isInteractive: true,
      };

      scene.userData = userData;

      scene.traverse((child) => {
        if (child.isMesh) {
          child.userData = { ...userData };
        }
      });

      console.log("✅ Set userData on scene:", scene.userData);
    }
  }, [scene, id, type, label]);

  // ✅ Shader Material for Hover Effect
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      transparency: { value: transparency }, // ✅ Keeps object transparency
      isHovered: { value: false }, // ✅ Toggles hover effect
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  });

  // ✅ Apply Hover Effect
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

  const handleInteraction = () => {
    if (!isNear) return;

    console.log(`🎮 Handling Interaction for ID: ${id}, Type: ${type}`);

    if (type === "project") {
      console.log(`📂 Project Selected: ${id}`);

      if (typeof onProjectSelect === "function") {
        onProjectSelect(id);
      } else {
        console.error(`❌ onProjectSelect is not a function or is undefined`);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isNear && event.code === "Space" && !isPaused) {
        handleInteraction();
      }
    };

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
      onCollisionExit={() => setIsNear(false)}
      onPointerEnter={() => setIsHovered(true)} // ✅ Hover Effect
      onPointerLeave={() => setIsHovered(false)}
    >
      <primitive object={scene} scale={scale} />
      {isNear && !isPaused && <Html position={[0, 1.2, 0]}><div className="object-label">{label}</div></Html>}
    </RigidBody>
  );
};

export default InteractiveObject;
