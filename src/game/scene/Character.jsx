import React, { useRef, useState, useEffect } from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { AnimationMixer, LoopRepeat } from "three";
import { useGame } from "../state/GameContext.jsx"; // ✅ Import GameContext

export const Character = ({ initialPosition, isPaused }) => {
  const characterRef = useRef();
  const modelRef = useRef();
  const mixerRef = useRef(null);
  const walkActionRef = useRef(null);
  const idleActionRef = useRef(null);
  const [isWalking, setIsWalking] = useState(false);
  const [isColliding, setIsColliding] = useState(false);
  const { targetPosition, setTargetPosition, spawnRotationY } = useGame(); // ✅ pull spawnRotationY
  const speed = 0.014;
  const lerpFactor = 1;
  const stopThreshold = 0.1;
  const turnSpeed = 7;

  const { scene: characterModel, animations } = useGLTF("https://pub-b249382bbc784cb189eee9b1d3002799.r2.dev/3dModels/ccCharacterAnimated.glb");

  useEffect(() => {
    if (characterModel && animations.length > 0) {
      mixerRef.current = new AnimationMixer(characterModel);
      idleActionRef.current = mixerRef.current.clipAction(animations[2]); // Idle animation
      walkActionRef.current = mixerRef.current.clipAction(animations[4]); // Walk animation

      idleActionRef.current.setLoop(LoopRepeat, Infinity);
      walkActionRef.current.setLoop(LoopRepeat, Infinity);

      idleActionRef.current.warp(1, 1, idleActionRef.current.getClip().duration);
      walkActionRef.current.warp(1, 1, walkActionRef.current.getClip().duration);

      idleActionRef.current.setDuration(idleActionRef.current.getClip().duration - 0.05);
      walkActionRef.current.setDuration(walkActionRef.current.getClip().duration - 0.05);

      idleActionRef.current.timeScale = 0.98;
      walkActionRef.current.timeScale = 0.98 * 1.8;

      idleActionRef.current.play();
    } else {
      console.error("Failed to load model or animations");
    }
  }, [characterModel, animations]);

  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    if (isPaused || !targetPosition || !characterRef.current || isColliding) return;

    const characterPos = characterRef.current.translation();
    let posX = characterPos.x;
    let posY = characterPos.y;
    let posZ = characterPos.z;
    let newPosX = targetPosition.x;
    let newPosZ = targetPosition.z;

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

    let moveDistance = Math.min(speed, distance);
    let targetPos = new THREE.Vector3(
      posX + (directionX / distance) * moveDistance,
      posY,
      posZ + (directionZ / distance) * moveDistance
    );

    let currentPos = new THREE.Vector3(posX, posY, posZ);
    currentPos.lerp(targetPos, lerpFactor);

    characterRef.current.setTranslation(
      { x: currentPos.x, y: currentPos.y, z: currentPos.z },
      true
    );

    const lookAtPos = new THREE.Vector3(newPosX, posY, newPosZ);
    const direction = new THREE.Vector3().subVectors(lookAtPos, currentPos).normalize();
    const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
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

  useEffect(() => {
    if (targetPosition) {
      setIsColliding(false);
    }
  }, [targetPosition]);

  useEffect(() => {
    if (characterRef.current) {
      const characterPos = characterRef.current.translation();
      console.log(`Player position in new room: x=${characterPos.x}, y=${characterPos.y}, z=${characterPos.z}`);
    }
  }, [initialPosition]);

  useEffect(() => {
    if (characterRef.current && initialPosition) {
      characterRef.current.setTranslation(initialPosition, true);
  
      if (modelRef.current) {
        // We're already rotated by Math.PI by default
        // So for backward, rotate an *additional* 180°
        const extraRotation = spawnRotationY === Math.PI ? Math.PI : 0;
        modelRef.current.rotation.y = Math.PI + extraRotation;
      }
  
      console.log(`Setting initial position: x=${initialPosition.x}, y=${initialPosition.y}, z=${initialPosition.z}`);
    }
  }, [initialPosition, spawnRotationY]);
  
  
  return (
    <RigidBody
      ref={characterRef}
      colliders="cuboid"
      position={initialPosition}
      mass={1}
      type="dynamic"
      name="character"
      angularFactor={[0, 1, 0]}
      linearDamping={0.5}
      angularDamping={0.5}
      onCollisionEnter={(event) => {
        if (event.colliderObject.name !== "character") {
          setIsColliding(true);
          setIsWalking(false);
          setTargetPosition(null);
        }
      }}
      onCollisionExit={(event) => {
        if (event.colliderObject.name !== "character") {
          setIsColliding(false);
        }
      }}
    >
      <CuboidCollider args={[0.35, 1, 0.35]} position={[0, 1, 0]} />
      {characterModel ? (
        <primitive
          ref={modelRef}
          object={characterModel}
          scale={1}
          rotation={[0, Math.PI, 0]} // ✅ DO NOT REMOVE THIS
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
