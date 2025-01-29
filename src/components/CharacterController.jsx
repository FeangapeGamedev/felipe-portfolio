import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export const CharacterController = ({ setTargetPosition }) => {
  const { scene, camera } = useThree();
  const raycaster = new THREE.Raycaster();

  useEffect(() => {
    const handlePointerDown = (event) => {
      console.log("🖱 Click detected");

      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      // 🔍 Find the floor object
      const floor = scene.getObjectByName("floor");

      if (!floor) {
        console.error("🚨 Floor object not found!");
        return;
      }

      console.log("✅ Floor found:", floor);
      console.log("🔍 Floor geometry:", floor.geometry);

      if (!floor.geometry) {
        console.error("🚨 Floor has NO geometry! Raycasting will fail.");
        return;
      }

      // 🎯 Use `setFromCamera()`
      raycaster.setFromCamera(mouse, camera);
      console.log("🚀 Raycaster set from camera");

      // Raycast only against the floor
      const intersects = raycaster.intersectObject(floor, true);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        console.log(`✅ Clicked on floor at: x=${point.x.toFixed(2)}, z=${point.z.toFixed(2)}`);
        setTargetPosition(new THREE.Vector3(point.x, 1, point.z)); // ✅ Set character target position
      } else {
        console.warn("⚠️ No intersection detected with the floor.");
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, [scene, camera, setTargetPosition]);

  return null; // No need to render anything
};
