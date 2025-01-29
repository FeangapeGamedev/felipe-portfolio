import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export const CharacterController = ({ setTargetPosition }) => {
  const { scene, camera } = useThree();
  const raycaster = new THREE.Raycaster();

  useEffect(() => {
    const handlePointerDown = (event) => {
  
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      // Find the floor object
      const floor = scene.getObjectByName("floor");

      // Use `setFromCamera()`
      raycaster.setFromCamera(mouse, camera);


      // Raycast only against the floor
      const intersects = raycaster.intersectObject(floor, true);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        setTargetPosition(new THREE.Vector3(point.x, 1, point.z)); // Set character target position
      } else {
        setTargetPosition(null); // Reset target position
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, [scene, camera, setTargetPosition]);

  return null; // No need to render anything
};
