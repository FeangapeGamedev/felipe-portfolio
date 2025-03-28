import React, { useEffect } from "react";
import { useGame } from "../state/GameContext";
import SurvivorIntroPopup from "../../components/SurvivorIntroPopup";
import TrapUI from "../../components/TrapUI";

const SurvivorGameManager = ({
  trapCharges,
  setTrapCharges,
  prepTime,
  setPrepTime,
  showIntro,
  setShowIntro,
  restartSurvivorGame,
  selectedTrapType,
  setSelectedTrapType,
  onArmTrap,
  isPlacingTrap,
}) => {
  const { currentRoom } = useGame();

  // Start countdown after closing intro
  useEffect(() => {
    if (showIntro || prepTime <= 0) return;
    const interval = setInterval(() => {
      setPrepTime(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [prepTime, showIntro]);

  useEffect(() => {
    if (prepTime === 0) {
      console.log("🧟 Enemies incoming!");
      // TODO: Spawn enemies
    }
  }, [prepTime]);

  return (
    <>
      {/* Survivor Mode Intro */}
      {showIntro && <SurvivorIntroPopup onClose={() => setShowIntro(false)} />}

      {/* Trap UI */}
      <TrapUI
        trapCharges={trapCharges}
        selectedTrapType={selectedTrapType}
        setSelectedTrapType={setSelectedTrapType}
        onArmTrap={onArmTrap}
        isPlacingTrap={isPlacingTrap}
        prepTime={prepTime}
        showIntro={showIntro}
      />

      {/* Prep Timer */}
      {!showIntro && (
        <div
          style={{
            position: "absolute",
            top: "300px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "8px 16px",
            background: "#000000cc",
            color: "#fff",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "bold",
            zIndex: 10,
          }}
        >
          Prep Time: {prepTime}s
        </div>
      )}

      {/* 🔁 Restart Game Button */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          zIndex: 10,
        }}
      >
        <button
          onClick={restartSurvivorGame}
          style={{
            padding: "10px 16px",
            fontSize: "14px",
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
            border: "1px solid #888",
            cursor: "pointer",
          }}
        >
          🔁 Restart Game
        </button>
      </div>
    </>
  );
};

export default SurvivorGameManager;
