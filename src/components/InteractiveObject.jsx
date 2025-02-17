import { useState } from "react";
import { Html } from "@react-three/drei";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";

const InteractiveObject = ({ position, onClick }) => {
  const [isNear, setIsNear] = useState(false);

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
      >
        {/* ✅ Do NOT add another capsule here, just the geometry */}
        <capsuleGeometry args={[0.3, 1, 10, 10]} />
        <meshStandardMaterial color="blue" />

        {isNear && (
          <Html position={[0, 1.2, 0]}>
            <div className="object-label">Click to interact</div>
          </Html>
        )}
      </mesh>
    </RigidBody>
  );
};

export default InteractiveObject;
