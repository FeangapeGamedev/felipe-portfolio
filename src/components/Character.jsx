import React, { useRef } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const Character = ({ targetPosition }) => {
  const characterRef = useRef();
  const speed = 0.3; // 🔹 Movement speed
  const lerpFactor = 0.1; // 🔹 Controls smoothness (lower = smoother movement)
  const stopThreshold = 0.05; // 🔹 Lower = more precise stop, higher = stops earlier

  useFrame(() => {
    if (targetPosition && characterRef.current) {
      // Get current position
      const characterPos = characterRef.current.translation();
      let posX = characterPos.x;
      let posZ = characterPos.z;
      let newPosX = targetPosition.x;
      let newPosZ = targetPosition.z;

      // Compute movement direction
      let diffX = Math.abs(posX - newPosX);
      let diffZ = Math.abs(posZ - newPosZ);
      let distance = Math.sqrt(diffX * diffX + diffZ * diffZ);

      if (distance > stopThreshold) { 
        let moveDistance = Math.min(speed, distance);
        let targetPos = new THREE.Vector3(
          posX + (moveDistance * (diffX / distance)) * (posX > newPosX ? -1 : 1),
          0.5, // 🔹 Keep Y locked
          posZ + (moveDistance * (diffZ / distance)) * (posZ > newPosZ ? -1 : 1)
        );

        // 🔹 Apply lerp for smoother movement (including stopping phase)
        let currentPos = new THREE.Vector3(posX, 0.5, posZ);
        currentPos.lerp(targetPos, lerpFactor);

        characterRef.current.setTranslation(
          { x: currentPos.x, y: 0.5, z: currentPos.z }, 
          true
        );
      }
    }
  });

  return (
    <RigidBody ref={characterRef} colliders="cuboid" position={[0, 0.5, 0]} mass={1} type="dynamic">
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#69da96" />
      </mesh>
    </RigidBody>
  );
};
