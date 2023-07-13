import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import WelcomeSection from './components/WelcomeSection/WelcomeSection.jsx';
import WhatWeOffer from './components/WhatWeOffer/WhatWeOffer.jsx';
import Internships from './components/Internships/Internships.jsx';
import Login from './components/Login/Login.jsx';
import SignUp from './components/Signup/Signup.jsx';
import './App.css';
import { UserProvider } from './UserContext.jsx';

function App() {
  return (
    <UserProvider>
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<div><WelcomeSection /><WhatWeOffer /></div>} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/login" element ={<Login />} />
          <Route path="/signup" element ={<SignUp />} />
        </Routes>
      </div>
    </Router>
    </UserProvider>
  );
}

export default App;
