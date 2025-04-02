// Enemy.jsx
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

export default class Enemy {
  // The loaded model will be stored in a static property.
  static model = null;

  /**
   * Call this static method once (for example, during app initialization)
   * so that the model is loaded before creating any enemy instances.
   */
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

    // Clone model and set up mixer and animations as before...
    this.model = clone(Enemy.model.scene);
    this.mixer = new THREE.AnimationMixer(this.model);
    this.animations = {};
    Enemy.model.animations.forEach((clip) => {
      this.animations[clip.name.toLowerCase()] = this.mixer.clipAction(clip);
    });

    // Set initial state and thresholds.
    this.state = "wander"; // possible states: "wander", "chase", "attack"
    this.followThreshold = 7;  // for example, chase if within 7 units
    this.attackThreshold = 1;   // attack if within 1 unit
    // Initialize wander state variables:
    this.wanderSubstate = "idle"; 
    this.idleTime = this._getRandomIdleTime();
    this.wanderTarget = null; // We'll generate this when needed.

    // Start with idle animation.
    this.currentAnimation = null;
    this.playAnimation('idle');
  }

  /**
   * Play a given animation by name.
   */
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

  /**
   * Update the animation mixer.
   * @param {number} delta - The time elapsed since the last frame.
   */
  update(delta) {
    this.mixer.update(delta);
  }

  /**
   * Update enemy behavior using a simple FSM (Finite State Machine).
   * @param {THREE.Vector3} playerPosition - The player's current position.
   * @param {number} delta - The time elapsed since the last frame.
   */
  updateBehavior(playerPosition, delta) {
    const enemyPosition = this.model.position;
    const distanceToPlayer = enemyPosition.distanceTo(playerPosition);

    console.log(
      "[Enemy] Distance to player:", distanceToPlayer.toFixed(2),
      "AttackThreshold:", this.attackThreshold,
      "FollowThreshold:", this.followThreshold,
      "CurrentState:", this.state,
      "WanderSubstate:", this.wanderSubstate
    );

    // Attack state
    if (distanceToPlayer < this.attackThreshold) {
      if (this.state !== "attack") {
        console.log("[Enemy] Switching to ATTACK state");
        this.state = "attack";
        this.playAnimation("attack");
      }
      return;
    }

    // Chase state
    if (distanceToPlayer < this.followThreshold) {
      if (this.state !== "chase") {
        console.log("[Enemy] Switching to CHASE state");
        this.state = "chase";
        this.playAnimation("run");
      }
      const directionToPlayer = new THREE.Vector3().subVectors(playerPosition, enemyPosition).normalize();
      const chaseSpeed = 2.5; // Updated chase speed
      enemyPosition.add(directionToPlayer.multiplyScalar(chaseSpeed * delta));
      // Rotate enemy to face the player
      const chaseTarget = new THREE.Vector3().addVectors(enemyPosition, directionToPlayer);
      this.model.lookAt(chaseTarget);
      return;
    }

    // Wander state (player is far)
    if (this.state !== "wander") {
      console.log("[Enemy] Switching to WANDER state");
      this.state = "wander";
      // Initialize wander substate to idle and set a random idle time.
      this.wanderSubstate = "idle";
      this.idleTime = this._getRandomIdleTime();
      this.playAnimation("idle");
    }

    // Handle the wander substates
    if (this.wanderSubstate === "idle") {
      // Count down the idle timer.
      this.idleTime -= delta;
      if (this.idleTime <= 0) {
        // Switch to move state: pick a new wander target.
        this.wanderSubstate = "move";
        this.wanderTarget = this._getRandomWanderPoint();
        console.log("[Enemy] Idle complete. Switching to MOVE state. New target:", this.wanderTarget);
        this.playAnimation("walk");
      }
    } else if (this.wanderSubstate === "move") {
      // Move toward wander target.
      if (!this.wanderTarget) {
        this.wanderTarget = this._getRandomWanderPoint();
      }
      const distanceToTarget = enemyPosition.distanceTo(this.wanderTarget);
      if (distanceToTarget < 0.2) {
        // Arrived: switch back to idle.
        this.wanderSubstate = "idle";
        this.idleTime = this._getRandomIdleTime();
        console.log("[Enemy] Arrived at wander target. Switching to IDLE for", this.idleTime.toFixed(2), "seconds");
        this.playAnimation("idle");
      } else {
        // Continue moving toward target.
        const direction = new THREE.Vector3().subVectors(this.wanderTarget, enemyPosition).normalize();
        const wanderSpeed = 1; // Adjust wander speed as needed
        enemyPosition.add(direction.multiplyScalar(wanderSpeed * delta));
        // Rotate enemy to face the wander target.
        const newTarget = new THREE.Vector3().addVectors(enemyPosition, direction);
        this.model.lookAt(newTarget);
        if (this.currentAnimation !== this.animations["walk"]) {
          console.log("[Enemy] Wandering: switching to WALK animation");
          this.playAnimation("walk");
        }
      }
    }
  }

  /**
   * Helper function to get a random point for wandering.
   * This version uses fixed boundaries (adjust as needed for your room).
   */
  _getRandomWanderPoint() {
    const minX = -10, maxX = 10;  // Adjust boundaries to your room dimensions
    const minZ = -10, maxZ = 10;
    const randomX = Math.random() * (maxX - minX) + minX;
    const randomZ = Math.random() * (maxZ - minZ) + minZ;
    // Return an absolute point within these boundaries. You can fix the Y value as needed.
    return new THREE.Vector3(randomX, this.model.position.y, randomZ);
  }

  /**
   * Helper function for random idle time.
   * Returns a random idle time between 2 and 6 seconds.
   */
  _getRandomIdleTime() {
    return Math.random() * 4 + 2;
  }
}
