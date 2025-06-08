import React, { useRef, useEffect, useState } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import vertexShader from "../../shaders/vertexShader.glsl";
import fragmentShader from "../../shaders/fragmentShader.glsl";
import { useGame } from "../state/GameContext.jsx";

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
  targetRoomId,
  onShowCodeFrame,
  loadingManager,
}) => {
  const objectRef = useRef();
  const [isNear, setIsNear] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [labelVisible, setLabelVisible] = useState(true);
  const { changeRoom } = useGame();

  const { scene } = useGLTF(model, true, loadingManager);
  if (!scene) {
    console.error(`❌ Failed to load model for InteractiveObject with ID: ${id}`);
    return null;
  }

  // Shader material for hover effect
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      transparency: { value: transparency },
      isHovered: { value: false },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
  });

  useEffect(() => {
    if (scene) {
      const userData = {
        id,
        type,
        label,
        raycastable: true,
        isInteractive: true,
        targetRoomId,
      };

      scene.userData = userData;

      scene.traverse((child) => {
        if (child.isMesh) {
          child.userData = { ...userData };
          child.renderOrder = type === "project" ? 999 : 0;

          if (!child.userData.originalMaterial) {
            child.userData.originalMaterial = child.material;
          }

          if (type === "project" && child.material) {
            child.material.depthTest = false;
            child.material.depthWrite = false;
          }
        }
      });
    }
  }, [scene, id, type, label, targetRoomId]);

  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child.isMesh) {
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material;
        }

        child.material = isHovered ? shaderMaterial : child.userData.originalMaterial;
        child.material.transparent = true;
        child.material.opacity = transparency;

        if (type === "project" && child.material) {
          child.material.depthTest = false;
          child.material.depthWrite = false;
        }
      }
    });

    return () => {
      scene.traverse((child) => {
        if (child.isMesh && child.userData.originalMaterial) {
          child.material = child.userData.originalMaterial;

          if (type === "project" && child.material) {
            child.material.depthTest = false;
            child.material.depthWrite = false;
          }
        }
      });
    };
  }, [scene, shaderMaterial, isHovered, transparency, type]);

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
        onShowCodeFrame();
      } else if (targetRoomId) {
        changeRoom(targetRoomId);
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
            setIsNear(true);
            setLabelVisible(true);
          }
        }}
        onCollisionExit={() => {
          setIsNear(false);
        }}
        onPointerEnter={() => setIsHovered(true)}
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
