import { useState } from "react";
import "../styles/Inventory.css";

const tools = [
  { 
    name: "Unity", 
    icon: <img src={`${import.meta.env.BASE_URL}U_Logo_Small_White_RGB_1C.webp`} alt="Unity" className="tool-icon" />, 
    description: "Advanced Unity development, specializing in C# and gameplay mechanics." 
  },
  { 
    name: "Three.js", 
    icon: <img src={`${import.meta.env.BASE_URL}ThreeJSLogo.svg`} alt="Three.js" className="tool-icon" loading="lazy" />, 
    description: "Developing interactive 3D experiences on the web using Three.js." 
  },
  { 
    name: "Unreal Engine", 
    icon: <img src={`${import.meta.env.BASE_URL}UE-Logotype-2023-Vertical-White.webp`} alt="Unreal Engine" className="tool-icon" loading="lazy" />, 
    description: "Familiar with Unreal Engine, including C++ and Blueprint scripting." 
  },
  { 
    name: "VR Development", 
    icon: <img src={`${import.meta.env.BASE_URL}head_mounted_device_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.webp`} alt="VR Development" className="tool-icon" loading="lazy" />, 
    description: "Building interactive VR applications with Unity and Unreal Engine." 
  },
  { 
    name: "3D Modeling", 
    icon: <img src={`${import.meta.env.BASE_URL}blender_logo_no_socket_white.webp`} alt="Blender" className="tool-icon" loading="lazy" />, 
    description: "Creating and optimizing 3D assets using Blender." 
  }
];

const Inventory = ({ onClose }) => {
  const [selectedTool, setSelectedTool] = useState(null);

  const aboutMe = (
    <p>
      I am a versatile Game Designer with strong programming and 3D modeling skills, dedicated to crafting immersive and engaging player experiences.
      I love playing and creating games, designing deep systems, gameplay, and storytelling. My favorite genres are RPGs, stealth, survival, and adventure games, where mechanics and narratives come together to create unforgettable moments.
    </p>
  );

  return (
    <div className="inventory-container">
      {/* Upper Ribbon */}
      <div className="inventory-ribbon">
        <span>INVENTORY</span>
        <button className="close-button" onClick={onClose}>X</button>
      </div>

      {/* Main Layout: Avatar & Tools */}
      <div className="inventory-main">
        {/* Left Column: Avatar & Active Skills */}
        <div className="left-column">
          <div className="frame-container avatar-frame" onClick={() => setSelectedTool(null)}>
            <h4 className="frame-title">Avatar</h4>
            <img 
              src={`${import.meta.env.BASE_URL}pxArt.webp`} 
              alt="Avatar" 
              className="avatar-img" 
              loading="lazy" 
            />
          </div>

          <div className="frame-container active-skills-container">
            <h4 className="frame-title">Active Skills</h4>
            <ul className="active-skills-list">
              {["Game Design", "System Design", "User Experience Design", "Gameplay Programming", "Modeling"].map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Tools Section */}
        <div className="right-column">
          <div className="frame-container tools-frame">
            <h4 className="frame-title">Tools</h4>
            <div className="tools-grid">
              {tools.map((tool) => (
                <div key={tool.name} className="tool-item" onClick={() => setSelectedTool(tool)}>
                  {tool.icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="frame-container description-frame">
        <h4 className="frame-title">Description</h4>
        <div className="description-content">
          {selectedTool ? <p>{selectedTool.description}</p> : aboutMe}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
