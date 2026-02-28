import express from "express";

import { addDoctor, adminLogin, getAllDoctors, getAllAppointments, cancelAppointmentAdmin, deleteDoctor, updateSubscription, addReceptionist } from "../controller/adminController.js";
import upload from "../middlewares/multer.js";
import { authAdmin } from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controller/doctorsController.js";
import { adminSymptomChecker } from "../controller/aiController.js";


const adminRoute = express.Router();

adminRoute.post('/add-doctors', authAdmin, upload.single('image'), addDoctor);
adminRoute.post('/login', adminLogin);
adminRoute.get('/all-doctors', authAdmin, getAllDoctors);
adminRoute.post('/change-availability', authAdmin, changeAvailability);
adminRoute.get('/all-appointments', authAdmin, getAllAppointments);
adminRoute.post('/cancel-appointment', authAdmin, cancelAppointmentAdmin);
adminRoute.post('/delete-doctor', authAdmin, deleteDoctor);
adminRoute.post('/update-subscription', authAdmin, updateSubscription);
adminRoute.post('/add-receptionist', authAdmin, addReceptionist);
adminRoute.post('/ai-symptom-check', authAdmin, adminSymptomChecker);


export default adminRoute;