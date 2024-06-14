import express from "express";
import { loginUser, getUserProfile, sendMessage, checkOtp, changePassword, logout } from "../Controllers/UserController.js";
import { isAuthenticatedUser } from "../Middlewares/auth.js";
import { sendEmail } from "../Features/sendEmail.js";

const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.get("/profile", isAuthenticatedUser, getUserProfile);
userRouter.post("/sendemail", sendEmail);
userRouter.post("/checkotp/:userId", checkOtp);
userRouter.put("/changepassword", changePassword);
userRouter.post("/logout", isAuthenticatedUser, logout);
userRouter.post("/sendmessage/:userId", isAuthenticatedUser, sendMessage); // Add the sendMessage route here

export default userRouter;
