import React from "react";
import "../styles/Projects.css"; // ✅ Make sure this file exists

const Projects = ({ onClose }) => {
  const projects = [
    {
      id: 1,
      title: "Project Name",
      description: "Short description here.",
      image: "/path-to-project-image.jpg", // ✅ Replace with actual image path
      link: "#", // ✅ Link to project details
    },
    {
      id: 2,
      title: "Project Name",
      description: "Short description here.",
      image: "/path-to-project-image.jpg", // ✅ Replace with actual image path
      link: "#", // ✅ Link to project details
    },
    {
      id: 3,
      title: "Project Name",
      description: "Short description here.",
      image: "/path-to-project-image.jpg", // ✅ Replace with actual image path
      link: "#", // ✅ Link to project details
    },
    {
      id: 4,
      title: "Project Name",
      description: "Short description here.",
      image: "/path-to-project-image.jpg", // ✅ Replace with actual image path
      link: "#", // ✅ Link to project details
    },
    
  ];

  return (
    <div className="projects-container">
      {/* Header */}
      <div className="projects-header">
        Projects
        <button onClick={onClose} className="close-button">✖</button>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {projects.map((project) => (
          <a key={project.id} href={project.link} className="project-frame">
            <img src={project.image} alt={project.title} className="project-image" />
            <span className="project-title">{project.title}</span>
            <span className="project-description">{project.description}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Projects;
