import React, { useContext } from 'react';
import { UserContext } from '../../UserContext';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);

    localStorage.removeItem('user');

    navigate('/');
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}

export default Logout;