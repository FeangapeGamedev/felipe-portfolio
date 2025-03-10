import React, { useState } from "react";
import "../styles/ProjectDetails.css"; // Ensure this file exists

const ProjectDetails = ({ project, onClose, onBack, disableBackButton }) => {
  const categories = [
    { id: "overview", label: "Overview" },
    { id: "my_contributions", label: "My Contributions" },
    { id: "media", label: "Media" }
  ];

  const [activeCategory, setActiveCategory] = useState("overview");
  const [selectedContribution, setSelectedContribution] = useState(null);

  return (
    <div className="overlay">
      <div className="project-details-container">
        {/* Header */}
        <div className="project-details-header">
          {project.title}
          <div className="header-buttons">
            {!disableBackButton && (
              <button onClick={onBack} className="back-button">← Back</button>
            )}
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
                onClick={() => {
                  setActiveCategory(category.id);
                  setSelectedContribution(null); // Reset selection when switching categories
                }}
              >
                {category.label}
              </div>
            ))}
          </div>

          {/* Right Panel - Content Display */}
          <div className="content-display">
            <div className="scrollable-content">

              {/* 🔹 Overview - Video on Top, Text Below */}
              {activeCategory === "overview" && (
                <div className="overview-container">
                  {project.overview_media && (
                    <div className="overview-media">
                      {project.overview_media.includes("youtube.com") ? (
                        <>
                          <iframe
                            width="560"
                            height="315"
                            src={project.overview_media.replace("watch?v=", "embed/")}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>

                          {/* 🔹 Show Disclaimer Below the Video */}
                          {project.disclaimer && (
                            <p className="video-disclaimer">{project.disclaimer}</p>
                          )}
                        </>
                      ) : project.overview_media.endsWith(".mp4") ? (
                        <video controls>
                          <source src={project.overview_media} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img src={project.overview_media} alt="Overview" />
                      )}
                    </div>
                  )}

                  {/* ✅ Overview Text (Keeps the fix for line breaks) */}
                  <div className="overview-text">
                    {project.overview.split("\n").map((line, index) =>
                      line.trim() !== "" ? <p key={index}>{line}</p> : <br key={index} />
                    )}
                  </div>
                </div>
              )}

              {/* 🔹 My Contributions List */}
              {activeCategory === "my_contributions" && !selectedContribution && (
                <div>
                  <ul className="contributions-list">
                    {Object.keys(project.my_contributions).map((key) => {
                      const contribution = project.my_contributions[key];
                      return (
                        <li key={key} className="contribution-item" onClick={() => setSelectedContribution(contribution)}>
                          {/* ✅ Use h4 for title */}
                          <h4 className="contribution-title">{contribution.title}</h4>
                          <p>{contribution.short_description}</p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* 🔹 Detailed Contribution View - Alternating Text & Media */}
              {selectedContribution && (
                <div className="contribution-details">
                  <button className="back-to-contributions" onClick={() => setSelectedContribution(null)}>← Back to Contributions</button>

                  {/* ✅ Change title to h4 */}
                  <h4 className="contribution-title">{selectedContribution.title}</h4>

                  {selectedContribution.content.map((section, index) => (
                    <div key={index} className="contribution-section">
                      {section.type === "text" && <p>{section.value}</p>}
                      {section.type === "image" && <img src={section.value} alt={selectedContribution.title} />}
                      {section.type === "video" && (
                        <video controls>
                          <source src={section.value} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 🔹 Media Section */}
              {activeCategory === "media" && (
                <div>
                  <img src={project.media} alt="Project Media" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
