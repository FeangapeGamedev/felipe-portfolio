import React, { useEffect, useMemo, useState } from "react";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { TGALoader } from 'three/addons/loaders/TGALoader.js';
import InteractiveObject from "./InteractiveObject";

export const Room = ({ room, setTargetPosition, isPaused, onProjectSelect, handleDoorOpen, doorDirection }) => {
  const wallThickness = 0.5;
  const floorThickness = 0.2;

  const [wallTexture, setWallTexture] = useState(null);
  const [floorTexture, setFloorTexture] = useState(null);

  useEffect(() => {
    const loader = new TGALoader();

    // Load wall texture
    loader.load(
      room.wallTexture,
      (texture) => {
        setWallTexture(texture);
        console.log('Wall texture loaded');
      },
      undefined,
      (error) => {
        console.error('An error happened while loading wall texture', error);
      }
    );

    // Load floor texture
    loader.load(
      room.floorTexture,
      (texture) => {
        setFloorTexture(texture);
        console.log('Floor texture loaded');
      },
      undefined,
      (error) => {
        console.error('An error happened while loading floor texture', error);
      }
    );
  }, [room.wallTexture, room.floorTexture]);

  // Memoize materials to avoid recreating them on every render
  const wallMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    map: wallTexture,
    metalness: 0,
    roughness: 1,
  }), [wallTexture]);

  const floorMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    map: floorTexture,
    metalness: 0.1,
    roughness: 0.9,
  }), [floorTexture]);

  const transparentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    opacity: 0,
    transparent: true,
  }), []);

  useEffect(() => {
    // Set the initial character position when the room is generated
    const initialPosition = doorDirection === "forward" ? room.spawnPositionForward : room.spawnPositionBackward;
    console.log(`Initial character position: ${initialPosition}`);
    setTargetPosition(new THREE.Vector3(initialPosition[0], initialPosition[1], initialPosition[2]));
  }, [room, setTargetPosition, doorDirection]);

  return (
    <group>
      {/* Floor */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh name="floor" userData={{ type: "floor", raycastable: true }} position={[0, -floorThickness / 2, 0]}>
          <boxGeometry args={[room.width, floorThickness, room.depth]} />
          {floorTexture && <primitive attach="material" object={floorMaterial} />}
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
            {wallTexture && <primitive attach="material" object={visible ? wallMaterial : transparentMaterial} />}
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
