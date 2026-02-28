import express from "express";
import {
    registerPatient,
    getAllPatients,
    bookAppointmentReceptionist,
    getTodaySchedule,
} from "../controller/receptionistController.js";
import { authAdmin } from "../middlewares/authAdmin.js";

// Receptionist routes protected by admin token (or separated later)
const receptionistRouter = express.Router();

receptionistRouter.post("/register-patient", authAdmin, registerPatient);
receptionistRouter.get("/patients", authAdmin, getAllPatients);
receptionistRouter.post("/book-appointment", authAdmin, bookAppointmentReceptionist);
receptionistRouter.get("/today-schedule", authAdmin, getTodaySchedule);

export default receptionistRouter;
