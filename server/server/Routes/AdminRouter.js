import express from "express";
import {loginAdmin, checkOtp, changePassword, logout} from "../Controllers/AdminController.js";
import { isAuthenticatedAdmin } from "../Middlewares/auth.js";
import { sendEmail } from "../Features/sendEmail.js";

const AdminRouter=express.Router();

// AdminRouter.post("/create",createUser);

AdminRouter.post("/login",loginAdmin);

// AdminRouter.get("/profile",isAuthenticatedAdmin,getUserProfile);

// AdminRouter.put("/profile",isAuthenticatedAdmin,updateUserProfile);

AdminRouter.post("/sendemail",sendEmail);

// AdminRouter.post("/exists",userExists);

AdminRouter.post("/checkotp/:userId",checkOtp);

AdminRouter.put("/changepassword",changePassword);

AdminRouter.post("/logout",isAuthenticatedAdmin,logout);

export default AdminRouter;
