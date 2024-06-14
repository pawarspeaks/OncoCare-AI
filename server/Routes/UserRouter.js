import express from "express";
import {loginUser, checkOtp, changePassword, logout, getUserProfile} from "../Controllers/UserController.js";
import { isAuthenticatedUser } from "../Middlewares/auth.js";
import { sendEmail } from "../Features/sendEmail.js";

const userRouter=express.Router();

// userRouter.post("/create",createUser);

userRouter.post("/login",loginUser);

userRouter.get("/profile",isAuthenticatedUser,getUserProfile);

// userRouter.put("/profile",isAuthenticatedUser,updateUserProfile);

userRouter.post("/sendemail",sendEmail);

// userRouter.post("/exists",userExists);

userRouter.post("/checkotp/:userId",checkOtp);

userRouter.put("/changepassword",changePassword);

userRouter.post("/logout",isAuthenticatedUser,logout);


export default userRouter;
