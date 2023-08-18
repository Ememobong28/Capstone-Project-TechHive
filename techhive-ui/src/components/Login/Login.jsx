import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography , IconButton, InputAdornment, TextField} from '@mui/material';
import { UserContext } from '../../UserContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './Login.css';
import LockIcon from '@mui/icons-material/Lock';
import MailIcon from '@mui/icons-material/Mail';
import LoadingState from '../LoadingState/LoadingState';

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
  const [showPassword, setShowPassword] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  
  const { setUser} = useContext(UserContext);


    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Set isLoading to true to show loading state during login process
      setIsLoading(true);
  
      try {
        const response = await axios.post('http://localhost:3000/auth/login', { email, password });
        if (response.data && response.data.user && response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setUser(response.data.user); // Set the user in the user context
          navigate('/');
        } else {
          setError('Invalid server response');
        }
      } catch (err) {
        console.error(err);
        if (err.response && err.response.data && err.response.data.message === 'User not found') {
          setError('No account found. Please create an account.');
          setTimeout(() => navigate('/signup'), 3000);
        }
      } finally {
        // Reset isLoading after the login process is complete
        setIsLoading(false);
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
            <TextField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              fullWidth
              style={styles.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailIcon />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: styles.inputLabel,
              }}
            />
            <TextField
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              fullWidth
              style={styles.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      style={styles.iconButton}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: styles.inputLabel,
              }}
            />
            {error && <div className="alert">{error}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Show loading state if isLoading is true */}
              {isLoading ? (
                <LoadingState />
              ) : (
                <>
                  <Button type="submit" variant="contained" sx={styles.button}>
                    Login
                  </Button>
                  <Typography variant="body2" component="p">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                  </Typography>
                </>
              )}
            </div>
          </form>
        </Box>
      </Container>
    </div>
  );
}

export default Login;
