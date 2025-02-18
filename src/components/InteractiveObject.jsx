import React, { useRef, useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const InteractiveObject = ({ id, position, onClick, onProjectClick, isPaused, color, shape = "capsule", label = "Press Space to activate", setTargetPosition }) => {
  const objectRef = useRef();
  const [isNear, setIsNear] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  useFrame(() => {
    if (objectRef.current) {
      objectRef.current.setTranslation({ x: position[0], y: position[1], z: position[2] }, true);
    }
  });

  return (
    <RigidBody
      ref={objectRef}
      colliders={shape === "door" ? "ball" : "cuboid"} // Use ball colliders for doors
      type="fixed"
      position={position}
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
      <mesh
        castShadow
        userData={{ raycastable: true, isInteractive: true }}
        onClick={(event) => {
          event.stopPropagation();
          onClick();
          // Move character to the interactable object
          setTargetPosition(new THREE.Vector3(position[0], position[1], position[2]));
        }}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        {shape === "door" ? (
          <sphereGeometry args={[0.5, 32, 32]} /> // Use sphere geometry for doors
        ) : (
          <boxGeometry args={[1, 1, 1]} />
        )}
        <meshStandardMaterial
          color={isHovered ? "yellow" : color}
          emissive={isHovered ? "yellow" : "black"}
          emissiveIntensity={isHovered ? 0.5 : 0}
        />

        {isNear && !isPaused && (
          <Html position={[0, 1.2, 0]}>
            <div className="object-label">{label}</div>
          </Html>
        )}
      </mesh>
    </RigidBody>
  );
};

export default InteractiveObject;
