import React from "react";
import "../styles/Navbar.css"; // ✅ Import external styles

const Navbar = ({ onInventoryClick, onProjectsClick, onContactClick }) => {
  return (
    <div className="navbar">
      <span>Felipe Garcia <br /> Game Designer</span>
      <nav>
        <ul className="text-xs">
          <li>
            <a 
              href="#" 
              className="about-button" // ✅ Keep class as "about-button"
              onClick={(e) => { 
                e.preventDefault(); 
                console.log("🔍 About (Inventory) Button Clicked!"); // ✅ Log for clarity
                onInventoryClick(); // ✅ Still calls inventory function
              }}
            >
              About
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="projects-button"
              onClick={(e) => { 
                e.preventDefault(); 
                console.log("🔍 Projects Button Clicked!");
                onProjectsClick();
              }}
            >
              Projects
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="contact-button"
              onClick={(e) => { 
                e.preventDefault(); 
                console.log("🔍 Contact Button Clicked!");
                onContactClick();
              }}
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
