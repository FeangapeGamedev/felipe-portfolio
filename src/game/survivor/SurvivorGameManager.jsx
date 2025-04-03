import React, { useEffect } from "react";
import SurvivorIntroPopup from "../../components/SurvivorIntroPopup";
import TrapUI from "../../components/TrapUI";
import { useGame } from "../state/GameContext.jsx"; // Access currentRoom from your game context

const SurvivorGameManager = ({
  trapCharges,
  prepTime,
  setPrepTime,
  showIntro,
  setShowIntro,
  restartSurvivorGame,
  selectedTrapType,
  setSelectedTrapType,
  onArmTrap,
  isPlacingTrap,
  onEnemySpawn, // callback to spawn enemy
}) => {
  const { currentRoom } = useGame();

  // Start countdown after closing intro
  useEffect(() => {
    if (showIntro || prepTime <= 0) return;
    const interval = setInterval(() => {
      setPrepTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [prepTime, showIntro, setPrepTime]);

  // When prep time is over, spawn enemy if we're in room 3.
  useEffect(() => {
    if (prepTime === 0) {
      if (currentRoom && currentRoom.id === 3) {
        onEnemySpawn(); // Trigger enemy spawn
      }
    }
  }, [prepTime, currentRoom, onEnemySpawn]);

  const handleTrapArm = (trapType) => {
    console.log("🪤 Trap armed:", trapType);
    onArmTrap(trapType);
  };

  return (
    <>
      {/* Survivor Mode Intro */}
      {showIntro && (
        <SurvivorIntroPopup
          onClose={() => {
            console.log("🎬 Survivor intro closed.");
            setShowIntro(false);
          }}
        />
      )}

      {/* Trap UI */}
      <TrapUI
        trapCharges={trapCharges}
        selectedTrapType={selectedTrapType}
        setSelectedTrapType={(type) => {
          console.log("🎯 Trap type selected:", type);
          setSelectedTrapType(type);
        }}
        onArmTrap={handleTrapArm}
        isPlacingTrap={isPlacingTrap}
        prepTime={prepTime}
        showIntro={showIntro}
        onResetGame={restartSurvivorGame} // Pass reset function to TrapUI
      />

      {/* Prep Timer */}
      {!showIntro && prepTime > 0 && (
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
    </>
  );
};

export default SurvivorGameManager;
