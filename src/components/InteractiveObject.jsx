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
      {/* Capsule Collider */}
      <CapsuleCollider args={[0.5, 0.3]} /> {/* (height, radius) */}

      <mesh position={position} onClick={onClick}>
        {/* Capsule Shape */}
        <capsuleGeometry args={[0.3, 1, 10, 10]} />
        <meshStandardMaterial color="blue" />

        {/* Label appears only when the character is near */}
        {isNear && (
          <Html position={[0, 1.2, 0]}>
            <div className="object-label"> Press "Enter" to View project</div>
          </Html>
        )}
      </mesh>
    </RigidBody>
  );
};

export default InteractiveObject;
