import React, { useRef, useEffect, useState } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import vertexShader from "../../shaders/vertexShader.glsl";
import fragmentShader from "../../shaders/fragmentShader.glsl";
import { useGame } from "../state/GameContext";

const InteractiveObject = ({
  id,
  type,
  position,
  rotation,
  scale,
  model,
  transparency = 1,
  label = "Press Y to activate",
  isPaused,
  onProjectSelect,
  targetRoomId, // Add targetRoomId prop
  onShowCodeFrame, // Add onShowCodeFrame prop

}) => {
  const objectRef = useRef();
  const [isNear, setIsNear] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // ✅ Track hover state
  const [labelVisible, setLabelVisible] = useState(true); // Track label visibility
  const { changeRoom } = useGame(); // ✅ Use changeRoom from GameContext

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
        targetRoomId, // Add targetRoomId to userData
      };

      scene.userData = userData;

      scene.traverse((child) => {
        if (child.isMesh) {
          child.userData = { ...userData };
        }
      });
    }
  }, [scene, id, type, label, targetRoomId]);

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
    if (!scene) return;

    scene.traverse((child) => {
      if (child.isMesh) {
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material;
        }
        // Restore original material when not hovered
        child.material = isHovered ? shaderMaterial : child.userData.originalMaterial;
        child.material.transparent = true;
        child.material.opacity = transparency;
      }
    });

    // Reset hover state when leaving room
    return () => {
      scene.traverse((child) => {
        if (child.isMesh && child.userData.originalMaterial) {
          child.material = child.userData.originalMaterial;
        }
      });
    };
  }, [scene, shaderMaterial, isHovered, transparency]);

  const handleInteraction = () => {
    if (!isNear) return;

    if (type === "project") {
      if (typeof onProjectSelect === "function") {
        onProjectSelect(id);
      } else {
        console.error(`❌ onProjectSelect is not a function or is undefined`);
      }
    } else if (type === "door") {
      if (id === "door2") {
        onShowCodeFrame(); // Show CodeFrame instead of changing room
      } else if (targetRoomId) {
        changeRoom(targetRoomId); // ✅ Change room using targetRoomId
      } else {
        console.error(`❌ targetRoomId is not defined for door: ${id}`);
      }
    } else {
      console.warn(`⚠️ Unknown interaction type: ${type}`);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isNear && !isPaused) {
        if (event.code === "KeyY") {
          handleInteraction();
        } else if (event.code === "KeyN") {
          setLabelVisible(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isNear, isPaused]);

  return (
    <>
      <RigidBody
        ref={objectRef}
        colliders="cuboid"
        type="fixed"
        position={position}
        rotation={rotation}
        scale={scale}
        onCollisionEnter={(event) => {
          if (event.other.rigidBodyObject?.name === "character") {
            console.log(`✅ Collision Detected with: ${id}`);
            setIsNear(true);
            setLabelVisible(true); // Re-enable label on collision enter
          }
        }}
        onCollisionExit={() => {
          console.log(`❌ Collision Lost with: ${id}`);
          setIsNear(false);
        }}
        onPointerEnter={() => setIsHovered(true)} // ✅ Hover Effect
        onPointerLeave={() => setIsHovered(false)}
      >
        <primitive object={scene} scale={scale} />
        {isNear && !isPaused && labelVisible && (
          <Html position={[0, 1.2, 0]}>
            <div className="object-label">{label}</div>
          </Html>
        )}
      </RigidBody>
    </>
  );
};

export default InteractiveObject;
