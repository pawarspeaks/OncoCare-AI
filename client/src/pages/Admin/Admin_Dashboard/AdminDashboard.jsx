import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css'; // Import your CSS file for styling
import viewPatientIcon from '../../../assets/viewpatient.png'; // Import the patient view icon
import viewHospitalIcon from '../../../assets/hospital.png'; // Import the hospital view icon

const AdminDashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const [patients, setPatients] = useState([]);
  const [view, setView] = useState(null); // 'hospitals' or 'patients'
  const [error, setError] = useState('');
  const [isInitial, setIsInitial] = useState(true); // State to manage initial button size
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (view === 'hospitals') {
      fetchHospitals();
    } else if (view === 'patients') {
      fetchPatients();
    }
  }, [view]);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get('http://localhost:3001/users/profile', { withCredentials: true });
      setUserProfile(res.data.user);
      console.log('Fetched user profile:', res.data.user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchHospitals = async () => {
    try {
      const response = await axios.get('http://localhost:3001/hospitals/all', { withCredentials: true });
      setHospitals(response.data.hospitals);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      setError('Failed to fetch hospitals');
    }
  };

  const fetchPatients = async () => {
    try {
        const response = await axios.get('http://localhost:3001/admin/patients', { withCredentials: true });
        setPatients(response.data.patients);
        setError(''); // Clear any previous errors
    } catch (error) {
        console.error('Error fetching patients:', error);
        setError('Failed to fetch patients. Please try again later.'); // Update error message
    }
};

  const handleViewHospitals = () => {
    setView('hospitals');
    setError('');
    setIsInitial(false);
  };

  const handleViewPatients = () => {
    setView('patients');
    setError('');
    setIsInitial(false);
  };

  const handleBackToInitialPage = () => {
    setView(null);
    setError('');
    setIsInitial(true);
  };

  const handleUpdateHospital = (hospital) => {
    // Implement update logic
    console.log('Update hospital:', hospital);
  };

  const handleDeleteHospital = (hospital) => {
    // Implement delete logic
    console.log('Delete hospital:', hospital);
  };

  const handleUpdatePatient = (patient) => {
    // Implement update logic
    console.log('Update patient:', patient);
  };

  const handleDeletePatient = (patient) => {
    // Implement delete logic
    console.log('Delete patient:', patient);
  };

  return (
    <div className="dashboard">
      <div className="content-wrapper">
        {!view && (
          <div className="white-container">
            <h1 className="admin-dashboard-heading">Admin Dashboard</h1>
            <div className={`buttons-container ${isInitial ? 'large' : 'small'}`}>
              <button className={`card-button ${isInitial ? 'large' : 'small'}`} onClick={handleViewHospitals}>
                <img src={viewHospitalIcon} alt="Hospital Icon" />
                View Hospitals
              </button>
              <button className={`card-button ${isInitial ? 'large' : 'small'}`} onClick={handleViewPatients}>
                <img src={viewPatientIcon} alt="Patient Icon" />
                View Patients
              </button>
            </div>
          </div>
        )}
        {view && (
          <>
            <div className="navigation-buttons">
              <button className="small-navigation-button" onClick={handleViewHospitals}>
                View Hospitals
              </button>
              <button className="small-navigation-button" onClick={handleViewPatients}>
                View Patients
              </button>
            </div>
            <h1 className="admin-dashboard-heading">Admin Dashboard</h1>
          </>
        )}
        {error && <p className="error-message">{error}</p>}

        <div className="cards-container">
          {view === 'hospitals' && hospitals.map((hospital) => (
            <div key={hospital._id} className="card">
              <h4>{hospital.hospital_name}</h4>
              <p>Hospital ID: {hospital.hospital_id}</p>
              <p>Password: {hospital.password}</p>
              <div className="card-actions">
                <button className="update-button" onClick={() => handleUpdateHospital(hospital)}>Update</button>
                <button className="delete-button" onClick={() => handleDeleteHospital(hospital)}>Delete</button>
              </div>
            </div>
          ))}
          {view === 'patients' && patients.map((patient) => (
            <div key={patient._id} className="card">
              <h4>User ID: {patient.userId}</h4>
              <p>Email: {patient.email}</p>
              <p>Age: {patient.age}</p>
              <div className="card-actions">
                <button className="update-button" onClick={() => handleUpdatePatient(patient)}>Update</button>
                <button className="delete-button" onClick={() => handleDeletePatient(patient)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
