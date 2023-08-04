import React, { useEffect, useState, useContext, createContext } from 'react';
import { AiFillHeart, AiOutlineHeart} from 'react-icons/ai';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import './Internships.css';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { UserContext } from '../../UserContext.jsx';
import { Link } from 'react-router-dom';

Modal.setAppElement('#root');

export const RefreshContext = createContext();

function Internships() {
  const [internships, setInternships] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const { user } = useContext(UserContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [refreshData, setRefreshData] = useState(false); 
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsOpen(true);
    }
  }, [user]);

  const closeModal = () => {
    setIsOpen(false);
    navigate('/');
  };

  const showSaveNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000); 
  };


  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await fetch('http://localhost:3000/internships');
        const data = await response.json();
        data.forEach(internship => {
        });
        setInternships(data);
      } catch (error) {
        console.error('Error fetching internships:', error);
      }
    };

    fetchInternships();
  }, [refreshData]);

  const handleInternshipClick = (link) => {
    window.open(link, '_blank');
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
    setFilterValue('');
  };

  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value);
  };

  const filterInternships = (internship) => {
    if (filterType === 'company') {
      return internship.company.toLowerCase().includes(filterValue.toLowerCase());
    } else if (filterType === 'category') {
      return internship.category.includes(filterValue);
    }
    return true; 
  };

  const filteredInternships = internships.filter((internship) =>
    internship.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    filterInternships(internship)
  );

  const handleLikeClick = async (event, internship) => {
    event.stopPropagation();
    try {
      const response = await fetch(`http://localhost:3000/api/like-internships/${internship.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });
  
      if (response.ok) {
        // Create a new object with updated isLiked state
        const updatedInternship = { ...internship, isLiked: !internship.isLiked };
        // Find the index of the internship in the state array
        const internshipIndex = internships.findIndex((i) => i.id === internship.id);
        // Create a new array with the updated internship object
        const updatedInternships = [...internships];
        updatedInternships[internshipIndex] = updatedInternship;
        // Update the state with the new array
        setInternships(updatedInternships);
      } else {
        console.error('Error liking internship.');
      }
    } catch (error) {
      console.error('Error liking internship:', error);
    }
  };
  
  

  const handleSaveClick = async (event, internship) => {
    event.stopPropagation();
    try {
      if (internship.isSaved) {
        await fetch(`http://localhost:3000/internships/${internship.id}/save`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        });
  
          
        const updatedInternships = internships.map(i => 
          i.id === internship.id ? { ...i, isSaved: false } : i
        );
        setInternships(updatedInternships);
      } else {
        await fetch(`http://localhost:3000/internships/${internship.id}/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        });

        // After saving the internship, update the localStorage
        const savedInternships = JSON.parse(localStorage.getItem('savedInternships')) || [];
        savedInternships.push(internship.id);
        localStorage.setItem('savedInternships', JSON.stringify(savedInternships));

        // Show the notification
        showSaveNotification();

        // Update the isSaved property in the state immediately
        const updatedInternships = internships.map((i) =>
          i.id === internship.id ? { ...i, isSaved: true } : i
        );
        setInternships(updatedInternships);
      }
    } catch (error) {
      console.error('Error saving internship:', error);
    }
  };

  useEffect(() => {
    // Load saved internships from localStorage
    const savedInternships = JSON.parse(localStorage.getItem('savedInternships')) || [];

    // Update the isSaved property for each internship
    const updatedInternships = internships.map((internship) => ({
      ...internship,
      isSaved: savedInternships.includes(internship.id),
    }));

    setInternships(updatedInternships);
  }, []);

  const handleRecommendationClick = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/recommendations/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Recommendation email sent successfully!');
      } else {
        console.error('Error sending recommendation email.');
      }
    } catch (error) {
      console.error('Error sending recommendation email:', error);
    }
  };
  
return (
  <RefreshContext.Provider value={setRefreshData}>
    <div className="internships-container">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="Modal"
        overlayClassName="Modal-overlay"
        contentLabel="Signup/Login Modal"
      >
        <h2>Please Login or Sign-Up😊</h2>
        <div className="modal-buttons">
          <button className="modal-button modal-button-close" onClick={closeModal}>Close</button>
          <button className="modal-button modal-button-login" onClick={() => navigate('/login')}>Log In</button>
          <button className="modal-button modal-button-signup" onClick={() => navigate('/signup')}>Sign Up</button>
       </div>
      </Modal>
      <h2>Internships</h2>
      <div className="search-new-container">
       <input
         type="text"
         placeholder="Search internships..."
         value={searchQuery}
         onChange={handleSearchInputChange}
         className="search-input"
       />
       <div className="filter-container">
            <select value={filterType} onChange={handleFilterTypeChange} className="filter-dropdown">
              <option value="all">All</option>
              <option value="company">Company</option>
              <option value="category">Category</option>
            </select>
            {filterType !== 'all' && (
              <input
                type="text"
                placeholder={`Filter by ${filterType}...`}
                value={filterValue}
                onChange={handleFilterValueChange}
                className="filter-input"
              />
            )}
          </div>
     <Link to="/new-internship">
      <button className='new-internships'>Post a New Internship</button>
    </Link>
    <button className="recommend-button" onClick={handleRecommendationClick}>
            Get Internship Recommendations
    </button>
   </div>
      <div className="internship-cards">
        {filteredInternships.map((internship) => (
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
            <button className="like-button" onClick={(event) => handleLikeClick(event, internship)}>
              {internship.isLiked ? <AiFillHeart color="red"/> : <AiOutlineHeart />}
            </button>

            <button className="save-button" onClick={(event) => handleSaveClick(event, internship)}>
                {internship.isSaved ? <FaBookmark color="black" /> : <FaRegBookmark />}
              </button>
          </div>
        ))}
      </div>
      <div className="notification" style={{ display: showNotification ? 'block' : 'none' }}>
          Internship has been saved!
        </div>
    </div>
  </RefreshContext.Provider>
  );
}

export default Internships;