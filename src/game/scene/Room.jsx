import React, { useEffect, useMemo, useState, useRef } from "react";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useGame } from "../state/GameContext.jsx";
import InteractiveObject from "./InteractiveObject.jsx";
import PropObject from "./propObjects.jsx";
import SpotLightManager from "../state/SpotLightManager.jsx";
import ThreeDText from "../../components/ThreeDText.jsx";

const Room = ({ isPaused, onProjectSelect, onShowCodeFrame, showSurvivorDoor, loadingManager }) => {
  const { currentRoom } = useGame();
  const wallThickness = 0.5;
  const floorThickness = 0.2;

  const [wallTextures, setWallTextures] = useState({});
  const [floorTexture, setFloorTexture] = useState(null);
  const [backgroundTexture, setBackgroundTexture] = useState(null);

  const wallRefs = useRef([]);
  wallRefs.current = []; // Reset on re-render

  useEffect(() => {
    const loader = new THREE.TextureLoader(loadingManager); // Use the loadingManager here

    const wallTexturePromises = Object.entries(currentRoom.walls).map(([wall, { texture }]) =>
      new Promise((resolve, reject) => {
        loader.load(
          texture.replace(".tga", ".jpg"),
          (loadedTexture) => {
            loadedTexture.flipY = false;
            resolve({ wall, texture: loadedTexture });
          },
          undefined,
          (error) => reject(error)
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
      .catch((error) => console.error("Error loading wall textures", error));

    loader.load(
      currentRoom.floorTexture.replace(".tga", ".jpg"),
      (texture) => {
        texture.flipY = false;
        setFloorTexture(texture);
      },
      undefined,
      (error) => console.error("Error loading floor texture", error)
    );

    if (currentRoom.backgroundTexture) {
      loader.load(
        currentRoom.backgroundTexture.replace(".tga", ".jpg"),
        (texture) => {
          texture.flipY = false;
          setBackgroundTexture(texture);
        },
        undefined,
        (error) => console.error("Error loading background texture", error)
      );
    }
  }, [currentRoom, loadingManager]);

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
    return backgroundTexture
      ? new THREE.MeshStandardMaterial({ map: backgroundTexture, metalness: 0, roughness: 1 })
      : new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0, roughness: 1 });
  }, [backgroundTexture]);

  const filteredItems = useMemo(() => {
    if (!currentRoom) return [];
    if (currentRoom.id === 3 && !showSurvivorDoor) {
      return currentRoom.items.filter(item => item.id !== "door4"); // Hide Survivor exit door
    }
    return currentRoom.items;
  }, [currentRoom, showSurvivorDoor]);

  return (
    <group>
      {/* Background Plane */}
      <mesh position={[0, currentRoom.height / 2, -currentRoom.depth / 2 - 0.1]}>
        <planeGeometry args={[currentRoom.width, currentRoom.height]} />
        <primitive attach="material" object={backgroundMaterial} />
      </mesh>

      {/* Spotlights */}
      {currentRoom.lights.map((light, index) => (
        <SpotLightManager key={index} {...light} />
      ))}

      {/* Floor */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh name="floor" userData={{ type: "floor", raycastable: true }} position={[0, -floorThickness / 2, 0]}>
          <boxGeometry args={[currentRoom.width, floorThickness, currentRoom.depth]} />
          {floorTexture && <primitive attach="material" object={floorMaterial} />}
        </mesh>
      </RigidBody>

      {/* Walls */}
      {[
        { pos: [0, currentRoom.height / 2, -currentRoom.depth / 2], rot: [0, 0, 0], size: [currentRoom.width, currentRoom.height, wallThickness], wall: "back" },
        { pos: [-currentRoom.width / 2, currentRoom.height / 2, 0], rot: [0, Math.PI / 2, 0], size: [currentRoom.depth, currentRoom.height, wallThickness], wall: "left" },
        { pos: [currentRoom.width / 2, currentRoom.height / 2, 0], rot: [0, Math.PI / 2, 0], size: [currentRoom.depth, currentRoom.height, wallThickness], wall: "right" },
        { pos: [0, currentRoom.height / 2, currentRoom.depth / 2], rot: [0, Math.PI, 0], size: [currentRoom.width, currentRoom.height, wallThickness], wall: "front" },
      ].map(({ pos, rot, size, wall }, index) => (
        <RigidBody key={index} type="fixed" colliders="cuboid">
          <mesh
            ref={(el) => el && wallRefs.current.push(el)} // Push each wall mesh to the ref
            name={`wall-${wall}`}
            position={pos}
            rotation={rot}
            userData={{ raycastable: true, isWall: true }}
          >
            <boxGeometry args={size} />
            {wallTextures[wall] && (
              <primitive
                attach="material"
                object={currentRoom.walls[wall].visible ? wallMaterials[wall] : transparentMaterial}
              />
            )}
          </mesh>
        </RigidBody>
      ))}

      {/* Interactive Items */}
      {filteredItems.map((item) => (
        <InteractiveObject
          key={item.id}
          {...item}
          isPaused={isPaused}
          onProjectSelect={item.type === "project" ? onProjectSelect : undefined}
          onShowCodeFrame={item.type === "door" && item.id === "door2" ? onShowCodeFrame : undefined}
        />
      ))}

      {/* Props */}
      {currentRoom.props.map((prop) => (
        <PropObject key={prop.id} {...prop} />
      ))}

      {/* 3D Text (Unified Style) */}
      {currentRoom.text && (
        <ThreeDText
          text={currentRoom.text.content}
          position={currentRoom.text.position}
          rotation={currentRoom.text.rotation}
          color={currentRoom.text.color}
          size={currentRoom.text.size}
          height={currentRoom.text.height}
          isNeon={currentRoom.text.isNeon}
        />
      )}
    </group>
  );
};

export default Room;
