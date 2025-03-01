import React, { useRef, useState, useEffect } from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { AnimationMixer, LoopRepeat } from "three";
import { useGame } from "../state/GameContext"; // ✅ Import GameContext

export const Character = ({ initialPosition, isPaused }) => {
  const characterRef = useRef();
  const modelRef = useRef();
  const mixerRef = useRef(null);
  const walkActionRef = useRef(null);
  const idleActionRef = useRef(null);
  const [isWalking, setIsWalking] = useState(false);
  const [isColliding, setIsColliding] = useState(false);
  const { targetPosition, setTargetPosition } = useGame(); // ✅ Use GameContext for movement
  const speed = 0.2;
  const lerpFactor = 0.1;
  const stopThreshold = 0.1;
  const turnSpeed = 4;

  // ✅ Load Character Model
  const { scene: characterModel, animations } = useGLTF("src/assets/3dModels/ccCharacterAnimated.glb");

  useEffect(() => {
    if (characterModel && animations.length > 0) {
      mixerRef.current = new AnimationMixer(characterModel);
      idleActionRef.current = mixerRef.current.clipAction(animations[2]); // Idle animation
      walkActionRef.current = mixerRef.current.clipAction(animations[4]); // Walk animation
      idleActionRef.current.setLoop(LoopRepeat, Infinity);
      walkActionRef.current.setLoop(LoopRepeat, Infinity);
      idleActionRef.current.play();
    } else {
      console.error("Failed to load model or animations");
    }
  }, [characterModel, animations]);

  useEffect(() => {
    const animate = () => {
      if (mixerRef.current) {
        mixerRef.current.update(0.01);
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  // ✅ Reset collision state when new target position is set
  useEffect(() => {
    if (targetPosition) {
      setIsColliding(false);
    }
  }, [targetPosition]);

  useFrame((_, delta) => {
    if (isPaused || !targetPosition || !characterRef.current || isColliding) return;

    // Get current position
    const characterPos = characterRef.current.translation();
    let posX = characterPos.x;
    let posY = characterPos.y;
    let posZ = characterPos.z;
    let newPosX = targetPosition.x;
    let newPosZ = targetPosition.z;

    // Calculate movement direction
    let directionX = newPosX - posX;
    let directionZ = newPosZ - posZ;
    let distance = Math.sqrt(directionX * directionX + directionZ * directionZ);

    if (distance < stopThreshold) {
      if (isWalking) {
        setIsWalking(false);
      }
      return;
    }

    if (!isWalking) {
      setIsWalking(true);
    }

    // Smooth movement
    let moveDistance = Math.min(speed, distance);
    let targetPos = new THREE.Vector3(
      posX + (directionX / distance) * moveDistance,
      posY,
      posZ + (directionZ / distance) * moveDistance
    );

    let currentPos = new THREE.Vector3(posX, posY, posZ);
    currentPos.lerp(targetPos, lerpFactor);

    // Update Position
    characterRef.current.setTranslation(
      { x: currentPos.x, y: currentPos.y, z: currentPos.z },
      true
    );

    // Update Rotation
    const lookAtPos = new THREE.Vector3(newPosX, posY, newPosZ);
    const direction = new THREE.Vector3().subVectors(lookAtPos, currentPos).normalize();
    const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1), // Forward direction
      new THREE.Vector3(direction.x, 0, direction.z)
    );

    modelRef.current.quaternion.slerp(targetQuaternion, turnSpeed * delta);
  });

  useEffect(() => {
    if (idleActionRef.current && walkActionRef.current) {
      if (isWalking) {
        idleActionRef.current.fadeOut(0.5);
        walkActionRef.current.reset().fadeIn(0.5).play();
      } else {
        walkActionRef.current.fadeOut(0.5);
        idleActionRef.current.reset().fadeIn(0.5).play();
      }
    }
  }, [isWalking]);

  return (
    <RigidBody
      ref={characterRef}
      colliders="cuboid"
      position={initialPosition}
      mass={1}
      type="dynamic"
      name="character"
      angularFactor={[0, 1, 0]} // Lock rotation on X and Z axes
      linearDamping={0.5}
      angularDamping={0.5}
      onCollisionEnter={(event) => {
        if (event.colliderObject.name !== "character") {
          console.log("Collision detected with:", event.colliderObject.name);
          setIsColliding(true);
          setIsWalking(false); // Stop walking animation
          setTargetPosition(null); // ✅ Reset target position in GameContext
        }
      }}
      onCollisionExit={(event) => {
        if (event.colliderObject.name !== "character") {
          console.log("Collision ended with:", event.colliderObject.name);
          setIsColliding(false); // Allow movement again
        }
      }}
    >
      <CuboidCollider args={[0.4, 1, 0.4]} position={[0, 1, 0]} />
      {characterModel ? (
        <primitive
          ref={modelRef}
          object={characterModel}
          scale={1}
          rotation={[0, Math.PI, 0]}
        />
      ) : (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      )}
    </RigidBody>
  );
};
