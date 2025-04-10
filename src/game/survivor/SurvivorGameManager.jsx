import React, { useEffect, useState } from "react";
import SurvivorIntroPopup from "../../components/SurvivorIntroPopup";
import TrapUI from "../../components/TrapUI";
import WinPopup from "../../components/WinPopup";
import LosePopup from "../../components/LosePopup";
import { useGame } from "../state/GameContext.jsx";

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
  onEnemySpawn,
  gameEnd,
  isPlayerDead,
  spawnedEnemies,
}) => {
  const { currentRoom } = useGame();
  const [activeEndPopup, setActiveEndPopup] = useState(null); // "win" | "lose" | null

  useEffect(() => {
    if (showIntro || prepTime <= 0) return;
    const interval = setInterval(() => {
      setPrepTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [prepTime, showIntro, setPrepTime]);

  useEffect(() => {
    if (prepTime === 0 && !isPlacingTrap && !gameEnd) {
      if (currentRoom && currentRoom.id === 3) {
        onEnemySpawn();
      }
    }
  }, [prepTime, currentRoom, isPlacingTrap, gameEnd, onEnemySpawn]);

  const handleTrapArm = (trapType) => {
    if (!trapType || isPlacingTrap) return;
    console.log("🪤 Trap armed:", trapType);
    onArmTrap(trapType);
  };

  const allTrapChargesEmpty = Object.values(trapCharges).every((charge) => charge === 0);
  const enemiesRemain = spawnedEnemies.length > 0;
  const playerLost = isPlayerDead || (allTrapChargesEmpty && enemiesRemain);
  const playerWon = gameEnd && !playerLost;

  useEffect(() => {
    if (playerWon || playerLost) {
      const timeout = setTimeout(() => {
        setActiveEndPopup(playerWon ? "win" : "lose");
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [playerWon, playerLost]);

  useEffect(() => {
    setActiveEndPopup(null);
  }, [prepTime]);

  return (
    <>
      {/* Intro */}
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
        onResetGame={restartSurvivorGame}
      />

      {/* Timer */}
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

      {/* ✅ Render Popups */}
      {activeEndPopup === "win" && (
        <WinPopup onClose={() => setActiveEndPopup(null)} />
      )}

      {activeEndPopup === "lose" && (
        <LosePopup onClose={() => setActiveEndPopup(null)} />
      )}
    </>
  );
};

export default SurvivorGameManager;
