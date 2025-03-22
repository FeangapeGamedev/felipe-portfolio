import React from "react";
import "../styles/PopupPanel.css";


const PopupPanel = ({ title, onClose, children, className = "" }) => {
  return (
    <div className={`popup-panel ${className}`}>
      <div className="popup-panel-header">
        <span>{title}</span>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
      <div className="popup-panel-content">
        {children}
      </div>
    </div>
  );
};

export default PopupPanel;
