import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./game/scene/Scene"; // ✅ Ensure correct path
import Navbar from "./components/Navbar";
import Inventory from "./components/Inventory";
import Contact from "./components/Contact";
import Projects from "./components/Projects";
import ProjectDetails from "./components/ProjectDetails";
import { projects } from "./game/data/projectsData"; // ✅ Ensure correct path

function App() {
  const [activeSection, setActiveSection] = useState("game");
  const [selectedProject, setSelectedProject] = useState(null);
  const [disableBackButton, setDisableBackButton] = useState(false);

  const isPaused = activeSection !== "game";

  const handleProjectSelect = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    setSelectedProject(project);
    setActiveSection("project-details");
    setDisableBackButton(true);
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

      {/* 🔹 Navbar */}
      <Navbar
        onInventoryClick={() => setActiveSection(activeSection === "inventory" ? "game" : "inventory")}
        onProjectsClick={() => setActiveSection(activeSection === "projects" ? "game" : "projects")}
        onContactClick={() => setActiveSection("contact")}
      />

      {/* 🔹 Main Game Canvas */}
      <Canvas shadows>
        <Scene isPaused={isPaused} onProjectSelect={handleProjectSelect} />
      </Canvas>
    </>
  );
}

export default App;
