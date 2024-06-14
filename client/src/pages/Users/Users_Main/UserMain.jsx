import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UsersMain.css';

const UserMain = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [fetchProfileDone, setFetchProfileDone] = useState(false);

  useEffect(() => {
    // Fetch user profile details when component mounts
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get('http://localhost:3001/users/profile', { withCredentials: true });
        setUserId(res.data.user.userId);
        setUserProfile(res.data.user);
        console.log('Fetched user profile:', res.data.user);
        setFetchProfileDone(true);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (fetchProfileDone && userId) {
      const timer = setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Hello, User ${userId}!` }]);
      }, 1000); // Wait for 1 second before executing

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [fetchProfileDone, userId]);

  const sendMessage = async () => {
    try {
      if (!userId) {
        console.error('User ID is not set');
        return;
      }

      if (input.trim() === '') {
        setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Hello, User ${userId}!` }]);
      } else {
        const payload = { message: input };
        console.log('Sending payload:', payload, 'to userId:', userId);

        // Check if the input message is a query about hospitalId, doctorId or other patient details
        const lowerCaseInput = input.toLowerCase().trim();

        // Define patterns for each type of query
        const patterns = {
          hospitalId: /^what\s+is\s+my\s+hospital\s+id$|^hospital\s+id$/i,
          doctorId: /^what\s+is\s+my\s+doctor\s+id$|^doctor\s+id$/i,
          name: /^what\s+is\s+my\s+name$|^who\s+am\s+i$|^name$/i,
          age: /^how\s+old\s+am\s+i$|^what\s+is\s+my\s+age$|^age$/i,
          gender: /^what\s+is\s+my\s+gender$|^am\s+i\s+(male|female)$|^gender$/i,
          cancerType: /^what\s+type\s+of\s+cancer\s+do\s+i\s+have$|^my\s+cancer\s+type$|^cancer\s+type$/i,
          diagnosisDate: /^when\s+was\s+i\s+diagnosed\s+with\s+cancer$|^my\s+diagnosis\s+date$|^diagnosis\s+date$/i,
          gleasonScore: /^what\s+is\s+my\s+gleason\s+score$|^my\s+gleason\s+score$|^gleason\s+score$/i,
          pathologicStage: /^what\s+is\s+my\s+pathologic\s+stage$|^my\s+pathologic\s+stage$|^pathologic\s+stage$/i,
          comorbidities: /^what\s+comorbidities\s+do\s+i\s+have$|^my\s+comorbidities$|^comorbidities$/i,
          diseaseState: /^what\s+is\s+my\s+current\s+disease\s+state$|^my\s+current\s+disease\s+state$|^disease\s+state$/i,
          procedures: /^what\s+procedures\s+have\s+i\s+undergone$|^my\s+procedures$|^procedures$/i,
          lastChemotherapy: /^when\s+was\s+my\s+last\s+chemotherapy$|^last\s+chemotherapy$|^latest\s+chemotherapy$/i
        };

        // Find matching pattern
        let found = false;
        for (const [key, pattern] of Object.entries(patterns)) {
          if (pattern.test(lowerCaseInput)) {
            found = true;
            switch (key) {
              case 'hospitalId':
                setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Your hospital ID is ${userProfile.hospital_id}.` }]);
                break;
              case 'doctorId':
                setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Your doctor ID is ${userProfile.doctorId}.` }]);
                break;
              case 'name':
                setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Your name is ${userProfile?.patientDetails?.name}.` }]);
                break;
              case 'age':
                setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `You are ${userProfile?.patientDetails?.age} years old.` }]);
                break;
              case 'gender':
                setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Your gender is ${userProfile?.patientDetails?.gender}.` }]);
                break;
              case 'cancerType':
                setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `You have ${userProfile?.patientDetails?.cancerType}.` }]);
                break;
              case 'diagnosisDate':
                setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `You were diagnosed with cancer on ${userProfile?.patientDetails?.diagnosisDate}.` }]);
                break;
              case 'gleasonScore':
                setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Your Gleason score is ${userProfile?.patientDetails?.gleason_score}.` }]);
                break;
              case 'pathologicStage':
                setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Your pathologic stage is ${userProfile?.patientDetails?.pathologicStage}.` }]);
                break;
              case 'comorbidities':
                setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `You have the following comorbidities: ${userProfile?.patientDetails?.comorbidities?.join(', ')}.` }]);
                break;
              case 'diseaseState':
                const currentState = userProfile?.patientDetails?.diseaseStates?.find(state => !state.endDate);
                setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Your current disease state is ${currentState?.state}, starting from ${currentState?.startDate}.` }]);
                break;
              case 'procedures':
                const procedures = userProfile?.patientDetails?.procedures?.map(procedure => `${procedure.type} on ${procedure.date}`).join(', ');
                setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `You have undergone the following procedures: ${procedures}.` }]);
                break;
              case 'lastChemotherapy':
                const procedureDates = userProfile?.patientDetails?.procedures?.map(procedure => ({
                  type: procedure.type,
                  date: new Date(procedure.date)
                }));
                const treatmentDates = userProfile?.patientDetails?.treatment?.map(treatment => ({
                  type: treatment.type,
                  date: new Date(treatment.end_date || treatment.start_date)
                }));

                const allDates = [...procedureDates, ...treatmentDates];
                if (allDates.length > 0) {
                  allDates.sort((a, b) => b.date - a.date); // Sort by date descending
                  const latestTherapy = allDates[0];
                  const latestTherapyDate = latestTherapy.date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });
                  setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                  setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Your last therapy was a ${latestTherapy.type} on ${latestTherapyDate}.` }]);
                } else {
                  setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                  setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `You have no recorded chemotherapy or treatment sessions.` }]);
                }
                break;
              default:
                break;
            }
            break;
          }
        }

        if (!found) {
          const res = await axios.post(
            `http://localhost:3001/users/sendmessage/${userId}`,
            payload,
            { withCredentials: true }
          );
          console.log('Response from sendMessage:', res.data);
          setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
          setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: res.data.message }]);
        }
      }
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error.response || error.message);
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  // Speech recognition setup
  const handleMicClick = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log('Voice recognition started. Try speaking into the microphone.');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        console.log('Recognized speech:', transcript);
      };

      recognition.onerror = (event) => {
        console.error('Error during recognition:', event.error);
      };

      recognition.onend = () => {
        console.log('Voice recognition ended.');
      };

      recognition.start();
    } else {
      console.error('Speech recognition is not supported in this browser.');
    }
  };

  return (
    <div className="user-main">
      {userProfile ? (
        <>
          <h1>Welcome, {userProfile.patientDetails.name}!</h1>
          <div className="chat-container">
            <div className="chat-history">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.sender}`}>
                  {message.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Type your message here..."
                value={input}
                onChange={handleChange}
              />
              <span className="mic-icon" onClick={handleMicClick}>🎙️</span>
              <button type="submit">Send</button>
            </form>
          </div>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default UserMain;
