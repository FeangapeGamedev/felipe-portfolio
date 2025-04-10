import React, { useEffect } from "react";
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
  onResetGame,
  onQuitGame,
  isPlacingTrap,
  prepTime,
  showIntro,
}) => {
  const trapKeys = ["1", "2", "3", "4", "5"];
  const trapTypes = Object.keys(trapCharges); // ["unity", "unreal", "react", "blender", "vr"]

  const onToolClicked = (toolName) => {
    if (trapCharges[toolName] > 0 && prepTime > 0 && !showIntro) {
      setSelectedTrapType(toolName);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      // Trap hotkeys 1–5
      const index = trapKeys.indexOf(key);
      if (index !== -1 && trapTypes[index]) {
        console.log(`Key ${key} pressed → selecting ${trapTypes[index]}`);
        onToolClicked(trapTypes[index]);
        return;
      }

      // Arm trap with F
      if (key === "f") {
        console.log("F key pressed");
        if (selectedTrapType && !isPlacingTrap && prepTime > 0 && !showIntro) {
          console.log("Triggering onArmTrap()");
          onArmTrap(selectedTrapType); // ✅ Pass the trap type manually
        } else {
          console.log("F key blocked. Conditions:", {
            selectedTrapType,
            isPlacingTrap,
            prepTime,
            showIntro,
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [trapCharges, selectedTrapType, isPlacingTrap, prepTime, showIntro]);

  return (
    <div className="trapbar">
      <span>TRAPS</span>
  
      <ul>
        {trapTypes.map((trap, index) => (
          <li key={trap}>
            <button
              className={`trap-button ${selectedTrapType === trap ? "selected" : ""}`}
              onClick={() => onToolClicked(trap)}
              disabled={trapCharges[trap] === 0 || prepTime <= 0 || showIntro}
              style={{ backgroundColor: trapColors[trap] }}
            >
              <span className="trap-label">[{index + 1}] {trapNames[trap]}</span>
              <span className="trap-count">({trapCharges[trap]} left)</span>
            </button>
          </li>
        ))}
      </ul>
  
      <div className="trap-controls">
        <button
          className="arm-trap-button"
          onClick={() => onArmTrap(selectedTrapType)}
          disabled={!selectedTrapType || isPlacingTrap || prepTime <= 0 || showIntro}
        >
          [F] ARM TRAP
        </button>
        <button
          className="reset-trap-button"
          onClick={onResetGame}
          disabled={showIntro}
        >
          RESET GAME
        </button>
        <button
          className="quit-trap-button"
          onClick={onQuitGame}
          disabled={showIntro}
        >
          QUIT GAME
        </button>
      </div>
    </div>
  );  
}  
export default TrapUI;
