import { createAdminCookie, deleteAdminCookie, generateToken, milliSecToMinute, minuteToMilliSec } from "../Features/feature.js";
import Admin from "../Models/AdminModel.js";
import User from "../Models/UserModel.js";
import Hospital from "../Models/HospitalModel.js";
import Otp from "../Models/otpModel.js";
import { FAILED_STATUS, NOT_FOUND_CODE, SERVER_ERR_CODE, SERVER_ERR_MSG, SUCCESS_CODE, SUCCESS_STATUS, WRONG_CODE } from "../data/Statuses.js";
// import bcrypt from "bcryptjs";

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
const loginAdmin=async(req,res,next)=>{
    try{
        const {email,password}=req.body;
         
        const admin=await Admin.findOne({email});
        if(!admin) return res.status(WRONG_CODE).send({success:false,message:"Wrong Credentials (email not found)"});

        const passMatch = password === admin.password;

        if(!passMatch) return res.status(WRONG_CODE).send({success:false,message:"Wrong Credentials (pass did not match)"}); 
        const token=generateToken(admin._id);

        createAdminCookie(res,token);
        console.log("Cookie token was created!")

        res.status(SUCCESS_CODE).send({
            success:SUCCESS_STATUS,
            message:"Logged in",
            admin:{
            email:admin.email,
            _id:admin._id,
            token: token }
        });
    }
    catch(error){
        res.status(SERVER_ERR_CODE).send({success:FAILED_STATUS,message:SERVER_ERR_MSG,error:error.message});
    }
}

const getUserProfile=async(req,res)=>{
    try{
        const user=await User.findById(req.userId).select("-password");

        if(!user){
            deleteAdminCookie(res);
            
            return res.status(NOT_FOUND_CODE).send({success:FAILED_STATUS,message:"User Not Found"});
        } 

        res.status(SUCCESS_CODE).send({success:SUCCESS_STATUS,message:"Cookie Found",user:user})
    }
    catch(error){
        res.status(SERVER_ERR_CODE).send({success:FAILED_STATUS,message:SERVER_ERR_MSG,error:error.message});
    }
}


const userExists=async(req,res)=>{
    try{
        const {email}=req.body;
    
        let user=await User.findOne({email}).select("-password");
    
        if(!user) return res.status(NOT_FOUND_CODE).send({success:FAILED_STATUS,message:"User Doesnot Exists"});

        res.status(SUCCESS_CODE).send({success:SUCCESS_STATUS,message:"User Exists",user:user})
    }
    catch(error){
        res.status(SERVER_ERR_CODE).send({success:FAILED_STATUS,message:SERVER_ERR_MSG,error:error.message});
    }
}

const checkOtp=async(req,res,next)=>{
    try{
        const userId=req.params.userId;
        const {otp}=req.body;
    
        const otpFind=await Otp.findById(userId);
        const user=await User.findById(userId);
    
        if(!otpFind) return res.status(NOT_FOUND_CODE).send({success:FAILED_STATUS,message:"Otp is Expired"});;
    
        if(otpFind.otpvalue!==otp) return res.status(WRONG_CODE).send({success:FAILED_STATUS,message:"Wrong Otp"})
        
        user.verified_otp_time=Date.now();

        await user.save();

        res.status(SUCCESS_CODE).send({success:SUCCESS_STATUS,message:"Otp is correct"});
    }
    catch(error){
        res.status(SERVER_ERR_CODE).send({success:FAILED_STATUS,message:SERVER_ERR_MSG,error:error.message});
    }
}

const changePassword=async(req,res,next)=>{
    try{
        const {email,password}=req.body;
        
        const user=await User.findOne({email});
        
        if(!user) return res.status(NOT_FOUND_CODE).send({success:FAILED_STATUS,message:"User does not Exists"});
        
        const diffTimeMinutes=milliSecToMinute(Date.now()-user.verified_otp_time);
        
        if(diffTimeMinutes>process.env.OTP_EXPIRE_TIME) return res.status(NOT_FOUND_CODE).send({success:FAILED_STATUS,message:"Your Session is expired"});
    
        user.password=password || user.password;
    
        await user.save();
    
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
        deleteAdminCookie(res);

        res.status(SUCCESS_CODE).send({success:SUCCESS_STATUS,message:"Logout Successfully"});
    }
    catch(error){
        res.status(SERVER_ERR_CODE).send({success:FAILED_STATUS,message:SERVER_ERR_MSG,error:error.message});
    }
}




const fetchAllPatients = async (req, res) => {
    try {
        const patients = await User.find({}); // Adjust this query as per your schema

        if (!patients) {
            return res.status(NOT_FOUND_CODE).send({ success: FAILED_STATUS, message: "No patients found" });
        }

        // Map patients data as needed
        const mappedPatients = patients.map(patient => ({
            _id: patient._id,
            name: patient.patientDetails.name,
            email: patient.email,
            userId: patient.userId,
            age: patient.patientDetails.age,
            hospital_id: patient.hospital_id,
            gender: patient.patientDetails.gender
            // Add other fields as needed
        }));

        res.status(SUCCESS_CODE).send({ success: SUCCESS_STATUS, message: "Patients retrieved successfully", patients: mappedPatients });
    } catch (error) {
        console.error("Error fetching patients:", error);
        res.status(SERVER_ERR_CODE).send({ success: FAILED_STATUS, message: SERVER_ERR_MSG, error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        // Extract userId from the request body
        const { userId, email, password, doctorId, hospital_id, patientDetails } = req.body;
        
        // Find the user by userId
        const user = await User.findOne({ userId });
        
        if (!user) {
            return res.status(NOT_FOUND_CODE).send({ success: FAILED_STATUS, message: "Account Not Found" });
        }
        
        // Update the user fields if they are provided in the request
        user.email = email || user.email;
        user.password = password || user.password;
        user.doctorId = doctorId || user.doctorId;
        user.hospital_id = hospital_id || user.hospital_id;
        
        // Update patient details if provided in the request
        if (patientDetails) {
            user.patientDetails = {
                ...user.patientDetails, // Keep existing details
                ...patientDetails, // Override with new details
                comorbidities: patientDetails.comorbidities || user.patientDetails.comorbidities,
                diseaseStates: patientDetails.diseaseStates || user.patientDetails.diseaseStates,
                procedures: patientDetails.procedures || user.patientDetails.procedures,
                treatments: patientDetails.treatments || user.patientDetails.treatments,
                labResults: patientDetails.labResults || user.patientDetails.labResults,
                imagingStudies: patientDetails.imagingStudies || user.patientDetails.imagingStudies,
                medications: patientDetails.medications || user.patientDetails.medications,
            };
        }
        
        // Save the updated user
        const updatedUser = await user.save();
        
        // Send the response with updated user details
        res.status(SUCCESS_CODE).send({
            success: SUCCESS_STATUS,
            message: "Updated User Profile",
            details: {
                _id: updatedUser._id,
                userId: updatedUser.userId,
                email: updatedUser.email,
                doctorId: updatedUser.doctorId,
                hospital_id: updatedUser.hospital_id,
                patientDetails: updatedUser.patientDetails,
            },
        });
    } catch (error) {
        res.status(SERVER_ERR_CODE).send({ success: FAILED_STATUS, message: SERVER_ERR_MSG, error: error.message });
    }
};

const updateHospitalProfile = async (req, res) => {
    try {
        // Extract hospital_id from the request body
        const { hospital_id, hospital_name, password } = req.body;
        console.log('Request received:', { hospital_id, hospital_name, password });

        // Check if the payload is correct
        if (!hospital_id || !hospital_name || !password) {
            return res.status(400).send({ success: false, message: "Invalid request payload" });
        }

        // Find the hospital by hospital_id and update its fields
        const updatedHospital = await Hospital.findOneAndUpdate(
            { hospital_id },
            { $set: { hospital_name, password } },
            { new: true, useFindAndModify: false } // Return the updated document
        );

        console.log('Hospital updated:', updatedHospital);

        if (!updatedHospital) {
            return res.status(NOT_FOUND_CODE).send({ success: FAILED_STATUS, message: "Hospital Not Found" });
        }

        res.status(SUCCESS_CODE).send({
            success: SUCCESS_STATUS,
            message: "Updated Hospital Profile",
            details: {
                _id: updatedHospital._id,
                hospital_id: updatedHospital.hospital_id,
                hospital_name: updatedHospital.hospital_name,
                password: updatedHospital.password,
            },
        });
    } catch (error) {
        console.log('Error:', error.message);
        res.status(SERVER_ERR_CODE).send({ success: FAILED_STATUS, message: SERVER_ERR_MSG, error: error.message });
    }
};


export {
    // createUser,
    loginAdmin,getUserProfile,updateUserProfile,checkOtp,changePassword,userExists,logout,fetchAllPatients,updateHospitalProfile};
