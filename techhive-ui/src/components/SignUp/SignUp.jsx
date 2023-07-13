import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import Confetti from 'react-confetti';
import './SignUp.css'


const styles = {
  form: {
    marginTop:'10px',
    maxWidth: '500px',
    padding: '20px',
    margin: 'auto',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
  },
  input: {
    width: '90%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    outline: 'none'
  },
  button: {
    padding: '10px 20px',
    background: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      background: '#0056b3'
    }
  }
};

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');
  

  const navigate = useNavigate(); 

  const handleSubmit = async e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.error ('Passwords do not match');
      return; 
    }
    try {
      const response = await axios.post("http://localhost:3000/auth/signup", { username, email, password });
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);

        navigate('/login'); 
      }, 3000)
      
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className='signup'>
    <form onSubmit={handleSubmit} style={styles.form}>
      <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required style={styles.input} />
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required style={styles.input} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required style={styles.input} />
      <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required style={styles.input} />
      <button type="submit" style={styles.button}>Sign Up</button>
    </form>
    {showConfetti && <Confetti />}
    </div>
  );
}

export default SignUp;
