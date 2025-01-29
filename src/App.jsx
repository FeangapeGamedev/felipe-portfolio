import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";

function App() {
  return (
    <Canvas shadows>
      <color attach="background" args={["#2b2b2b"]} />
      <Experience />
    </Canvas>
  );
}

export default App;