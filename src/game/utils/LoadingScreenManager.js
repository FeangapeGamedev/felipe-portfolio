// utils/LoadingScreenManager.js
import * as THREE from "three";

export default class LoadingScreenManager {
  constructor({ setLoading }) {
    this.setLoading = setLoading;
    this.loadingManager = new THREE.LoadingManager();
    this.assetsLoading = false;
    this.minDuration = 800; // Minimum screen time in ms
    this.loadingStartTime = null;

    this.setupEvents();
  }

  setupEvents() {
    this.loadingManager.onStart = () => {
      this.assetsLoading = true;
      this.loadingStartTime = Date.now();
      console.log("🎮 Asset loading started");
      this.setLoading(true);
    };

    this.loadingManager.onLoad = () => {
      this.assetsLoading = false;
      const elapsed = Date.now() - this.loadingStartTime;
      const remaining = Math.max(this.minDuration - elapsed, 0);

      setTimeout(() => {
        console.log("✅ Asset loading complete");
        this.setLoading(false);
      }, remaining);
    };

    this.loadingManager.onProgress = (url, loaded, total) => {
      console.log(`📦 Loading ${url} (${loaded}/${total})`);
    };

    this.loadingManager.onError = (url) => {
      console.error(`❌ Failed to load ${url}`);
    };
  }

  getManager() {
    return this.loadingManager;
  }

  // Call this when changing rooms
  triggerRoomChangeLoading() {
    this.loadingStartTime = Date.now();
    this.setLoading(true);
  }

  waitUntilAssetsLoaded(callback) {
    const check = () => {
      if (!this.assetsLoading) {
        callback();
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  }
}
