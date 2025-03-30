import React from "react";
import "../styles/TrapUI.css";

const trapColors = {
  unity: "#224b55",
  unreal: "#3f2a47",
  react: "#1e3a5f",
  blender: "#5a2c16",
  vr: "#3d1f1f",
};

const trapNames = {
  unity: "Unity Field",
  unreal: "Unreal Dimension",
  react: "Reactive Pulse",
  blender: "Anomaly Blender",
  vr: "Nullspace Snare",
};

const TrapUI = ({
  trapCharges,
  selectedTrapType,
  setSelectedTrapType,
  onArmTrap,
  onResetGame, // ✅ Receive here
  isPlacingTrap,
  prepTime,
  showIntro,
}) => {
  const onToolClicked = (toolName) => {
    if (trapCharges[toolName] > 0 && prepTime > 0) {
      setSelectedTrapType(toolName);
    }
  };

  return (
    <div className="trapbar">
      <span>TRAPS</span>
      <ul>
        {Object.entries(trapCharges).map(([trap, count]) => (
          <li key={trap}>
            <button
              className={`trap-button ${selectedTrapType === trap ? "selected" : ""}`}
              onClick={() => onToolClicked(trap)}
              disabled={count === 0 || prepTime <= 0 || showIntro}
              style={{
                backgroundColor: trapColors[trap],
                opacity: showIntro ? 0.3 : 1,
              }}
            >
              <span className="trap-label">{trapNames[trap]}</span>
              <span className="trap-count">({count} left)</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="arm-button-container">
        <button
          className="arm-trap-button"
          onClick={onArmTrap}
          disabled={
            !selectedTrapType || isPlacingTrap || prepTime <= 0 || showIntro
          }
          style={{
            opacity: showIntro ? 0.3 : 1,
            cursor:
              selectedTrapType && prepTime > 0 ? "pointer" : "not-allowed",
          }}
        >
          ARM TRAP
        </button>
      </div>

      {/* ✅ Reset Button */}
      <div className="reset-button-container">
        <button
          className="reset-trap-button"
          onClick={onResetGame}
          disabled={showIntro}
          style={{
            opacity: showIntro ? 0.3 : 1,
            cursor: showIntro ? "not-allowed" : "pointer",
          }}
        >
          RESET GAME
        </button>
      </div>
    </div>
  );
};

export default TrapUI;
