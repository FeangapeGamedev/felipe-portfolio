import React, { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import SurvivorIntroPopup from "../../components/SurvivorIntroPopup";
import TrapUI from "../../components/TrapUI";
import WinPopup from "../../components/WinPopup";
import LosePopup from "../../components/LosePopup";
import { useGame } from "../state/GameContext.jsx";

const SurvivorGameManager = ({
  characterRef,
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
  setIsPlacingTrap,
  onEnemySpawn,
  gameEnd,
  setGameEnd,
  isPlayerDead,
  setIsPlayerDead,
  spawnedEnemies,
  setSpawnedEnemies,
  setPlacedTraps,
  setShowSurvivorDoor,
  setSurvivorGameActive,
  hasSpawnedRef
}) => {
  const { currentRoom } = useGame();
  const [activeEndPopup, setActiveEndPopup] = useState(null);
  const countdownRef = useRef(null);
  const quittingRef = useRef(false); // 🆕 Used to block enemy spawn after quit


  const handleEnemySpawn = () => {
    const newEnemy = {
      id: crypto.randomUUID?.() || `enemy-${Date.now()}-${Math.floor(Math.random() * 10000)}`, // ✅ Unique ID
      position: new THREE.Vector3(
        Math.random() * 10 - 5,
        0,
        Math.random() * 10 - 5
      ),
    };

    setSpawnedEnemies((prevEnemies) => [...prevEnemies, newEnemy]);
    console.log("👾 New enemy spawned:", newEnemy);
  };

  // Countdown logic
  useEffect(() => {
    if (showIntro || prepTime <= 0 || gameEnd) return;

    countdownRef.current = setInterval(() => {
      setPrepTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdownRef.current);
  }, [showIntro, prepTime, gameEnd]);

  // Reset quittingRef if we are starting fresh
  useEffect(() => {
    if (!showIntro && prepTime === 20 && !gameEnd) {
      quittingRef.current = false;
    }
  }, [showIntro, prepTime, gameEnd]);

  // Spawn enemies after 3-second prep (trap placement disabled during prep)
  useEffect(() => {
    if (
      prepTime === 0 &&
      currentRoom?.id === 3 &&
      !hasSpawnedRef.current &&
      !quittingRef.current &&
      !gameEnd
    ) {
      console.log("👾 Spawning enemies after prep!");
      handleEnemySpawn();
      hasSpawnedRef.current = true;
    }
  }, [prepTime, currentRoom, gameEnd]);

  // Hide door when prep begins
  useEffect(() => {
    if (prepTime < 20) {
      setShowSurvivorDoor(false);
    }
  }, [prepTime]);

  // Win / lose logic
  const playerLost = isPlayerDead; // Remove trap-related conditions
  const playerWon = gameEnd && !playerLost;

  useEffect(() => {
    if (playerWon || playerLost) {
      const timeout = setTimeout(() => {
        setActiveEndPopup(playerWon ? "win" : "lose");

        // ✅ Clear traps if the player wins (for free roam consistency)
        if (playerWon) {
          setPlacedTraps([]);
          setTrapCharges({
            unity: 1,
            unreal: 1,
            react: 1,
            blender: 1,
            vr: 1,
          });
        }
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [playerWon, playerLost]);

  // Show the door again on win
  useEffect(() => {
    if (gameEnd && !playerLost) {
      setShowSurvivorDoor(true);
    }
  }, [gameEnd, playerLost]);

  useEffect(() => {
    setActiveEndPopup(null);
  }, [prepTime]);

  const handleTrapArm = (trapType) => {
    if (!trapType || isPlacingTrap) return;
    console.log("🪤 Trap armed:", trapType);
    onArmTrap(trapType);
  };

  // ✅ Quit the game and enter free roam mode
  const handleQuitGame = () => {
    console.log("🚪 Quitting Survivor Mode...");
    quittingRef.current = true;
    hasSpawnedRef.current = false;

    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    setSurvivorGameActive(false); // free roam enabled
    setSelectedTrapType(null);
    setActiveEndPopup(null);
    setTrapCharges({
      unity: 1,
      unreal: 1,
      react: 1,
      blender: 1,
      vr: 1,
    });
    setPlacedTraps([]);
    setSpawnedEnemies([]);
    setPrepTime(0); // no timer
    setGameEnd(false);
    setIsPlayerDead(false);
    setIsPlacingTrap(false);

    characterRef.current?.revive?.();

    setTimeout(() => {
      setShowSurvivorDoor(true);
    }, 50);
  };


  return (
    <>
      {/* 🧠 Intro popup */}
      {showIntro && (
        <SurvivorIntroPopup onClose={() => setShowIntro(false)} />
      )}

      {/* 🧰 Trap UI with reset & quit buttons */}
      <TrapUI
        trapCharges={trapCharges}
        selectedTrapType={selectedTrapType}
        setSelectedTrapType={setSelectedTrapType}
        onArmTrap={handleTrapArm}
        isPlacingTrap={isPlacingTrap}
        prepTime={prepTime}
        showIntro={showIntro}
        onResetGame={restartSurvivorGame}
        onQuitGame={handleQuitGame}
      />

      {/* ⏱️ Prep timer display */}
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

      {/* 🎉 Win / Lose popups */}
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
