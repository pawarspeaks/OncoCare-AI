import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
import loginImage from '../../../assets/admin.png';

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
        withCredentials: true,
      });

      if (response.data && response.data.success) {
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
      <div className="loginContent">
        <div className="imageContainer">
          <img src={loginImage} alt="Login" className="loginImage" />
        </div>
        <form onSubmit={handleSubmit} className="loginForm">
          <div className="formContainer">
            <label htmlFor="email">Email address</label>
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
            {error && <p className="error">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
