import React, { useEffect, useMemo, useState } from "react";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { TGALoader } from 'three/addons/loaders/TGALoader.js';
import InteractiveObject from "./InteractiveObject";

export const Room = ({ room, setTargetPosition, isPaused, onProjectSelect, handleDoorOpen, doorDirection }) => {
  const wallThickness = 0.5;
  const floorThickness = 0.2;

  const [wallTextures, setWallTextures] = useState({});
  const [floorTexture, setFloorTexture] = useState(null);
  const [backgroundTexture, setBackgroundTexture] = useState(null);

  useEffect(() => {
    const loader = new TGALoader();

    // Load wall textures
    const wallTexturePromises = Object.entries(room.walls).map(([wall, { texture }]) =>
      new Promise((resolve, reject) => {
        loader.load(
          texture,
          (loadedTexture) => {
            resolve({ wall, texture: loadedTexture });
          },
          undefined,
          (error) => {
            reject(error);
          }
        );
      })
    );

    Promise.all(wallTexturePromises)
      .then((textures) => {
        const textureMap = textures.reduce((acc, { wall, texture }) => {
          acc[wall] = texture;
          return acc;
        }, {});
        setWallTextures(textureMap);
        console.log('Wall textures loaded');
      })
      .catch((error) => {
        console.error('An error happened while loading wall textures', error);
      });

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

    // Load background texture if provided
    if (room.backgroundTexture) {
      loader.load(
        room.backgroundTexture,
        (texture) => {
          setBackgroundTexture(texture);
          console.log('Background texture loaded');
        },
        undefined,
        (error) => {
          console.error('An error happened while loading background texture', error);
        }
      );
    }
  }, [room.walls, room.floorTexture, room.backgroundTexture]);

  // Memoize materials to avoid recreating them on every render
  const wallMaterials = useMemo(() => {
    return Object.entries(wallTextures).reduce((acc, [wall, texture]) => {
      acc[wall] = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0,
        roughness: 1,
      });
      return acc;
    }, {});
  }, [wallTextures]);

  const floorMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    map: floorTexture,
    metalness: 0.1,
    roughness: 0.9,
  }), [floorTexture]);

  const transparentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    opacity: 0,
    transparent: true,
  }), []);

  const backgroundMaterial = useMemo(() => {
    if (backgroundTexture) {
      return new THREE.MeshStandardMaterial({
        map: backgroundTexture,
        metalness: 0,
        roughness: 1,
      });
    } else {
      return new THREE.MeshStandardMaterial({
        color: 0x000000, // Default color if no texture is provided
        metalness: 0,
        roughness: 1,
      });
    }
  }, [backgroundTexture]);

  useEffect(() => {
    // Set the initial character position when the room is generated
    const initialPosition = doorDirection === "forward" ? room.spawnPositionForward : room.spawnPositionBackward;
    console.log(`Initial character position: ${initialPosition}`);
    setTargetPosition(new THREE.Vector3(initialPosition[0], initialPosition[1], initialPosition[2]));
  }, [room, setTargetPosition, doorDirection]);

  return (
    <group>
      {/* Background Plane */}
      <mesh position={[0, room.height / 2, -room.depth / 2 - 0.1]} rotation={[0, 0, 0]}>
        <planeGeometry args={[room.width, room.height]} />
        <primitive attach="material" object={backgroundMaterial} />
      </mesh>

      {/* Floor */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh name="floor" userData={{ type: "floor", raycastable: true }} position={[0, -floorThickness / 2, 0]}>
          <boxGeometry args={[room.width, floorThickness, room.depth]} />
          {floorTexture && <primitive attach="material" object={floorMaterial} />}
        </mesh>
      </RigidBody>

      {/* Walls */}
      {[
        { pos: [0, room.height / 2, -room.depth / 2], rot: [0, 0, 0], size: [room.width, room.height, wallThickness], name: "back-wall", wall: "back" },
        { pos: [-room.width / 2, room.height / 2, 0], rot: [0, Math.PI / 2, 0], size: [room.depth, room.height, wallThickness], name: "left-wall", wall: "left" },
        { pos: [room.width / 2, room.height / 2, 0], rot: [0, Math.PI / 2, 0], size: [room.depth, room.height, wallThickness], name: "right-wall", wall: "right" },
        { pos: [0, room.height / 2, room.depth / 2], rot: [0, Math.PI, 0], size: [room.width, room.height, wallThickness], name: "front-wall", wall: "front" },
      ].map(({ pos, rot, size, name, wall }, index) => (
        <RigidBody key={index} type="fixed" colliders="cuboid">
          <mesh position={pos} rotation={rot} name={name} userData={{ raycastable: room.walls[wall].visible }}>
            <boxGeometry args={size} />
            {wallTextures[wall] && <primitive attach="material" object={room.walls[wall].visible ? wallMaterials[wall] : transparentMaterial} />}
          </mesh>
        </RigidBody>
      ))}

      {/* Interactive Items */}
      {room.items.map((item, index) => (
        <InteractiveObject
          key={index}
          id={item.id}
          position={item.position}
          rotation={item.rotation}
          scale={item.scale}
          onClick={() => console.log(`${item.type} clicked!`)}
          onProjectClick={item.type === "door" ? () => handleDoorOpen(item.direction) : onProjectSelect}
          isPaused={isPaused}
          color={item.color || "red"}
          shape={item.type === "door" ? "door" : "sphere"} // Use "door" shape for doors
          label={item.label}
          setTargetPosition={setTargetPosition}
          model={item.model} // Pass the model path to InteractiveObject
          transparency={item.transparency} // Pass transparency to InteractiveObject
        />
      ))}
    </group>
  );
};
