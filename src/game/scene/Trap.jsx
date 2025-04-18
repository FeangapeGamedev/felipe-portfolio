import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import Explosion from "../effects/Explosion";
import GlobalConstants from "../utils/GlobalConstants.js";
import { registerTrap, unregisterTrap } from "../utils/trapRegistry";

const trapColors = {
  unity: "#224b55",
  unreal: "#3f2a47",
  react: "#1e3a5f",
  blender: "#5a2c16",
  vr: "#3d1f1f",
};

const trapDamage = {
  unity: 25,
  unreal: 25,
  blender: 15,
  vr: 15,
  react: 10,
};

export default function Trap({ trapId, position, type = "unity", onTrapConsumed }) {
  const meshRef = useRef();
  const clock = useRef(0);
  const baseY = useRef(position.y);
  const [exploded, setExploded] = useState(false);

  useEffect(() => {
    const data = {
      trapId,
      trapType: type,
      damage: trapDamage[type] || 10,
      position,
    };

    registerTrap(trapId, data);

    return () => unregisterTrap(trapId);
  }, [trapId, type, position]);

  useFrame((_, delta) => {
    clock.current += delta;
    if (meshRef.current && !exploded) {
      meshRef.current.position.y = baseY.current + Math.sin(clock.current * 2) * 0.1;
      meshRef.current.rotation.x += delta * 0.5;
      const pulse = 0.6 + Math.sin(clock.current * 4) * 0.4;
      meshRef.current.material.emissiveIntensity = pulse;
    }
  });

  return (
    <>
      {!exploded && (
        <RigidBody
          type="fixed"
          position={[position.x, position.y, position.z]}
          colliders={false}
          name="trap"
          userData={{ trapId }} // ✅ Attach trapId to the parent RigidBody
        >
          <mesh ref={meshRef} castShadow>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial
              color={trapColors[type] || "white"}
              emissive={trapColors[type] || "white"}
              emissiveIntensity={1}
            />
          </mesh>

          <CuboidCollider
            name="trap"
            type="sensor"
            args={[0.25, 1, 0.25]}
            collisionGroups={GlobalConstants.createInteractionGroup(
              GlobalConstants.TRAP_GROUP,
              GlobalConstants.CHARACTER_GROUP
            )}
            onCollisionEnter={(event) => {
              const otherName =
                event.colliderObject?.name || event.colliderObject?.userData?.name;

              if (otherName !== "enemy") return;

              console.log(`🔥 Trap triggered by: ${otherName}`);
              setExploded(true);

              setTimeout(() => {
                console.log(`🧯 Removing trap with ID ${trapId}`);
                if (onTrapConsumed) onTrapConsumed(trapId);
              }, 1000);
            }}
          />
        </RigidBody>
      )}

      {exploded && (
        <Explosion
          position={[position.x, position.y + 0.5, position.z]}
          onComplete={() => {}}
        />
      )}
    </>
  );
}
