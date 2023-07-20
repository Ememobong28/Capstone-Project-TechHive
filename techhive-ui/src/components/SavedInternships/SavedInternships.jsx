import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './SavedInternships.css';
import { UserContext } from '../../UserContext.jsx';
import "../Internships/Internships.css"


function SavedInternships() {
    const [savedInternships, setSavedInternships] = useState([]);
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    
    useEffect(() => {
        const fetchSavedInternships = async () => {
          try {
            const response = await fetch(`http://localhost:3000/users/${user.id}/saved-internships`, {
                method: 'GET',
                headers: {
                      'Content-Type': 'application/json',
             },
          });
            const data = await response.json();
            setSavedInternships(data);
          } catch (error) {
            console.error('Error fetching saved internships:', error);
          }
        };
      
        fetchSavedInternships();
      },[],[user.id]);

       
    
    // Function to handle clicking on a saved internship
    const handleInternshipClick = (link) => {
      window.open(link, '_blank');
    };
  
    return (
        <div className="internships-container">
          <h2>Saved Internships</h2>
          <div className="internship-cards">
            {savedInternships.length > 0 ? (
              savedInternships.map((internship) => (
                <div
                  className="internship-card"
                  key={internship.id}
                  onClick={() => handleInternshipClick(internship.link)}
                >
                  <img
                    src={`http://localhost:3000/images/${internship.picture}`}
                    className="internship-image"
                    alt="Internship"
                  />
                  <div className="internship-details">
                    <h3>{internship.title}</h3>
                    <p>{internship.description}</p>
                    <a href={internship.link} target="_blank" rel="noopener noreferrer">
                      Learn More
                    </a>
                    <p className="company">Company: {internship.company}</p>
                    <p className="category">Category: {internship.category.join(', ')}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No saved internships found.</p>
            )}
          </div>
          <button onClick={() => navigate('/internships')} className='back'>Back to Internships</button>
        </div>
      );
      
        
}
  
  export default SavedInternships;
  