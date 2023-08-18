import React, { useContext, useState } from 'react';
import Logo from '../Logo/Logo';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { UserContext } from '../../UserContext';
import { FaUserCircle } from 'react-icons/fa';
import Logout from '../Logout/Logout';
import { FaBookmark } from 'react-icons/fa';
import { FaComments } from 'react-icons/fa';
import styled from 'styled-components';

export const ProfilePic = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 10px;
`;

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
        <li><Link to="/colorstack-community">Colorstack Community</Link></li>
      </ul>
      <div className="auth-container">
      {user ? ( 
          <>
          <div className='logged'>
            <button title = "Messages" className='chat'><Link to="/chat"><FaComments size={20} color='black' /></Link></button>
            <button onClick={toggleDropdown} className="profile-icon" title="Profile">
                {user.profilePicture ? (
                  <ProfilePic src={`http://localhost:3000/profile/picture/${user.id}`} alt="Profile" />
                ) : (
                  <FaUserCircle />
                )}
              </button>
            {dropdownVisible && (
              <div className="dropdown-menu">
                <Link onClick={toggleDropdown} className="dropdown-item" to="/profile">Profile</Link>
                <Link onClick={toggleDropdown} className="dropdown-item" to="/saved-internships"> <FaBookmark /> Saved Internships</Link>
              </div>
            )}
            <Logout /> 
            </div>
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
