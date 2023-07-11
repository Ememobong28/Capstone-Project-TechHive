import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const styles = {
    form: {
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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); 

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/auth/login", { email, password });
      console.log(response.data);
      navigate('/');
    } catch (err) {
      console.error(err.response.data); 
    }
  };

  return (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required style={styles.input} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required style={styles.input} />
          <button type="submit" style={styles.button}>Login</button>
        </form>
  );
}

export default Login;
