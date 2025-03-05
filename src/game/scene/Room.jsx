import React, { useEffect, useMemo, useState } from "react";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { TGALoader } from "three/addons/loaders/TGALoader.js";
import { useGame } from "../state/GameContext"; // ✅ Import GameContext
import InteractiveObject from "./InteractiveObject";
import PropObject from "./propObjects"; // ✅ Import PropObject

export const Room = ({ isPaused, onProjectSelect }) => {
  const { currentRoom} = useGame(); // ✅ Use GameContext
  const wallThickness = 0.5;
  const floorThickness = 0.2;

  const [wallTextures, setWallTextures] = useState({});
  const [floorTexture, setFloorTexture] = useState(null);
  const [backgroundTexture, setBackgroundTexture] = useState(null);

  useEffect(() => {
    const loader = new TGALoader();

    // Load wall textures
    const wallTexturePromises = Object.entries(currentRoom.walls).map(([wall, { texture }]) =>
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
      })
      .catch((error) => {
        console.error("An error happened while loading wall textures", error);
      });

    // Load floor texture
    loader.load(
      currentRoom.floorTexture,
      (texture) => {
        setFloorTexture(texture);
      },
      undefined,
      (error) => {
        console.error("An error happened while loading floor texture", error);
      }
    );

    // Load background texture if provided
    if (currentRoom.backgroundTexture) {
      loader.load(
        currentRoom.backgroundTexture,
        (texture) => {
          setBackgroundTexture(texture);
        },
        undefined,
        (error) => {
          console.error("An error happened while loading background texture", error);
        }
      );
    }
  }, [currentRoom]);

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

  return (
    <group>
      {/* Background Plane */}
      <mesh position={[0, currentRoom.height / 2, -currentRoom.depth / 2 - 0.1]} rotation={[0, 0, 0]}>
        <planeGeometry args={[currentRoom.width, currentRoom.height]} />
        <primitive attach="material" object={backgroundMaterial} />
      </mesh>

      {/* Floor */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh name="floor" userData={{ type: "floor", raycastable: true }} position={[0, -floorThickness / 2, 0]}>
          <boxGeometry args={[currentRoom.width, floorThickness, currentRoom.depth]} />
          {floorTexture && <primitive attach="material" object={floorMaterial} />}
        </mesh>
      </RigidBody>

      {/* Walls */}
      {[
        { pos: [0, currentRoom.height / 2, -currentRoom.depth / 2], rot: [0, 0, 0], size: [currentRoom.width, currentRoom.height, wallThickness], name: "back-wall", wall: "back" },
        { pos: [-currentRoom.width / 2, currentRoom.height / 2, 0], rot: [0, Math.PI / 2, 0], size: [currentRoom.depth, currentRoom.height, wallThickness], name: "left-wall", wall: "left" },
        { pos: [currentRoom.width / 2, currentRoom.height / 2, 0], rot: [0, Math.PI / 2, 0], size: [currentRoom.depth, currentRoom.height, wallThickness], name: "right-wall", wall: "right" },
        { pos: [0, currentRoom.height / 2, currentRoom.depth / 2], rot: [0, Math.PI, 0], size: [currentRoom.width, currentRoom.height, wallThickness], name: "front-wall", wall: "front" },
      ].map(({ pos, rot, size, name, wall }, index) => (
        <RigidBody key={index} type="fixed" colliders="cuboid">
          <mesh position={pos} rotation={rot} name={name} userData={{ raycastable: currentRoom.walls[wall].visible }}>
            <boxGeometry args={size} />
            {wallTextures[wall] && <primitive attach="material" object={currentRoom.walls[wall].visible ? wallMaterials[wall] : transparentMaterial} />}
          </mesh>
        </RigidBody>
      ))}

      {/* Interactive Items */}
      {currentRoom.items.map((item) => (
        <InteractiveObject
          key={item.id} // ✅ Ensure each object maintains a unique key
          id={item.id}  // ✅ Pass the correct ID
          type={item.type}  // ✅ Ensure type is passed
          position={item.position}
          rotation={item.rotation}
          scale={item.scale}
          isPaused={isPaused}
          label={item.label}
          model={item.model}
          transparency={item.transparency}
          onProjectSelect={item.type === "project" ? onProjectSelect : undefined}
        />
      ))}

      {/* Non-Interactive Props */}
      {currentRoom.props.map((prop) => (
        <PropObject
          key={prop.id}
          id={prop.id}
          type={prop.type}
          position={prop.position}
          rotation={prop.rotation}
          scale={prop.scale}
          model={prop.model}
        />
      ))}
    </group>
  );
};
