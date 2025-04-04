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

    // Collider config
    this.colliderSize = [0.5, size.y / 2, 0.5];
    this.colliderPosition = [0, size.y / 2, 0];

    // Visual debug collider box (for dev only)
    const colliderMesh = new THREE.Mesh(
      new THREE.BoxGeometry(this.colliderSize[0] * 2, this.colliderSize[1] * 2, this.colliderSize[2] * 2),
      new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true, transparent: true, opacity: 0.25 })
    );
    colliderMesh.name = 'enemy-collider';
    colliderMesh.position.set(...this.colliderPosition);

    this.group.add(clonedModel);
    this.group.add(colliderMesh);

    // Animation setup
    this.mixer = new THREE.AnimationMixer(clonedModel);
    this.animations = {};
    Enemy.model.animations.forEach((clip) => {
      this.animations[clip.name.toLowerCase()] = this.mixer.clipAction(clip);
    });

    this.state = "wander";
    this.followThreshold = 7;
    this.attackThreshold = 1;
    this.wanderTarget = this._getRandomWanderPoint();
    this.currentAnimation = null;
    this.rigidBody = null;

    this.playAnimation('idle');
  }

  setPhysicsControl(rigidBody) {
    this.rigidBody = rigidBody;
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
    const distanceToPlayer = position.distanceTo(playerPosition);

    if (distanceToPlayer < this.attackThreshold) {
      if (this.state !== "attack") {
        this.state = "attack";
        this.playAnimation("attack");
      }
      this.rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    if (distanceToPlayer < this.followThreshold) {
      if (this.state !== "chase") {
        this.state = "chase";
        this.playAnimation("run");
      }
      const direction = new THREE.Vector3().subVectors(playerPosition, position);
      const distance = direction.length();
      if (distance > 0.1) {
        direction.normalize();
        const chaseSpeed = 3.5;
        this.rigidBody.setLinvel({
          x: direction.x * chaseSpeed,
          y: 0,
          z: direction.z * chaseSpeed
        }, true);
        this.group.lookAt(new THREE.Vector3().addVectors(position, direction));
      }
      return;
    }

    if (this.state !== "wander") {
      this.state = "wander";
      this.wanderTarget = this._getRandomWanderPoint();
      this.playAnimation("walk");
    }

    const direction = new THREE.Vector3().subVectors(this.wanderTarget, position);
    const distance = direction.length();
    if (distance > 0.1) {
      direction.normalize();
      const wanderSpeed = 1.5;
      this.rigidBody.setLinvel({
        x: direction.x * wanderSpeed,
        y: 0,
        z: direction.z * wanderSpeed
      }, true);
      this.group.lookAt(new THREE.Vector3().addVectors(position, direction));
    } else {
      this.wanderTarget = this._getRandomWanderPoint();
    }
  }

  die(callback) {
    if (this.state === "dead") return;
    this.state = "dead";

    if (this.rigidBody) {
      this.rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
      this.rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
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
