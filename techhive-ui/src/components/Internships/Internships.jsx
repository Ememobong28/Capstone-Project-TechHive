import React, { useEffect, useState } from 'react';
import './Internships.css';

function Internships() {
  const [internships, setInternships] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await fetch('http://localhost:3000/internships');
        const data = await response.json();
        setInternships(data);
      } catch (error) {
        console.error('Error fetching internships:', error);
      }
    };

    fetchInternships();
  }, []);

  const handleInternshipClick = (link) => {
    window.open(link, '_blank');
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredInternships = internships.filter((internship) =>
    internship.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="internships-container">
      <h2>Internships</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search internships..."
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>
      <div className="internship-cards">
        {filteredInternships.map((internship) => (
          <div
            className="internship-card"
            key={internship.id}
            onClick={() => handleInternshipClick(internship.link)}
          >
            <img
            //   src={internship.picture}
            //   alt={internship.title}
              className="internship-image"
            />
            <div className="internship-details">
              <h3>{internship.title}</h3>
              <p>{internship.description}</p>
              <a href={internship.link} target="_blank" rel="noopener noreferrer">
                Learn More
              </a>
              <p className="company">Company: {internship.company}</p>
              <p className="category">Category: {internship.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Internships;
