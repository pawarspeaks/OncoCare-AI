import express from 'express';
import {
  loginHospital,
  checkOtp,
  changePassword,
  logout,
  getHospitalProfile,
  fetchAllPatients,
  sendInvitationEmailHandler,
  fetchAllHospitals
} from '../Controllers/HospitalController.js';
import { isAuthenticatedHospital, isVerifiedHospital } from '../Middlewares/auth.js';

const HospitalRouter = express.Router();

HospitalRouter.post('/login', loginHospital);
HospitalRouter.get('/profile', isAuthenticatedHospital, getHospitalProfile);
HospitalRouter.post('/checkotp/:userId', checkOtp);
HospitalRouter.put('/changepassword', changePassword);
HospitalRouter.post('/logout', isAuthenticatedHospital, logout);
HospitalRouter.post('/verified', isVerifiedHospital);
HospitalRouter.get('/patients', isAuthenticatedHospital, fetchAllPatients); // Updated route to fetch patients
HospitalRouter.post('/send-invitation-email', sendInvitationEmailHandler);
HospitalRouter.get('/all', fetchAllHospitals);

export default HospitalRouter;
