import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./OrgDataMgmt.css";
import { useNavigate } from "react-router-dom";


const OrgDataMgmt = () => {
  const [userId, setUserId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [hospital_id, setHospitalId] = useState("");
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isVerifiedHospital = async () => {
      try {
        // Verify user authentication and role
        const authResponse = await axios.post(
          "http://localhost:3001/hospitals/verified",
          {},
          { withCredentials: true }
        );

        if (!authResponse.data.success) {
          setTimeout(() => {
            alert("Please make a login to access any further details");
            window.location.href = "/"; // Redirect to home page after user clicks "OK"
          }, 500); // 500 milliseconds delay before showing alert
          return;
        }
      } catch (error) {
        console.error("Error verifying hospital:", error);
        setTimeout(() => {
          alert("Please make a login to access any further details");
          window.location.href = "/"; // Redirect to home page after user clicks "OK"
        }, 500); // 500 milliseconds delay before showing alert
      }
    };

    isVerifiedHospital();
  }, [navigate]);

  useEffect(() => {
    const fetchHospitalProfile = async () => {
      try {
        const profileresponse = await axios.get(
          "http://localhost:3001/hospitals/profile",
          { withCredentials: true }
        );
        setHospitalName(profileresponse.data.hospital.hospital_name);
        setHospitalId(profileresponse.data.hospital.hospital_id);
      } catch (error) {
        console.error("Error fetching hospital profile:", error);
      }
    };

    fetchHospitalProfile();
  }, []);

  const generateRandomPassword = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 8;
    let password = "";
    for (let i = 0; i < length; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return password;
  };

  const handleTextSubmit = async () => {
    if (
      !userId.trim() ||
      !doctorId.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      alert("Please enter MRN Number, Doctor ID, Email, and Text Data");
      return;
    }

    try {
      // Step 1: Send patientDetails to parse-unstructured API endpoint
      const response = await axios.post(
        "http://localhost:3001/hospitals/parse-unstructured",
        {
          data: message, // Send the raw message data
        },
        {
          withCredentials: true,
        }
      );

      console.log("Parsed data response:", response.data);

      // Check if the response contains valid data
      if (response.data && response.data.data) {
        const parsedPatientDetails = response.data.data;
        console.log(parsedPatientDetails);

        // Step 2: Construct patient object with updated patientDetails
        const patient = {
          userId,
          email,
          doctorId,
          hospital_id,
          password: generateRandomPassword(), // Generate random password
          patientDetails: parsedPatientDetails,
        };

        // Step 3: Call addNewPatient API endpoint with updated patient object
        const addPatientResponse = await axios.post(
          "http://localhost:3001/hospitals/addNewPatient",
          patient,
          {
            withCredentials: true,
          }
        );

        console.log("New patient added:", addPatientResponse.data);
        alert("New patient added successfully");
        setUserId("");
        setDoctorId("");
        setEmail("");
        setMessage("");
        setFile(null);
        setFileType("");
      } else {
        console.error("Invalid response from parse-unstructured endpoint");
        alert("Error parsing patient details");
      }
    } catch (error) {
      console.error("Error adding new patient:", error);
      alert("Error adding new patient");
    }
  };

  const handleFileSubmit = async () => {
    if (!userId.trim() || !doctorId.trim() || !email.trim() || !file) {
      alert("Please enter MRN Number, Doctor ID, Email, and select a file");
      return;
    }

    try {
      // Read file content
      const reader = new FileReader();
      reader.readAsText(file);

      reader.onload = async (event) => {
        const fileContent = event.target.result;
        let parsedFileData;

        try {
          parsedFileData = JSON.parse(fileContent);
        } catch (error) {
          console.error("Error parsing JSON file:", error);
          alert("Error parsing JSON file");
          return;
        }

        const patientData = {
          userId,
          doctorId,
          email,
          hospital_id,
          password: generateRandomPassword(),
          fileType, // Assuming you still need this field
          patientDetails: parsedFileData, // Include the parsed JSON content here
        };

        try {
          const addPatientResponse = await axios.post(
            "http://localhost:3001/hospitals/addNewPatient",
            patientData,
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );

          console.log(
            "New patient added with file data:",
            addPatientResponse.data
          );
          alert("New patient added successfully");
          setUserId("");
          setDoctorId("");
          setEmail("");
          setMessage("");
          setFile(null);
          setFileType("");
        } catch (error) {
          console.error("Error adding new patient with file data:", error);
          alert("Error adding new patient with file data");
        }
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        alert("Error reading file");
      };
    } catch (error) {
      console.error("Error handling file submit:", error);
      alert("Error handling file submit");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3001/hospitals/logout",
        {},
        { withCredentials: true }
      );
      navigate("/"); // Redirect to the login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    const fileType = file.type.split("/")[1];
    setFileType(fileType);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleViewPatients = () => {
    navigate("/OrgView");
  };

  const handleViewHomePage = () => {
    navigate("/OrgHome");
  };

  const OpenStructuredDataLink = () => {
    window.open(
      "https://unstructure-to-structure.streamlit.app/",
      "_blank",
      "noopener noreferrer"
    );
  };

  const OpenExampleUnstructuredData = () => {
    window.open(
      "https://drive.google.com/file/d/1YqWcwzZ2Lch6crmq_E9VKHZp0KFLtKUV/view?usp=sharing",
      "_blank",
      "noopener noreferrer"
    );
  };

  return (
    <div className="org-data-management">
      <div className="side-panel">
        <div className="oncocare-header">OncoCare</div>
        <div className="hospital-name">{hospitalName}</div>
        <div className="options">
          <button onClick={handleViewPatients}>View Patients</button>
          <button onClick={handleViewHomePage}>Hospital Home Page</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="main-content">
        <div className="containerss">
          <div className="patient-details">
            <h2>Patient Details</h2>
            <div className="input-group">
              <label>MRN Number:</label>
              <input
                type="text"
                placeholder="Enter patient number here...."
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Doctor ID:</label>
              <input
                type="text"
                placeholder="Enter doctor id here...."
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Email:</label>
              <input
                type="email"
                placeholder="Enter patient email here...."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="chat-bot">
            <div className="chat-box"></div>
            <div className="chat-input">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleMessageChange}
                placeholder="Enter Unstructured Data as Text here...."
                rows="1"
                style={{
                  overflow: message.split("\n").length > 7 ? "auto" : "hidden",
                }}
              />
              <button onClick={handleTextSubmit}>Upload Text Data</button>
            </div>

            <a onClick={OpenExampleUnstructuredData}>
              Example of Unstructured Data for above input
            </a>
            <a onClick={OpenStructuredDataLink}>Link to Structure</a>
          </div>
          <div className="file-upload">
            <label>Upload File [json]:</label>
            <input
              type="file"
              accept=".json, .csv, .jpg, .jpeg, .png"
              onChange={handleFileChange}
            />
          </div>
          <div className="action-buttons">
            <button onClick={handleFileSubmit}>Upload File Data</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgDataMgmt;
