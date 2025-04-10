import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import Enemy from "./Enemy";
import * as THREE from "three";

const EnemyComponent = ({ playerPosition, onDeath, onPlayerHit }) => {
  const rigidBodyRef = useRef();
  const [enemyInstance, setEnemyInstance] = useState(null);
  const [isDead, setIsDead] = useState(false);
  const [rigidBodyReady, setRigidBodyReady] = useState(false);

  // ✅ Track overlap and timing
  const isOverlappingRef = useRef(false);
  const collisionStartTimeRef = useRef(null);
  const ATTACK_OVERLAP_THRESHOLD = 1.5; // seconds (matches your attackCooldown)

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
    }
  };

  useFrame((_, delta) => {
    if (!enemyInstance || !rigidBodyReady || isDead) return;

    enemyInstance.update(delta);

    if (!playerPosition || !rigidBodyRef.current) return;

    enemyInstance.updateBehavior(playerPosition, delta);

    // 🧠 Check overlap distance
    const enemyPos = rigidBodyRef.current.translation();
    const distance = playerPosition.distanceTo(new THREE.Vector3(enemyPos.x, enemyPos.y, enemyPos.z));
    const isCloseEnough = distance < 1.2;

    if (enemyInstance.state === "attack" && isCloseEnough) {
      if (!isOverlappingRef.current) {
        // 🟢 First frame of overlap
        isOverlappingRef.current = true;
        collisionStartTimeRef.current = performance.now();
      } else {
        const now = performance.now();
        const elapsed = (now - collisionStartTimeRef.current) / 1000;
        if (elapsed >= ATTACK_OVERLAP_THRESHOLD) {
          onPlayerHit?.(); // ✅ Player dies after sustained attack contact
          isOverlappingRef.current = false; // prevent multiple triggers
          collisionStartTimeRef.current = null;
        }
      }
    } else {
      // ❌ Reset if out of range or not attacking
      isOverlappingRef.current = false;
      collisionStartTimeRef.current = null;
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
