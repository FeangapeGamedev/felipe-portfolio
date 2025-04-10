import React from "react";
import PopupPanel from "./PopupPanel";

const LosePopup = ({ onClose }) => {
  return (
    <div className="safe-area">
      <div className="lose-overlay">
        <PopupPanel title="💀 Game Over" onClose={onClose}>
          <p>You were defeated by the enemies.</p>
          <p>Try again by restarting the Survivor Mode.</p>
        </PopupPanel>
      </div>
    </div>
  );
};

export default LosePopup;
