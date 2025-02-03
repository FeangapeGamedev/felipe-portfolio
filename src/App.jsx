import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import Navbar from "./sections/Navbar";
import Inventory from "./sections/Inventory";

function App() {
  const [showInventory, setShowInventory] = useState(false);

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
    <>
      {showInventory && <Inventory onClose={() => setShowInventory(false)} />}
      <Navbar onAboutClick={() => setShowInventory((prev) => !prev)} />
      <Canvas shadows>
        <color attach="background" args={["#2b2b2b"]} />
        <Experience isPaused={showInventory} /> {/* Pass pause state */}
      </Canvas>
    </>
  );
}


export default App;
