import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import WelcomeSection from './components/WelcomeSection/WelcomeSection.jsx';
import WhatWeOffer from './components/WhatWeOffer/WhatWeOffer.jsx';
import Internships from './components/Internships/Internships.jsx';
import Login from './components/Login/Login.jsx';
import SignUp from './components/Signup/Signup.jsx';
import './App.css';
import { UserProvider } from './UserContext.jsx';
import NewInternship from './components/NewInternship/NewInternship.jsx';
import Profile from './components/Profile/Profile.jsx';
import SavedInternships from './components/SavedInternships/SavedInternships.jsx';
import Chat from './components/Chat/Chat.jsx';
import LoadingState from './components/LoadingState/LoadingState.jsx';
import Footer from './components/Footer/Footer.jsx';

function App() {
  const [tooltipText, setTooltipText] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading process with a 3-second delay
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, []);

  const handleTooltip = (event, text) => {
    setTooltipText(text);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const hideTooltip = () => {
    setTooltipText('');
  };

  return (
    <UserProvider>
      <Router>
        {/* Show the loading state if isLoading is true */}
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
          <Navbar />
          <Routes>
            <Route path="/" element={<div><WelcomeSection /><WhatWeOffer /> <Footer /> </div>} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/new-internship" element={<NewInternship />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/saved-internships" element={<SavedInternships />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
          {tooltipText && (
        <div className="custom-tooltip" style={{ top: tooltipPosition.y, left: tooltipPosition.x }}>
          {tooltipText}
        </div>
        )}
        </>
      )}
      </Router>
    </UserProvider>
  );
}

export default App;
