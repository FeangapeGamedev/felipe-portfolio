import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const trapColors = {
  unity: "cyan",
  blender: "orange",
  react: "blue",
};

export default function useTrapPlacement({ placementMode, onPlaced }) {
  const { camera, scene } = useThree();
  const [mouse, setMouse] = useState(new THREE.Vector2());
  const [position, setPosition] = useState(null);
  const meshRef = useRef();

  // 🖱️ Track mouse position for raycasting
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = e.target.getBoundingClientRect();
      setMouse(
        new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        )
      );
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 🎯 Raycast to floor to position trap preview
  useFrame(() => {
    if (!placementMode) {
      setPosition(null);
      return;
    }

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
    const floorHit = intersects.find(hit => hit.object.name === "floor");

    if (floorHit) {
      const snap = floorHit.point.clone().setY(0.01);
      setPosition(snap);
    } else {
      setPosition(null); // hide preview if not on floor
    }
  });

  // 🖱️ Click to place trap
  useEffect(() => {
    const handleClick = () => {
      if (placementMode && position) {
        onPlaced(placementMode, position.clone());
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [placementMode, position, onPlaced]);

  // 🟦 Trap preview mesh
  const TrapPreview = placementMode && position ? (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 0.1, 1]} />
      <meshStandardMaterial
        color={trapColors[placementMode] || "white"}
        opacity={0.5}
        transparent
      />
    </mesh>
  ) : null;

  return { TrapPreview };
}
