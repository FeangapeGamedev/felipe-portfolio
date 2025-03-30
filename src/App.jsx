import { useState, useEffect, Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";

import "./index.css";

// Game Data & State
import { projects } from "./game/data/projectsData";
import { useGame } from "./game/state/GameContext";
import SurvivorGameManager from "./game/survivor/SurvivorGameManager";

// Components
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
  const [prepTime, setPrepTime] = useState(60); // ⏱️ 60s prep
  const [showIntro, setShowIntro] = useState(true); // 👋 Show intro popup
  const [forceTeleport, setForceTeleport] = useState(false);
  const [initialPosition, setInitialPosition] = useState(null);
  const [selectedTrapType, setSelectedTrapType] = useState(null);
  const [isPlacingTrap, setIsPlacingTrap] = useState(false);


  const { changeRoom, currentRoom, doorDirection } = useGame();
  const previousRoomId = useRef(null);
  const loadingStartTime = useRef(null);

  const isPaused = activeSection !== "game" || showWelcomePopup;

  // 👇 Trap placement state (shared between Scene + SurvivorGameManager)
  const [trapCharges, setTrapCharges] = useState({
    unity: 1,
    unreal: 1,
    react: 1,
    blender: 1,
    vr: 1,
  });




  // Show Welcome popup only once after everything has loaded
  useEffect(() => {
    if (!hasMounted && !showLoadingScreen) {
      setHasMounted(true);
      setShowWelcomePopup(true);
    }
  }, [hasMounted, showLoadingScreen]);

  // Auto-close error popup
  useEffect(() => {
    if (showErrorPopup) {
      const timer = setTimeout(() => {
        setShowErrorPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showErrorPopup]);

  // Show loading screen on all room changes with a minimum duration
  useEffect(() => {
    const from = previousRoomId.current;
    const to = currentRoom?.id;

    if (to && to !== from) {
      previousRoomId.current = to;
      loadingStartTime.current = Date.now();
      setShowLoadingScreen(true);

      const MIN_LOADING_DURATION = 800;

      const checkTimer = setTimeout(() => {
        const now = Date.now();
        const elapsed = now - loadingStartTime.current;
        const remaining = Math.max(MIN_LOADING_DURATION - elapsed, 0);

        setTimeout(() => {
          setShowLoadingScreen(false);
        }, remaining);
      }, 0);

      return () => clearTimeout(checkTimer);
    }
  }, [currentRoom]);

  const handleCorrectPassKey = () => {
    setShowCodeFrame(false);
    setActiveSection("game");
    setShowLoadingScreen(true);
    changeRoom(3);
  };

  const handleProjectSelect = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    setSelectedProject(project);
    setActiveSection("project-details");
    setDisableBackButton(true);
  };

  const handleShowCodeFrame = () => {
    setShowCodeFrame(true);
    setActiveSection("code-frame");
  };

  const handleRoomChange = (roomId) => {
    setShowLoadingScreen(true);
    changeRoom(roomId);
  };

  const restartSurvivorGame = () => {
    changeRoom(3); // Respawn into Room 3

    setTrapCharges({
      unity: 1,
      blender: 1,
      react: 1,
      unreal: 1,
      vr: 1,
    });


    setPlacementMode(null);
    setPrepTime(60);     // ⏱️ reset timer
    setShowIntro(true);  // 🧾 show popup again

    // ✅ Force teleport after room loads
    setTimeout(() => {
      setInitialPosition(new THREE.Vector3(...roomData[2].spawnPositionForward)); // Room 3's spawn
      setForceTeleport(true); // trigger teleport
    }, 200); // slight delay to allow Room 3 to render
  };



  return (
    <>
      {showLoadingScreen && (
        <div className="loading-screen">
          <p>Loading...</p>
        </div>
      )}

      <Suspense fallback={null}>
        {/* ✅ Canvas (pure 3D stuff) */}
        <Canvas shadows>
          <Physics>
            <Scene
              isPaused={isPaused}
              onProjectSelect={handleProjectSelect}
              onShowCodeFrame={handleShowCodeFrame}
              onRoomChange={handleRoomChange}
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
            />
          </Physics>
        </Canvas>

        {/* ✅ Floating UI Layer */}
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

          {activeSection === "inventory" && (
            <Inventory onClose={() => setActiveSection("game")} />
          )}

          {activeSection === "contact" && (
            <Contact onClose={() => setActiveSection("game")} />
          )}

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
              onCorrectPassKey={handleCorrectPassKey}
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
      </Suspense>

      {currentRoom?.id === 3 && !showLoadingScreen && (
        <SurvivorGameManager
          trapCharges={trapCharges}
          setTrapCharges={setTrapCharges}
          prepTime={prepTime}
          setPrepTime={setPrepTime}
          showIntro={showIntro}
          setShowIntro={setShowIntro}
          restartSurvivorGame={restartSurvivorGame}
          selectedTrapType={selectedTrapType}
          setSelectedTrapType={setSelectedTrapType}
          onArmTrap={() => {
            if (!selectedTrapType || isPlacingTrap) return;
            setIsPlacingTrap(true);
          }}
          isPlacingTrap={isPlacingTrap}
        />

      )}

      {!showLoadingScreen && showWelcomePopup && (
        <WelcomePopup onClose={() => setShowWelcomePopup(false)} />
      )}
    </>
  );
}

export default App;
