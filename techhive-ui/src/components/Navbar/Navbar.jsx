import React, {useContext} from 'react';
import Logo from '../Logo/Logo';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { UserContext } from '../../UserContext';

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
        {user ? (
          <li onClick={handleLogout}>
            <Link to="/">Logout</Link>
          </li>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
        <li><Link to="/signup">SignUp</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
