import React from 'react';
import Logo from '../Logo/Logo';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <Logo />
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/internships">Internships</Link></li>
        <li><Link to="/conferences">Conferences</Link></li>
        <li><Link to="/programs">Programs</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;