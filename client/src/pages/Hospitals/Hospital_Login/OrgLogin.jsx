import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './OrgLogin.css';
import loginImage from '../../../assets/login.png';

const OrgLogin = () => {
  const [hospital_id, setHospitalId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/hospitals/login', {
        hospital_id,
        password,
      }, {
        withCredentials: true,
      });

      if (response.data && response.data.success) {
        navigate('/OrgHome');
      } else {
        setError('Invalid hospital ID or password');
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || 'Unknown error');
      setError('Invalid hospital ID or password');
    }
  };

  return (
    <div className="logincard">
      <h1>OncoCare</h1>
      <p>Login to access your hospital dashboard</p>
      <div className="loginContent">
        <div className="imageContainer">
          <img src={loginImage} alt="Login" className="loginImage" />
        </div>
        <form onSubmit={handleSubmit} className="loginForm">
          <div className="formContainer">
            <label htmlFor="hospital_id">Hospital ID</label>
            <input
              type="text"
              id="hospital_id"
              name="hospital_id"
              placeholder="Enter your hospital ID"
              required
              value={hospital_id}
              onChange={(e) => setHospitalId(e.target.value)}
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

export default OrgLogin;
