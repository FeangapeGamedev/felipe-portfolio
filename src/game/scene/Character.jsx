import React, { useRef, useState, useEffect } from "react";
import { RigidBody, CuboidCollider, interactionGroups } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { AnimationMixer, LoopRepeat, LoopOnce } from "three";
import { useGame } from "../state/GameContext.jsx";

export const Character = ({ initialPosition, isPaused, teleport = false, onTeleportComplete = () => { }, selectedTrapType, setIsPlacingTrap, isPlacingTrap, onTrapPlaced = () => { } }) => {
  const characterRef = useRef();
  const modelRef = useRef();
  const mixerRef = useRef(null);
  const walkActionRef = useRef(null);
  const idleActionRef = useRef(null);
  const runActionRef = useRef(null);
  const standToCrouchActionRef = useRef(null);
  const crouchIdleActionRef = useRef(null);
  const crouchToStandingActionRef = useRef(null);
  const hasPlacedTrapRef = useRef(false);
  const trapToPlaceRef = useRef(null); // ✅ Use ref instead of state

  const [justTeleported, setJustTeleported] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const [isColliding, setIsColliding] = useState(false);
  const [disableMovement, setDisableMovement] = useState(false); // Step 1: Add movement lock state
  const hasStartedPlacingRef = useRef(false);

  const { targetPosition, setTargetPosition, spawnRotationY, setPlayerPosition } = useGame();

  const walkSpeed = 0.014;
  const runSpeed = 0.035;
  const stopThreshold = 0.25;
  const lerpFactor = 1;
  const turnSpeed = 7;

  const { scene: characterModel, animations } = useGLTF(
    "https://pub-b249382bbc784cb189eee9b1d3002799.r2.dev/3dModels/ccCharacterAnimated.glb"
  );

  const restoreMovementWeights = () => {
    idleActionRef.current.weight = isIdle ? 1 : isWalking ? 0.2 : 0;
    walkActionRef.current.weight = isWalking && !isRunning ? 1 : 0;
    runActionRef.current.weight = isWalking && isRunning ? 1 : 0;
  };

  const blendTo = (actionRef, weight = 1) => {
    actionRef.reset();
    actionRef.weight = weight;
    actionRef.fadeIn(0.2).play();
  };

  const stopAllAnimations = () => {
    idleActionRef.current?.stop();
    walkActionRef.current?.stop();
    runActionRef.current?.stop();
    crouchToStandingActionRef.current?.stop();
    crouchIdleActionRef.current?.stop();
    standToCrouchActionRef.current?.stop();
  };

  const zeroAllWeights = () => {
    idleActionRef.current.weight = 0;
    walkActionRef.current.weight = 0;
    runActionRef.current.weight = 0;
    crouchToStandingActionRef.current.weight = 0;
    crouchIdleActionRef.current.weight = 0;
    standToCrouchActionRef.current.weight = 0;
  };

  useEffect(() => {
    if (characterModel && animations.length > 0) {
      mixerRef.current = new AnimationMixer(characterModel);
      idleActionRef.current = mixerRef.current.clipAction(animations[2]); // Idle
      walkActionRef.current = mixerRef.current.clipAction(animations[5]); // Walk
      standToCrouchActionRef.current = mixerRef.current.clipAction(animations[1]); // Stand to Crouch
      crouchIdleActionRef.current = mixerRef.current.clipAction(animations[0]); // Crouch Idle
      crouchToStandingActionRef.current = mixerRef.current.clipAction(animations[4]); // Crouch to Stand
      runActionRef.current = mixerRef.current.clipAction(animations[3]); // Run

      idleActionRef.current.setLoop(LoopRepeat, Infinity);
      walkActionRef.current.setLoop(LoopRepeat, Infinity);
      runActionRef.current.setLoop(LoopRepeat, Infinity);

      standToCrouchActionRef.current.setLoop(LoopOnce, 1);
      crouchIdleActionRef.current.setLoop(LoopOnce, 1);
      crouchToStandingActionRef.current.setLoop(LoopOnce, 1);

      standToCrouchActionRef.current.clampWhenFinished = true;
      crouchIdleActionRef.current.clampWhenFinished = true;
      crouchToStandingActionRef.current.clampWhenFinished = true;

      idleActionRef.current.timeScale = 1;
      walkActionRef.current.timeScale = 1.8;
      runActionRef.current.timeScale = 1;

      // Initialize weights
      idleActionRef.current.weight = 1;
      walkActionRef.current.weight = 0;
      runActionRef.current.weight = 0;
      standToCrouchActionRef.current.weight = 0; // Set crouching weights to 0
      crouchIdleActionRef.current.weight = 0;    // Set crouching weights to 0
      crouchToStandingActionRef.current.weight = 0; // Set crouching weights to 0

      idleActionRef.current.play();
      walkActionRef.current.play();
      runActionRef.current.play();

      mixerRef.current.update(0);
    } else {
      console.error("❌ Failed to load character model or animations.");
    }
  }, [characterModel, animations]);

  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    // Update player position in the GameContext on every frame
    if (characterRef.current) {
      const currentPos = characterRef.current.translation();
      setPlayerPosition(new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z));
    }

    // Step 2: Check disableMovement before processing movement
    if (justTeleported || isPaused || !targetPosition || !characterRef.current || isColliding || isPlacingTrap || disableMovement) return;

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
      if (!isIdle) setIsIdle(true);
      if (isWalking) setIsWalking(false);
      if (isRunning) setIsRunning(false);
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

    if (!isWalking && !isRunning) {
      return;
    }

    modelRef.current.quaternion.slerp(targetQuaternion, turnSpeed * delta);
  });

  useEffect(() => {
    if (isPlacingTrap) return;
    if (!idleActionRef.current || !walkActionRef.current || !runActionRef.current) return;

    idleActionRef.current.setEffectiveWeight(isIdle ? 1 : isWalking ? 0.2 : 0);
    walkActionRef.current.setEffectiveWeight(isWalking && !isRunning ? 1 : 0);
    runActionRef.current.setEffectiveWeight(isWalking && isRunning ? 1 : 0);
  }, [isIdle, isWalking, isRunning, isPlacingTrap]);

  const onCrouchAnimationFinished = (e) => {
    const finishedAction = e.action;

    if (finishedAction === standToCrouchActionRef.current) {
      console.log("🎥 Finished: stand → crouch");
      blendTo(crouchIdleActionRef.current);
    } else if (finishedAction === crouchIdleActionRef.current) {
      console.log("🎥 Finished: crouch idle");

      // ✅ Retrieve trap data from ref
      const trapToPlace = trapToPlaceRef.current;
      if (trapToPlace && !hasPlacedTrapRef.current) {
        console.log("📦 Placing trap DURING crouch idle:", trapToPlace);
        onTrapPlaced?.(trapToPlace.type, trapToPlace.position);
        hasPlacedTrapRef.current = true;
      }

      // Now fade out idle and stand up
      crouchIdleActionRef.current.fadeOut(0.2);

      crouchToStandingActionRef.current.reset();
      crouchToStandingActionRef.current.setLoop(LoopOnce, 1);
      crouchToStandingActionRef.current.clampWhenFinished = true;
      crouchToStandingActionRef.current.setEffectiveWeight(1);
      crouchToStandingActionRef.current.fadeIn(0.2).play();
    } else if (finishedAction === crouchToStandingActionRef.current) {
      console.log("✅ Finished: crouch → stand");

      mixerRef.current.removeEventListener("finished", onCrouchAnimationFinished);

      // Reset animation weights
      crouchToStandingActionRef.current.weight = 0;
      crouchIdleActionRef.current.weight = 0;
      standToCrouchActionRef.current.weight = 0;

      idleActionRef.current.reset().play();
      walkActionRef.current.reset().play();
      runActionRef.current.reset().play();

      restoreMovementWeights();

      // Cleanup
      trapToPlaceRef.current = null; // ✅ Clear the ref
      setIsPlacingTrap(false);
      hasStartedPlacingRef.current = false;
      hasPlacedTrapRef.current = false;

      // Step 4: Unlock movement after animation finishes
      setDisableMovement(false);
    }
  };

  useEffect(() => {
    if (targetPosition) {
      setIsColliding(false);
    }
  }, [targetPosition]);

  useEffect(() => {
    if (
      isPlacingTrap &&
      selectedTrapType &&
      characterRef.current &&
      !hasStartedPlacingRef.current
    ) {
      // Step 3: Lock movement during trap placement
      setDisableMovement(true);

      const pos = characterRef.current.translation();
      const trapPosition = new THREE.Vector3(pos.x, 0.5, pos.z); // 🔥 Force Y to 0.5

      setTargetPosition(trapPosition);
      trapToPlaceRef.current = { type: selectedTrapType, position: trapPosition }; // ✅ Use ref instead of state
    }
  }, [isPlacingTrap, selectedTrapType]);

  useEffect(() => {
    if (teleport && initialPosition && characterRef.current) {
      console.log("🌀 Teleporting to:", initialPosition.toArray()); // ✅ Add this

      characterRef.current.setTranslation(initialPosition, true);

      if (modelRef.current) {
        modelRef.current.quaternion.setFromEuler(
          new THREE.Euler(0, spawnRotationY, 0)
        );
      }

      setTargetPosition(null);
      setIsIdle(true);
      setIsWalking(false);
      setIsRunning(false);

      setJustTeleported(true);
      setTimeout(() => setJustTeleported(false), 50);

      onTeleportComplete?.();
    }
  }, [teleport, initialPosition, spawnRotationY]);


  useEffect(() => {
    if (!trapToPlaceRef.current || !characterRef.current) return;

    const characterPos = characterRef.current.translation();
    const distance = trapToPlaceRef.current.position.distanceTo(
      new THREE.Vector3(characterPos.x, characterPos.y, characterPos.z)
    );

    if (distance < stopThreshold && !hasStartedPlacingRef.current) {
      hasStartedPlacingRef.current = true;
      setIsPlacingTrap(true);

      // ✅ Freeze movement so character won't slide during animation
      if (characterRef.current) {
        characterRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true); // Zero linear velocity
        characterRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true); // Zero angular velocity
      }

      if (standToCrouchActionRef.current) {
        blendTo(standToCrouchActionRef.current);
        idleActionRef.current.weight = 0;
        walkActionRef.current.weight = 0;
        runActionRef.current.weight = 0;
      }

      mixerRef.current.removeEventListener("finished", onCrouchAnimationFinished);
      mixerRef.current.addEventListener("finished", onCrouchAnimationFinished);
    }

  }, [trapToPlaceRef.current, selectedTrapType]);

  useEffect(() => {
    if (!isPlacingTrap || !selectedTrapType || !characterRef.current || hasStartedPlacingRef.current) return;

    const pos = characterRef.current.translation();
    const trapPos = new THREE.Vector3(pos.x, 0.1, pos.z); // 🔥 Force Y to 0.5

    console.log("🎯 Trap setup initiated:", selectedTrapType, trapPos);

    trapToPlaceRef.current = { type: selectedTrapType, position: trapPos }; // ✅ Use ref instead of state
    setTargetPosition(trapPos);

    hasStartedPlacingRef.current = true;
    hasPlacedTrapRef.current = false; // ✅ Reset this flag

    // ✅ Stop all animations and reset weights
    stopAllAnimations();
    zeroAllWeights();

    // ✅ Start crouch sequence
    if (standToCrouchActionRef.current && mixerRef.current) {
      blendTo(standToCrouchActionRef.current);

      mixerRef.current.removeEventListener("finished", onCrouchAnimationFinished);
      mixerRef.current.addEventListener("finished", onCrouchAnimationFinished);
    }
  }, [isPlacingTrap, selectedTrapType]);

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
      <CuboidCollider
        args={[0.35, 1, 0.35]}
        position={[0, 1, 0]}
        collisionGroups={interactionGroups(0b0010, 0b1110)} // Character = group 2, collides with groups 2-4
      />
      {characterModel ? (
        <primitive
          ref={modelRef}
          object={characterModel}
          scale={1}
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
