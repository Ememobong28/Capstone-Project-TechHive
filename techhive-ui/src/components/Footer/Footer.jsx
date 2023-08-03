import React from 'react';
import './Footer.css';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src="/logo.png" alt="TechHive Logo" />
        </div>
        <div className="footer-links">
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Contact Us</a>
        </div>
        <div className="footer-social">
          <a href="#" target="_blank" rel="noopener noreferrer" className="facebook">
            <FaFacebook />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="twitter">
            <FaTwitter />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="instagram">
            <FaInstagram />
          </a>
        </div>
      </div>
      <div className="footer-contact">
        <p>Contact Us:</p>
        <p>Email: techhivewebsite@gmail.com</p>
        <p>Phone: (704) 913-0099</p>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} TechHive. All rights reserved.</p>
        <p>
          <a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a> | <a href="#">Contact Us</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
