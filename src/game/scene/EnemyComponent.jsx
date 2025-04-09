import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider} from "@react-three/rapier";
import Enemy from "./Enemy";

const EnemyComponent = ({ playerPosition, onDeath }) => {
  const rigidBodyRef = useRef();
  const [enemyInstance, setEnemyInstance] = useState(null);
  const [isDead, setIsDead] = useState(false); // Track if the enemy is dead
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
      if (enemyInstance && enemyInstance.state !== "dead") {
        enemyInstance.die(() => {
          console.log("☠️ Enemy died from trap, removing from scene");
          setIsDead(true); // Trigger unmount
          onDeath?.(); // Notify parent (Scene) if needed
        });
      }
    }
  };

  useFrame((_, delta) => {
    if (!enemyInstance || !rigidBodyReady || isDead) return;

    enemyInstance.update(delta);

    if (playerPosition) {
      enemyInstance.updateBehavior(playerPosition, delta);
    }

    const rotation = rigidBodyRef.current.rotation();
    rigidBodyRef.current.setRotation({ x: 0, y: rotation.y, z: 0 }, true);
  });

  if (isDead || !enemyInstance) return null; // Unmount enemy if dead

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      name = "enemy"
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
