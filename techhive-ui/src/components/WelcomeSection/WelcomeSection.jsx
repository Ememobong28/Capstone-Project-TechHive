import React from 'react';
import './WelcomeSection.css';

function WelcomeSection() {
  return (
    <section className="welcome-section">
      <div className="content-container">
        <div className="animation-container">
          <img src="/Hi Human.png" alt="Animation" className="animation-image" />
        </div>
        <div className="text-container">
          <h1>Hi, Welcome to TechHive 🐝👩‍💻!</h1>
          <p>A streamlined platform for college students in the tech field.</p>
        </div>
      </div>
    </section>
  );
}

export default WelcomeSection;
