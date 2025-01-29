import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import Navbar from "./sections/Navbar"; // ✅ Use the Navbar component

function App() {
  return (
    <>
      <Navbar /> {/* ✅ Navbar is now inside App.jsx again */}
      <Canvas shadows>
        <color attach="background" args={["#2b2b2b"]} />
        <Experience />
      </Canvas>
    </>
  );
}

export default App;
