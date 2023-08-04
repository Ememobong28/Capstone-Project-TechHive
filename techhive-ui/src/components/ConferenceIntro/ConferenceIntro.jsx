import React from 'react';
import './ConferenceIntro.css';

const ConferenceIntro = () => {
  return (
    <div className="conference-intro-container">
     <div className="stickers-container">
        <div className="sticker sticker-1">
          <img src="/afrotech.jpg" alt="Afrotech" />
        </div>
        <div className="sticker sticker-2">
          <img src="/NSBE.png" alt="NSBE" />
        </div>
        <div className="sticker sticker-3">
          <img src="/Tapia.png" alt="Tapia" />
        </div>
        <div className="sticker sticker-4">
          <img src="/Codepath.webp" alt="Codepath Summit" />
        </div>
        <div className="sticker sticker-5">
          <img src="/GraceHopper.jpg" alt="Gracehopper" />
        </div>
        <div className="sticker sticker-6">
          <img src="/Colorstack.png" alt="Colorstack" />
        </div>
      </div>
        <div className="intro-text">
        <h2>Welcome to Tech Conferences</h2>
        <p>Check out the Afrotech video below to get a glimpse of the exciting world of tech conferences!</p>
      </div>
      <div className="video-container">
        <iframe
          width="640"
          height="360"
          src="https://www.youtube.com/embed/nRSCdsF6iiQ?autoplay=1&loop=1&playlist=nRSCdsF6iiQ&mute=1"
          title="Afrotech Video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>
      <div className="call-to-action">
        <p>Explore more tech conferences and stay up-to-date with the latest events.</p>
        <button className="explore-button">Explore Conferences</button>
      </div>
    </div>
  );
}

export default ConferenceIntro;
