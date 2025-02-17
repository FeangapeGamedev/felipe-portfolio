import { useState, useEffect } from "react";
import { Html } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

const InteractiveObject = ({ id, position, onClick, onProjectClick, isPaused, color }) => {
  const [isNear, setIsNear] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isNear && event.code === "Space" && !isPaused) {
        onProjectClick(id); // Call the onProjectClick function with the id
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isNear, onProjectClick, id, isPaused]);

  return (
    <RigidBody
      type="fixed"
      onCollisionEnter={(event) => {
        if (event.other.rigidBodyObject?.name === "character") {
          setIsNear(true);
        }
      }}
      onCollisionExit={(event) => {
        if (event.other.rigidBodyObject?.name === "character") {
          setIsNear(false);
        }
      }}
    >
      <mesh
        position={position}
        onClick={(event) => {
          event.stopPropagation();
          onClick();
        }}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <capsuleGeometry args={[0.3, 1, 10, 10]} />
        <meshStandardMaterial
          color={isHovered ? "yellow" : color}
          emissive={isHovered ? "yellow" : "black"}
          emissiveIntensity={isHovered ? 0.5 : 0}
        />

        {isNear && !isPaused && (
          <Html position={[0, 1.2, 0]}>
            <div className="object-label">Press Space to activate</div>
          </Html>
        )}
      </mesh>
    </RigidBody>
  );
};

export default InteractiveObject;
