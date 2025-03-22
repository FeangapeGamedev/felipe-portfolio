import React, { useState } from "react";
import PopupPanel from "./PopupPanel";
import "../styles/PopupPanel.css";

const CodeFrame = ({ onClose, className, doorPassKey, onCorrectPassKey }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleSubmit = () => {
    if (inputValue === doorPassKey) {
      onCorrectPassKey(); // ✅ only call success
    } else {
      onClose(); // ❌ only call on incorrect pass
    }
  };

  return (
    <PopupPanel title="Access Panel" onClose={onClose} className={className}>
      <p>📅 Date of a simple tennis match, played on an oscilloscope, created in a lab…</p>
      <p>🎮 It was the first of all gaming.</p>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="****"
        className="code-input"
      />
      <button onClick={handleSubmit} className="submit-button">
        Submit
      </button>
    </PopupPanel>
  );
};

export default CodeFrame;
