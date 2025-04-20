// App.jsx
import { useState, useEffect, Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import "./index.css";

import { projects } from "./game/data/projectsData";
import { useGame } from "./game/state/GameContext";
import SurvivorGameManager from "./game/survivor/SurvivorGameManager";

import Scene from "./game/scene/Scene";
import Navbar from "./components/Navbar";
import Inventory from "./components/Inventory";
import Contact from "./components/Contact";
import Projects from "./components/Projects";
import ProjectDetails from "./components/ProjectDetails";
import CodeFrame from "./components/CodeFrame";
import ErrorCodePopup from "./components/ErrorCodePopup";
import WelcomePopup from "./components/WelcomePopup";
import * as THREE from "three";
import { roomData } from "./game/data/roomData";

function App() {
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("game");
  const [selectedProject, setSelectedProject] = useState(null);
  const [disableBackButton, setDisableBackButton] = useState(false);
  const [showCodeFrame, setShowCodeFrame] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [doorPassKey] = useState("1958");

  const [prepTime, setPrepTime] = useState(3); // ⏱️ short Bomberman-style prep
  const [showIntro, setShowIntro] = useState(true);
  const [forceTeleport, setForceTeleport] = useState(false);
  const [initialPosition, setInitialPosition] = useState(null);
  const [selectedTrapType, setSelectedTrapType] = useState(null);
  const [isPlacingTrap, setIsPlacingTrap] = useState(false);
  const [placedTraps, setPlacedTraps] = useState([]);
  const [enemySpawned, setEnemySpawned] = useState(false);
  const [gameEnd, setGameEnd] = useState(false);
  const [isPlayerDead, setIsPlayerDead] = useState(false);
  const [spawnedEnemies, setSpawnedEnemies] = useState([]);
  const [showSurvivorDoor, setShowSurvivorDoor] = useState(true);
  const [survivorGameActive, setSurvivorGameActive] = useState(true);

  const { changeRoom, currentRoom } = useGame();
  const previousRoomId = useRef(null);
  const loadingStartTime = useRef(null);
  const characterRef = useRef();
  const hasSpawnedRef = useRef(false);

  const isPaused = activeSection !== "game" || showWelcomePopup;

  const [trapCharges, setTrapCharges] = useState({
    unity: 1,
    unreal: 1,
    react: 1,
    blender: 1,
    vr: 1,
  });

  useEffect(() => {
    if (!hasMounted && !showLoadingScreen) {
      setHasMounted(true);
      setShowWelcomePopup(true);
    }
  }, [hasMounted, showLoadingScreen]);

  useEffect(() => {
    if (showErrorPopup) {
      const timer = setTimeout(() => setShowErrorPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showErrorPopup]);

  useEffect(() => {
    const from = previousRoomId.current;
    const to = currentRoom?.id;

    if (to && to !== from) {
      previousRoomId.current = to;
      loadingStartTime.current = Date.now();
      setShowLoadingScreen(true);

      const MIN_LOADING_DURATION = 800;
      const elapsed = Date.now() - loadingStartTime.current;
      const remaining = Math.max(MIN_LOADING_DURATION - elapsed, 0);

      const timer = setTimeout(() => {
        setShowLoadingScreen(false);
      }, remaining);

      return () => clearTimeout(timer);
    }
  }, [currentRoom]);

  const restartSurvivorGame = () => {
    changeRoom(3);

    setTrapCharges({
      unity: 1,
      blender: 1,
      react: 1,
      unreal: 1,
      vr: 1,
    });

    setPlacedTraps([]);
    setSpawnedEnemies([]); // ✅ Kill all active enemies
    setPrepTime(3); // ⏱️ short Bomberman-style prep
    setShowIntro(true);
    setSelectedTrapType(null);
    setIsPlacingTrap(false);
    setEnemySpawned(false); // optional, for legacy
    setGameEnd(false);
    setIsPlayerDead(false); // ✅ Reset death state
    hasSpawnedRef.current = false;

    setTimeout(() => {
      const spawn = new THREE.Vector3(...roomData[2].spawnPositionForward);
      setInitialPosition(spawn);
      setForceTeleport(true);

      setTimeout(() => {
        characterRef.current?.revive?.();
      }, 100);
    }, 300);
  };

  const resetSurvivorGameState = () => {
    console.log("🔄 Resetting Survivor Game to initial state...");
    setPlacedTraps([]);
    setSpawnedEnemies([]);
    setTrapCharges({
      unity: 1,
      blender: 1,
      react: 1,
      unreal: 1,
      vr: 1,
    });
    setSurvivorGameActive(false);
    setShowIntro(true); // ✅ show intro again
    setPrepTime(3); // ⏱️ short Bomberman-style prep
    setSelectedTrapType(null);
    setGameEnd(false);
    setIsPlayerDead(false);
    setIsPlacingTrap(false);
  };

  const handleArmTrap = (trapType) => {
    if (!trapType || isPlacingTrap) return;
    setIsPlacingTrap(true);
    console.log(`🪤 Preparing trap placement of type: ${trapType}`);
    characterRef.current?.prepareTrapPlacement?.(trapType); // Call the method on characterRef
  };

  return (
    <>
      {showLoadingScreen && (
        <div className="loading-screen">
          <p>Loading...</p>
        </div>
      )}

      <Suspense fallback={null}>
        <div className="canvas-container">
          <Canvas shadows>
            <Physics>
              <Scene
                isPaused={isPaused}
                onProjectSelect={(id) => {
                  const project = projects.find((p) => p.id === id);
                  setSelectedProject(project);
                  setActiveSection("project-details");
                  setDisableBackButton(true);
                }}
                onShowCodeFrame={() => {
                  setShowCodeFrame(true);
                  setActiveSection("code-frame");
                }}
                onRoomChange={(roomId) => {
                  setShowLoadingScreen(true);
                  changeRoom(roomId);
                }}
                showSurvivorDoor={showSurvivorDoor} // ✅ add this
                trapCharges={trapCharges}
                setTrapCharges={setTrapCharges}
                initialPosition={initialPosition}
                setInitialPosition={setInitialPosition}
                forceTeleport={forceTeleport}
                setForceTeleport={setForceTeleport}
                selectedTrapType={selectedTrapType}
                setSelectedTrapType={setSelectedTrapType}
                isPlacingTrap={isPlacingTrap}
                setIsPlacingTrap={setIsPlacingTrap}
                placedTraps={placedTraps}
                setPlacedTraps={setPlacedTraps}
                restartSurvivorGame={restartSurvivorGame}
                enemySpawned={enemySpawned}
                setEnemySpawned={setEnemySpawned}
                onEnemyDeath={() => {
                  setEnemySpawned(false);
                  setGameEnd(true);
                }}
                characterRef={characterRef}
                isPlayerDead={isPlayerDead}
                setIsPlayerDead={setIsPlayerDead}
                setSpawnedEnemies={setSpawnedEnemies}
                setSurvivorGameActive={setSurvivorGameActive}
                setShowIntro={setShowIntro}
                setPrepTime={setPrepTime}
                setGameEnd={setGameEnd}
                spawnedEnemies={spawnedEnemies}
                resetSurvivorGameState={resetSurvivorGameState}
              />
            </Physics>
          </Canvas>
        </div>
      </Suspense>

      <div className="ui-layer">
        <Navbar
          onInventoryClick={() =>
            setActiveSection(activeSection === "inventory" ? "game" : "inventory")
          }
          onProjectsClick={() =>
            setActiveSection(activeSection === "projects" ? "game" : "projects")
          }
          onContactClick={() => setActiveSection("contact")}
        />

        {activeSection === "project-details" && selectedProject && (
          <ProjectDetails
            project={selectedProject}
            onClose={() => {
              setSelectedProject(null);
              setActiveSection("game");
            }}
            onBack={() => {
              setSelectedProject(null);
              setActiveSection("projects");
            }}
            disableBackButton={disableBackButton}
          />
        )}

        {activeSection === "inventory" && <Inventory onClose={() => setActiveSection("game")} />}
        {activeSection === "contact" && <Contact onClose={() => setActiveSection("game")} />}
        {activeSection === "projects" && (
          <Projects
            onClose={() => setActiveSection("game")}
            onProjectClick={(project) => {
              setSelectedProject(project);
              setActiveSection("project-details");
              setDisableBackButton(false);
            }}
          />
        )}
        {activeSection === "code-frame" && (
          <CodeFrame
            className="popup-frame"
            doorPassKey={doorPassKey}
            onCorrectPassKey={() => {
              setShowCodeFrame(false);
              setActiveSection("game");
              setShowLoadingScreen(true);
              changeRoom(3);
            }}
            onClose={() => {
              setActiveSection("game");
              setShowErrorPopup(true);
            }}
          />
        )}
        {showErrorPopup && (
          <ErrorCodePopup
            message="ACCESS DENIED – TRY AGAIN"
            onClose={() => setShowErrorPopup(false)}
          />
        )}
      </div>

      {!showLoadingScreen && currentRoom?.id === 3 && (
        <SurvivorGameManager
          characterRef={characterRef}
          trapCharges={trapCharges}
          setTrapCharges={setTrapCharges}
          prepTime={prepTime}
          setPrepTime={setPrepTime}
          showIntro={showIntro}
          setShowIntro={setShowIntro}
          restartSurvivorGame={restartSurvivorGame}
          selectedTrapType={selectedTrapType}
          setSelectedTrapType={setSelectedTrapType}
          isPlacingTrap={isPlacingTrap}
          onArmTrap={handleArmTrap} // Use the new function here
          onEnemySpawn={() => {
            console.log("👾 Spawning enemy!");

            const newEnemy = {
              id: `enemy-${Date.now()}`, // give it a unique ID
              position: new THREE.Vector3(
                Math.random() * 10 - 5, // x: -5 to 5
                0,
                Math.random() * 10 - 5 // z: -5 to 5
              ),
            };

            setSpawnedEnemies((prev) => [...prev, newEnemy]);
          }}
          isPlayerDead={isPlayerDead}
          setIsPlayerDead={setIsPlayerDead}
          spawnedEnemies={spawnedEnemies}
          setEnemySpawned={setEnemySpawned}
          setIsPlacingTrap={setIsPlacingTrap}
          gameEnd={gameEnd}
          setShowSurvivorDoor={setShowSurvivorDoor}
          setSurvivorGameActive={setSurvivorGameActive}
          setPlacedTraps={setPlacedTraps}
          setSpawnedEnemies={setSpawnedEnemies}
          hasSpawnedRef={hasSpawnedRef}
          setGameEnd={setGameEnd}
        />
      )}

      {!showLoadingScreen && showWelcomePopup && (
        <WelcomePopup onClose={() => setShowWelcomePopup(false)} />
      )}
    </>
  );
}

export default App;
