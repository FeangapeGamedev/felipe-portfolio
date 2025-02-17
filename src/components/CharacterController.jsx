import { useThree, useFrame } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

export const CharacterController = ({ setTargetPosition, onInteract }) => {
  const { scene, camera, gl } = useThree();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  useEffect(() => {
    const onMouseDown = (event) => {
      // Convert mouse click to normalized device coordinates (-1 to +1)
      mouse.x = (event.clientX / gl.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / gl.domElement.clientHeight) * 2 + 1;

      // Set the raycaster from camera to click point
      raycaster.setFromCamera(mouse, camera);

      // Get intersections
      const intersections = raycaster.intersectObjects(scene.children, true);

      // If there are intersections and the object is raycastable
      if (intersections.length > 0 && intersections[0].object.userData.raycastable) {
        const selectedObject = intersections[0].object;

        // Check if the object is interactive
        if (selectedObject.userData?.isInteractive) {
          onInteract(selectedObject);
        } else {
          // Move character to clicked position
          const point = intersections[0].point;
          setTargetPosition(new THREE.Vector3(point.x, point.y, point.z));
        }
      }
      // If there are intersections and the object is not raycastable, move to the next intersection
      else if (intersections.length > 1 && !intersections[0].object.userData.raycastable) {
        const point = intersections[1].point;
        setTargetPosition(new THREE.Vector3(point.x, point.y, point.z));
      }
    };

    // Attach event listener
    window.addEventListener("mousedown", onMouseDown);

    return () => {
      // Cleanup event listener on unmount
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [camera, gl, scene, setTargetPosition, onInteract]);

  return null;
};
