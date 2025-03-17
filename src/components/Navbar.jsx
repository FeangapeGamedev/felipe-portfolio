import React from "react";
import "../styles/Navbar.css";

const Navbar = ({ onInventoryClick, onProjectsClick, onContactClick }) => {
  return (
    <div className="navbar">
      <span>Felipe Garcia <br /> Game Designer</span>
      <nav>
        <ul className="text-xs">
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
      </nav>
    </div>
  );
};

export default Navbar;
