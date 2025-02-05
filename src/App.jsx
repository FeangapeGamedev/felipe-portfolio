import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./components/Scene";
import Navbar from "./sections/Navbar";
import Inventory from "./sections/Inventory";
import Contact from "./sections/Contact";

function App() {
  const [activeSection, setActiveSection] = useState(null); // Manages which section is open

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
          <Scene isPaused={activeSection !== null} />
        </Canvas>
      </>
    </Router>
  );
}

export default App;
