import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const location = useLocation();

  return (
    <div className="App">
      {location.pathname === '/' && (
        <>
          <nav className="navbar">
            <div className="nav-right">
              <Link to="/AdminLogin">Admin</Link>
              <Link to="/OrgLogin">Hospital Login</Link>
              <Link to="/UserLogin">User Login</Link>
              <Link to="/about">About OncoCare</Link>
            </div>
          </nav>
          <div className="content">
            <h1>OncoCare</h1>
            <p><i>Welcome to OncoCare, your trusted partner in cancer care.</i></p>
          </div>
        </>
      )}
    </div>
  );
}

export default LandingPage;
