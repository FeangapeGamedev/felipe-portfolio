import { useState } from "react";
import "../styles/Inventory.css";

const skills = [
  { name: "Unity", icon: "🛠️", description: "Advanced experience in Unity development, specializing in C# and gameplay mechanics." },
  { name: "Three.js", icon: "🌐", description: "Developing interactive 3D experiences on the web using Three.js." },
  { name: "Unreal Engine", icon: "🎮", description: "Familiarity with Unreal Engine, including C++ and Blueprint scripting." },
  { name: "Game Design", icon: "📜", description: "Experienced in designing engaging gameplay mechanics and immersive player experiences." },
  { name: "UI/UX", icon: "🖥️", description: "Designing and implementing user interfaces and experiences for games." },
  { name: "VR Development", icon: "🕶️", description: "Building interactive VR applications with Unity and Unreal Engine." },
  { name: "3D Modeling", icon: "🎨", description: "Creating and optimizing 3D assets using Blender." }
];

const Inventory = ({ onClose }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const aboutMe = (
    <>
      <p><strong>Felipe Andres Garcia Pereira</strong></p>
      <p>Game Designer | Unity Specialist | Versatile Game Developer</p>
      <p>3+ years of experience in Unity development, game design, and programming.</p>
      <p>Skilled in creating engaging gameplay, VR development, and UI/UX design.</p>
      <p>Proficient in C#, C++, Unreal Blueprints, and various game development tools.</p>
    </>
  );

  return (
    <div className="inventory-container">
      {/* Upper Ribbon */}
      <div className="inventory-ribbon">
        <span>Inventory</span>
        <button className="close-button" onClick={onClose}>X</button>
      </div>

      {/* Main Section: Avatar & Skills */}
      <div className="inventory-main">
        {/* Avatar Frame (Clickable to Show About Me) */}
        <div className="avatar-frame" onClick={() => setSelectedSkill(null)}>
          <img src="/profile.jpg" alt="Avatar" className="avatar-img" />
        </div>

        {/* Skills Section */}
        <div className="skills-frame">
          <div className="skills-grid">
            {skills.map((skill) => (
              <div key={skill.name} className="skill-item" onClick={() => setSelectedSkill(skill)}>
                {skill.icon}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Description Box */}
      <div className="description-frame">
        {selectedSkill ? <p>{selectedSkill.description}</p> : aboutMe}
      </div>
    </div>
  );
};

export default Inventory;
