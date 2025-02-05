import { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./components/Scene";
import { CharacterController } from "./components/CharacterController"; // ✅ Ensure this is correctly imported
import Navbar from "./sections/Navbar";
import Inventory from "./sections/Inventory";
import Contact from "./sections/Contact";

function App() {
  const [activeSection, setActiveSection] = useState(null); // ✅ Controls which UI is active

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

  // ✅ Define `isPaused` to disable movement when a popup is open
  const isPaused = activeSection !== null;

  return (
    <Router>
      <>
        {activeSection === "inventory" && <Inventory onClose={() => setActiveSection(null)} />}
        {activeSection === "contact" && <Contact onClose={() => setActiveSection(null)} />}

        <Navbar
          onAboutClick={() => setActiveSection(activeSection === "inventory" ? null : "inventory")}
          onContactClick={() => setActiveSection(activeSection === "contact" ? null : "contact")}
        />

        <Canvas shadows>
          <color attach="background" args={["#2b2b2b"]} />
          <Scene isPaused={activeSection !== null} /> {/* ✅ Pass isPaused into Scene */}
        </Canvas>
      </>
    </Router>
  );
}

export default App;
