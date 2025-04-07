import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider, interactionGroups } from "@react-three/rapier";
import * as THREE from "three";
import Enemy from "./Enemy";

const EnemyComponent = ({ playerPosition, onDeath }) => {
  const rigidBodyRef = useRef();
  const [enemyInstance, setEnemyInstance] = useState(null);
  const [rigidBodyReady, setRigidBodyReady] = useState(false);

  useEffect(() => {
    async function initEnemy() {
      if (!Enemy.model) await Enemy.load();
      const enemy = new Enemy();
      setEnemyInstance(enemy);
    }
    initEnemy();
  }, []);

  useEffect(() => {
    if (enemyInstance && rigidBodyRef.current && !enemyInstance.rigidBody) {
      enemyInstance.setPhysicsControl(rigidBodyRef.current);
      rigidBodyRef.current.setRotation({ x: 0, y: 0, z: 0 }, true);
      setRigidBodyReady(true);
    }
  }, [enemyInstance, rigidBodyRef.current]);

  const handleCollision = (event) => {
    const otherName = event.colliderObject.name;

    if (otherName?.toLowerCase().includes("trap")) {
      console.log("💥 Enemy collided with a trap:", otherName);

      if (enemyInstance && enemyInstance.state !== "dead") {
        enemyInstance.die(() => {
          console.log("☠️ Enemy died from trap");
          onDeath?.();
        });
      }
    }
  };

  useFrame((_, delta) => {
    if (!enemyInstance || !rigidBodyReady) return;

    enemyInstance.update(delta);

    if (playerPosition) {
      enemyInstance.updateBehavior(playerPosition, delta);
    }

    const rotation = rigidBodyRef.current.rotation();
    rigidBodyRef.current.setRotation({ x: 0, y: rotation.y, z: 0 }, true);
  });

  return enemyInstance ? (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      colliders={false}
      angularFactor={[0, 1, 0]}
      linearDamping={3}
      angularDamping={5}
      restitution={0}
      onCollisionEnter={handleCollision}
      collisionGroups={interactionGroups(0b0010, 0b1111)} // group 2, collides with 1 (trap), 4, and 8
    >
      <primitive object={enemyInstance.group} />
      <CuboidCollider
        args={enemyInstance.colliderSize}
        position={enemyInstance.colliderPosition}
      />
    </RigidBody>
  ) : null;
};

export default EnemyComponent;
