import React from "react";
import { RigidBody } from "@react-three/rapier";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export const Walls = ({ wallMaterial }) => {
  const floorSize = 15; // Match the floor size
  const wallHeight = 5;
  const wallThickness = 0.5;
  const tiltAngle = Math.PI / 1; // don't know why but it looks better with this value

  // Load textures for the wall
  const colorMap = useLoader(THREE.TextureLoader, "/src/assets/models/plaster/textures/red_plaster_weathered_diff_4k.jpg");
  const normalMap = useLoader(THREE.TextureLoader, "/src/assets/models/plaster/textures/red_plaster_weathered_nor_gl_4k.jpg");
  const roughnessMap = useLoader(THREE.TextureLoader, "/src/assets/models/plaster/textures/red_plaster_weathered_arm_4k.jpg");

  // Create material for the walls
  const wallMaterialFromTextures = new THREE.MeshStandardMaterial({
    map: colorMap,
    normalMap: normalMap,
    roughnessMap: roughnessMap,
    metalness: 0,
    roughness: 1,
  });

  return (
    <group>
      {/* Back Wall (Tilted) */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          position={[0, wallHeight / 2, -floorSize / 2]}
          rotation={[0, 0, tiltAngle]} // Apply tilt on Z-axis
          raycast={(...args) => THREE.Mesh.prototype.raycast.apply(this, args)}
        >
          <boxGeometry args={[floorSize, wallHeight, wallThickness]} />
          <primitive attach="material" object={wallMaterialFromTextures} />
        </mesh>
      </RigidBody>

      {/* Left Wall (Tilted) */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          position={[-floorSize / 2, wallHeight / 2, 0]}
          rotation={[0, Math.PI / 2, -tiltAngle]} // Rotate + tilt
          raycast={(...args) => THREE.Mesh.prototype.raycast.apply(this, args)}
        >
          <boxGeometry args={[floorSize, wallHeight, wallThickness]} />
          <primitive attach="material" object={wallMaterialFromTextures} />
        </mesh>
      </RigidBody>

      {/* Right Wall (Collider Only) - Tilted */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          position={[floorSize / 2, wallHeight / 2, 0]}
          rotation={[0, -Math.PI / 2, -tiltAngle]} // Rotate + inverse tilt
        >
          <boxGeometry args={[wallThickness, wallHeight, floorSize]} />
          <meshStandardMaterial visible={false} /> {/* Invisible Wall */}
        </mesh>
      </RigidBody>

      {/* Front Wall (Collider Only) - Tilted */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          position={[0, wallHeight / 2, floorSize / 2]}
          rotation={[0, 0, -tiltAngle]} // Opposite tilt
        >
          <boxGeometry args={[floorSize, wallHeight, wallThickness]} />
          <meshStandardMaterial visible={false} /> {/* Invisible Wall */}
        </mesh>
      </RigidBody>
    </group>
  );
};
