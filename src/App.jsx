import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier"; // Import Physics component
import Scene from "./game/scene/Scene"; // Ensure correct path
import Navbar from "./components/Navbar";
import Inventory from "./components/Inventory";
import Contact from "./components/Contact";
import Projects from "./components/Projects";
import ProjectDetails from "./components/ProjectDetails";
import CodeFrame from "./components/CodeFrame"; // Import CodeFrame component
import { projects } from "./game/data/projectsData"; // Ensure correct path
import { useGame } from "./game/state/GameContext"; // Import useGame

function App() {
  const [activeSection, setActiveSection] = useState("game");
  const [selectedProject, setSelectedProject] = useState(null);
  const [disableBackButton, setDisableBackButton] = useState(false);
  const [showCodeFrame, setShowCodeFrame] = useState(false); // even thou showCodeFrame is not used we need to import it
  const [doorPassKey] = useState("1958"); // Default passkey
  const { changeRoom } = useGame(); // Use changeRoom from GameContext

  const isPaused = activeSection !== "game";

  const handleProjectSelect = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    setSelectedProject(project);
    setActiveSection("project-details");
    setDisableBackButton(true);
  };

  const handleShowCodeFrame = () => {
    setShowCodeFrame(true);
    setActiveSection("code-frame");
  };

  const handleCorrectPassKey = () => {
    // Logic to move to the next room
    console.log("Correct passkey entered. Moving to the next room.");
    changeRoom(3); // Use the correct room ID
  };

  return (
    <>
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
      )} {/* Display CodeFrame */}

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
    </>
  );
}

export default App;
