import React from "react";
import { RigidBody } from "@react-three/rapier";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export const Game_room = ({ width = 15, depth = 15, height = 5 }) => {
  const wallThickness = 0.5;
  const floorThickness = 0.2;

  // Load textures
  let colorMap, normalMap, roughnessMap, floorTexture;
  try {
    colorMap = useLoader(THREE.TextureLoader, "/src/assets/models/plaster/textures/green_plaster_weathered_diff_4k.jpg");
    normalMap = useLoader(THREE.TextureLoader, "/src/assets/models/plaster/textures/green_plaster_weathered_nor_gl_4k.jpg");
    roughnessMap = useLoader(THREE.TextureLoader, "/src/assets/models/plaster/textures/green_plaster_weathered_arm_4k.jpg");
    floorTexture = useLoader(THREE.TextureLoader, "/src/assets/models/granite/textures/granite_tile_diff_4k.jpg");
  } catch (error) {
    console.error("Error loading textures, using fallback textures", error);
    colorMap = useLoader(THREE.TextureLoader, "/src/assets/models/plaster/textures/red_plaster_weathered_diff_4k.jpg");
    normalMap = useLoader(THREE.TextureLoader, "/src/assets/models/plaster/textures/red_plaster_weathered_nor_gl_4k.jpg");
    roughnessMap = useLoader(THREE.TextureLoader, "/src/assets/models/plaster/textures/red_plaster_weathered_arm_4k.jpg");
    floorTexture = useLoader(THREE.TextureLoader, "/src/assets/models/granite/textures/granite_tile_diff_4k.jpg");
  }

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
        <mesh name="floor" userData={{ type: "floor", raycastable: true }} position={[0, -floorThickness / 2, 0]}>
          <boxGeometry args={[width, floorThickness, depth]} />
          <primitive attach="material" object={floorMaterial} />
        </mesh>
      </RigidBody>

      {/* Walls - Only Back & Left are Visible */}
      {[
        { pos: [0, height / 2, -depth / 2], rot: [0, 0, 0], size: [width, height, wallThickness], name: "back-wall", visible: true },
        { pos: [-width / 2, height / 2, 0], rot: [0, Math.PI / 2, 0], size: [depth, height, wallThickness], name: "left-wall", visible: true },
        { pos: [width / 2, height / 2, 0], rot: [0, Math.PI / 2, 0], size: [depth, height, wallThickness], name: "right-wall", visible: false, raycastable: false }, 
        { pos: [0, height / 2, depth / 2], rot: [0, Math.PI, 0], size: [width, height, wallThickness], name: "front-wall", visible: false, raycastable: false }, 
      ].map(({ pos, rot, size, name, visible, raycastable }, index) => (
        <RigidBody key={index} type="fixed" colliders="cuboid">
          <mesh position={pos} rotation={rot} name={name} userData={{ raycastable }}>
            <boxGeometry args={size} />
            <meshStandardMaterial
              map={visible ? colorMap : null} // ✅ Assign texture only to visible walls
              normalMap={visible ? normalMap : null}
              roughnessMap={visible ? roughnessMap : null}
              metalness={0}
              roughness={1}
              visible={visible}
              opacity={visible ? 1 : 0}
              transparent={!visible} // ✅ Allows invisibility
            />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
};