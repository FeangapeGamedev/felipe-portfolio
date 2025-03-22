import React, { useRef, useState, useEffect } from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { AnimationMixer, LoopRepeat } from "three";
import { useGame } from "../state/GameContext.jsx";

export const Character = ({ initialPosition, isPaused }) => {
  const characterRef = useRef();
  const modelRef = useRef();
  const mixerRef = useRef(null);
  const walkActionRef = useRef(null);
  const idleActionRef = useRef(null);
  const runActionRef = useRef(null);

  const [isWalking, setIsWalking] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const [isColliding, setIsColliding] = useState(false);

  const { targetPosition, setTargetPosition, spawnRotationY } = useGame();

  const walkSpeed = 0.014;
  const runSpeed = 0.035;
  const stopThreshold = 0.1;
  const lerpFactor = 1;
  const turnSpeed = 7;

  const { scene: characterModel, animations } = useGLTF(
    "https://pub-b249382bbc784cb189eee9b1d3002799.r2.dev/3dModels/ccCharacterAnimated.glb"
  );

  useEffect(() => {
    if (characterModel && animations.length > 0) {
      console.log("🎬 Loaded Animations:", animations.map(a => a.name));

      mixerRef.current = new AnimationMixer(characterModel);
      idleActionRef.current = mixerRef.current.clipAction(animations[2]);
      walkActionRef.current = mixerRef.current.clipAction(animations[5]);
      runActionRef.current = mixerRef.current.clipAction(animations[3]);

      idleActionRef.current.setLoop(LoopRepeat, Infinity);
      walkActionRef.current.setLoop(LoopRepeat, Infinity);
      runActionRef.current.setLoop(LoopRepeat, Infinity);

      idleActionRef.current.timeScale = 1;
      walkActionRef.current.timeScale = 1.8;
      runActionRef.current.timeScale = 1;

      // Start all actions (idle always running in background)
      idleActionRef.current.play();
      walkActionRef.current.play();
      runActionRef.current.play();

      // Set default weights
      idleActionRef.current.weight = 1;
      walkActionRef.current.weight = 0;
      runActionRef.current.weight = 0;

      mixerRef.current.update(0);
    } else {
      console.error("❌ Failed to load character model or animations.");
    }
  }, [characterModel, animations]);

  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    if (isPaused || !targetPosition || !characterRef.current || isColliding) return;

    const characterPos = characterRef.current.translation();
    const posX = characterPos.x;
    const posY = characterPos.y;
    const posZ = characterPos.z;

    let newPosX, newPosZ;

    if (targetPosition?.position) {
      newPosX = targetPosition.position.x;
      newPosZ = targetPosition.position.z;
      if (targetPosition.run && !isRunning) setIsRunning(true);
      else if (!targetPosition.run && isRunning) setIsRunning(false);
    } else if (targetPosition instanceof THREE.Vector3) {
      newPosX = targetPosition.x;
      newPosZ = targetPosition.z;
      if (isRunning) setIsRunning(false);
    } else {
      return;
    }

    const directionX = newPosX - posX;
    const directionZ = newPosZ - posZ;
    const distance = Math.sqrt(directionX * directionX + directionZ * directionZ);

    if (distance < stopThreshold) {
      if (!isIdle) {
        setIsIdle(true);
        console.log("🧍 Set idle");
      }
      if (isWalking) {
        setIsWalking(false);
        console.log("🛑 Stopped walking");
      }
      if (isRunning) {
        setIsRunning(false);
        console.log("🛑 Stopped running");
      }
      return;
    }

    if (!isWalking) setIsWalking(true);
    if (isIdle) setIsIdle(false);

    const speed = isRunning ? runSpeed : walkSpeed;
    const moveDistance = Math.min(speed, distance);

    const targetPos = new THREE.Vector3(
      posX + (directionX / distance) * moveDistance,
      posY,
      posZ + (directionZ / distance) * moveDistance
    );

    const currentPos = new THREE.Vector3(posX, posY, posZ);
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
    if (!idleActionRef.current || !walkActionRef.current || !runActionRef.current) return;

    // Reset all weights
    idleActionRef.current.weight = 0;
    walkActionRef.current.weight = 0;
    runActionRef.current.weight = 0;

    if (isIdle) {
      idleActionRef.current.weight = 1;
      console.log("🎬 Blending to idle");
    } else if (isWalking && isRunning) {
      runActionRef.current.weight = 1;
      idleActionRef.current.weight = 0.2;
      console.log("🏃 Blending to run");
    } else if (isWalking && !isRunning) {
      walkActionRef.current.weight = 1;
      idleActionRef.current.weight = 0.2;
      console.log("🚶 Blending to walk");
    }
  }, [isIdle, isWalking, isRunning]);

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
        const colliderName = event.colliderObject.name;
        if (colliderName === "character" || colliderName === "floor") return;

        console.log("🛑 Collision with:", colliderName);
        setIsColliding(true);
        setIsWalking(false);
        setIsRunning(false);
        setIsIdle(true);
        setTargetPosition(null);
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
