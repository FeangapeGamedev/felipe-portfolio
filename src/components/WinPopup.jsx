import React from "react";
import PopupPanel from "./PopupPanel";

const WinPopup = ({ onClose }) => {
  return (
    <div className="safe-area">
      <div className="win-overlay">
        <PopupPanel title="🎉 You Win!" onClose={onClose}>
          <p>Congratulations, you survived all the enemy waves!</p>
          <p>Thanks for playing my interactive portfolio game.</p>
        </PopupPanel>
      </div>
    </div>
  );
};

export default WinPopup;
