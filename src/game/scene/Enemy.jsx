// Enemy.jsx
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

export default class Enemy {
  static model = null;

  static load() {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        'https://pub-b249382bbc784cb189eee9b1d3002799.r2.dev/3dModels/Enemy.glb',
        (gltf) => {
          Enemy.model = gltf;
          resolve(gltf);
        },
        undefined,
        (error) => {
          console.error('Error loading enemy model:', error);
          reject(error);
        }
      );
    });
  }

  constructor() {
    if (!Enemy.model) {
      throw new Error('Enemy model not loaded. Call Enemy.load() before creating an instance.');
    }

    const clonedModel = clone(Enemy.model.scene);
    clonedModel.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(clonedModel);
    const size = new THREE.Vector3();
    box.getSize(size);
    const minY = box.min.y;

    clonedModel.position.set(
      clonedModel.position.x - box.getCenter(new THREE.Vector3()).x,
      clonedModel.position.y - minY,
      clonedModel.position.z - box.getCenter(new THREE.Vector3()).z
    );

    this.group = new THREE.Group();
    this.group.add(clonedModel);

    this.colliderSize = [0.5, 1, 0.5];
    this.colliderPosition = [0, size.y / 2, 0];

    this.mixer = new THREE.AnimationMixer(clonedModel);
    this.animations = {};
    Enemy.model.animations.forEach((clip) => {
      this.animations[clip.name.toLowerCase()] = this.mixer.clipAction(clip);
    });

    this.state = "wander";
    this.followThreshold = 7;
    this.attackThreshold = 1.2;
    this.wanderTarget = this._getRandomWanderPoint();
    this.currentAnimation = null;
    this.rigidBody = null;
    this.wasBlocked = false;
    this.attackCooldown = 0;

    // 🔋 Add health properties
    this.maxHealth = 100;
    this.currentHealth = 100;

    this.playAnimation("idle");
  }

  setPhysicsControl(rigidBodyRef) {
    this.rigidBody = rigidBodyRef.current;
    if (this.rigidBody) {
      this.rigidBody.lockRotations(true, false);
      this.rigidBody.onCollisionEnter = (event) => {
        const otherType = event.colliderObject?.type;
        if (otherType === "Trap") {
          console.log("💥 Enemy collided with a trap!");
          this.die(() => console.log("☠️ Enemy died from trap collision"));
        } else {
          this.handleWanderCollision();
        }
      };
    }
  }

  playAnimation(name) {
    const action = this.animations[name.toLowerCase()];
    if (!action) return;
    if (this.currentAnimation && this.currentAnimation !== action) {
      this.currentAnimation.fadeOut(0.3);
    }
    action.reset().fadeIn(0.3).play();
    this.currentAnimation = action;
  }

  update(delta) {
    this.mixer.update(delta);
    if (this.attackCooldown > 0) this.attackCooldown -= delta;
  }

  updateBehavior(playerPosition, delta) {
    if (!this.rigidBody || this.state === "dead") return;

    const pos = this.rigidBody.translation();
    const position = new THREE.Vector3(pos.x, pos.y, pos.z);
    const direction = new THREE.Vector3().subVectors(playerPosition, position);
    const distance = direction.length();

    if (distance < this.attackThreshold) {
      if (this.state !== "attack" && this.attackCooldown <= 0) {
        console.log("⚔️ State: ATTACK");
        this.state = "attack";
        this.playAnimation("attack");
        this.attackCooldown = 1.5;
      }
      this.rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    if (distance < this.followThreshold) {
      if (this.state !== "chase") {
        console.log("🏃 State: CHASE");
        this.state = "chase";
        this.playAnimation("run");
      }

      if (distance > 0.1) {
        direction.normalize();
        const chaseSpeed = 3.5;
        const targetVel = new THREE.Vector3(direction.x * chaseSpeed, 0, direction.z * chaseSpeed);
        const currentVel = new THREE.Vector3().copy(this.rigidBody.linvel());
        const smoothedVel = currentVel.lerp(targetVel, 0.1);
        this.rigidBody.setLinvel(smoothedVel, true);

        const angle = Math.atan2(direction.x, direction.z);
        this.group.rotation.set(0, angle, 0);
      } else {
        this.rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
      }
      return;
    }

    if (this.state !== "wander") {
      console.log("🚶 State: WANDER");
      this.state = "wander";
      this.wanderTarget = this._getRandomWanderPoint();
      this.playAnimation("walk");
    }

    if (!this.wanderTarget) {
      this.wanderTarget = this._getRandomWanderPoint();
    }

    if (this.wasBlocked) {
      this.wasBlocked = false;
      this.rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
      this.wanderTarget = this._getRandomWanderPoint();
      return;
    }

    const wanderDirection = new THREE.Vector3().subVectors(this.wanderTarget, position);
    const wanderDistance = wanderDirection.length();

    if (wanderDistance > 0.1) {
      wanderDirection.normalize();
      const wanderSpeed = 1;
      const targetVel = new THREE.Vector3(wanderDirection.x * wanderSpeed, 0, wanderDirection.z * wanderSpeed);
      const currentVel = new THREE.Vector3().copy(this.rigidBody.linvel());
      const smoothedVel = currentVel.lerp(targetVel, 0.1);
      this.rigidBody.setLinvel(smoothedVel, true);

      const angle = Math.atan2(wanderDirection.x, wanderDirection.z);
      this.group.rotation.set(0, angle, 0);

      if (this.currentAnimation !== this.animations["walk"]) {
        this.playAnimation("walk");
      }
    } else {
      this.wanderTarget = this._getRandomWanderPoint();
      this.rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
  }

  die(callback) {
    if (this.state === "dead") return;
    this.state = "dead";

    if (this.rigidBody) {
      this.rigidBody.setLinvel({ x: 0, y: 1, z: 0 }, true);
      this.rigidBody.setAngvel({ x: 0, y: 1, z: 0 }, true);
    }

    Object.values(this.animations).forEach((action) => action.stop());
    if (this.animations["die"]) {
      this.playAnimation("die");
    }

    setTimeout(() => callback?.(), 4000);
  }

  // 💥 Add takeDamage() method
  takeDamage(amount, onDeathCallback) {
    if (this.state === "dead") return;

    this.currentHealth -= amount;
    this.currentHealth = Math.max(0, this.currentHealth);

    if (this.currentHealth === 0) {
      this.die(onDeathCallback);
    }
  }

  handleWanderCollision() {
    if (this.state === "wander") {
      console.log("🚧 Wander collision detected, redirecting");
      this.wasBlocked = true;
    }
  }

  _getRandomWanderPoint() {
    const minX = -10, maxX = 10;
    const minZ = -10, maxZ = 10;
    const randomX = Math.random() * (maxX - minX) + minX;
    const randomZ = Math.random() * (maxZ - minZ) + minZ;
    return new THREE.Vector3(randomX, 0, randomZ);
  }

  getWorldPosition(offsetY = 0) {
    if (!this.rigidBody) return new THREE.Vector3(0, 0, 0);
    const pos = this.rigidBody.translation();
    return new THREE.Vector3(pos.x, pos.y + offsetY, pos.z);
  }
  
}
