import React from "react";
import "../styles/Navbar.css";

const Navbar = ({ onInventoryClick, onProjectsClick, onContactClick }) => {
  return (
    <div className="navbar">
      <span>Felipe Garcia <br /> Game Designer</span>
      <div className="navbar-buttons">
        <ul>
          <li>
            <a role="button" className="about-button" onClick={onInventoryClick}>
              About
            </a>
          </li>
          <li>
            <a role="button" className="projects-button" onClick={onProjectsClick}>
              Projects
            </a>
          </li>
          <li>
            <a role="button" className="contact-button" onClick={onContactClick}>
              Contact
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
