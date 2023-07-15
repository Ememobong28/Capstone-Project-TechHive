import React, { useContext, useState } from 'react';
import axios from 'axios';
import { RefreshContext } from '../Internships/Internships.jsx'; 
import { useNavigate } from 'react-router-dom';
import './NewInternship.css';
import { IoIosCloseCircleOutline } from 'react-icons/io';

const NewInternship = () => {
  const [internshipData, setInternshipData] = useState({
    title: '',
    link: '',
    description: '',
    company: '',
    category: '',
    picture: null,
  });
  const [errors, setErrors] = useState([]);
  const setRefreshData = useContext(RefreshContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const inputValue = e.target.value.trim();
    
    if (e.target.name === 'category') {
      const categories = inputValue.split(',').map(item => item.trim());
      setInternshipData({ ...internshipData, [e.target.name]: JSON.stringify(categories) });
    } else {
      setInternshipData({ ...internshipData, [e.target.name]: inputValue });
    }
}
  const handleFileChange = (e) => {
    setInternshipData({ ...internshipData, picture: e.target.files[0] });
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(internshipData).forEach(([key, value]) => formData.append(key, value));
    console.log(internshipData);

    try {
      const response = await axios.post('http://localhost:3000/internships', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        alert('Internship submitted successfully!');
        setRefreshData(prev => !prev);
        navigate('/internships');
      }
    } catch (error) {
      if (error.response) {
        // client received an error response (5xx, 4xx)
        const serverErrors = error.response.data.errors;
        const errorMessages = serverErrors.map(err => err.msg);  // Extract error messages
        setErrors(errorMessages);
      } else if (error.request) {
        // client never received a response, or request never left
        setErrors(['Network error, please try again']);
      } else {
        // anything else
        setErrors(['An error occurred, please try again']);
      }
    }
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <h2>Add a new Internship</h2>
      {errors.map((error, index) => <p key={index} className="error">{error}</p>)}
      <label>Title:</label>
      <input type="text" name="title" required onChange={handleInputChange} />

      <label>Link:</label>
      <input type="text" name="link" required onChange={handleInputChange} />

      <label>Description:</label>
      <textarea name="description" required onChange={handleInputChange} />

      <label>Company:</label>
      <input type="text" name="company" required onChange={handleInputChange} />

      <label>Category:</label>
      <input type="text" name="category" required onChange={handleInputChange} />

      <label>Picture:</label>
      <input type="file" name="picture" required onChange={handleFileChange} />

      <div className="form-button-group">
      <button type="submit">Submit</button>
      <button className="close-btn" onClick={() => navigate('/internships')}>
        <IoIosCloseCircleOutline size={30} />
      </button>
    </div>
    </form>
  );
};

export default NewInternship;
