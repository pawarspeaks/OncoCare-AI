import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrgHome.css';
import hospitalImage from '../../../assets/hospital.png'; // Import the image

const OrgHome = () => {
  const [HospitalData, setProfile] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const isVerifiedHospital = async () => {
      try {
        const authResponse = await axios.post('http://localhost:3001/hospitals/verified', {}, { withCredentials: true });
        
        if (!authResponse.data.success) {
          setTimeout(() => {
            alert("Please make a login to access any further details");
            window.location.href = '/'; 
          }, 500); 
          return;
        }
      } catch (error) {
        console.error('Error verifying hospital:', error);
        setTimeout(() => {
          alert("Please make a login to access any further details");
          window.location.href = '/'; 
        }, 500); 
      }
    };

    isVerifiedHospital();
  }, [navigate]);

  useEffect(() => {
    const fetchHospitalProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3001/hospitals/profile', { withCredentials: true });
        setProfile(response.data);
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
      navigate('/'); 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="organization-containers">
      <div className="white-boxs">
        <div className="header">
          {HospitalData ? (
            <>
              <h1>Welcome to {HospitalData.hospital.hospital_name || 'Please login'}</h1>
              <h2>Organization ID: {HospitalData.hospital.hospital_id || 'NA'}</h2>
            </>
          ) : (
            <>
              <h1>Welcome to Surya Hospital, Nanded</h1>
              <h2>Organization ID: 21000</h2>
              <p><i>Not Logged In, please login to access your dashboard if you're an Organization/Hospital</i></p>
            </>
          )}
        </div>

        <div className="contents">
          
          <div className="hospital-image">
            <img src={hospitalImage} alt="Hospital" />
          </div>
          <div className="options">
            <Link className="link1" to="add-patient">Add Patient</Link>
            <Link className="link1" to="/OrgMain">View Patient</Link>
          </div>
         
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default OrgHome;
