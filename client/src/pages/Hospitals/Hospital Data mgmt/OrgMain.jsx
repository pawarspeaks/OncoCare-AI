import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrgMain.css';

const OrgMain = ({ hospital_id }) => {
  const [patients, setPatients] = useState([]);
  const [hospitalId, setHospitalId] = useState(null);
  const [emails, setEmails] = useState({});
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

    setTimeout(() => {
      isVerifiedHospital();
    }, 500);
  }, [navigate]);

  useEffect(() => {
    const fetchHospitalProfile = async () => {
      try {
        const profileresponse = await axios.get('http://localhost:3001/hospitals/profile', { withCredentials: true });
        setHospitalId(profileresponse.data.hospital.hospital_id);
      } catch (error) {
        console.error('Error fetching hospital profile:', error);
      }
    };

    setTimeout(() => {
      fetchHospitalProfile();
    }, 500);
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!hospitalId) return;
      try {
        const response = await axios.get(`http://localhost:3001/hospitals/patients?hospital_id=${hospitalId}`, {
          withCredentials: true
        });
        setPatients(Array.isArray(response.data.patients) ? response.data.patients : []);
        console.log(response.data.patients);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    const delayedFetchPatients = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      fetchPatients();
    };

    delayedFetchPatients();
  }, [hospitalId]);

  const sendInvitationEmail = async (patient) => {
    const { userId, doctorId, password, hospital_id } = patient;
    const email = emails[userId];
    if (!email) {
      alert('Please enter an email for this patient.');
      return;
    }
    try {
      await axios.post('http://localhost:3001/hospitals/send-invitation-email', {
        userId,
        doctorId,
        password,
        hospital_id,
        email
      }, {
        withCredentials: true
      });

      alert('Invitation email sent successfully');
      setEmails({ ...emails, [userId]: '' });
    } catch (error) {
      console.error('Error sending invitation email:', error);
      alert('Error sending invitation email');
    }
  };

  const handleEmailChange = (userId, email) => {
    setEmails({ ...emails, [userId]: email });
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/hospitals/logout', {}, { withCredentials: true });
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="view-patients">
      <div className="white-box">
        
        <h1>Patients List</h1>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Doctor ID</th>
              <th>Password</th>
              <th>Organization ID</th>
              <th>Email</th>
              <th>Invite</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan="6">No patients found.</td>
              </tr>
            ) : (
              patients.slice(-6).map((patient, index) => (
                <tr key={index} className={patient.hospital_id === hospital_id ? 'highlight' : ''}>
                  <td>{patient.userId}</td>
                  <td>{patient.doctorId}</td>
                  <td>{patient.password}</td>
                  <td>{patient.hospital_id}</td>
                  <td>
                    <input
                      type="email"
                      placeholder="Enter email"
                      value={emails[patient.userId] || ''}
                      onChange={(e) => handleEmailChange(patient.userId, e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={() => sendInvitationEmail(patient)} className="invite-button">Invite</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
      </div>
    </div>
  );
};

export default OrgMain;
