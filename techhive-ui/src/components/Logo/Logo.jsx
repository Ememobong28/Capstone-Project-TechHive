import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.css';

function Logo() {
  return (
    <div className="logo-container">
      <Link to="/">
        <img src="/Logo.png" alt="Techhive Logo" className="logo-image" />
      </Link>
    </div>
  );
}
export default Logo;
