import React from "react";
import PopupPanel from "./PopupPanel";

const WinPopup = ({ onClose }) => {
  return (
    <div className="safe-area">
      <div className="win-overlay">
        <PopupPanel title="🎉 You Win!" onClose={onClose}>
          <p>Congratulations, you made it to the end!</p>
          <p>Thank you for exploring my interactive portfolio experience.</p>
          <p>While it’s not a full-fledged game, it’s a glimpse into my work as a game developer. I hope you enjoyed it!</p>
        </PopupPanel>
      </div>
    </div>
  );
};

export default WinPopup;
