import express from "express";
import {loginUser, checkOtp, changePassword, logout, getUserProfile,sendMessage,updateUserProfile} from "../Controllers/UserController.js";
import { isAuthenticatedUser,isVerifiedUser } from "../Middlewares/auth.js";
// import { isAuthenticatedAdmin } from "../Middlewares/auth.js";
import { sendEmail } from "../Features/sendEmail.js";

const userRouter=express.Router();

// userRouter.post("/create",createUser);

userRouter.post("/login",loginUser);

userRouter.get("/profile",isAuthenticatedUser,getUserProfile);

// userRouter.put("/update-patient",isAuthenticatedUser,updateUserProfile);

userRouter.post("/sendemail",sendEmail);

// userRouter.post("/exists",userExists);

userRouter.post("/checkotp/:userId",checkOtp);

userRouter.put("/changepassword",changePassword);

userRouter.post("/logout",isAuthenticatedUser,logout);

userRouter.post("/sendmessage/:userId", isAuthenticatedUser, sendMessage); // Add the sendMessage route here

userRouter.post("/verified",isVerifiedUser);

export default userRouter;
