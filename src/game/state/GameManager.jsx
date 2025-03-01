import { useGame } from "../state/GameContext";

export const GameManager = (onProjectSelect) => {
  const { changeRoom, currentRoom } = useGame();

  const handleInteraction = (id, type) => {
    console.log(`🎮 Handling Interaction - ID: ${id}, Type: ${type}`);

    if (type === "door") {
      const door = currentRoom.items.find(item => item.id === id);
      if (!door) {
        console.error(`❌ Door with ID ${id} not found in current room!`);
        return;
      }

      console.log(`🚪 Door Opened: ${id}`);
      console.log(`🔄 Changing Room to: ${door.targetRoomId}`);

      if (!door.targetRoomId) {
        console.error(`❌ No targetRoomId assigned to door ${id}`);
        return;
      }

      changeRoom(door.targetRoomId);
    } else if (type === "project") {
      console.log(`📂 Project Selected: ${id}`);

      if (typeof onProjectSelect === "function") {
        onProjectSelect(id); // ✅ Call project selection safely
      } else {
        console.error(`❌ onProjectSelect is not a function or is undefined`);
      }
    } else {
      console.warn(`⚠️ Unknown interaction type: ${type}`);
    }
  };

  return { handleInteraction };
};
