import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import mainImage from '../../assets/bg.png'; // Import the image

function LandingPage() {
  return (
    <div className="containers">
      <div className="sidebar">
        <h2>Menu</h2>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/AdminLogin">Admin</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/OrgLogin">Hospital Login</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/UserLogin">User Login</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/about">About OncoCare</Link>
          </li>
        </ul>
      </div>
      <div className="content">
        <div className="content-text">
          <h1>OncoCare</h1>
          <p><i>Welcome to OncoCare, your trusted partner in cancer care.</i></p>
        </div>
        <div className="content-image">
          <img src={mainImage} alt="OncoCare" />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
