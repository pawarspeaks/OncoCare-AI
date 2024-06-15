import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css'; // Import your CSS file for styling
import viewPatientIcon from '../../../assets/viewpatient.png'; // Import the patient view icon
import viewHospitalIcon from '../../../assets/hospital.png'; // Import the hospital view icon
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const [patients, setPatients] = useState([]);
  const [view, setView] = useState(null); // 'hospitals' or 'patients'
  const [error, setError] = useState('');
  const [isInitial, setIsInitial] = useState(true); // State to manage initial button size
  const [userProfile, setUserProfile] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [editingHospital, setEditingHospital] = useState(null); // State for editing hospital
  const navigate = useNavigate();


  useEffect(() => {
    const isVerifiedAdmin = async () => {
        try {
            // Verify user authentication and role
            const authResponse = await axios.post('http://localhost:3001/admins/verified', {}, { withCredentials: true });
            
            if (!authResponse.data.success) {
                setTimeout(() => {
                    alert("Please make a login to access any further details");
                    window.location.href = '/'; // Redirect to home page after user clicks "OK"
                }, 500); // 500 milliseconds delay before showing alert
                return;
            }
        } catch (error) {
            console.error('Error verifying Admin:', error);
            setTimeout(() => {
                alert("Please make a login to access any further details");
                window.location.href = '/'; // Redirect to home page after user clicks "OK"
            }, 500); // 500 milliseconds delay before showing alert
        }
    };

    isVerifiedAdmin();
}, [navigate]);


  useEffect(() => {
    if (view === 'hospitals') {
      fetchHospitals();
    } else if (view === 'patients') {
      fetchPatients();
    }
  }, [view]);

  const fetchHospitals = async () => {
    try {
      const response = await axios.get('http://localhost:3001/hospitals/all', {
        withCredentials: true
      });
      setHospitals(response.data.hospitals);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      setError('Failed to fetch hospitals');
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:3001/admins/patients', {
        withCredentials: true
      });
      setPatients(response.data.patients);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Failed to fetch patients. Please try again later.'); // Update error message
    }
  };

  const handlePatientEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { userId, email, password, doctorId, hospital_id, patientDetails } = editingPatient;
      const updatedPatient = {
        userId,
        email,
        password,
        doctorId,
        hospital_id,
        patientDetails
      };

      const response = await axios.put('http://localhost:3001/admins/update-patient', updatedPatient, {
        withCredentials: true
      });

      // Update the patients state with the updated patient data
      setPatients(patients.map(patient => (patient._id === editingPatient._id ? editingPatient : patient)));
      setEditingPatient(null);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error updating patient:', error);
      setError('Failed to update patient. Please try again later.');
    }
    try {
      const response = await axios.get('http://localhost:3001/admins/patients', {
        withCredentials: true
      });
      setPatients(response.data.patients);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Failed to fetch patients. Please try again later.'); // Update error message
    }
  };

  const handleHospitalEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { hospital_id, hospital_name, password } = editingHospital;
      const updatedHospital = {
        hospital_id,
        hospital_name,
        password
      };
  
      const response = await axios.put('http://localhost:3001/admins/update-hospital', updatedHospital, {
        withCredentials: true
      });
  
      // Update the hospitals state with the updated hospital data
      setHospitals(hospitals.map(hospital => (hospital._id === editingHospital._id ? editingHospital : hospital)));
      setEditingHospital(null);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error updating hospital:', error);
      setError('Failed to update hospital. Please try again later.');
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
    setEditingHospital({ 
      ...hospital 
    });
  };

  const handleDeleteHospital = (hospital) => {
    // Implement delete logic
    console.log('Delete hospital:', hospital);
  };

  const handleUpdatePatient = (patient) => {
    setEditingPatient({
      ...patient,
      patientDetails: {
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        // Add other details as needed
      }
    });
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
          {view === 'hospitals' && !editingHospital && hospitals.map((hospital) => (
            <div key={hospital._id} className="card">
              <h4>{hospital.hospital_name}</h4>
              <h5>Hospital ID: {hospital.hospital_id}</h5>
              <h5>Password: {hospital.password}</h5>
              <div className="card-actions">
                <button className="update-button" onClick={() => handleUpdateHospital(hospital)}>Update</button>
                <button className="delete-button" onClick={() => handleDeleteHospital(hospital)}>Delete</button>
              </div>
            </div>
          ))}
          {view === 'patients' && !editingPatient && patients.map((patient) => (
            <div key={patient._id} className="card">
              <h4>User ID: {patient.userId}</h4>
              <h5>Hospital ID: {patient.hospital_id}</h5>
              <h5>Patient Name: {patient.name}</h5>
              <h5>Email: {patient.email}</h5>
              <h5>Gender: {patient.gender}</h5>
              <div className="card-actions">
                <button className="update-button" onClick={() => handleUpdatePatient(patient)}>Update</button>
                <button className="delete-button" onClick={() => handleDeletePatient(patient)}>Delete</button>
              </div>
            </div>
          ))}

          {editingPatient && (
            <form className="edit-patient-form" onSubmit={handlePatientEditSubmit}>
              <h2>Edit Patient</h2>
              <label>
                Email:
                <input
                  type="email"
                  value={editingPatient.email}
                  onChange={(e) => setEditingPatient({ ...editingPatient, email: e.target.value })}
                />
              </label>
              <label>
                Name:
                <input
                  type="text"
                  value={editingPatient.patientDetails.name}
                  onChange={(e) => setEditingPatient({
                    ...editingPatient,
                    patientDetails: { ...editingPatient.patientDetails, name: e.target.value }
                  })}
                />
              </label>
              <label>
                Age:
                <input
                  type="number"
                  value={editingPatient.patientDetails.age}
                  onChange={(e) => setEditingPatient({
                    ...editingPatient,
                    patientDetails: { ...editingPatient.patientDetails, age: e.target.value }
                  })}
                />
              </label>
              <label>
                Gender:
                <select
                  value={editingPatient.patientDetails.gender}
                  onChange={(e) => setEditingPatient({
                    ...editingPatient,
                    patientDetails: { ...editingPatient.patientDetails, gender: e.target.value }
                  })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </label>
              {/* Add more fields as needed */}
              <div className="form-actions">
                <button type="submit">Done</button>
                <button type="button" onClick={() => setEditingPatient(null)}>Cancel</button>
              </div>
            </form>
          )}

          {editingHospital && (
            <form className="edit-hospital-form" onSubmit={handleHospitalEditSubmit}>
              <h2>Edit Hospital</h2>
              <label>
                Hospital Name:
                <input
                  type="text"
                  value={editingHospital.hospital_name}
                  onChange={(e) => setEditingHospital({ ...editingHospital, hospital_name: e.target.value })}
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  value={editingHospital.password}
                  onChange={(e) => setEditingHospital({ ...editingHospital, password: e.target.value })}
                />
              </label>
              <div className="form-actions">
                <button type="submit">Done</button>
                <button type="button" onClick={() => setEditingHospital(null)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
