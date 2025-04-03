import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider, interactionGroups } from "@react-three/rapier";
import * as THREE from "three";
import Enemy from "./Enemy";

const EnemyComponent = ({ playerPosition, onDeath }) => {
  const rigidBodyRef = useRef();
  const [enemyInstance, setEnemyInstance] = useState(null);

  useEffect(() => {
    async function initEnemy() {
      try {
        if (!Enemy.model) {
          await Enemy.load();
          console.log("Enemy model loaded.");
        }
        const enemy = new Enemy();
        // Initialize translation from group's position.
        enemy.translation.copy(enemy.group.position);
        setEnemyInstance(enemy);
      } catch (error) {
        console.error("Enemy instance could not be created. Ensure the model is loaded first.", error);
      }
    }
    initEnemy();
  }, []);

  const handleCollision = (event) => {
    const otherName = event.colliderObject.name;
    if (otherName && otherName.toLowerCase().includes("trap")) {
      console.log("[EnemyComponent] Collision detected with trap:", otherName);
      if (enemyInstance && enemyInstance.state !== "dead") {
        enemyInstance.die(() => {
          if (onDeath) onDeath();
        });
      }
    }
  };

  useFrame((state, delta) => {
    if (enemyInstance) {
      enemyInstance.update(delta);
      if (playerPosition) {
        enemyInstance.updateBehavior(playerPosition, delta);
      }
      if (rigidBodyRef.current) {
        // Update the kinematic body's translation using the computed translation.
        const pos = enemyInstance.translation;
        rigidBodyRef.current.setNextKinematicTranslation({ x: pos.x, y: pos.y, z: pos.z });
      }
      // Force the enemy to remain upright while preserving Y rotation.
      const quaternion = enemyInstance.group.quaternion;
      const euler = new THREE.Euler(0, 0, 0, "YXZ");
      euler.setFromQuaternion(quaternion);
      enemyInstance.group.quaternion.setFromEuler(new THREE.Euler(0, euler.y, 0, "YXZ"));
    }
  });

  return enemyInstance ? (
    <RigidBody
      ref={rigidBodyRef}
      type="kinematicPosition"
      colliders={false}
      angularFactor={[0, 1, 0]}
      linearDamping={0.5}
      angularDamping={0.5}
      onCollisionEnter={handleCollision}
      collisionGroups={interactionGroups(0b0010, 0b0001)}
    >
      <primitive object={enemyInstance.group} />
      <CuboidCollider args={enemyInstance.colliderSize} position={enemyInstance.colliderPosition} />
    </RigidBody>
  ) : null;
};

export default EnemyComponent;
