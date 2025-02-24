import React, { useRef, useState, useEffect } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { AnimationMixer, LoopRepeat } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const Character = ({ initialPosition, targetPosition, isPaused }) => {
  const characterRef = useRef();
  const modelRef = useRef();
  const mixerRef = useRef(null);
  const walkActionRef = useRef(null);
  const [isWalking, setIsWalking] = useState(false);
  const speed = 0.3;
  const lerpFactor = 0.1;
  const stopThreshold = 0.1;

  // Load the character model
  const { scene: characterModel } = useGLTF("src/assets/3dModels/GdevCharacterAI.glb"); // Ensure the correct path

  useEffect(() => {
    const loadWalkAnimation = async () => {
      try {
        const gltfLoader = new GLTFLoader();
        const walkAnimation = await gltfLoader.loadAsync("src/assets/animations/standardWalkAnim.glb"); // Ensure the correct path

        // Log node names in the model
        characterModel.traverse((node) => {
          console.log(node.name);
        });

        mixerRef.current = new AnimationMixer(characterModel);
        walkActionRef.current = mixerRef.current.clipAction(walkAnimation.animations[0]);
        walkActionRef.current.setLoop(LoopRepeat, Infinity);
      } catch (error) {
        console.error("Error loading walk animation:", error);
      }
    };
    loadWalkAnimation();
  }, [characterModel]);

  useFrame((_, delta) => {
    if (isPaused || !targetPosition || !characterRef.current) return;

    const characterPos = characterRef.current.translation();
    let posX = characterPos.x;
    let posZ = characterPos.z;
    let newPosX = targetPosition.x;
    let newPosZ = targetPosition.z;

    let directionX = newPosX - posX;
    let directionZ = newPosZ - posZ;
    let distance = Math.sqrt(directionX * directionX + directionZ * directionZ);

    if (distance < 0.01) {
      setIsWalking(false);
      return;
    }

    setIsWalking(true);

    let currentSpeed = speed;
    if (distance < stopThreshold) {
      currentSpeed = speed * (distance / stopThreshold);
    }

    let moveDistance = Math.min(currentSpeed, distance);
    let targetPos = new THREE.Vector3(
      posX + (directionX / distance) * moveDistance,
      0,
      posZ + (directionZ / distance) * moveDistance
    );

    let currentPos = new THREE.Vector3(posX, 0, posZ);
    currentPos.lerp(targetPos, lerpFactor);

    characterRef.current.setTranslation(
      { x: currentPos.x, y: 0, z: currentPos.z },
      true
    );

    // Rotate the character to face the direction of movement
    const lookAtPos = new THREE.Vector3(newPosX, 0, newPosZ);
    if (modelRef.current) {
      modelRef.current.lookAt(lookAtPos);
    }

    if (mixerRef.current) mixerRef.current.update(delta);
  });

  useEffect(() => {
    if (walkActionRef.current) {
      if (isWalking) {
        walkActionRef.current.play();
      } else {
        walkActionRef.current.stop();
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
      linearDamping={0.5} // Add damping to smooth out movement
      angularDamping={0.5} // Add damping to smooth out rotation
    >
      <primitive
        ref={modelRef}
        object={characterModel}
        scale={1}
        rotation={[0, Math.PI / 4, 0]} // Adjust the rotation for isometric view
      />
    </RigidBody>
  );
};
