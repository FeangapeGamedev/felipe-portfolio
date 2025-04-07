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

    // Collider config
    this.colliderSize = [0.5, 1, 0.5];
    this.colliderPosition = [0, size.y / 2, 0];

    // Animation setup
    this.mixer = new THREE.AnimationMixer(clonedModel);
    this.animations = {};
    Enemy.model.animations.forEach((clip) => {
      this.animations[clip.name.toLowerCase()] = this.mixer.clipAction(clip);
    });

    this.state = "wander";
    this.followThreshold = 7;
    this.attackThreshold = 0.7;
    this.wanderTarget = this._getRandomWanderPoint();
    this.currentAnimation = null;
    this.rigidBody = null;

    this.playAnimation('idle');
  }

  setPhysicsControl(rigidBody) {
    this.rigidBody = rigidBody;

    // Set the type of the enemy collider to "Enemy"
    this.rigidBody.type = "Enemy";

    // Add collision detection for colliders of type "Trap"
    this.rigidBody.onCollisionEnter = (event) => {
      const otherType = event.colliderObject?.type; // Check the type of the colliding object
      if (otherType === "Trap") {
        console.log("💥 Enemy collided with a trap!");
        this.die(() => {
          console.log("☠️ Enemy died from trap collision");
        });
      }
    };
  }

  playAnimation(name) {
    const action = this.animations[name.toLowerCase()];
    if (!action) return;
    if (this.currentAnimation && this.currentAnimation !== action) {
      this.currentAnimation.fadeOut(0.5);
    }
    action.reset().fadeIn(0.5).play();
    this.currentAnimation = action;
  }

  update(delta) {
    this.mixer.update(delta);
  }

  updateBehavior(playerPosition, delta) {
    if (!this.rigidBody || this.state === "dead") return;

    const pos = this.rigidBody.translation();
    const position = new THREE.Vector3(pos.x, pos.y, pos.z);
    const direction = new THREE.Vector3().subVectors(playerPosition, position);
    const distance = direction.length();

    // Stop movement if too close to the player
    if (distance < 0.6) {
      this.rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    // Attack state: if player is within attack threshold
    if (distance < this.attackThreshold) {
      if (this.state !== "attack") {
        this.state = "attack";
        this.playAnimation("attack");
      }
      this.rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    // Chase state: if player is within follow threshold
    if (distance < this.followThreshold) {
      if (this.state !== "chase") {
        this.state = "chase";
        this.playAnimation("run");
      }

      if (distance > 0.1) {
        direction.normalize();
        const chaseSpeed = 3.5;

        // Smooth out velocity changes
        const targetVel = new THREE.Vector3(direction.x * chaseSpeed, 0, direction.z * chaseSpeed);
        const currentVel = new THREE.Vector3().copy(this.rigidBody.linvel());
        const smoothedVel = currentVel.lerp(targetVel, 0.1); // Smooth transition
        this.rigidBody.setLinvel(smoothedVel, true);

        const lookAtTarget = new THREE.Vector3().addVectors(position, direction);
        this.group.lookAt(lookAtTarget);
      } else {
        this.rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
      }
      return;
    }

    // Wander state: if player is far
    if (this.state !== "wander") {
      this.state = "wander";
      this.wanderTarget = this._getRandomWanderPoint();
      this.playAnimation("walk"); // Ensure "walk" animation is played
    }

    if (!this.wanderTarget) {
      this.wanderTarget = this._getRandomWanderPoint();
    }

    const wanderDirection = new THREE.Vector3().subVectors(this.wanderTarget, position);
    const wanderDistance = wanderDirection.length();

    if (wanderDistance > 0.1) {
      wanderDirection.normalize();
      const wanderSpeed = 1;

      // Smooth out wander velocity
      const targetVel = new THREE.Vector3(wanderDirection.x * wanderSpeed, 0, wanderDirection.z * wanderSpeed);
      const currentVel = new THREE.Vector3().copy(this.rigidBody.linvel());
      const smoothedVel = currentVel.lerp(targetVel, 0.1); // Smooth transition
      this.rigidBody.setLinvel(smoothedVel, true);

      const lookAtTarget = new THREE.Vector3().addVectors(position, wanderDirection);
      this.group.lookAt(lookAtTarget);

      // Ensure "walk" animation is playing during wandering
      if (this.state === "wander" && this.currentAnimation !== this.animations["walk"]) {
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

    setTimeout(() => {
      if (callback) callback();
    }, 1000);
  }

  _getRandomWanderPoint() {
    const minX = -10, maxX = 10;
    const minZ = -10, maxZ = 10;
    const randomX = Math.random() * (maxX - minX) + minX;
    const randomZ = Math.random() * (maxZ - minZ) + minZ;
    return new THREE.Vector3(randomX, 0, randomZ);
  }
}
