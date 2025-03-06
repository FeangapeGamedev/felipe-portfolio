import React, { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";

const SpotLightManager = ({ position, targetPosition, intensity, color }) => {
  const spotLightRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    if (spotLightRef.current) {
      spotLightRef.current.target.position.set(...targetPosition);
      scene.add(spotLightRef.current.target);
    }
  }, [targetPosition, scene]);

  return (
    <spotLight
      ref={spotLightRef}
      position={position}
      intensity={intensity}
      color={color}
      angle={Math.PI / 4}  // Controls how wide the spotlight is
      penumbra={0.5}        // Softens the light edges
      decay={2}             // Makes light diminish over distance (realistic)
      distance={20}         // Limits how far the light reaches
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
    />
  );
};

export default SpotLightManager;
