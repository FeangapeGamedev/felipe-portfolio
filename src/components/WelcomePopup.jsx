import React from "react";
import PopupPanel from "./PopupPanel";
import "../styles/PopupPanel.css";

const WelcomePopup = ({ onClose }) => {
  return (
    <div className="safe-area">
      <div className="welcome-overlay">
        <PopupPanel title="Lali-ho" onClose={onClose}>
          <p>Welcome to my portfolio.</p>
          <p>
            Use the Navbar to quickly explore my work,<br />
            or dive into the interactive experience below.
          </p>
          <hr style={{ width: "100%", margin: "1rem 0" }} />
          <p style={{ fontSize: "12px", opacity: 0.8 }}>
            Controls: Click to move, double-click to run, and press Y near objects to interact.
          </p>
        </PopupPanel>
      </div>
    </div>
  );
};

export default WelcomePopup;
