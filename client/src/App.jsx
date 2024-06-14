import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrgLogin from './pages/Hospitals/Hospital_Login/OrgLogin';
import AdminLogin from './pages/Admin/Admin_login/AdminLogin';
import LandingPage from './pages/LandingPage/LandingPage';
import UserLogin from './pages/Users/User_Login/UserLogin';
import OrgMain from './pages/Hospitals/Hospital Data mgmt/OrgMain';
import OrgHome from './pages/Hospitals/Hospital_Home/OrgHome';
import AdminDashboard from './pages/Admin/Admin_Dashboard/AdminDashboard';
import UserMain from './pages/Users/Users_Main/UserMain'; // Import UserMain

import './App.css';

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/OrgLogin" element={<OrgLogin />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/UserLogin" element={<UserLogin />} />
        <Route path="/OrgMain" element={<OrgMain />} />
        <Route path="/OrgHome" element={<OrgHome />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/UserMain" element={<UserMain />} /> {/* Add this line */}
      </Routes>
    </div>
  );
}

export default App;
