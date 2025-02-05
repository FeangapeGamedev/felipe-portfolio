import React from "react";
import "../styles/Navbar.css"; // ✅ Import external styles

const Navbar = ({ onAboutClick, onContactClick }) => {
  return (
    <div className="navbar">
      <span>
        Felipe Garcia <br /> Game Designer
      </span>
      <nav>
        <ul className="text-xs">
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onAboutClick();
              }}
            >
              About
            </a>
          </li>
          <li>
            <a href="#projects">Projects</a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                console.log("Contact button clicked!"); // ✅ Debug log
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
