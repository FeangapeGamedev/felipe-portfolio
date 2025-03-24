import React, { useEffect, useState } from "react";
import { useGame } from "../state/GameContext";
import SurvivorIntroPopup from "../../components/SurvivorIntroPopup";

const SurvivorGameManager = ({
  placementMode,
  setPlacementMode,
  trapCharges,
  setTrapCharges,
  prepTime,
  setPrepTime,
  showIntro,
  setShowIntro,
  restartSurvivorGame,
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

  const onToolClicked = (toolName) => {
    if (trapCharges[toolName] > 0 && prepTime > 0) {
      setPlacementMode(toolName);
    }
  };

  return (
    <>
      {/* Survivor Mode Intro */}
      {showIntro && <SurvivorIntroPopup onClose={() => setShowIntro(false)} />}

      {/* Trap Buttons */}
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
        {Object.entries(trapCharges).map(([trap, count]) => {
          const trapColors = {
            unity: "#224b55",    // Deep teal (dark Unity cyan)
            unreal: "#3f2a47",   // Dusky plum (dark Unreal purple)
            react: "#1e3a5f",    // Midnight blue (React)
            blender: "#5a2c16",  // Burnt orange-brown (Blender)
            vr: "#3d1f1f",        // Dried blood red (VR)
          };
          
          return (
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
                border: "1px solid #888",
                cursor: count > 0 && prepTime > 0 ? "pointer" : "not-allowed",
                opacity: showIntro ? 0.3 : 1,
              }}
            >
              {trap.toUpperCase()} ({count})
            </button>
          );
        })}
      </div>

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
