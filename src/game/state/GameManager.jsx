import { useGame } from "../state/GameContext";

export const GameManager = (onProjectSelect = () => {}) => {
  const { changeRoom, currentRoom } = useGame();

  const handleInteraction = (id, type) => {
    if (type === "door") {
      const door = currentRoom.items.find(item => item.id === id);
      if (!door) {
        console.error(`❌ Door with ID ${id} not found in current room!`);
        return;
      }
      changeRoom(door.targetRoomId);
    } else if (type === "project") {
      if (typeof onProjectSelect === "function") {
        onProjectSelect(id);
      } else {
        console.error(`❌ onProjectSelect is not a function or is undefined.`);
      }
    } else {
      console.warn(`⚠️ Unknown interaction type: ${type}`);
    }
  };

  return { handleInteraction };
};
