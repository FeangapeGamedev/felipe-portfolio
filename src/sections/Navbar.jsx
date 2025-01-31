import React from "react";
import "../styles/Navbar.css"; // ✅ Import external styles

const Navbar = () => {
  return (
    <div className="navbar">
      <span className="">Felipe A. Garcia</span>
      <nav>
        <ul className="text-xs">
          <li><a href="#about">About</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#education">Education</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href=""></a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
