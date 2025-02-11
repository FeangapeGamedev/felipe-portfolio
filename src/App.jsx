import { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./components/Scene";
import { CharacterController } from "./components/CharacterController";
import Navbar from "./sections/Navbar";
import Inventory from "./sections/Inventory";
import Contact from "./sections/Contact";
import Projects from "./sections/Projects";
import ProjectDetails from "./sections/ProjectDetails"; // ✅ Import Project Details

function App() {
  const [activeSection, setActiveSection] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null); // ✅ Track selected project

  useEffect(() => {
    console.log("Active section:", activeSection);
  }, [activeSection]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === "i") {
        setActiveSection((prev) => (prev === "inventory" ? null : "inventory"));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <Router>
      <>
        {/* ✅ Inventory Window (Closes when Project Details is Open) */}
        {activeSection === "inventory" && !selectedProject && <Inventory onClose={() => setActiveSection(null)} />}
        
        {/* ✅ Contact Window (Closes when Project Details is Open) */}
        {activeSection === "contact" && !selectedProject && <Contact onClose={() => setActiveSection(null)} />}
        
        {/* ✅ Projects Window (Closes when Project Details is Open) */}
        {activeSection === "projects" && !selectedProject && (
          <Projects 
            onClose={() => setActiveSection(null)} // ✅ Close Projects window
            onProjectClick={(project) => {
              setActiveSection(null); // ✅ Closes all other popups
              setSelectedProject(project); // ✅ Opens Project Details
            }}
          />
        )}

        {/* ✅ Project Details Window (Closes all other popups when opened) */}
        {selectedProject && (
          <ProjectDetails
            project={selectedProject}
            onClose={() => setSelectedProject(null)} // ✅ Close Project Details
            onBack={() => {
              setSelectedProject(null);
              setActiveSection("projects"); // ✅ Go back to Projects List
            }}
          />
        )}

        {/* ✅ Navbar */}
        <Navbar
          onAboutClick={() => setActiveSection(activeSection === "inventory" ? null : "inventory")}
          onProjectsClick={() => setActiveSection(activeSection === "projects" ? null : "projects")}
          onContactClick={() => setActiveSection(activeSection === "contact" ? null : "contact")}
        />

        {/* ✅ Scene & Character Controller */}
        <Canvas shadows>
          <color attach="background" args={["#2b2b2b"]} />
          <Scene isPaused={activeSection !== null || selectedProject !== null} />
          <CharacterController isPaused={activeSection !== null || selectedProject !== null} setTargetPosition={() => { }} />
        </Canvas>
      </>
    </Router>
  );
}

export default App;
