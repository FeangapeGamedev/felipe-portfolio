import React from "react";
import "../styles/Projects.css";

const Projects = ({ onClose, onProjectClick }) => {
  const projects = [
    {
      id: 1,
      title: "Project One",
      description: "A cool project about...",
      image: "/images/project1.jpg",
      overview: "This is an overview of Project One.",
      gameplay: "Gameplay details for Project One.",
      technology: "Technology stack used in Project One.",
      media: "Screenshots and videos for Project One."
    },
    {
      id: 2,
      title: "Project Two",
      description: "Another awesome project...",
      image: "/images/project2.jpg",
      overview: "Overview of Project Two.",
      gameplay: "How Project Two plays.",
      technology: "Tech used in Project Two.",
      media: "Screenshots/videos from Project Two."
    }
  ];

  const handleProjectClick = (id) => {
    const project = projects.find((project) => project.id === id);
    if (project) {
      onProjectClick(project);
    }
  };

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
          <div
            key={project.id}
            className="project-frame"
            onClick={() => onProjectClick(project)}
          >
            <img src={project.image} alt={project.title} className="project-image" />
            <span className="project-title">{project.title}</span>
            <span className="project-description">{project.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
