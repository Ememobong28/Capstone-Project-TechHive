import React, { useEffect, useState, useContext, createContext } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
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
  const { user } = useContext(UserContext);
  const [modalIsOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [refreshData, setRefreshData] = useState(false); 

  useEffect(() => {
    if (!user) {
      setIsOpen(true);
    }
  }, [user]);

  const closeModal = () => {
    setIsOpen(false);
    navigate('/');
  };


  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await fetch('http://localhost:3000/internships');
        const data = await response.json();
        data.forEach(internship => {
          internship.isLiked = false; 
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

  const filteredInternships = internships.filter((internship) =>
    internship.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLikeClick = (event, internship) => {
    event.stopPropagation(); 
    internship.isLiked = !internship.isLiked;
    setInternships([...internships]);
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
     <Link to="/new-internship">
      <button className='new-internships'>Post a New Internship</button>
    </Link>
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
          </div>
        ))}
      </div>
    </div>
  </RefreshContext.Provider>
  );
}

export default Internships;
