import { createHospitalCookie, deleteHospitalCookie, generateToken, milliSecToMinute, minuteToMilliSec } from "../Features/feature.js";
import Hospital from "../Models/HospitalModel.js";
import User from "../Models/UserModel.js";
import Otp from "../Models/otpModel.js";
import { FAILED_STATUS, NOT_FOUND_CODE, SERVER_ERR_CODE, SERVER_ERR_MSG, SUCCESS_CODE, SUCCESS_STATUS, WRONG_CODE } from "../data/Statuses.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { config } from 'dotenv';

config();
// const createUser=async(req,res,next)=>{
//     try{
//         const {name,email,password,twitter_handle}=req.body;

//         if(!name || !email || !password) return res.status(WRONG_CODE).send({success:FAILED_STATUS,message:"Enter All Credentials"});
     
//         let user=await User.findOne({email});
     
//         if(user) return res.status(WRONG_CODE).send({success:FAILED_STATUS,message:"User Already Exists"});

//         const timeToStore=Date.now()-minuteToMilliSec(process.env.OTP_EXPIRE_TIME);

//         user=await User.create({
//             name,
//             email,
//             password,
//             twitter_handle,
//             verified_otp_time:timeToStore
//         });

//         const token=generateToken(user._id);

//         createUserCookie(res,token);

//         const respoUser={
//             _id:user._id,
//             name:user.name,
//             email:user.email
//         }

//         res.status(SUCCESS_CODE).send({success:FAILED_STATUS,message:"User created",details:respoUser})
//     }
//     catch(error){
//         res.status(SERVER_ERR_CODE).send({success:FAILED_STATUS,message:SERVER_ERR_MSG,error:error.message});
//     }
// }

const loginHospital=async(req,res,next)=>{
    try{
        const {hospital_id,password}=req.body;
         
        const hospital=await Hospital.findOne({hospital_id});
        if(!hospital) return res.status(WRONG_CODE).send({success:false,message:"Wrong Credentials (no hospital)"});
        

        const passMatch = password === hospital.password;
                
        if(!passMatch) return res.status(WRONG_CODE).send({success:false,message:"Wrong  (no pass)"}); 

        const token=generateToken(hospital._id);

        createHospitalCookie(res,token);

        res.status(SUCCESS_CODE).send({
            success:SUCCESS_STATUS,
            message:"Logged in",
            hospital:{
            hospital_id:hospital_id,
            token: token }
        });
    }
    catch(error){
        res.status(SERVER_ERR_CODE).send({success:FAILED_STATUS,message:SERVER_ERR_MSG,error:error.message});
    }
}

const getHospitalProfile=async(req,res)=>{
    try{

        const hospital=await Hospital.findById(req.hospital_id).select("-password");

        if(!hospital){
            deleteHospitalCookie(res);
            
            return res.status(NOT_FOUND_CODE).send({success:FAILED_STATUS,message:"Hospital Not Found"});
        } 

        res.status(SUCCESS_CODE).send({success:SUCCESS_STATUS,message:"Cookie Found",hospital:hospital})
    }
    catch(error){
        res.status(SERVER_ERR_CODE).send({success:FAILED_STATUS,message:SERVER_ERR_MSG,error:error.message});
    }
}


const updateHospitalProfile=async(req,res)=>{
    try{
        const hospital=await Hospital.findById(req.hospital_id);
    
        if(!hospital){
            deleteHospitalCookie(res);
    
            return res.status(NOT_FOUND_CODE).send({success:FAILED_STATUS,message:"Account Not Found"});
        } 
    
        const {hospital_id,password,}=req.body;
    
        hospital.hospital_id=hospital_id || hospital.hospital_id;
        hospital.password=password || hospital.password;
  
        const updateHospital=await hospital.save();
    
        res.status(SUCCESS_CODE).send({success:SUCCESS_STATUS,message:"Updated Hospital Profile",details:{
            _id:updateHospital._id,
            name:updateHospital.name
        }});
    }
    catch(error){
        res.status(SERVER_ERR_CODE).send({success:FAILED_STATUS,message:SERVER_ERR_MSG,error:error.message});
    }
}


// const userExists=async(req,res)=>{
//     try{
//         const {email}=req.body;
    
//         let user=await User.findOne({email}).select("-password");
    
//         if(!user) return res.status(NOT_FOUND_CODE).send({success:FAILED_STATUS,message:"User Doesnot Exists"});

//         res.status(SUCCESS_CODE).send({success:SUCCESS_STATUS,message:"User Exists",user:user})
//     }
//     catch(error){
//         res.status(SERVER_ERR_CODE).send({success:FAILED_STATUS,message:SERVER_ERR_MSG,error:error.message});
//     }
// }

const checkOtp=async(req,res,next)=>{
    try{
        const HospitalId=req.params.hospital_id;
        const {otp}=req.body;
    
        const otpFind=await Otp.findById(HospitalId);
        const hospital=await Hospital.findById(HospitalId);
    
        if(!otpFind) return res.status(NOT_FOUND_CODE).send({success:FAILED_STATUS,message:"Otp is Expired"});;
    
        if(otpFind.otpvalue!==otp) return res.status(WRONG_CODE).send({success:FAILED_STATUS,message:"Wrong Otp"})
        
        hospital.verified_otp_time=Date.now();

        await hospital.save();

        res.status(SUCCESS_CODE).send({success:SUCCESS_STATUS,message:"Otp is correct"});
    }
    catch(error){
        res.status(SERVER_ERR_CODE).send({success:FAILED_STATUS,message:SERVER_ERR_MSG,error:error.message});
    }
}

const changePassword=async(req,res,next)=>{
    try{
        const {hospital_id,password}=req.body;
        
        const hospital=await Hospital.findOne({hospital_id});
        
        if(!hospital) return res.status(NOT_FOUND_CODE).send({success:FAILED_STATUS,message:"hospital does not Exists"});
        
        const diffTimeMinutes=milliSecToMinute(Date.now()-hospital.verified_otp_time);
        
        if(diffTimeMinutes>process.env.OTP_EXPIRE_TIME) return res.status(NOT_FOUND_CODE).send({success:FAILED_STATUS,message:"Your Session is expired"});
    
        hospital.password=password || hospital.password;
    
        await hospital.save();
    
        res.status(SUCCESS_CODE).send({
            success:SUCCESS_STATUS,
            message:"Password Changed Successfully",
        });
    }
    catch(error){
        res.status(SERVER_ERR_CODE).send({success:FAILED_STATUS,message:SERVER_ERR_MSG,error:error.message});
    }
}

const logout=async(req,res)=>{
    try{
        deleteHospitalCookie(res);

        res.status(SUCCESS_CODE).send({success:SUCCESS_STATUS,message:"Logout Successfully"});
    }
    catch(error){
        res.status(SERVER_ERR_CODE).send({success:FAILED_STATUS,message:SERVER_ERR_MSG,error:error.message});
    }
}

const fetchAllPatients = async (req, res) => {
    try {
        const { hospital_id } = req.query; // Get hospital_id from query parameters if provided
        let patients;

        if (hospital_id) {
            patients = await User.find({ 'hospital_id': hospital_id }); // Fetch patients for specific hospital
            console.log('hospital id:', hospital_id);
        } else {
            patients = await User.find(); // Fetch all patients if no hospital_id is provided
        }

        res.status(SUCCESS_CODE).send({ success: SUCCESS_STATUS, message: "Patients fetched successfully", patients: patients });
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(SERVER_ERR_CODE).send({ success: FAILED_STATUS, message: SERVER_ERR_MSG, error: error.message });
    }
};


const emailUser = process.env.FROM_EMAIL;  
const emailPass = process.env.FROM_PASSWORD;    


const sendInvitationEmail = async (userId, doctorId, password, hospital_id, email) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });

  const mailOptions = {
    from: `"OncoCare" <${emailUser}>`, // sender address
    to: `${email}`, // list of receivers
    subject: "Your Invitation to OncoCare", // Subject line
    text: `Dear User,

You have been invited to join OncoCare. Here are your details:

User ID: ${userId}
Doctor ID: ${doctorId}
Hospital ID: ${hospital_id}
Password: ${password}

Please log in to your account using the above credentials.

Best regards,
OncoCare Team`, // plain text body
    // html: "<b>Hello world?</b>" // html body
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};



// Endpoint to send invitation email to a patient
const sendInvitationEmailHandler = async (req, res) => {
  const { userId, doctorId, password, hospital_id, email } = req.body;

  try {
    await sendInvitationEmail(userId, doctorId, password, hospital_id, email);
    res.status(SUCCESS_CODE).send({ success: SUCCESS_STATUS, message: "Invitation email sent successfully" });
  } catch (error) {
    console.error('Error sending invitation email:', error);
    res.status(SERVER_ERR_CODE).send({ success: FAILED_STATUS, message: SERVER_ERR_MSG, error: error.message });
  }
};


const addNewPatient = async (req, res) => {
    try {
        const patientData = req.body; // Get patient data from the request body

        // Insert the patient data into the User collection
        await User.create(patientData);

        res.status(SUCCESS_CODE).send({ success: SUCCESS_STATUS, message: "Patient added successfully" });
    } catch (error) {
        console.error('Error adding patient:', error);
        res.status(SERVER_ERR_CODE).send({ success: FAILED_STATUS, message: SERVER_ERR_MSG, error: error.message });
    }
};



export {
    // createHospital,
    loginHospital,getHospitalProfile,updateHospitalProfile,checkOtp,changePassword,
    // HospitalExists,
    logout,fetchAllPatients,sendInvitationEmailHandler, sendInvitationEmail,addNewPatient};
