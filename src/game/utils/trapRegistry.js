// src/game/utils/trapRegistry.js
const trapRegistry = new Map();

export const registerTrap = (trapId, data) => {
  trapRegistry.set(trapId, data);
};

export const unregisterTrap = (trapId) => {
  trapRegistry.delete(trapId);
};

export const getTrapData = (trapId) => {
  return trapRegistry.get(trapId);
};
