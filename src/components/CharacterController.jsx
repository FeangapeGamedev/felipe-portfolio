import { useThree, useFrame } from "@react-three/fiber";
import React, { useEffect } from "react";
import * as THREE from "three";

export const CharacterController = ({ isPaused, setTargetPosition, onInteract }) => {
  const { scene, camera, gl } = useThree();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  useEffect(() => {
    const onMouseDown = (event) => {
      if (isPaused) return;

      // Convert mouse click to normalized device coordinates (-1 to +1)
      mouse.x = (event.clientX / gl.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / gl.domElement.clientHeight) * 2 + 1;

      // Set the raycaster from camera to click point
      raycaster.setFromCamera(mouse, camera);

      // Get intersections
      const intersections = raycaster.intersectObjects(scene.children, true);

      // Log intersections for debugging
      console.log('Intersections:', intersections);

      // Loop through intersections to find the first raycastable object
      for (let i = 0; i < intersections.length; i++) {
        const intersectedObject = intersections[i].object;

        console.log(`Intersected object: ${intersectedObject.name}, Raycastable: ${intersectedObject.userData.raycastable}`);

        if (intersectedObject.userData.raycastable) {
          // Check if the object is interactive
          if (intersectedObject.userData?.isInteractive) {
            onInteract(intersectedObject);
          } else {
            // Move character to clicked position
            const point = intersections[i].point;
            console.log(`Moving character to: ${point.x}, ${point.y}, ${point.z}`);
            setTargetPosition(new THREE.Vector3(point.x, point.y, point.z));
          }
          break; // Exit the loop once a raycastable object is found
        }
      }
    };

    // Attach event listener
    window.addEventListener("mousedown", onMouseDown);

    return () => {
      // Cleanup event listener on unmount
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [camera, gl, scene, setTargetPosition, onInteract, isPaused]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isPaused) return;

      // Handle character movement and interaction logic here
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPaused]);

  return null;
};

