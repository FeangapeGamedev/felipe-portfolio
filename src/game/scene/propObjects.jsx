import React, { useEffect, useState, useRef } from "react";
import { RigidBody, MeshCollider } from "@react-three/rapier";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

const PropObject = ({ id, type, position, rotation, scale, model, loadingManager }) => {
  const [gltf, setGltf] = useState(null);
  const boundingBox = useRef(new THREE.Box3());
  const size = useRef([1, 1, 1]); // Default size

  useEffect(() => {
    const loader = new GLTFLoader(loadingManager); // Use the loadingManager here
    loader.load(
      model,
      (loadedGltf) => {
        // Compute bounding box
        const box = new THREE.Box3().setFromObject(loadedGltf.scene);
        boundingBox.current = box;

        const width = box.max.x - box.min.x;
        const height = box.max.y - box.min.y;
        const depth = box.max.z - box.min.z;

        // Validate dimensions
        if (width > 0 && height > 0 && depth > 0) {
          size.current = [width / 2, height / 2, depth / 2]; // Adjust size for collider
        } else {
          console.warn(`Invalid bounding box for ${id}:`, { width, height, depth });
        }

        setGltf(loadedGltf);
      },
      undefined,
      (error) => {
        console.error(`Error loading model ${id}:`, error);
      }
    );
  }, [model, loadingManager]);

  return (
    <>
      {gltf && (
        <RigidBody type="fixed" position={position} rotation={rotation} scale={scale} debug>
          <group>
            {/* Render the actual model */}
            <primitive object={gltf.scene} />

            {/* Collider based on computed size */}
            <MeshCollider type="cuboid" args={size.current} />
          </group>
        </RigidBody>
      )}
    </>
  );
};

export default PropObject;
