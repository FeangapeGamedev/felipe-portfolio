// EnemyComponent.jsx
import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import Enemy from "./Enemy";
import * as THREE from "three"; // Ensure THREE is imported for Vector3 calculations

const EnemyComponent = ({ playerPosition, onDeath, onPlayerHit }) => {
  const rigidBodyRef = useRef();
  const [enemyInstance, setEnemyInstance] = useState(null);
  const [isDead, setIsDead] = useState(false);
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
      enemyInstance.setPhysicsControl(rigidBodyRef);
      setRigidBodyReady(true);
    }
  }, [enemyInstance, rigidBodyRef.current]);

  const handleCollision = (event) => {
    const otherName = event.colliderObject.name?.toLowerCase();
    if (otherName?.includes("trap")) {
      if (enemyInstance && enemyInstance.state !== "dead") {
        enemyInstance.die(() => {
          console.log("☠️ Enemy died from trap, removing from scene");
          setIsDead(true);
          onDeath?.();
        });
      }
    } else if (enemyInstance && enemyInstance.state === "wander") {
      enemyInstance.handleWanderCollision();
    }
  };

  useFrame((_, delta) => {
    if (!enemyInstance || !rigidBodyReady || isDead) return;

    enemyInstance.update(delta);

    if (playerPosition) {
      enemyInstance.updateBehavior(playerPosition, delta);

      // Detect if the player is nearby while the enemy is attacking
      if (
        enemyInstance?.state === "attack" &&
        rigidBodyRef.current
      ) {
        const enemyPos = rigidBodyRef.current.translation();
        const distance = playerPosition.distanceTo(
          new THREE.Vector3(enemyPos.x, enemyPos.y, enemyPos.z)
        );

        if (distance < 1.2) {
          onPlayerHit?.();
        }
      }
    }
  });

  if (isDead || !enemyInstance) return null;

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      name="enemy"
      colliders={false}
      angularFactor={[0, 1, 0]}
      linearDamping={3}
      angularDamping={5}
      restitution={0}
      onCollisionEnter={handleCollision}
    >
      <primitive object={enemyInstance.group} />
      <CuboidCollider
        name="enemy"
        args={enemyInstance.colliderSize}
        position={enemyInstance.colliderPosition}
      />
    </RigidBody>
  );
};

export default EnemyComponent;
