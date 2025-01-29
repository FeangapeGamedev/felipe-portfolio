import React, { useRef } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const Character = ({ targetPosition }) => {
  const characterRef = useRef();
  const speed = 5; // Movement speed

  useFrame(() => {
    if (targetPosition && characterRef.current) {
      const characterPos = characterRef.current.translation(); // Get Rapier position
      const character = new THREE.Vector3(characterPos.x, 0, characterPos.z); // Keep Y fixed

      const direction = new THREE.Vector3(
        targetPosition.x - character.x,
        0,
        targetPosition.z - character.z
      );

      const distance = character.distanceTo(targetPosition);

      if (distance > 0.1) {
        direction.normalize();
        characterRef.current.setLinvel({ x: direction.x * speed, y: 0, z: direction.z * speed }, true);
      } else {
        characterRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      }
    }
  });

  return (
    <RigidBody ref={characterRef} colliders="cuboid" position={[0, 1, 0]} mass={1} type="dynamic">
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#69da96" />
      </mesh>
    </RigidBody>
  );
};
