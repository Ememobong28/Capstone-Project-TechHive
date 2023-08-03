import React from 'react';
import './LoadingState.css';

const LoadingState = () => {
  return (
    <div className="loading-container">
      <div className="loading-balls">
        <div className="ball ball1"></div>
        <div className="ball ball2"></div>
        <div className="ball ball3"></div>
      </div>
      <div className="loading-text">Just a sec, we're getting ready to amaze you!</div>
      <div className="loading-tooltip">Hang tight, something fantastic is on its way!</div>
    </div>
  );
};

export default LoadingState;
