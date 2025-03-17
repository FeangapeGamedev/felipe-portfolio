import React, { useState, lazy, Suspense } from "react";
import "../styles/CodeFrame.css";

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
      onCorrectPassKey();
    } else {
      console.log("Incorrect passkey");
    }
    onClose();
  };

  return (
    <div className={`code-frame ${className}`}>
      <div className="code-frame-header">
        <span>Access Panel</span>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
      <div className="code-frame-content">
        <p>📅 Date of a simple tennis match, played on an oscilloscope, created in a lab…</p>
        <p>🎮 It was the first of all gaming.</p>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="****"
          className="code-input"
        />
        <button onClick={handleSubmit} className="submit-button">Submit</button>
      </div>
    </div>
  );
};

export default CodeFrame;
