import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { AnimationMixer, LoopRepeat, LoopOnce } from "three";
import { useGame } from "../state/GameContext.jsx";
import GlobalConstants from "../utils/GlobalConstants.js";
import { v4 as uuidv4 } from "uuid"; // ✅ Import UUID
import TrapTimerBar from "../../components/TrapTimerBar.jsx"; // Import the component
import { getTrapMeta } from "../utils/trapRegistry"; // ✅ Add this at the top

export const Character = forwardRef(({
  initialPosition,
  isPaused,
  teleport = false,
  onTeleportComplete = () => { },
  selectedTrapType,
  setIsPlacingTrap,
  isPlacingTrap,
  onTrapPlaced = () => { },
}, ref) => {
  const characterRef = useRef();
  const modelRef = useRef();
  const mixerRef = useRef(null);
  const walkActionRef = useRef(null);
  const idleActionRef = useRef(null);
  const runActionRef = useRef(null);
  const standToCrouchActionRef = useRef(null);
  const crouchIdleActionRef = useRef(null);
  const crouchToStandingActionRef = useRef(null);
  const dieActionRef = useRef(null);
  const hasPlacedTrapRef = useRef(false);
  const trapToPlaceRef = useRef(null);
  const trapPlacementStartTimeRef = useRef(null); // ⏱️ Track start time of trap placement
  const trapArmTimeRef = useRef(1); // 🆕 Add this ref

  const [justTeleported, setJustTeleported] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const [isColliding, setIsColliding] = useState(false);
  const [disableMovement, setDisableMovement] = useState(false);
  const [modelInstanceKey, setModelInstanceKey] = useState(0);
  const [showTrapTimer, setShowTrapTimer] = useState(false)
  const [trapTotalTime, setTrapTotalTime] = useState(1000) // fallback
  const [trapStartTime, setTrapStartTime] = useState(null); // 🆕 Add this state
  const [trapTimerPos, setTrapTimerPos] = useState(new THREE.Vector3()); // 🆕 Add this state
  const hasStartedPlacingRef = useRef(false);

  const { targetPosition, setTargetPosition, spawnRotationY, setPlayerPosition } = useGame();

  const walkSpeed = 0.014;
  const runSpeed = 0.035;
  const stopThreshold = 0.25;
  const lerpFactor = 1;
  const turnSpeed = 7;


  const { scene: characterModel, animations } = useGLTF(
    "https://pub-b249382bbc784cb189eee9b1d3002799.r2.dev/3dModels/Character.glb"
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
    dieActionRef.current?.stop();
  };

  const zeroAllWeights = () => {
    idleActionRef.current.weight = 0;
    walkActionRef.current.weight = 0;
    runActionRef.current.weight = 0;
    crouchToStandingActionRef.current.weight = 0;
    crouchIdleActionRef.current.weight = 0;
    standToCrouchActionRef.current.weight = 0;
    dieActionRef.current.weight = 0;
  };

  const getClipByName = (name) => animations.find((clip) => clip.name === name);

  useEffect(() => {
    if (characterModel && animations.length > 0) {
      mixerRef.current = new AnimationMixer(characterModel);

      idleActionRef.current = mixerRef.current.clipAction(getClipByName("Idle"));
      walkActionRef.current = mixerRef.current.clipAction(getClipByName("Walk"));
      runActionRef.current = mixerRef.current.clipAction(getClipByName("Run"));
      standToCrouchActionRef.current = mixerRef.current.clipAction(getClipByName("StandToCrouch"));
      crouchIdleActionRef.current = mixerRef.current.clipAction(getClipByName("CrouchIdle"));
      crouchToStandingActionRef.current = mixerRef.current.clipAction(getClipByName("CrouchToStand"));
      dieActionRef.current = mixerRef.current.clipAction(getClipByName("Die"));

      idleActionRef.current.setLoop(LoopRepeat, Infinity);
      walkActionRef.current.setLoop(LoopRepeat, Infinity);
      runActionRef.current.setLoop(LoopRepeat, Infinity);

      standToCrouchActionRef.current.setLoop(LoopOnce, 1);
      crouchIdleActionRef.current.setLoop(LoopOnce, 1);
      crouchToStandingActionRef.current.setLoop(LoopOnce, 1);
      dieActionRef.current.setLoop(LoopOnce, 1);

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
      standToCrouchActionRef.current.weight = 0;
      crouchIdleActionRef.current.weight = 0;
      crouchToStandingActionRef.current.weight = 0;
      dieActionRef.current.weight = 0;

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

    // Prevent movement or actions if certain conditions are met
    if (justTeleported || isPaused || !targetPosition || !characterRef.current || isColliding || isPlacingTrap || disableMovement) return;

    // Update player position in the GameContext on every frame
    if (characterRef.current) {
      const currentPos = characterRef.current.translation();
      setPlayerPosition(new THREE.Vector3(currentPos.x, currentPos.y, currentPos.z));
    }

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

    if (characterRef.current && isPlacingTrap) {
      const pos = characterRef.current.translation();
      setTrapTimerPos(new THREE.Vector3(pos.x, pos.y + 2, pos.z)); // Offset Y for visibility
    }
  });

  useEffect(() => {
    if (!isPlacingTrap) {
      trapPlacementStartTimeRef.current = null; // 🧹 Reset timer
    }
    if (!idleActionRef.current || !walkActionRef.current || !runActionRef.current) return;

    idleActionRef.current.setEffectiveWeight(isIdle ? 1 : isWalking ? 0.2 : 0);
    walkActionRef.current.setEffectiveWeight(isWalking && !isRunning ? 1 : 0);
    runActionRef.current.setEffectiveWeight(isWalking && isRunning ? 1 : 0);
  }, [isIdle, isWalking, isRunning, isPlacingTrap]);

  const onCrouchAnimationFinished = (e) => {
    const finishedAction = e.action;

    if (finishedAction === standToCrouchActionRef.current) {
      console.log("🎥 Finished: stand → crouch");

      // 🆕 Adjust crouchIdle playback duration based on armTime
      crouchIdleActionRef.current.setDuration(trapArmTimeRef.current);

      blendTo(crouchIdleActionRef.current);
    } else if (finishedAction === crouchIdleActionRef.current) {
      console.log("🎥 Finished: crouch idle");

      const trapToPlace = trapToPlaceRef.current;
      if (trapToPlace && !hasPlacedTrapRef.current) {
        console.log("📦 Placing trap DURING crouch idle:", trapToPlace);
        onTrapPlaced?.(trapToPlace.type, trapToPlace.position);
        hasPlacedTrapRef.current = true;
      }

      crouchIdleActionRef.current.fadeOut(0.2);

      crouchToStandingActionRef.current.reset();
      crouchToStandingActionRef.current.setLoop(LoopOnce, 1);
      crouchToStandingActionRef.current.clampWhenFinished = true;
      crouchToStandingActionRef.current.setEffectiveWeight(1);
      crouchToStandingActionRef.current.reset().play();
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

      setShowTrapTimer(false); // ✅ HIDE TIMER

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
      hasStartedPlacingRef.current = true;
      setDisableMovement(true);

      const now = Date.now();
      trapPlacementStartTimeRef.current = now;
      setTrapStartTime(now);
      setShowTrapTimer(true);

      // Position trap to place
      const pos = characterRef.current.translation();
      const trapPosition = new THREE.Vector3(pos.x, 0.5, pos.z);
      trapToPlaceRef.current = { type: selectedTrapType, position: trapPosition };

      // Freeze character movement
      characterRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true); // Zero linear velocity
      characterRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true); // Zero angular velocity

      // Start crouch animation
      if (standToCrouchActionRef.current && mixerRef.current) {
        blendTo(standToCrouchActionRef.current);
        idleActionRef.current.weight = 0;
        walkActionRef.current.weight = 0;
        runActionRef.current.weight = 0;

        mixerRef.current.removeEventListener("finished", onCrouchAnimationFinished);
        mixerRef.current.addEventListener("finished", onCrouchAnimationFinished);
      }

      // ⏳ Delay full trap placement until timer finishes
      setTimeout(() => {
        if (!hasPlacedTrapRef.current && trapToPlaceRef.current) {
          console.log("🧨 Timer finished. Placing trap:", trapToPlaceRef.current);
          onTrapPlaced?.(trapToPlaceRef.current.type, trapToPlaceRef.current.position);
          hasPlacedTrapRef.current = true;

          // Now transition to standing up
          if (crouchIdleActionRef.current && crouchToStandingActionRef.current) {
            crouchIdleActionRef.current.fadeOut(0.2);

            crouchToStandingActionRef.current.reset();
            crouchToStandingActionRef.current.setLoop(LoopOnce, 1);
            crouchToStandingActionRef.current.clampWhenFinished = true;
            crouchToStandingActionRef.current.setEffectiveWeight(1);
            crouchToStandingActionRef.current.play();

            mixerRef.current.removeEventListener("finished", onCrouchAnimationFinished);
            mixerRef.current.addEventListener("finished", onCrouchAnimationFinished);
          }
        }
      }, trapTotalTime); // Wait for full timer duration
    }
  }, [isPlacingTrap, selectedTrapType, trapTotalTime]);

  useEffect(() => {
    if (teleport && initialPosition && characterRef.current) {
      console.log("🌀 Teleporting to:", initialPosition.toArray());

      characterRef.current.setTranslation(initialPosition, true);

      if (modelRef.current) {
        modelRef.current.quaternion.setFromEuler(
          new THREE.Euler(0, spawnRotationY, 0)
        );
      }

      // ✅ Force model remount
      setModelInstanceKey((k) => k + 1);

      setTargetPosition(null);
      setIsIdle(true);
      setIsWalking(false);
      setIsRunning(false);

      setJustTeleported(true);
      setTimeout(() => setJustTeleported(false), 50);

      onTeleportComplete?.();
    }
  }, [teleport, initialPosition, spawnRotationY]);

  const playDieAnimation = () => {
    if (dieActionRef.current && mixerRef.current) {
      console.log("💀 Playing character die animation");

      stopAllAnimations();
      zeroAllWeights();

      dieActionRef.current.reset();
      dieActionRef.current.setLoop(LoopOnce, 1);
      dieActionRef.current.clampWhenFinished = true;

      // ⛔️ Avoid effectiveWeight — we’ll set weight explicitly
      dieActionRef.current.weight = 1;

      dieActionRef.current.play();

      // ⚠️ Ensure mixer state is fully updated this frame
      mixerRef.current.update(0);

      setDisableMovement(true);
    }
  };

  useImperativeHandle(ref, () => ({
    playDieAnimation,

    revive: () => {
      console.log("🧟‍♂️ Reviving character...");

      if (dieActionRef.current?.isRunning()) {
        dieActionRef.current.stop();
        dieActionRef.current.reset();
        dieActionRef.current.weight = 0;
        mixerRef.current.update(0); // 💥 force update after change
      }

      // Set idle as active animation
      stopAllAnimations();
      zeroAllWeights();


      idleActionRef.current.reset().play();
      walkActionRef.current.reset().play();
      runActionRef.current.reset().play();

      restoreMovementWeights();

      // Reset movement flags
      setDisableMovement(false);
      setIsIdle(true);
      setIsWalking(false);
      setIsRunning(false);
    },

    prepareTrapPlacement: (trapType) => {
      if (!trapType || isPlacingTrap || hasStartedPlacingRef.current) return;

      console.log("⚙️ Starting trap placement via imperative call:", trapType);

      const trapMeta = getTrapMeta(trapType); // ✅ Lookup actual armTime
      trapArmTimeRef.current = trapMeta?.armTime || 1; // 🆕 Store armTime
      setTrapTotalTime(1500 + trapArmTimeRef.current * 1000); // ✅ Adjust total time
      setIsPlacingTrap(true);
    },
  }));

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
      collisionGroups={GlobalConstants.createInteractionGroup(
        GlobalConstants.CHARACTER_GROUP,
        GlobalConstants.TRAP_GROUP // Interacts with everything except traps
      )}
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
      />
      {characterModel ? (
        <primitive
          key={modelInstanceKey} // ✅ Forces remount
          ref={modelRef}
          object={characterModel}
          scale={1}
          onTrapPlaced={(trapType, position) => {
            setTrapCharges((prev) => ({
              ...prev,
              [trapType]: Math.max(0, prev[trapType] - 1),
            }));

            setPlacedTraps((prev) => [
              ...prev,
              {
                trapId: uuidv4(), // ✅ Add unique trapId
                type: trapType,
                position,
              },
            ]);

            setSelectedTrapType(null);
          }}
        />
      ) : (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      )}
      {showTrapTimer && trapStartTime && (
        <TrapTimerBar
          key={trapStartTime}
          startTime={trapStartTime}
          totalTime={trapTotalTime}
          position={trapTimerPos} // Pass the precomputed position
        />
      )}
    </RigidBody>
  );
});
