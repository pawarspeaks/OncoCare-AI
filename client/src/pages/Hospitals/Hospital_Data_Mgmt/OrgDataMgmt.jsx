import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './OrgDataMgmt.css';
import { useNavigate } from 'react-router-dom';


const OrgDataMgmt = () => {
    const [userId, setUserId] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [email, setEmail] = useState('');
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState('');
    const [hospitalName, setHospitalName] = useState('');
    const [hospital_id, setHospitalId] = useState('');
    const [message, setMessage] = useState('');
    const textareaRef = useRef(null);
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
                const profileresponse = await axios.get('http://localhost:3001/hospitals/profile', { withCredentials: true });
                setHospitalName(profileresponse.data.hospital.hospital_name);
                setHospitalId(profileresponse.data.hospital.hospital_id);
            } catch (error) {
                console.error('Error fetching hospital profile:', error);
            }
        };

        fetchHospitalProfile();
    }, []);

    const generateRandomPassword = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const length = 8;
        let password = '';
        for (let i = 0; i < length; i++) {
            password += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return password;
    };

    const handleTextSubmit = async () => {
        if (!userId.trim() || !doctorId.trim() || !email.trim() || !message.trim()) {
            alert('Please enter MRN Number, Doctor ID, Email, and Text Data');
            return;
        }

        try {
            const patient = {
                userId,
                email,
                doctorId,
                hospital_id,
                password: generateRandomPassword(), // Generate random password
                patientDetails: JSON.parse(message) // Parse the message as JSON
            };

            const response = await axios.post('http://localhost:3001/hospitals/addNewPatient', patient, {
                withCredentials: true, 
              });
              console.log(response.data);
              alert('New patient added successfully');
            } catch (error) {
              console.error('Error adding new patient:', error);
              alert('Error adding new patient');
            }
          };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
        const fileType = file.type.split('/')[1];
        setFileType(fileType);
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };


    const handleViewPatients = () => {
        navigate('/OrgView');
    };
    
    return (
        <div className="org-data-management">
        <div className="side-panel">
            <div className="oncocare-header">OncoCare</div>
            <div className="hospital-name">{hospitalName}</div>
            <div className="options">
                <button  onClick={handleViewPatients}>View Patients</button>
                <button>Hospital Home Page</button>
                <button>Logout</button>
            </div>
        </div>
        <div className="main-content">
            <div className="patient-details">
                <h2>Patient Details</h2>
                <div className="input-group">
                    <label>MRN Number:</label>
                    <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
                </div>
                <div className="input-group">
                    <label>Doctor ID:</label>
                    <input type="text" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} />
                </div>
                <div className="input-group">
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
            </div>
            <div className="chat-bot">
                <h2>Chat Interface</h2>
                <div className="chat-box">
                    {/* chat messages here */}
                </div>
                <div className="chat-input">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleMessageChange}
                        placeholder="Enter Unstructured Data as Text here...."
                        rows="1"
                        style={{ overflow: message.split('\n').length > 7 ? 'auto' : 'hidden' }}
                    />
                    <button onClick={handleTextSubmit}>Upload Text Data</button>
                </div>
            </div>
            <div className="file-upload">
                <label>Upload File:</label>
                <input type="file" accept=".json, .csv, .jpg, .jpeg, .png" onChange={handleFileChange} />
            </div>
            <div className="action-buttons">
                <button >Submit File Data</button>
            </div>
        </div>
     </div>
    );
};

export default OrgDataMgmt;
