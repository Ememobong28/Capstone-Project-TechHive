import React from 'react';
import Logo from '../Logo/Logo';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Logo />
      <ul className="nav-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">Internships</a></li>
        <li><a href="#">Conferences</a></li>
        <li><a href="#">Programs</a></li>
        <li><a href="#">About</a></li>


        {/* Add more navigation links as needed */}
      </ul>
    </nav>
  );
}

export default Navbar;
