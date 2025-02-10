import { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./components/Scene";
import { CharacterController } from "./components/CharacterController";
import Navbar from "./sections/Navbar";
import Inventory from "./sections/Inventory";
import Contact from "./sections/Contact";
import Projects from "./sections/Projects"; // ✅ Import Projects

function App() {
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    console.log("Active section:", activeSection); // ✅ Debug log
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

  const isPaused = activeSection !== null;

  return (
    <Router>
      <>
        {activeSection === "inventory" && <Inventory onClose={() => setActiveSection(null)} />}
        {activeSection === "contact" && <Contact onClose={() => setActiveSection(null)} />}
        {activeSection === "projects" && <Projects onClose={() => setActiveSection(null)} />} 
        <Navbar
          onAboutClick={() => setActiveSection(activeSection === "inventory" ? null : "inventory")}
          onContactClick={() => setActiveSection(activeSection === "contact" ? null : "contact")}
          onProjectsClick={() => setActiveSection(activeSection === "projects" ? null : "projects")} 
        />

        <Canvas shadows>
          <color attach="background" args={["#2b2b2b"]} />
          <Scene isPaused={isPaused} />
          <CharacterController isPaused={isPaused} setTargetPosition={() => {}} />
        </Canvas>
      </>
    </Router>
  );
}

export default App;
