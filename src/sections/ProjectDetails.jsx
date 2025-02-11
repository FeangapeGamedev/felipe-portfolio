import React, { useState } from "react";
import "../styles/ProjectDetails.css"; // ✅ Ensure this file exists

const ProjectDetails = ({ project, onClose, onBack }) => {
  const categories = [
    { id: "overview", label: "Overview" },
    { id: "gameplay", label: "Gameplay" },
    { id: "technology", label: "Technology" },
    { id: "media", label: "Media" },
  ];

  const [activeCategory, setActiveCategory] = useState("overview");

  const content = {
    overview: project.overview || "No overview available.",
    gameplay: project.gameplay || "No gameplay details available.",
    technology: project.technology || "No technology details available.",
    media: project.media || "No media available.",
  };

  return (
    <div className="overlay">
      <div className="project-details-container">
        {/* Header */}
        <div className="project-details-header">
          {project.title}
          <div className="header-buttons">
            <button onClick={onBack} className="back-button">← Back</button>
            <button onClick={onClose} className="close-button">✖</button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="project-details-content">
          {/* Left Panel - Categories */}
          <div className="categories-menu">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`category-item ${activeCategory === category.id ? "active" : ""}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </div>
            ))}
          </div>

          {/* Right Panel - Expands Fully */}
          <div className="content-display">
            <div className="scrollable-content">
              <p>{content[activeCategory]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
