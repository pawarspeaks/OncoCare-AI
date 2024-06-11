import { createAdminCookie, deleteAdminCookie, generateToken, milliSecToMinute, minuteToMilliSec } from "../Features/feature.js";
import Admin from "../Models/AdminModel.js";
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
const loginAdmin=async(req,res,next)=>{
    try{
        const {email,password}=req.body;
         
        const admin=await Admin.findOne({email});
        if(!admin) return res.status(WRONG_CODE).send({success:false,message:"Wrong Credentials (email not found)"});

        const passMatch = password === admin.password;

        if(!passMatch) return res.status(WRONG_CODE).send({success:false,message:"Wrong Credentials (pass did not match)"}); 

        const token=generateToken(admin._id);

        createAdminCookie(res,token);

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


const updateUserProfile=async(req,res)=>{
    try{
        const user=await User.findById(req.userId);
    
        if(!user){
            deleteAdminCookie(res);
    
            return res.status(NOT_FOUND_CODE).send({success:FAILED_STATUS,message:"Account Not Found"});
        } 
    
        const {name,email,password,context,twitter_handle}=req.body;
    
        user.name=name || user.name;
        user.email=email || user.email;
        user.password=password || user.password;
  
        const updateUser=await user.save();
    
        res.status(SUCCESS_CODE).send({success:SUCCESS_STATUS,message:"Updated User Profile",details:{
            _id:updateUser._id,
            name:updateUser.name,
            email:updateUser.email,

        }});
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

export {
    // createUser,
    loginAdmin,getUserProfile,updateUserProfile,checkOtp,changePassword,userExists,logout};
