import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrgHome.css';

const OrgHome = () => {
  const [HospitalData, setProfile] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const isVerifiedHospital = async () => {
      try {
        // Verify user authentication and role
        const authResponse = await axios.post('http://localhost:3001/hospitals/verified', {}, { withCredentials: true });
        
        if (!authResponse.data.success) {
          setTimeout(() => {
            alert("Please make a login to access any further details");
            window.location.href = '/'; // Redirect to home page after user clicks "OK"
          }, 500); // 500 milliseconds delay before showing alert
          return;
        }
      } catch (error) {
        console.error('Error verifying hospital:', error);
        setTimeout(() => {
          alert("Please make a login to access any further details");
          window.location.href = '/'; // Redirect to home page after user clicks "OK"
        }, 500); // 500 milliseconds delay before showing alert
      }
    };

    isVerifiedHospital();
  }, [navigate]);

  useEffect(() => {
    const fetchHospitalProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3001/hospitals/profile', { withCredentials: true });
        setProfile(response.data);
        // Access response data directly
        console.log('Hospital name:', response.data.hospital.hospital_name);
        console.log('Hospital id:', response.data.hospital.hospital_id);
      } catch (error) {
        console.error('Error fetching hospital profile:', error);
      }
    };

    fetchHospitalProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/hospitals/logout', {}, { withCredentials: true });
      navigate('/'); // Redirect to the login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="organization-container">
      <div className="header">
        <div className="logout-container">
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
        {HospitalData ? (
          <>
            <h1>Welcome to {HospitalData.hospital.hospital_name || 'Please login'}</h1>
            <h2>Organization ID: {HospitalData.hospital.hospital_id || 'NA'}</h2>
          </>
        ) : (
          <p><i>Not Logged In, please login to access your dashboard if you're a Organization/Hospital</i></p>
        )}
      </div>

      <div className="content">
        <div className="options">
          <Link className="link1" to="/OrgDataMgmt">Add Patient</Link>
          <Link className="link1" to="/OrgView">View Patient</Link>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default OrgHome;
