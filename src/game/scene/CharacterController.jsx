import { useThree } from "@react-three/fiber";
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

      for (let i = 0; i < intersections.length; i++) {
        const intersectedObject = intersections[i].object;

        if (intersectedObject.userData?.raycastable) {
          console.log(`🖱️ Clicked on: ${intersectedObject.name || "Unknown Object"}`);

          // ✅ Check if the object is interactive
          if (intersectedObject.userData?.isInteractive) {
            console.log(`🖱️ Interactive Object Clicked: ${intersectedObject.userData.type}`);
            
            if (intersectedObject.userData.type === "project" || intersectedObject.userData.type === "door") {
              onInteract(intersectedObject);
            }

            return; // ✅ Prevents character from moving when clicking an interactive object
          }

          // ✅ Move character to clicked position
          const point = intersections[i].point;
          console.log(`📍 Moving character to: ${point.x}, ${point.y}, ${point.z}`);
          setTargetPosition(new THREE.Vector3(point.x, point.y, point.z));

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

  return null;
};
