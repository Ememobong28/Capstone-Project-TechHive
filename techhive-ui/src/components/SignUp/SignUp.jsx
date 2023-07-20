import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { UserContext } from '../../UserContext';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  Typography,
} from '@mui/material';
import LockIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './SignUp.css';

const styles = {
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '10vh',
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
  },
  input: {
    marginBottom: '20px',
  },
  button: {
    marginTop: '20px',
    background: '#007BFF',
    color: 'white',
    borderRadius: '5px',
    '&:hover': {
      background: '#0056b3',
    },
  },
  select: {
    '& .MuiSelect-select': {
      paddingTop: '10px',
      paddingBottom: '10px',
    },
    '& .MuiSelect-selectMenu': {
      display: 'none',
    },
  },
  inputLabel: {
    marginBottom: '10px',
    marginTop: '10px',
  },
};

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState('student');
  const [industry, setIndustry] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/auth/signup', {
        username,
        email,
        password,
        accountType,
        industry: accountType === 'company' ? industry : null,
        university: accountType === 'student' ? university : null,
        major: accountType === 'student' ? major : null,
      });
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="signup">
      <Container maxWidth="sm">
        <Box sx={styles.formContainer}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <Typography variant="h5" component="h1" align="center" gutterBottom>
              Join TechHive🐝👩‍💻
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  fullWidth
                  required
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  }
                  sx={styles.input}
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  fullWidth
                  required
                  startAdornment={
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  }
                  sx={styles.input}
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  fullWidth
                  required
                  startAdornment={
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        style={styles.iconButton}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  }
                  sx={styles.input}
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  fullWidth
                  required
                  startAdornment={
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        style={styles.iconButton}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  }
                  sx={styles.input}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth sx={styles.input}>
                  <InputLabel id="account-type-label" sx={styles.inputLabel}>
                    Account Type
                  </InputLabel>
                  <Select
                    labelId="account-type-label"
                    id="account-type"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    MenuProps={{
                      classes: {
                        paper: styles.select,
                      },
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      },
                      getContentAnchorEl: null,
                    }}
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="company">Company</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {accountType === 'company' && (
                <Grid item xs={12}>
                  <Input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Industry"
                    fullWidth
                    required
                    startAdornment={
                      <InputAdornment position="start">
                        <WorkIcon />
                      </InputAdornment>
                    }
                    sx={styles.input}
                  />
                </Grid>
              )}
              {accountType === 'student' && (
                <>
                  <Grid item xs={12}>
                    <Input
                      type="text"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="University"
                      fullWidth
                      required
                      startAdornment={
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      }
                      sx={styles.input}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Input
                      type="text"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      placeholder="Major"
                      fullWidth
                      required
                      startAdornment={
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      }
                      sx={styles.input}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Button type="submit" variant="contained" fullWidth sx={styles.button}>
                    Sign Up
                  </Button>
                  <Typography variant="body2" component="p">
                    Already have an account? <Link to="/login">Login</Link>
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
      {showConfetti && <Confetti />}
    </div>
  );
};

export default SignUp;
