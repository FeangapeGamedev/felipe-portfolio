// SpawnEffect.jsx
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

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

export default SpawnEffect;
