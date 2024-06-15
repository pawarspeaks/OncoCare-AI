import express from "express";
import {loginAdmin, checkOtp, changePassword, logout,fetchAllPatients,updateUserProfile,updateHospitalProfile} from "../Controllers/AdminController.js";
import { isAuthenticatedAdmin,isAuthenticatedUser,isVerifiedAdmin } from "../Middlewares/auth.js";
import { sendEmail } from "../Features/sendEmail.js";

const AdminRouter=express.Router();

// AdminRouter.post("/create",createUser);

AdminRouter.post("/login",loginAdmin);

AdminRouter.post("/sendemail",sendEmail);

// AdminRouter.post("/exists",userExists);

AdminRouter.post("/checkotp/:userId",checkOtp);

AdminRouter.put("/changepassword",changePassword);

AdminRouter.post("/logout",isAuthenticatedAdmin,logout);

AdminRouter.get("/patients", isAuthenticatedAdmin, fetchAllPatients);

AdminRouter.put("/update-patient",isAuthenticatedAdmin, updateUserProfile);

AdminRouter.put("/update-hospital",isAuthenticatedAdmin, updateHospitalProfile);

AdminRouter.post("/verified",isVerifiedAdmin);

export default AdminRouter;
