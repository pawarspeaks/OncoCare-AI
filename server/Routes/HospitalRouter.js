import express from "express";
import {loginHospital, checkOtp, changePassword ,logout, getHospitalProfile, fetchAllPatients, sendInvitationEmailHandler, sendInvitationEmail, addNewPatient, parseUnstructuredData, generatePromptsHandler, fetchAllHospitals} from "../Controllers/HospitalController.js";
import {updateUserProfile} from "../Controllers/UserController.js";
import { isAuthenticatedHospital,isVerifiedHospital } from "../Middlewares/auth.js";
// import { sendEmail } from "../Features/sendEmail.js";

const HospitalRouter=express.Router();

// HospitalRouter.post("/create",createHospital);

HospitalRouter.post("/login",loginHospital);

HospitalRouter.get("/profile",isAuthenticatedHospital,getHospitalProfile);

// HospitalRouter.put("/profile",isAuthenticatedHospital,updateUserProfile);

// HospitalRouter.post("/sendemail",sendEmail);

// HospitalRouter.post("/exists",userExists);

HospitalRouter.post("/checkotp/:userId",checkOtp);

HospitalRouter.put("/changepassword",changePassword);

HospitalRouter.post("/logout",isAuthenticatedHospital,logout);

HospitalRouter.post("/verified",isVerifiedHospital);

HospitalRouter.get("/patients",isAuthenticatedHospital,fetchAllPatients);

HospitalRouter.post('/send-invitation-email', sendInvitationEmailHandler);

HospitalRouter.post('/addNewPatient',isAuthenticatedHospital, addNewPatient);

HospitalRouter.post('/parse-unstructured',isAuthenticatedHospital, parseUnstructuredData);

HospitalRouter.get('/all', fetchAllHospitals);

HospitalRouter.put("/update-patient",isAuthenticatedHospital,updateUserProfile);

export default HospitalRouter;
