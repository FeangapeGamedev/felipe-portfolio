import React, { useRef, useEffect, useState, useCallback } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import vertexShader from "../shaders/vertexShader.glsl";
import fragmentShader from "../shaders/fragmentShader.glsl";

const InteractiveObject = ({ id, position, rotation, scale, onClick, onProjectClick, isPaused, label = "Press Space to activate", setTargetPosition, model, transparency = 1 }) => {
  const objectRef = useRef();
  const [isNear, setIsNear] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if the model prop is valid
  if (!model) {
    console.error(`Model path is invalid for InteractiveObject with id: ${id}`);
    return null;
  }

  const { scene } = useGLTF(model, true); // Load the model

  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    opacity: transparency, // Set transparency
  });

  useEffect(() => {
    if (objectRef.current) {
      objectRef.current.userData = { id, label, onClick, onProjectClick };
    }
  }, [id, label, onClick, onProjectClick]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isNear && event.code === "Space" && !isPaused) {
        onProjectClick(id); // Call the onProjectClick function with the id
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isNear, onProjectClick, id, isPaused]);

  useEffect(() => {
    setIsNear(false); // Reset isNear state when position changes
  }, [position]);

  useFrame((state) => {
    shaderMaterial.uniforms.time.value = state.clock.getElapsedTime();
    if (objectRef.current) {
      objectRef.current.setTranslation({ x: position[0], y: position[1], z: position[2] }, true);
    }
  });

  const handlePointerOver = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handlePointerOut = useCallback(() => {
    setIsHovered(false);
  }, []);

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          if (!child.userData.originalMaterial) {
            child.userData.originalMaterial = child.material;
          }
          child.material = isHovered ? shaderMaterial : child.userData.originalMaterial;
          child.material.transparent = true;
          child.material.opacity = transparency; // Apply transparency
        }
      });
    }
  }, [scene, shaderMaterial, isHovered, transparency]);

  if (!scene) {
    console.error(`Failed to load model for InteractiveObject with id: ${id}`);
    return null;
  }

  return (
    <RigidBody
      ref={objectRef}
      colliders="cuboid" // Add a cuboid collider
      type="fixed"
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (objectRef.current?.userData.onClick) {
          objectRef.current.userData.onClick();
        }
      }}
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
    >
      {scene ? (
        <primitive
          object={scene}
          scale={scale} // Apply the scale to the model
          userData={{ raycastable: true, isInteractive: true }}
          onClick={(event) => {
            event.stopPropagation();
            onClick();
            // Move character to the interactable object
            setTargetPosition(new THREE.Vector3(position[0], position[1], position[2]));
          }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
      ) : (
        <mesh
          userData={{ raycastable: true, isInteractive: true }}
          onClick={(event) => {
            event.stopPropagation();
            onClick();
            // Move character to the interactable object
            setTargetPosition(new THREE.Vector3(position[0], position[1], position[2]));
          }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" transparent opacity={transparency} /> {/* Default color for fallback */}
        </mesh>
      )}
      {isNear && !isPaused && (
        <Html position={[0, 1.2, 0]}>
          <div className="object-label">{label}</div>
        </Html>
      )}
    </RigidBody>
  );
};

export default InteractiveObject;
