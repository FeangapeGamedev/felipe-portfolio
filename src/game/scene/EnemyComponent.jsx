import React, { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import Enemy from "./Enemy";
import * as THREE from "three";
import HealthBar from "../../components/HealthBar"; // ✅ Import the new health bar

const EnemyComponent = ({ playerPosition, onDeath, onPlayerHit }) => {
  const rigidBodyRef = useRef();
  const [enemyInstance, setEnemyInstance] = useState(null);
  const [isDead, setIsDead] = useState(false);
  const [rigidBodyReady, setRigidBodyReady] = useState(false);

  const isOverlappingRef = useRef(false);
  const collisionStartTimeRef = useRef(null);
  const ATTACK_OVERLAP_THRESHOLD = 1.5;

  const [health, setHealth] = useState(100);
  const [healthBarPos, setHealthBarPos] = useState(new THREE.Vector3());

  useEffect(() => {
    async function initEnemy() {
      if (!Enemy.model) await Enemy.load();
      const enemy = new Enemy();
      setEnemyInstance(enemy);
    }
    initEnemy();

    return () => {
      isOverlappingRef.current = false;
      collisionStartTimeRef.current = null;

      if (enemyInstance) {
        enemyInstance.dispose?.();
      }
    };
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
        enemyInstance.takeDamage(100, () => {
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

    if (enemyInstance.currentHealth !== health) {
      setHealth(enemyInstance.currentHealth);
    }

    const enemyPos = rigidBodyRef.current.translation();
    const distance = playerPosition.distanceTo(new THREE.Vector3(enemyPos.x, enemyPos.y, enemyPos.z));
    const isCloseEnough = distance < 1.2;

    if (enemyInstance.state === "attack" && isCloseEnough) {
      if (!isOverlappingRef.current) {
        isOverlappingRef.current = true;
        collisionStartTimeRef.current = performance.now();
      } else {
        const now = performance.now();
        const elapsed = (now - collisionStartTimeRef.current) / 900;
        if (elapsed >= ATTACK_OVERLAP_THRESHOLD) {
          onPlayerHit?.();
          isOverlappingRef.current = false;
          collisionStartTimeRef.current = null;
        }
      }
    } else {
      isOverlappingRef.current = false;
      collisionStartTimeRef.current = null;
    }

    // ✅ Update health bar world position each frame
    if (enemyInstance) {
      setHealthBarPos(enemyInstance.getWorldPosition(0.5)); // Offset above head
    }
  });

  if (isDead || !enemyInstance) return null;

  return (
    <>
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

      {/* ✅ Floating, billboarded health bar */}
      <HealthBar
        position={healthBarPos}
        health={health}
        maxHealth={100}
        yOffset={1.5}
      />
    </>
  );
};

export default EnemyComponent;
