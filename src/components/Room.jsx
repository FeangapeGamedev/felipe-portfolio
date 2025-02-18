import React, { useEffect } from "react";
import { RigidBody } from "@react-three/rapier";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import InteractiveObject from "./InteractiveObject";

export const Room = ({ room, setTargetPosition, isPaused, onProjectSelect, handleDoorOpen }) => {
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

  useEffect(() => {
    // Set the initial character position when the room is generated
    const initialPosition = room.spawnPosition; // Use spawn position from room data
    setTargetPosition(new THREE.Vector3(initialPosition[0], initialPosition[1], initialPosition[2]));
  }, [room, setTargetPosition]);

  return (
    <group>
      {/* Floor */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh name="floor" userData={{ type: "floor", raycastable: true }} position={[0, -floorThickness / 2, 0]}>
          <boxGeometry args={[room.width, floorThickness, room.depth]} />
          <primitive attach="material" object={floorMaterial} />
        </mesh>
      </RigidBody>

      {/* Walls */}
      {[
        { pos: [0, room.height / 2, -room.depth / 2], rot: [0, 0, 0], size: [room.width, room.height, wallThickness], name: "back-wall", visible: true, raycastable: true },
        { pos: [-room.width / 2, room.height / 2, 0], rot: [0, Math.PI / 2, 0], size: [room.depth, room.height, wallThickness], name: "left-wall", visible: true, raycastable: true },
        { pos: [room.width / 2, room.height / 2, 0], rot: [0, Math.PI / 2, 0], size: [room.depth, room.height, wallThickness], name: "right-wall", visible: false, raycastable: false },
        { pos: [0, room.height / 2, room.depth / 2], rot: [0, Math.PI, 0], size: [room.width, room.height, wallThickness], name: "front-wall", visible: false, raycastable: false },
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

      {/* Interactive Items */}
      {room.items.map((item, index) => (
        <InteractiveObject
          key={index}
          id={item.id}
          position={item.position}
          onClick={() => console.log(`${item.type} clicked!`)}
          onProjectClick={item.type === "door" ? () => handleDoorOpen(item.direction) : onProjectSelect}
          isPaused={isPaused}
          color={item.color || "red"}
          shape={item.type === "door" ? "door" : "sphere"} // Use "door" shape for doors
          label={item.label}
          setTargetPosition={setTargetPosition}
        />
      ))}
    </group>
  );
};
