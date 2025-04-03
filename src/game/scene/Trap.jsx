// /game/scene/Trap.jsx
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider, interactionGroups } from "@react-three/rapier";

const trapColors = {
  unity: "#224b55",
  unreal: "#3f2a47",
  react: "#1e3a5f",
  blender: "#5a2c16",
  vr: "#3d1f1f",
};

const TRAP_GROUP = 0b0001;   // Group 1
const ENEMY_GROUP = 0b0010;  // Group 2

const Trap = ({ position, type = "unity" }) => {
  const meshRef = useRef();
  const clock = useRef(0);
  const baseY = useRef(position.y);

  useFrame((_, delta) => {
    clock.current += delta;
    if (meshRef.current) {
      // Float, pulse, and rotate.
      meshRef.current.position.y = baseY.current + Math.sin(clock.current * 2) * 0.1;
      meshRef.current.rotation.x += delta * 0.5;
      const pulse = 0.6 + Math.sin(clock.current * 4) * 0.4;
      meshRef.current.material.emissiveIntensity = pulse;
    }
  });

  return (
    <RigidBody
      type="fixed"
      position={[position.x, position.y, position.z]}
      colliders={false}
    >
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color={trapColors[type] || "white"}
          emissive={trapColors[type] || "white"}
          emissiveIntensity={1}
        />
      </mesh>

      {/* Add a name to the collider so enemy can detect it */}
      <CuboidCollider
        name="trap"
        args={[0.25, 1, 0.25]}
        position={[0, 0, 0]}
        collisionGroups={interactionGroups(TRAP_GROUP, ENEMY_GROUP)}
      />
    </RigidBody>
  );
};

export default Trap;
