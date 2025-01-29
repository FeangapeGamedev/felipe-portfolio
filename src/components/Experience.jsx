import React, { useState } from "react";
import { useGLTF, OrthographicCamera } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Floor } from "./Floor";
import { Walls } from "./Walls";
import { CharacterController } from "./CharacterController";
import { Character } from "./Character";

export const Experience = () => {
  const [targetPosition, setTargetPosition] = useState(null);

  // Load the GLTF model for the floor
  const gltf = useGLTF("/src/assets/models/granite/granite_tile_4k.gltf");
  const graniteMaterial = gltf.materials ? gltf.materials[0] : null;

  // Load textures for the walls
  const { materials: wallMaterials } = useGLTF("/src/assets/models/plaster/red_plaster_weathered_4k.gltf");
  const wallMaterial = wallMaterials ? wallMaterials.plaster : new THREE.MeshStandardMaterial({ color: "#e0e0e0" });

  return (
    <group>
      {/* Orthographic Camera */}
      <OrthographicCamera
        makeDefault
        position={[5, 5, 10]}
        rotation={[-Math.PI / 10, Math.PI / 5, 0.2]}
        zoom={60}
      />

      {/* Lights */}
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight position={[10, 10, 10]} intensity={0.7} castShadow />

      {/* Physics world */}
      <Physics>
        <Floor graniteMaterial={graniteMaterial} />
        <Walls wallMaterial={wallMaterial} />
        <Character targetPosition={targetPosition} /> {/* Character moves based on target */}
        <CharacterController setTargetPosition={setTargetPosition} /> {/* Handles mouse input */}
      </Physics>
    </group>
  );
};
