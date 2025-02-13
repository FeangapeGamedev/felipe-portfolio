import { useState } from "react";
import { Html } from "@react-three/drei"; // ✅ Allows HTML UI inside Three.js

const InteractiveObject = ({ position, geometry, onClick }) => {
  const [showLabel, setShowLabel] = useState(false);

  return (
    <mesh 
      position={position} 
      onPointerEnter={() => setShowLabel(true)}
      onPointerLeave={() => setShowLabel(false)}
      onClick={onClick}
    >
      {geometry}
      <meshStandardMaterial color="blue" />
      
      {/* Label above object */}
      {showLabel && (
        <Html position={[0, 1.2, 0]}>
          <div className="object-label">Click to interact</div>
        </Html>
      )}
    </mesh>
  );
};

export default InteractiveObject; // ✅ Ensure default export
