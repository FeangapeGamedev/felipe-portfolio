import React from "react";
import "../styles/Navbar.css"; // ✅ Import external styles

const Navbar = ({ onAboutClick }) => {
  return (
    <div className="navbar">
      <span>
        Felipe A. Garcia <br /> Game Developer Portfolio
      </span>
      <nav>
        <ul className="text-xs">
          <li><a href="#" onClick={(e) => { e.preventDefault(); onAboutClick(); }}>About</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
