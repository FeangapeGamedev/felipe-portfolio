import { useState, lazy, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier"; 
import { projects } from "./game/data/projectsData"; 
import { useGame } from "./game/state/GameContext"; 
import "./index.css";

// ✅ Lazy Load Components
const Scene = lazy(() => import("./game/scene/Scene"));
const Navbar = lazy(() => import("./components/Navbar"));
const Inventory = lazy(() => import("./components/Inventory"));
const Contact = lazy(() => import("./components/Contact"));
const Projects = lazy(() => import("./components/Projects"));
const ProjectDetails = lazy(() => import("./components/ProjectDetails"));
const CodeFrame = lazy(() => import("./components/CodeFrame"));

function App() {
  const [activeSection, setActiveSection] = useState("game");
  const [selectedProject, setSelectedProject] = useState(null);
  const [disableBackButton, setDisableBackButton] = useState(false);
  const [showCodeFrame, setShowCodeFrame] = useState(false);
  const [doorPassKey] = useState("1958");
  const { changeRoom } = useGame();

  const isPaused = activeSection !== "game";

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

  const handleCorrectPassKey = () => {
    console.log("Correct passkey entered. Moving to the next room.");
    changeRoom(3);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* 🔹 Project Details Popup */}
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

      {/* 🔹 Other UI Popups */}
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
          onClose={() => setActiveSection("game")}
          className="popup-frame"
          doorPassKey={doorPassKey}
          onCorrectPassKey={handleCorrectPassKey}
        />
      )}

      {/* 🔹 Navbar */}
      <Navbar
        onInventoryClick={() => setActiveSection(activeSection === "inventory" ? "game" : "inventory")}
        onProjectsClick={() => setActiveSection(activeSection === "projects" ? "game" : "projects")}
        onContactClick={() => setActiveSection("contact")}
      />

      {/* 🔹 Main Game Canvas */}
      <Canvas shadows>
        <Physics>
          <Scene isPaused={isPaused} onProjectSelect={handleProjectSelect} onShowCodeFrame={handleShowCodeFrame} />
        </Physics>
      </Canvas>
    </Suspense>
  );
}

export default App;
