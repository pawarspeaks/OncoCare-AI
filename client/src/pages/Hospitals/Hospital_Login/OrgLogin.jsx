import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './OrgLogin.css';

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
        withCredentials: true, // This line adds the withCredentials option
      });
    
      if (response.data && response.data.success) {
        // Redirect user to main page after successful login
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

      <form onSubmit={handleSubmit}>
        <div className="loginContainer">
          <span>Login</span>
        </div>
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default OrgLogin;
