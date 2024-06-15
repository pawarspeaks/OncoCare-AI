import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import OrgLogin from './pages/Hospitals/Hospital_Login/OrgLogin';
import AdminLogin from './pages/Admin/Admin_login/AdminLogin';
import LandingPage from './pages/LandingPage/LandingPage';
import UserLogin from './pages/Users/User_Login/UserLogin';
import OrgView from './pages/Hospitals//Hospital_View_Patients/OrgView';
import OrgHome from './pages/Hospitals/Hospital_Home/OrgHome';
import OrgDataMgmt from './pages/Hospitals/Hospital_Data_Mgmt/OrgDataMgmt';
import AdminDashboard from './pages/Admin/Admin_Dashboard/AdminDashboard';
import UserMain from './pages/Users/Users_Main/UserMain'; 


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
        <Route path="/OrgView" element={<OrgView />} />
        <Route path="/OrgHome" element={<OrgHome />} />
        <Route path="/OrgDataMgmt" element={<OrgDataMgmt />} />
        <Route path="/UserMain" element={<UserMain />} /> {/* Add this line */}
        <Route path="/AdminDashboard" element={<AdminDashboard />} />


      </Routes>
    </div>
  );
}

export default App;
