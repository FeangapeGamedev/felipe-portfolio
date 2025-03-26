import React from "react";
import PopupPanel from "./PopupPanel";
import "../styles/PopupPanel.css";

const SurvivorIntroPopup = ({ onClose }) => {
  return (
    <div className="safe-area">
      <div className="welcome-overlay">
        <PopupPanel title="Survivor Mode" onClose={onClose}>
          <p>You’ve entered the final room.</p>
          <p>
            You have <strong>60 seconds</strong> to place your traps.<br />
            When time’s up, enemies will enter and chase you down.
          </p>
          <p>
            Place 1 trap of each type by clicking the trap buttons<br />
            and placing them strategically around the room.
          </p>
          <hr style={{ width: "100%", margin: "1rem 0" }} />
          <p style={{ fontSize: "12px", opacity: 0.8 }}>
            Move to lure enemies into traps and survive!
          </p>
        </PopupPanel>
      </div>
    </div>
  );
};

export default SurvivorIntroPopup;
