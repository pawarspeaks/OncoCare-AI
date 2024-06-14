import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrgView.css';

const OrgView = ({ hospital_id }) => {
    const [patients, setPatients] = useState([]);
    const [hospitalId, setHospitalId] = useState(null);
    const [emails, setEmails] = useState({});
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

        setTimeout(() => {
            isVerifiedHospital();
        }, 500); // 500 milliseconds delay before starting verification
    }, [navigate]);

    useEffect(() => {
        const fetchHospitalProfile = async () => {
            try {
                const profileresponse = await axios.get('http://localhost:3001/hospitals/profile', { withCredentials: true });
                setHospitalId(profileresponse.data.hospital.hospital_id); // Set hospitalId with the actual ID
            } catch (error) {
                console.error('Error fetching hospital profile:', error);
            }
        };

        setTimeout(() => {
            fetchHospitalProfile();
        }, 500); // 500 milliseconds delay before fetching hospital profile
    }, []);

    useEffect(() => {
        const fetchPatients = async () => {
            if (!hospitalId) return; // Do nothing if hospitalId is not set
            try {
                const response = await axios.get(`http://localhost:3001/hospitals/patients?hospital_id=${hospitalId}`, {
                    withCredentials: true
                });
                // Ensure response.data.patients is accessed correctly
                setPatients(Array.isArray(response.data.patients) ? response.data.patients : []);
                console.log(response.data.patients);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        const delayedFetchPatients = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Add a delay of 1 second
            fetchPatients();
        };

        delayedFetchPatients();
    }, [hospitalId]);

    // Function to handle sending an invitation email
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
            // Clear the email input after sending the email
            setEmails({...emails, [userId]: ''});
        } catch (error) {
            console.error('Error sending invitation email:', error);
            alert('Error sending invitation email');
        }
    };

    // Function to handle input change for email
    const handleEmailChange = (userId, email) => {
        setEmails({...emails, [userId]: email});
    };


    const handleLogout = async () => {
      try {
        await axios.post('http://localhost:3001/hospitals/logout', {}, { withCredentials: true });
        navigate('/'); // Redirect to the login page after logout
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };


    return (
        <div className="view-patients">
             <div className="logout-container">
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
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
                                <td>{patient.email}</td> {/* Add email field */}
                                <td>
                                    <input
                                        type="email"
                                        placeholder="Enter email"
                                        value={emails[patient.userId] || ''}
                                        onChange={(e) => handleEmailChange(patient.userId, e.target.value)}
                                    />
                                </td>
                                <td>
                                    <button onClick={() => sendInvitationEmail(patient)}>Invite</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default OrgView;
