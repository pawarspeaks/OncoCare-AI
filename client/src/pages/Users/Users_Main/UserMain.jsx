import React, { useState, useEffect , useRef } from 'react';
import axios from 'axios';
import './UserMain.css';
import botImage from '../../../assets/bot.png';
import Layout from '../../../Layout';
const UserMain = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [fetchProfileDone, setFetchProfileDone] = useState(false);
  const chatBottomRef = useRef(null);

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
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (fetchProfileDone && userId) {
      const timer = setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Hello, ${userProfile.patientDetails.name}!` }]);
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
          lastChemotherapy: /^when\s+was\s+my\s+last\s+chemotherapy$|^last\s+chemotherapy$|^latest\s+chemotherapy$/i,
          allergies: /^what\s+are\s+my\s+allergies$|^my\s+allergies$|^allergies$/i,
          currentMedications: /^what\s+medications\s+am\s+i\s+currently\s+taking$|^my\s+current\s+medications$|^current\s+medications$/i,
          familyHistory: /^what\s+is\s+my\s+family\s+history$|^family\s+history$/i,
          upcomingAppointments: /^when\s+is\s+my\s+next\s+appointment$|^next\s+appointment$|^upcoming\s+appointments$/i,
          emergencyContacts: /^who\s+are\s+my\s+emergency\s+contacts$|^my\s+emergency\s+contacts$|^emergency\s+contacts$/i,
          insuranceDetails: /^what\s+are\s+my\s+insurance\s+details$|^my\s+insurance\s+details$|^insurance\s+details$/i,
          surgicalHistory: /^what\s+is\s+my\s+surgical\s+history$|^my\s+surgical\s+history$|^surgical\s+history$/i,
          bloodType: /^what\s+is\s+my\s+blood\s+type$|^my\s+blood\s+type$|^blood\s+type$/i,
          immunizations: /^what\s+immunizations\s+have\s+i\s+received$|^my\s+immunizations$|^immunizations$/i,
          dietaryRestrictions: /^do\s+i\s+have\s+any\s+dietary\s+restrictions$|^my\s+dietary\s+restrictions$|^dietary\s+restrictions$/i,
          contactInformation: /^what\s+is\s+my\s+contact\s+information$|^my\s+contact\s+information$|^contact\s+information$/i,
          smokingStatus: /^what\s+is\s+my\s+smoking\s+status$|^my\s+smoking\s+status$|^smoking\s+status$/i,
          imagingStudies: /^what\s+are\s+my\s+imaging\s+studies$|^my\s+imaging\s+studies$|^imaging\s+studies$/i,
          labResults: /^what\s+are\s+my\s+lab\s+results$|^my\s+lab\s+results$|^lab\s+results$/i,
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
                  })) || []; // Default to empty array if undefined
                  
                  const treatmentDates = userProfile?.patientDetails?.treatment?.map(treatment => ({
                    type: treatment.type,
                    date: new Date(treatment.end_date || treatment.start_date)
                  })) || []; // Default to empty array if undefined
                  
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
                  case 'allergies':
                    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                    setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `You have the following allergies: ${userProfile?.patientDetails?.allergies?.join(', ')}.` }]);
                    break;
                    case 'currentMedications':
                      setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                      setMessages(prevMessages => [
                        ...prevMessages,
                        {
                          sender: 'bot',
                          text: `You are currently taking the following medications: ${userProfile?.patientDetails?.medications?.map(med => `${med.name} (${med.dosage})`).join(', ')}.`
                        }
                      ]);
                     break;
                  case 'familyHistory':
                    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                    setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Your family history includes: ${userProfile?.patientDetails?.familyHistory}.` }]);
                    break;
                  case 'upcomingAppointments':
                    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                    setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Your next appointment is on ${userProfile?.patientDetails?.nextAppointmentDate}.` }]);
                    break;
                  case 'emergencyContacts':
                    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                    setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Your emergency contacts are: ${userProfile?.patientDetails?.emergencyContacts?.join(', ')}.` }]);
                    break;
                  case 'insuranceDetails':
                    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                    setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Your insurance details are: ${userProfile?.patientDetails?.insuranceDetails}.` }]);
                    break;
                  case 'surgicalHistory':
                    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                    setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Your surgical history includes: ${userProfile?.patientDetails?.surgicalHistory?.join(', ')}.` }]);
                    break;
                  case 'bloodType':
                    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                    setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Your blood type is ${userProfile?.patientDetails?.bloodType}.` }]);
                    break;
                  case 'immunizations':
                    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                    setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `You have received the following immunizations: ${userProfile?.patientDetails?.immunizations?.join(', ')}.` }]);
                    break;
                  case 'dietaryRestrictions':
                    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                    setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Your dietary restrictions are: ${userProfile?.patientDetails?.dietaryRestrictions}.` }]);
                    break;
                  case 'contactInformation':
                    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                    setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Your contact information is: ${userProfile?.patientDetails?.contactInfo}.` }]);
                    break;
                  case 'smokingStatus':
                    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                    setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Your smoking status is: ${userProfile?.patientDetails?.smokingStatus}.` }]);
                    break;
                  case 'imagingStudies':
                    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                    setMessages(prevMessages => [
                       ...prevMessages,
                       {
                        sender: 'bot',
                        text: `Your imaging studies include: ${userProfile?.patientDetails?.imagingStudies?.map(study => `${study.type} (${study.date}): ${study.findings}`).join(', ')}.`
                       }
                     ]);
                    break;
                    case 'labResults':
                      setMessages(prevMessages => [...prevMessages, { sender: 'user', text: input }]);
                      
                      const labResults = userProfile?.patientDetails?.labResults?.map(result => {
                        const valueText = Object.entries(result.value)
                          .map(([key, value]) => value !== null ? `${key}: ${value}` : `${key}: not available`)
                          .join(', ');
                        return `${result.test} (${new Date(result.date).toLocaleDateString()}): ${valueText}`;
                      }).join('. ');
                      
                      setMessages(prevMessages => [
                        ...prevMessages,
                        {
                          sender: 'bot',
                          text: `Here are your latest lab results: ${labResults}.`
                        }
                      ]);
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
    <Layout>
    <div className="user-main">
      {userProfile ? (
        <>
          <h1>Welcome, {userProfile.patientDetails.name}!</h1>
          <div className="chat-wrapper">
          <div className="chat-section">
          <img src={botImage} alt="Bot" className="bot-image" />
           <div className="chat-container">
            <div className="chat-history">
            {messages.map((message, index) => (
                <div key={index} className={`message ${message.sender}`}>
                  {message.sender === 'user' && (
                    <div className="message-container user-message-container">
                      <div className="user-message">
                        <span>{message.text}</span>
                      </div>
                    </div>
                  )}
                  {message.sender === 'bot' && (
                    <div className="message-container bot-message-container">
                      <div className="bot-message">
                        <span>{message.text}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
               <div ref={chatBottomRef} />
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
          </div> 
          </div>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
    </Layout>
  );
};

export default UserMain;
