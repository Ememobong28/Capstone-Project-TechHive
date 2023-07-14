import React, { useContext } from 'react';
import Logo from '../Logo/Logo';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { UserContext } from '../../UserContext';
import { FaUserCircle } from 'react-icons/fa'; // import the icon

function Navbar() {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  }

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
        {user && <FaUserCircle className="profile-icon"/>}
        <div className="auth-links">
          {user ? (
            <span onClick={handleLogout}>
              <Link to="/">Logout</Link>
            </span>
          ) : (
            <>
              <span><Link to="/login">Login</Link></span>
              <span><Link to="/signup">SignUp</Link></span>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
