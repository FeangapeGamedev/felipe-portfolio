// EnemyComponent.jsx
import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import Enemy from "./Enemy";

const EnemyComponent = ({ playerPosition }) => {
  const enemyRef = useRef();
  const [enemyInstance, setEnemyInstance] = useState(null);

  useEffect(() => {
    async function initEnemy() {
      try {
        if (!Enemy.model) {
          await Enemy.load();
          console.log("Enemy model loaded.");
        }
        const enemy = new Enemy();
        setEnemyInstance(enemy);
      } catch (error) {
        console.error("Enemy instance could not be created. Ensure the model is loaded first.", error);
      }
    }
    initEnemy();
  }, []);

  useFrame((state, delta) => {
    if (enemyInstance) {
      enemyInstance.update(delta);
      if (playerPosition) {
        enemyInstance.updateBehavior(playerPosition, delta);
      }
    }
  });

  return enemyInstance ? <primitive object={enemyInstance.model} ref={enemyRef} /> : null;
};

export default EnemyComponent;
