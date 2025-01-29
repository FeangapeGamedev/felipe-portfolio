import React from "react";
import { RigidBody } from "@react-three/rapier";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export const Floor = () => {
  const tileSize = 15;

  // Load floor textures
  const colorMap = useLoader(THREE.TextureLoader, "/src/assets/models/granite/textures/granite_tile_diff_4k.jpg");
  const normalMap = useLoader(THREE.TextureLoader, "/src/assets/models/granite/textures/granite_tile_nor_gl_4k.jpg");
  const roughnessMap = useLoader(THREE.TextureLoader, "/src/assets/models/granite/textures/granite_tile_arm_4k.jpg");

  // Create a material for the floor
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: colorMap,
    normalMap: normalMap,
    roughnessMap: roughnessMap,
    metalness: 0,
    roughness: 1,
  });

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh
        name="floor"
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]} // ✅ Fixed rotation prop
        receiveShadow
      >
        <planeGeometry args={[tileSize, tileSize]} />
        <primitive attach="material" object={floorMaterial} />
      </mesh>
    </RigidBody>
  );
};