import React, { useContext, useState } from 'react';
import Logo from '../Logo/Logo';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { UserContext } from '../../UserContext';
import { FaUserCircle } from 'react-icons/fa';
import Logout from '../Logout/Logout';

const Navbar = () => {
  const { user } = useContext(UserContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <nav className="navbar">
      <Logo />
      <ul className="nav-links">
        <li><Link to="/">Welcome</Link></li>
        <li><Link to="/internships">Internships</Link></li>
        <li><Link to="/conferences">Conferences</Link></li>
        <li><Link to="/programs">Programs</Link></li>
      </ul>
      <div className="auth-container">
      {user ? ( 
          <>
            <button onClick={toggleDropdown} className="profile-icon">
              <FaUserCircle />
            </button>
            {dropdownVisible && (
              <div className="dropdown-menu">
                <Link onClick={toggleDropdown} className="dropdown-item" to="/profile">Profile</Link>
                <Link onClick={toggleDropdown} className="dropdown-item" to="/saved-internships">Saved Internships</Link>
              </div>
            )}
            <Logout />
          </>
        ) : (
          <div className="auth-links">
            <span><Link to="/login">Login</Link></span>
            <span><Link to="/signup">SignUp</Link></span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
