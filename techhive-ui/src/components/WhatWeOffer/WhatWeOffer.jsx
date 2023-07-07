import React from 'react';
import Slider from 'react-slick';
import './WhatWeOffer.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function WhatWeOffer() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <section className="what-we-offer-section">
      <h2 className="section-heading">What We Offer</h2>
      <div className="offer-card">
        <div className="offer-content">
          <img src="/Internships.png" alt="Internships" className="offer-image" />
          <div className="offer-text">
            <h3>Find Internship Opportunities</h3>
            <p>Discover a wide range of internship opportunities in the tech field. Explore internships specifically tailored for different academic years, including options for freshmen, sophomores, juniors, and seniors.</p>
          </div>
        </div>
      </div>
      <div className="offer-card">
        <Slider {...settings}>
          <div>
            <div className="offer-content">
              <img src="/NSBE.png" alt="Conference 1" className="offer-image" />
              <div className="offer-text">
                <h3>Discover Conferences</h3>
                <p>Explore and learn from tech conferences and events happening worldwide. Find conferences focused on various tech domains, including web development, artificial intelligence, cybersecurity, and more.</p>
                <p>Like NSBE Conference, AfroTech, and so much more</p>
              </div>
            </div>
          </div>
          <div>
            <div className="offer-content">
              <img src="/afrotech.jpg" alt="Conference 2" className="offer-image" />
              <div className="offer-text">
                <h3>Discover Conferences</h3>
                <p>Explore and learn from tech conferences and events happening worldwide. Find conferences focused on various tech domains, including web development, artificial intelligence, cybersecurity, and more.</p>
                <p>Like NSBE Conference, AfroTech, and so much more</p>
              </div>
            </div>
          </div>
          <div>
            <div className="offer-content">
              <img src="/Codepath.webp" alt="Conference 3" className="offer-image" />
              <div className="offer-text">
                <h3>Discover Conferences</h3>
                <p>Explore and learn from tech conferences and events happening worldwide. Find conferences focused on various tech domains, including web development, artificial intelligence, cybersecurity, and more.</p>
                <p>Like NSBE Conference, AfroTech, and so much more</p>
              </div>
            </div>
          </div>
        </Slider>
      </div>
      <div className="offer-card">
        <div className="offer-content">
          <img src="/Programs Codepath.png" alt="Programs" className="offer-image" />
          <div className="offer-text">
            <h3>Explore Programs</h3>
            <p>Explore and learn from tech conferences and events happening worldwide. Connect with industry leaders, attend workshops, and gain insights into the latest advancements in the tech industry.</p>
            <p>What if you don't get an internship?,that's fine!, lets grow our skills, take a codepath course, do a mentorship program etc</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhatWeOffer;
