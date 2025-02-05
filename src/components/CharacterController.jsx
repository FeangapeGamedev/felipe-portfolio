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

      raycaster.setFromCamera(mouse, camera);

      // 🔹 Ensure the floor object exists
      const floor = scene.getObjectByName("floor");
      if (!floor) return;

      // 🔹 Perform raycast only on the floor
      const intersects = raycaster.intersectObject(floor, true);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        setTargetPosition(new THREE.Vector3(point.x, 0.5, point.z)); // 🔹 Keep Y at 0.5
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, [scene, camera, setTargetPosition]);

  return null;
};
