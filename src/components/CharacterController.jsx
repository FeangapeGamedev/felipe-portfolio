import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export const CharacterController = ({ setTargetPosition, isPaused }) => {
  const { scene, camera } = useThree();
  const raycaster = new THREE.Raycaster();
  const isPausedRef = useRef(isPaused); // ✅ Use ref to always get the latest value

  useEffect(() => {
    isPausedRef.current = isPaused; // ✅ Keep ref updated
    console.log("CharacterController: isPaused =", isPaused); // ✅ Debug log
  }, [isPaused]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      console.log("Mouse Clicked: isPaused =", isPausedRef.current); // ✅ Always reference ref

      if (isPausedRef.current) {
        console.log("Movement is blocked!"); // ✅ Confirm blocking works
        return; // ⛔ Stop movement if UI is open
      }

      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);

      const floor = scene.getObjectByName("floor");
      if (!floor) return;

      const intersects = raycaster.intersectObject(floor, true);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        setTargetPosition(new THREE.Vector3(point.x, 0.5, point.z));
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, [scene, camera, setTargetPosition]); // ✅ No longer depends on `isPaused`

  return null;
};
