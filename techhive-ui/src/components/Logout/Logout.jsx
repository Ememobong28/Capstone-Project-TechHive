import React, { useContext } from 'react';
import { UserContext } from '../../UserContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LogoutButton = styled.button`
    border: none;
    border-radius: 30px;
    padding: 10px 20px;
    color: #333333;
    background-color: #d1a0f8;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-family: montserrat;
    font-weight: bold;
    font-size: 14px;

    &:hover {
        background-color:#cb91f8;
    }
`;

const Logout = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <LogoutButton onClick={handleLogout}>
      Logout
    </LogoutButton>
  );
};

export default Logout;
