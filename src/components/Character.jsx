import React, { useRef, useState, useEffect } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const Character = ({ targetPosition, isPaused }) => {
  const characterRef = useRef();
  const [isColliding, setIsColliding] = useState(false);
  const speed = 0.3; // 🔹 Movement speed
  const lerpFactor = 0.1; // 🔹 Controls smoothness (lower = smoother movement)
  const stopThreshold = 0.6; // 🔹 Distance to start reducing speed

  useEffect(() => {
    setIsColliding(false); // Reset collision state when target position is updated
  }, [targetPosition]);

  useFrame(() => {
    if (isPaused || !targetPosition || !characterRef.current) return;

    const characterPos = characterRef.current.translation();
    let posX = characterPos.x;
    let posZ = characterPos.z;
    let newPosX = targetPosition.x;
    let newPosZ = targetPosition.z;

    // Compute movement vector
    let directionX = newPosX - posX;
    let directionZ = newPosZ - posZ;
    let distance = Math.sqrt(directionX * directionX + directionZ * directionZ);

    // Reduce speed as the character approaches the target
    let currentSpeed = speed;
    if (distance < stopThreshold) {
      currentSpeed = speed * (distance / stopThreshold);
    }

    // Move if distance is greater than a small threshold and is not colliding
    if (distance > 0.01 && !isColliding) {
      let moveDistance = Math.min(currentSpeed, distance);
      let targetPos = new THREE.Vector3(
        posX + (directionX / distance) * moveDistance,
        0.5, // 🔹 Keep Y locked
        posZ + (directionZ / distance) * moveDistance
      );

      // Smooth movement using Lerp
      let currentPos = new THREE.Vector3(posX, 0.5, posZ);
      currentPos.lerp(targetPos, lerpFactor);

      characterRef.current.setTranslation(
        { x: currentPos.x, y: 0.5, z: currentPos.z },
        true
      );
    }
  });

  const handleCollisionEnter = (event) => {
    if (event.other.name !== "floor") {
      setIsColliding(true);
    }
  };

  const handleCollisionExit = (event) => {
    if (event.other.name !== "floor") {
      setIsColliding(false);
    }
  };

  return (
    <RigidBody
      ref={characterRef}
      colliders="cuboid"
      position={[0, 0.5, 0]}
      mass={1}
      type="dynamic"
      name="character"
      onCollisionEnter={handleCollisionEnter}
      onCollisionExit={handleCollisionExit}
    >
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#69da96" />
      </mesh>
    </RigidBody>
  );
};
