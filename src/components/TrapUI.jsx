// TrapUI.jsx
import React from "react";

const trapColors = {
  unity: "#224b55",
  unreal: "#3f2a47",
  react: "#1e3a5f",
  blender: "#5a2c16",
  vr: "#3d1f1f",
};

const TrapUI = ({
  trapCharges,
  selectedTrapType,
  setSelectedTrapType,
  onArmTrap,
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
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "16px",
        zIndex: 10,
      }}
    >
      {Object.entries(trapCharges).map(([trap, count]) => (
        <button
          key={trap}
          onClick={() => onToolClicked(trap)}
          disabled={count === 0 || prepTime <= 0 || showIntro}
          style={{
            padding: "14px 22px",
            fontSize: "16px",
            borderRadius: "30px",
            background: trapColors[trap] || "#333",
            color: "#fff",
            border: selectedTrapType === trap ? "2px solid yellow" : "1px solid #888",
            cursor: count > 0 && prepTime > 0 ? "pointer" : "not-allowed",
            opacity: showIntro ? 0.3 : 1,
          }}
        >
          {trap.toUpperCase()} ({count})
        </button>
      ))}

      {/* Arm Trap Button */}
      <button
        onClick={onArmTrap}
        disabled={!selectedTrapType || isPlacingTrap || prepTime <= 0 || showIntro}
        style={{
          padding: "14px 22px",
          fontSize: "16px",
          borderRadius: "30px",
          background: "#555",
          color: "#fff",
          border: "2px solid #aaa",
          cursor: selectedTrapType && prepTime > 0 ? "pointer" : "not-allowed",
          opacity: showIntro ? 0.3 : 1,
        }}
      >
        ARM TRAP
      </button>
    </div>
  );
};

export default TrapUI;
