import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./components/Scene";
import Navbar from "./sections/Navbar";
import Inventory from "./sections/Inventory";
import Contact from "./sections/Contact";

function App() {
  const [showInventory, setShowInventory] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === "i") {
        setShowInventory((prev) => !prev);
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
        {showInventory && <Inventory onClose={() => setShowInventory(false)} />}
        {showContact && <Contact onClose={() => setShowContact(false)} />}
        <Navbar 
          onAboutClick={() => setShowInventory((prev) => !prev)}
          onContactClick={() => setShowContact((prev) => !prev)}
        />
        
        <Canvas shadows>
          <color attach="background" args={["#2b2b2b"]} />
          <Scene isPaused={showInventory || showContact} />
        </Canvas>
      </>
    </Router>
  );
}

export default App;
