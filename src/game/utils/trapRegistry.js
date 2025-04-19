// src/game/utils/trapRegistry.js
const trapRegistry = new Map();

const trapMetaByType = {
  unity: { armTime: 5, damage: 50 },
  unreal: { armTime: 4, damage: 40 },
  blender: { armTime: 2, damage: 25 },
  vr: { armTime: 1, damage: 10 },
  react: { armTime: 1, damage: 10 },
};

export const registerTrap = (trapId, data) => {
  trapRegistry.set(trapId, data);
};

export const unregisterTrap = (trapId) => {
  trapRegistry.delete(trapId);
};

export const getTrapData = (trapId) => {
  return trapRegistry.get(trapId);
};

export const getTrapMeta = (type) => {
  return trapMetaByType[type] || { armTime: 1, damage: 10 };
};
