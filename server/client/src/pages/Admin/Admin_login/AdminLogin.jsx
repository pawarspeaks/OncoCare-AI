import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setAdminEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/admins/login', {
        email,
        password,
      }, {
        withCredentials: true, // This line adds the withCredentials option
      });
    
      if (response.data && response.data.success) {
        // Redirect user to main page after successful login
        navigate('/AdminDashboard');
      } else {
        setError('Invalid Admin email or password');
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || 'Unknown error');
      setError('Invalid Admin email or password');
    }    
  };

  return (
    <div className="logincard">
      <h1>OncoCare</h1>
      <p>Admin Login to dashboard</p>

      <form onSubmit={handleSubmit}>
        <div className="loginContainer">
          <span>Login</span>
        </div>
        <label htmlFor="email">email address</label>
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Enter your email address"
          required
          value={email}
          onChange={(e) => setAdminEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default AdminLogin;