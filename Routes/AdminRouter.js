import express from "express";
import { loginAdmin, checkOtp, changePassword, logout, fetchAllPatients } from "../Controllers/AdminController.js";
import { isAuthenticatedAdmin } from "../Middlewares/auth.js";
import { sendEmail } from "../Features/sendEmail.js";

const AdminRouter = express.Router();

// Endpoint to login admin
AdminRouter.post("/login", loginAdmin);

// Endpoint to send email (assuming this is handled by sendEmail function)
AdminRouter.post("/sendemail", sendEmail);

// Endpoint to check OTP for admin
AdminRouter.post("/checkotp/:userId", checkOtp);

// Endpoint to change admin password
AdminRouter.put("/changepassword", changePassword);

// Endpoint to logout admin
AdminRouter.post("/logout", isAuthenticatedAdmin, logout);

// Endpoint to fetch all patients (secured with isAuthenticatedAdmin middleware)
AdminRouter.get("/patients", isAuthenticatedAdmin, fetchAllPatients);

export default AdminRouter;
