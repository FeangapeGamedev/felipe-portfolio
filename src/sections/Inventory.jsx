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
    <p>
      I am versatile Game Designer with strong programming and 3D modeling skills, dedicated to crafting immersive and engaging player experiences.
      I love playing and creating games, designing deep systems, gameplay, and storytelling. My favorite genres are RPGs, stealth, survival, and adventure games, where mechanics and narratives come together to create unforgettable moments.
    </p>
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
        <div className="frame-container">
          <p className="frame-title">Avatar</p>
          <div className="avatar-frame" onClick={() => setSelectedSkill(null)}>
            <img src="/profile.jpg" alt="Avatar" className="avatar-img" />
          </div>
        </div>

        {/* Skills Section */}
        <div className="frame-container">
          <p className="frame-title">Skills</p>
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
      </div>

      {/* Bottom Description Box */}
      <div className="frame-container">
        <p className="frame-title">Description</p>
        <div className="description-frame">
          {selectedSkill ? <p>{selectedSkill.description}</p> : aboutMe}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
