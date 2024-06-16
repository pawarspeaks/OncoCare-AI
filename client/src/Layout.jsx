import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="contain">
      <div className="sidebar">
        <h1 >OncoCare</h1>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-linkS" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-linkS" to="/AdminLogin">Admin</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-linkS" to="/OrgLogin">Hospital Login</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-linkS" to="/UserLogin">User Login</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-linkS" to="/about">About OncoCare</Link>
          </li>
        </ul>
      </div>
      <div className="contents">
        {children}
      </div>
    </div>
  );
};

export default Layout;
