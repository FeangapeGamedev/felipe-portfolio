import { useState, useRef, useEffect } from "react";
import "../styles/Inventory.css";

const skills = [
  { name: "Unity", icon: "🛠️", description: "Expert in C# & Unity development." },
  { name: "Three.js", icon: "🌐", description: "Building 3D web experiences." },
  { name: "Blender", icon: "🎨", description: "3D modeling & asset creation." },
  { name: "Wwise", icon: "🎵", description: "Audio integration for games." },
  { name: "Reaper", icon: "🎧", description: "Music & sound editing for interactive media." }
];

const Inventory = ({ onClose }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const inventoryRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth / 2 - 250, // Center horizontally (assuming width ~500px)
    y: window.innerHeight / 2 - 150 // Center vertically (assuming height ~300px)
  });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={inventoryRef}
      className={`inventory-container ${isDragging ? "dragging" : ""}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${position.x}px`, 
        position: "fixed",
        width: "800px",
        height: "640px"
      }}
    >
      <div className="inventory-title-bar" onMouseDown={handleMouseDown}>
        Inventory
        <button className="close-button" onClick={onClose}>X</button>
      </div>
      <div className="inventory-content">
        <div className="inventory">
          {skills.map((skill) => (
            <div key={skill.name} className="skill-item" onClick={() => setSelectedSkill(skill)}>
              {skill.icon}
            </div>
          ))}
        </div>
        <div className="stats">
          {selectedSkill ? <p>{selectedSkill.description}</p> : <p>Select a skill to see details</p>}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
