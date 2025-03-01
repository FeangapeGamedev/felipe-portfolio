import { useThree } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGame } from "../state/GameContext";
import { GameManager } from "../state/GameManager";

export const CharacterController = ({ isPaused, onProjectSelect }) => {
  const { scene, camera, gl } = useThree();
  const { setTargetPosition } = useGame();
  const { handleInteraction } = GameManager(onProjectSelect); // ✅ Pass it here

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const interactionTarget = useRef(null);

  useEffect(() => {
    const onMouseDown = (event) => {
      if (isPaused) return;

      mouse.x = (event.clientX / gl.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / gl.domElement.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersections = raycaster.intersectObjects(scene.children, true);

      let firstInteractive = null;
      let firstFloorHit = null;

      for (let i = 0; i < intersections.length; i++) {
        let object = intersections[i].object;

        while (object && !object.userData?.raycastable && object.parent) {
          object = object.parent;
        }

        if (object.userData?.raycastable) {
          const point = intersections[i].point;

          if (object.userData?.isInteractive) {
            console.log(`🖱️ Clicked Object Data:`, object.userData);

            if (object.userData.id && object.userData.type) {
              console.log(`🖱️ Clicked on Interactive Object: ID=${object.userData.id}, Type=${object.userData.type}`);
              firstInteractive = { object, point };
              interactionTarget.current = object.userData;
              break;
            } else {
              console.warn("⚠️ Clicked object has no valid ID or type!", object.userData);
            }
          }

          if (object.userData?.type === "floor" && !firstFloorHit) {
            console.log("📍 Clicked on floor at:", point);
            firstFloorHit = { object, point };
          }
        }
      }

      if (firstInteractive) {
        setTargetPosition(new THREE.Vector3(firstInteractive.point.x, firstInteractive.point.y, firstInteractive.point.z));
      } else if (firstFloorHit) {
        setTargetPosition(new THREE.Vector3(firstFloorHit.point.x, firstFloorHit.point.y, firstFloorHit.point.z));
      }
    };

    const onKeyDown = (event) => {
      if (isPaused || event.code !== "Space" || !interactionTarget.current) return;

      console.log(`🔹 Space Pressed - Executing stored interaction`);
      handleInteraction(interactionTarget.current.id, interactionTarget.current.type);
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [camera, gl, scene, setTargetPosition, handleInteraction, isPaused]);

  return null;
};
