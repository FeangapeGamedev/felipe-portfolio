import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export const CharacterController = ({ setTargetPosition, isPaused }) => {
  const { scene, camera } = useThree();
  const raycaster = new THREE.Raycaster();
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (isPausedRef.current) return;

      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        // Find the floor first before any other object
        const floorHit = intersects.find((hit) => hit.object.userData?.type === "floor");

        if (floorHit) {
          const point = floorHit.point;
          console.log("✅ Floor Clicked! Moving to:", point);
          setTargetPosition(new THREE.Vector3(point.x, 0.5, point.z));
          return;
        }

        // Otherwise, handle other interactive objects
        let clickedObject = intersects.find(obj => obj.object.userData?.raycastable !== false)?.object;
        if (!clickedObject) {
          console.log("❌ No valid object clicked.");
          return;
        }

        console.log("🎯 Clicked Object:", clickedObject.name || clickedObject.userData?.type || "Unknown Object");

        // Handle interactive objects
        if (clickedObject.userData?.type === "interactive") {
          setTargetPosition(clickedObject.position);
          console.log("🚶 Moving towards interactive object...");
        }
      } else {
        console.log("❌ No valid object clicked.");
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, [scene, camera, setTargetPosition]);

  return null;
};
