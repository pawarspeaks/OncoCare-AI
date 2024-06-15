import { createUserCookie, deleteUserCookie, generateToken, milliSecToMinute, minuteToMilliSec } from "../Features/feature.js";
import User from "../Models/UserModel.js";
import Otp from "../Models/otpModel.js";
import { FAILED_STATUS, NOT_FOUND_CODE, SERVER_ERR_CODE, SERVER_ERR_MSG, SUCCESS_CODE, SUCCESS_STATUS, WRONG_CODE } from "../data/Statuses.js";
import bcrypt from "bcryptjs";

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


const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Find user by email in the nested patientDetails
        const user = await User.findOne({'email': email});;
        // Check if the user exists
        if (!user) {
            return res.status(WRONG_CODE).send({ success: false, message: "Wrong Credentials (email not found)" });
        }

        // Compare the password
        const passMatch = password === user.password;

        // If passwords do not match
        if (!passMatch) {
            return res.status(WRONG_CODE).send({ success: false, message: "Wrong Credentials (password mismatch)" });
        }

        // Generate token
        const token = generateToken(user._id);

        // Create user cookie
        createUserCookie(res, token);

        res.status(SUCCESS_CODE).send({
            success: SUCCESS_STATUS,
            message: "Logged in",
            user: {
                email: user.email,
                _id: user._id,
                token: token  }
        });
    } catch (error) {
        res.status(SERVER_ERR_CODE).send({ success: FAILED_STATUS, message: SERVER_ERR_MSG, error: error.message });
    }
};



const getUserProfile=async(req,res)=>{
    try{
        const user=await User.findById(req.userId).select("-password");

        if(!user){
            deleteUserCookie(res);
            
            return res.status(NOT_FOUND_CODE).send({success:FAILED_STATUS,message:"User Not Found"});
        } 

        res.status(SUCCESS_CODE).send({success:SUCCESS_STATUS,message:"Cookie Found",user:user})
    }
    catch(error){
        res.status(SERVER_ERR_CODE).send({success:FAILED_STATUS,message:SERVER_ERR_MSG,error:error.message});
    }
}


const updateUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.userId);
  
      if (!user) {
    
        return res.status(NOT_FOUND_CODE).send({ success: FAILED_STATUS, message: "Account Not Found" });
      }
  
      // Extract details from the request body
      const { email, password, doctorId, hospital_id, patientDetails } = req.body;
  
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
          treatment: patientDetails.treatment || user.patientDetails.treatment,
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
        deleteUserCookie(res);

        res.status(SUCCESS_CODE).send({success:SUCCESS_STATUS,message:"Logout Successfully"});
    }
    catch(error){
        res.status(SERVER_ERR_CODE).send({success:FAILED_STATUS,message:SERVER_ERR_MSG,error:error.message});
    }
}


const sendMessage = async (req, res) => {
    try {
        const userId = req.params.userId; // Extract user ID from request parameters
        const message = `Hello, User ${userId}!`; // Construct the message using the user ID
        res.status(200).json({ message }); // Send the message as JSON response
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
};



export {
    // createUser
    loginUser,getUserProfile,updateUserProfile,checkOtp,changePassword,userExists,logout,sendMessage};
