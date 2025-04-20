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
            A relentless enemy is chasing you! Use your wits to place traps and outsmart your pursuer.
            You can select traps using the hotkeys <strong>1–5</strong> or the buttons on the right panel.
          </p>
          <p>
            Once a trap is selected, arm it using the <strong>F</strong> key or the arm button on the right panel.
            Strategize quickly and stay one step ahead of your enemy!
          </p>
          <hr style={{ width: "100%", margin: "1rem 0" }} />
          <p style={{ fontSize: "13px" }}>
            💡 <strong>Hotkeys:</strong><br />
            Select Traps: <strong>1–5</strong><br />
            Arm Trap: <strong>F</strong>
          </p>
          <p style={{ fontSize: "12px", opacity: 0.8 }}>
            Stay sharp and good luck!
          </p>
        </PopupPanel>
      </div>
    </div>
  );
};

export default SurvivorIntroPopup;
