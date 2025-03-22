import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { useGame } from "../state/GameContext.jsx";

export const CharacterController = ({ isPaused }) => {
  const { scene, camera, gl } = useThree();
  const { setTargetPosition } = useGame();

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const [currentInteractive, setCurrentInteractive] = useState(null);
  const [collidingObject, setCollidingObject] = useState(null);
  const [lastClickedObject, setLastClickedObject] = useState(null);

  const [lastClickTime, setLastClickTime] = useState(0);

  useEffect(() => {
    const onMouseDown = (event) => {
      if (isPaused) return;

      const currentTime = performance.now();
      const timeSinceLastClick = currentTime - lastClickTime;
      const isDoubleClick = timeSinceLastClick < 300;

      setLastClickTime(currentTime);

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
            if (object.userData.id && object.userData.type) {
              firstInteractive = { object, point };

              if (collidingObject === object.userData.id) {
                return;
              }

              break;
            } else {
              console.warn("⚠️ Clicked object has no valid ID or type!", object.userData);
            }
          }

          if (object.userData?.type === "floor" && !firstFloorHit) {
            firstFloorHit = { object, point };
          }
        }
      }

      if (!isDoubleClick && lastClickedObject && firstInteractive?.object.userData.id === lastClickedObject) {
        return;
      }

      // ✅ Move to interactive object (with run)
      if (firstInteractive) {
        setLastClickedObject(firstInteractive.object.userData.id);

        if (collidingObject !== firstInteractive.object.userData.id) {
          setTargetPosition({
            position: new THREE.Vector3(
              firstInteractive.point.x,
              firstInteractive.point.y,
              firstInteractive.point.z
            ),
            run: isDoubleClick, // ✅ enable run to interactive object
          });
        }

        setCurrentInteractive(firstInteractive.object.userData);
      }

      // ✅ Move on floor (with run)
      else if (firstFloorHit) {
        setLastClickedObject(null);
        setTargetPosition({
          position: new THREE.Vector3(
            firstFloorHit.point.x,
            firstFloorHit.point.y,
            firstFloorHit.point.z
          ),
          run: isDoubleClick,
        });
        setCurrentInteractive(null);
      }
    };

    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [
    camera,
    gl,
    scene,
    setTargetPosition,
    isPaused,
    currentInteractive,
    collidingObject,
    lastClickedObject,
    lastClickTime,
  ]);

  useEffect(() => {
    const handleCollisionEnter = (event) => {
      if (event?.other?.rigidBodyObject?.userData?.isInteractive) {
        setCollidingObject(event.other.rigidBodyObject.userData.id);
      }
    };

    const handleCollisionExit = (event) => {
      if (event?.other?.rigidBodyObject?.userData?.isInteractive) {
        setCollidingObject(null);
      }
    };

    window.addEventListener("collisionEnter", handleCollisionEnter);
    window.addEventListener("collisionExit", handleCollisionExit);

    return () => {
      window.removeEventListener("collisionEnter", handleCollisionEnter);
      window.removeEventListener("collisionExit", handleCollisionExit);
    };
  }, []);

  return null;
};
