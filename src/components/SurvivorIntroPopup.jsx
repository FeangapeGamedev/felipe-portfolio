import React from "react";
import PopupPanel from "./PopupPanel";
import "../styles/PopupPanel.css";

const SurvivorIntroPopup = ({ onClose }) => {
  return (
    <div className="safe-area">
      <div className="welcome-overlay">
        <PopupPanel title="Survivor Mode" onClose={onClose}>
          <p>Welcome, Survivor!</p>
          <p>
            In each round, you have <strong>20 seconds</strong> to set your traps.
            Race around the room, position yourself strategically, and use the buttons on the left panel to select and arm your traps.
          </p>
          <p>
            Lure the monsters into your deadly traps and outsmart the horde. Stay sharp, and may your wits keep you alive!
          </p>
          <hr style={{ width: "100%", margin: "1rem 0" }} />
          <p style={{ fontSize: "12px", opacity: 0.8 }}>
            Time is ticking... Good luck!
          </p>
        </PopupPanel>
      </div>
    </div>
  );
};

export default SurvivorIntroPopup;
