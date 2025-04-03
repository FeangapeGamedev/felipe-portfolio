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

    // Clone the enemy model.
    const clonedModel = clone(Enemy.model.scene);
    clonedModel.updateMatrixWorld(true);

    // Compute bounding box and center of the cloned model.
    const box = new THREE.Box3().setFromObject(clonedModel);
    const size = new THREE.Vector3();
    box.getSize(size);
    const minY = box.min.y;

    // Adjust the model's position so its base is at Y = 0.
    clonedModel.position.set(
      clonedModel.position.x - box.getCenter(new THREE.Vector3()).x, // Center horizontally
      clonedModel.position.y - minY, // Align base to Y = 0
      clonedModel.position.z - box.getCenter(new THREE.Vector3()).z
    );

    // Create a group to hold the visual model.
    this.group = new THREE.Group();
    this.group.add(clonedModel);

    // Now the enemy's "computed" translation is stored in this.group.position.
    // For movement, we’ll track it in a separate vector.
    this.translation = new THREE.Vector3().copy(this.group.position);

    // Save collider properties.
    // Adjust the collider position to match the model's bounding box.
    this.colliderSize = [0.5, size.y / 2, 0.5];
    this.colliderPosition = [0, size.y / 2, 0]; // Center the collider vertically around the body.

    // Set up the animation mixer using the cloned model.
    this.mixer = new THREE.AnimationMixer(clonedModel);
    this.animations = {};
    Enemy.model.animations.forEach((clip) => {
      this.animations[clip.name.toLowerCase()] = this.mixer.clipAction(clip);
    });

    // Set initial state and thresholds.
    this.state = "wander"; // "wander", "chase", "attack", "dead"
    this.followThreshold = 7;
    this.attackThreshold = 1;
    // Initialize wander target based on the current translation.
    this.translation.copy(this.group.position);
    this.wanderTarget = this._getRandomWanderPoint();

    // Start with idle animation.
    this.currentAnimation = null;
    this.playAnimation('idle');
  }

  playAnimation(name) {
    const action = this.animations[name.toLowerCase()];
    if (!action) {
      console.warn(`Animation "${name}" not found.`);
      return;
    }
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
    // Use our computed translation (this.translation) for movement.
    const distanceToPlayer = this.translation.distanceTo(playerPosition);

    // Attack state: if player is within attack threshold.
    if (distanceToPlayer < this.attackThreshold) {
      if (this.state !== "attack") {
        console.log("[Enemy] Switching to ATTACK state");
        this.state = "attack";
        this.playAnimation("attack");
      }
      return; // Do not update translation while attacking.
    }

    // Chase state: if player is within follow threshold.
    if (distanceToPlayer < this.followThreshold) {
      if (this.state !== "chase") {
        console.log("[Enemy] Switching to CHASE state");
        this.state = "chase";
        this.playAnimation("run");
      }
      const directionToPlayer = new THREE.Vector3().subVectors(playerPosition, this.translation).normalize();
      const chaseSpeed = 2.5;
      this.translation.add(directionToPlayer.multiplyScalar(chaseSpeed * delta));
      const chaseTarget = new THREE.Vector3().addVectors(this.translation, directionToPlayer);
      this.group.lookAt(chaseTarget);
      return;
    }

    // Wander state: if player is far.
    if (this.state !== "wander") {
      console.log("[Enemy] Switching to WANDER state");
      this.state = "wander";
      this.wanderTarget = this._getRandomWanderPoint();
      this.playAnimation("walk");
    }
    if (!this.wanderTarget) {
      this.wanderTarget = this._getRandomWanderPoint();
    }
    const distanceToTarget = this.translation.distanceTo(this.wanderTarget);
    if (distanceToTarget < 0.2) {
      this.wanderTarget = this._getRandomWanderPoint();
    } else {
      const direction = new THREE.Vector3().subVectors(this.wanderTarget, this.translation).normalize();
      const wanderSpeed = 1;
      this.translation.add(direction.multiplyScalar(wanderSpeed * delta));
      const newTarget = new THREE.Vector3().addVectors(this.translation, direction);
      this.group.lookAt(newTarget);
      if (this.currentAnimation !== this.animations["walk"]) {
        console.log("[Enemy] Wandering: switching to WALK animation");
        this.playAnimation("walk");
      }
    }
  }

  die(callback) {
    if (this.state === "dead") return;
    console.log("[Enemy] Dying...");
    this.state = "dead";
    Object.values(this.animations).forEach((action) => action.stop());
    if (this.animations["die"]) {
      this.playAnimation("die");
    }
    setTimeout(() => {
      console.log("[Enemy] Die animation complete, removing enemy.");
      if (callback) callback();
    }, 1000);
  }

  _getRandomWanderPoint() {
    const minX = -10, maxX = 10;
    const minZ = -10, maxZ = 10;
    const randomX = Math.random() * (maxX - minX) + minX;
    const randomZ = Math.random() * (maxZ - minZ) + maxZ;
    // Use the current translation's y so that the point is at ground level.
    return new THREE.Vector3(randomX, this.translation.y, randomZ);
  }
}
