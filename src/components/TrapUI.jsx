import React, { useEffect } from "react";
import "../styles/TrapUI.css";
import { getTrapMeta } from "../game/utils/trapRegistry"; // ✅ Import metadata

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
    if (trapCharges[toolName] > 0 && prepTime <= 0 && !showIntro) {
      setSelectedTrapType(toolName);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      const index = trapKeys.indexOf(key);
      if (index !== -1 && trapTypes[index]) {
        onToolClicked(trapTypes[index]);
        return;
      }

      if (key === "f") {
        if (selectedTrapType && !isPlacingTrap && prepTime <= 0 && !showIntro) {
          onArmTrap(selectedTrapType);
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
        {trapTypes.map((trap, index) => {
          const meta = getTrapMeta(trap);

          // Correct calculation for totalTime
          const totalTime = Math.floor(1.5 + meta.armTime + 1.5); // Ensure it calculates correctly as 8 seconds

          return (
            <li key={trap}>
              <button
                className={`trap-button ${selectedTrapType === trap ? "selected" : ""}`}
                onClick={() => onToolClicked(trap)}
                disabled={trapCharges[trap] === 0 || prepTime > 0 || showIntro}
                style={{ backgroundColor: trapColors[trap] }}
              >
                <span className="trap-label">
                  [{index + 1}] {trapNames[trap]}
                </span>

                <div className="trap-meta">
                  <span>⏱ {totalTime} secs</span>
                  <br />
                  <span>💥 {meta.damage} dmg</span>
                </div>

                <span className="trap-count">
                  ({trapCharges[trap]} left)
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="trap-controls">
        <button
          className="arm-trap-button"
          onClick={() => onArmTrap(selectedTrapType)}
          disabled={!selectedTrapType || isPlacingTrap || prepTime > 0 || showIntro}
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
};

export default TrapUI;
