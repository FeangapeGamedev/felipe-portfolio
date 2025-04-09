import { interactionGroups } from "@react-three/rapier";

class GlobalConstants {
  // Define collision groups as bitmasks
  static CHARACTER_GROUP = 0b0001; // Group 1
  static TRAP_GROUP = 0b0010;      // Group 2

  /**
   * Utility method to create interaction groups.
   * Ensures only Character and Trap ignore each other.
   * @param {number} selfGroup - The group this object belongs to.
   * @param {number} interactWith - The groups this object can interact with.
   * @returns {number} - The interaction group bitmask.
   */
  static createInteractionGroup(selfGroup, interactWith) {
    // Ensure Character and Trap groups ignore each other
    if (selfGroup === GlobalConstants.CHARACTER_GROUP) {
      interactWith &= ~GlobalConstants.TRAP_GROUP; // Ignore Traps
    } else if (selfGroup === GlobalConstants.TRAP_GROUP) {
      interactWith &= ~GlobalConstants.CHARACTER_GROUP; // Ignore Characters
    }

    return interactionGroups(selfGroup, interactWith);
  }
}

export default GlobalConstants;