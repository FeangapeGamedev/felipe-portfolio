import React from "react";
import { RigidBody } from "@react-three/rapier";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export const Room = ({ width = 15, depth = 15, height = 5 }) => {
  const wallThickness = 0.5;
  const floorThickness = 0.2;

  // Load textures
  const colorMap = useLoader(THREE.TextureLoader, "/src/assets/models/plaster/textures/red_plaster_weathered_diff_4k.jpg");
  const normalMap = useLoader(THREE.TextureLoader, "/src/assets/models/plaster/textures/red_plaster_weathered_nor_gl_4k.jpg");
  const roughnessMap = useLoader(THREE.TextureLoader, "/src/assets/models/plaster/textures/red_plaster_weathered_arm_4k.jpg");
  const floorTexture = useLoader(THREE.TextureLoader, "/src/assets/models/granite/textures/granite_tile_diff_4k.jpg");

  const wallMaterial = new THREE.MeshStandardMaterial({
    map: colorMap,
    normalMap: normalMap,
    roughnessMap: roughnessMap,
    metalness: 0,
    roughness: 1,
  });

  const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorTexture,
    metalness: 0.1,
    roughness: 0.9,
  });

  return (
    <group>
      {/* Floor */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh name="floor" position={[0, -floorThickness / 2, 0]}>
          <boxGeometry args={[width, floorThickness, depth]} />
          <primitive attach="material" object={floorMaterial} />
        </mesh>
      </RigidBody>

      {/* Walls - Auto Generated */}
      {[ 
        { pos: [0, height / 2, -depth / 2], rot: [0, 0, 0], size: [width, height, wallThickness] }, // Back
        { pos: [-width / 2, height / 2, 0], rot: [0, Math.PI / 2, 0], size: [depth, height, wallThickness] }, // Left
        { pos: [width / 2, height / 2, 0], rot: [0, Math.PI / 2, 0], size: [depth, height, wallThickness], invisible: true }, // Right (Collider only)
        { pos: [0, height / 2, depth / 2], rot: [0, Math.PI, 0], size: [width, height, wallThickness], invisible: true }, // Front (Collider only)
      ].map(({ pos, rot, size, invisible }, index) => (
        <RigidBody key={index} type="fixed" colliders="cuboid">
          <mesh position={pos} rotation={rot}>
            <boxGeometry args={size} />
            {invisible ? <meshStandardMaterial visible={false} /> : <primitive attach="material" object={wallMaterial} />}
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
};
