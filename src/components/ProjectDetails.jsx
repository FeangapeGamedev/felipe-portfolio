import React, { useState } from "react";
import "../styles/ProjectDetails.css"; 

const ProjectDetails = ({ project, onClose, onBack, disableBackButton }) => {
  const categories = [
    { id: "overview", label: "Overview" },
    { id: "my_contributions", label: "My Contributions" },
    { id: "media", label: "Media" }
  ];

  const [activeCategory, setActiveCategory] = useState("overview");
  const [selectedContribution, setSelectedContribution] = useState(null);

  const renderTextWithFormatting = (text) => {
    const lines = text.split("\n");
    return lines.map((line, index) => {
      if (line.trim() === "") {
        return <br key={index} />;
      }
      const formattedLine = line
        .replace(/#### (.*)/g, "<h4>$1</h4>") 
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return <p key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />;
    });
  };

  return (
    <div className="safe-area">
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
                    setSelectedContribution(null);
                  }}
                >
                  {category.label}
                </div>
              ))}
            </div>

            {/* Right Panel - Content Display */}
            <div className="content-display">
              <div className="scrollable-content">
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

                            {project.disclaimer && (
                              <p className="video-disclaimer">{project.disclaimer}</p>
                            )}
                          </>
                        ) : project.overview_media.endsWith(".mp4") ? (
                          <video controls preload="metadata">
                            <source src={project.overview_media} type="video/mp4" />
                          </video>
                        ) : (
                          <img src={project.overview_media} alt="Overview" loading="lazy" />
                        )}
                      </div>
                    )}

                    <div className="overview-text">
                      {renderTextWithFormatting(project.overview)}
                    </div>
                  </div>
                )}

                {activeCategory === "my_contributions" && !selectedContribution && (
                  <div>
                    <ul className="contributions-list">
                      {Object.keys(project.my_contributions).map((key) => {
                        const contribution = project.my_contributions[key];
                        return (
                          <li key={key} className="contribution-item" onClick={() => setSelectedContribution(contribution)}>
                            <h4 className="contribution-title">{contribution.title}</h4>
                            <p>{contribution.short_description}</p>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {selectedContribution && (
                  <div className="contribution-details">
                    <button className="back-to-contributions" onClick={() => setSelectedContribution(null)}>← Back to Contributions</button>
                    <h4 className="contribution-title">{selectedContribution.title}</h4>

                    {selectedContribution.content.map((section, index) => (
                      <div key={index} className="contribution-section">
                        {section.type === "text" && renderTextWithFormatting(section.value)}
                        {section.type === "image" && <img src={section.value} alt={selectedContribution.title} loading="lazy" />}
                        {section.type === "video" && (
                          <video controls preload="metadata">
                            <source src={section.value} type="video/mp4" />
                          </video>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activeCategory === "media" && (
                  <div>
                    <div className="media-link">
                      <a href="https://www.youtube.com/playlist?list=PLFZuofY8ahtdBD438Uat_QqovD9h6tLpz" target="_blank" rel="noopener noreferrer">
                        Watch more on YouTube
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
