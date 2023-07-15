import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import { UserContext } from '../../UserContext';
import './Login.css';

const styles = {
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '10vh',
  },
  form: {
    width: '100%',
    maxWidth: '500px',
    padding: '20px',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
  },
  input: {
    width: '90%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  button: {
    padding: '10px 20px',
    background: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      console.error(err.response.data);
      if (err.response.data.message === 'User not found') {
        setError('No account found. Please create an account.');
        setTimeout(() => navigate('/signup'), 3000);
      } 
    }
  };

  return (
    <div className="login">
      <Container maxWidth="sm">
        <Box sx={styles.formContainer}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <Typography variant="h5" component="h1" align="center" gutterBottom>
              Welcome Back!
            </Typography>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              style={styles.input}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={styles.input}
            />
            {error && <div className="alert">
              {error}</div>}
            <Button type="submit" variant="contained" sx={styles.button}>
              Login
            </Button>
          </form>
        </Box>
      </Container>
    </div>
  );
}

export default Login;
