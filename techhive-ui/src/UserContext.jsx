import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const localUser = localStorage.getItem('user');
      return localUser ? JSON.parse(localUser) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  });

  const setValue = (newUser) => {
    try {
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Error setting user to localStorage:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: setValue }}>
      {children}
    </UserContext.Provider>
  );
};