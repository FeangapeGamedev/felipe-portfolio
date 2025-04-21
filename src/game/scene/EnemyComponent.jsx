import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import Enemy from "./Enemy";
import * as THREE from "three";
import HealthBar from "../../components/HealthBar";
import { getTrapData } from "../utils/trapRegistry";

// 🧊 Spawn shards effect
const SpawnEffect = ({ position, onComplete }) => {
  const ref = useRef();
  const shards = useRef([]);
  const lifespan = 1.2; // seconds
  const startTime = useRef(performance.now());

  useEffect(() => {
    const group = ref.current;
    const geometry = new THREE.TetrahedronGeometry(0.1);
    const material = new THREE.MeshBasicMaterial({ color: "skyblue", transparent: true });

    for (let i = 0; i < 25; i++) {
      const mesh = new THREE.Mesh(geometry, material.clone());
      mesh.position.set(0, 0, 0);
      mesh.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        Math.random() * 2,
        (Math.random() - 0.5) * 4
      );
      mesh.material.opacity = 1;
      group.add(mesh);
      shards.current.push(mesh);
    }
  }, []);

  useFrame(() => {
    const elapsed = (performance.now() - startTime.current) / 1000;
    if (elapsed > lifespan) {
      onComplete?.();
      return;
    }

    shards.current.forEach((shard) => {
      shard.position.addScaledVector(shard.velocity, 0.02);
      shard.material.opacity = 1 - elapsed / lifespan;
    });
  });

  return <group ref={ref} position={position} />;
};

const EnemyComponent = ({ playerPosition, spawnPosition, onDeath, onPlayerHit }) => {
  const rigidBodyRef = useRef();
  const [enemyInstance, setEnemyInstance] = useState(null);
  const [isDead, setIsDead] = useState(false);
  const [rigidBodyReady, setRigidBodyReady] = useState(false);
  const [showSpawnEffect, setShowSpawnEffect] = useState(true);

  const isOverlappingRef = useRef(false);
  const collisionStartTimeRef = useRef(null);
  const ATTACK_OVERLAP_THRESHOLD = 1.5;

  const [health, setHealth] = useState(100);
  const [healthBarPos, setHealthBarPos] = useState(new THREE.Vector3());

  useEffect(() => {
    async function initEnemy() {
      if (!Enemy.model) await Enemy.load();
      const enemy = new Enemy(spawnPosition);
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
      const trapId =
        event.colliderObject?.userData?.trapId ||
        event.colliderObject?.parent?.userData?.trapId;
      const trapInfo = trapId ? getTrapData(trapId) : null;
      const damage = trapInfo?.damage ?? 10;

      console.log("💥 Trap hit! ID:", trapId, "Damage:", damage);

      if (enemyInstance && enemyInstance.state !== "dead") {
        enemyInstance.takeDamage(damage, () => {
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

    // Update health bar position
    if (enemyInstance) {
      setHealthBarPos(enemyInstance.getWorldPosition(0.5));
    }
  });

  if (isDead || !enemyInstance) return null;

  return (
    <>
      {showSpawnEffect && (
        <SpawnEffect
          position={spawnPosition}
          onComplete={() => setShowSpawnEffect(false)}
        />
      )}

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
        position={[spawnPosition.x, spawnPosition.y, spawnPosition.z]}
      >
        <primitive object={enemyInstance.group} />
        <CuboidCollider
          name="enemy"
          args={enemyInstance.colliderSize}
          position={enemyInstance.colliderPosition}
        />
      </RigidBody>

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
