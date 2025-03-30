import React, { useEffect } from "react";
import SurvivorIntroPopup from "../../components/SurvivorIntroPopup";
import TrapUI from "../../components/TrapUI";

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
}) => {
  // Start countdown after closing intro
  useEffect(() => {
    if (showIntro || prepTime <= 0) return;
    const interval = setInterval(() => {
      setPrepTime((prev) => {
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [prepTime, showIntro]);

  useEffect(() => {
    if (prepTime === 0) {
      console.log("🧟 Enemies incoming! Prep time is over.");
      // TODO: Spawn enemies
    }
  }, [prepTime]);

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
        onResetGame={restartSurvivorGame} // ✅ Pass reset function to TrapUI
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
    </>
  );
};

export default SurvivorGameManager;
