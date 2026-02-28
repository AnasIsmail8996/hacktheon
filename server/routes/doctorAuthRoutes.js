import express from "express";
import {
    doctorLogin,
    getDoctorProfile,
    getDoctorAppointments,
    completeAppointment,
    cancelAppointmentByDoctor,
    getDoctorDashboard,
} from "../controller/doctorAuthController.js";
import { authDoctor } from "../middlewares/authDoctor.js";
import { changeAvailability, doctorsList } from "../controller/doctorsController.js";
import { getDoctorPrescriptions } from "../controller/prescriptionController.js";
import { symptomChecker } from "../controller/aiController.js";

const doctorRouter = express.Router();

// Public
doctorRouter.post("/login", doctorLogin);
doctorRouter.get("/list", doctorsList);

// Protected (needs doctor token via "dtoken" header)
doctorRouter.get("/profile", authDoctor, getDoctorProfile);
doctorRouter.get("/appointments", authDoctor, getDoctorAppointments);
doctorRouter.get("/dashboard", authDoctor, getDoctorDashboard);
doctorRouter.post("/complete-appointment", authDoctor, completeAppointment);
doctorRouter.post("/cancel-appointment", authDoctor, cancelAppointmentByDoctor);
doctorRouter.post("/change-availability", authDoctor, changeAvailability);
doctorRouter.get("/prescriptions", authDoctor, getDoctorPrescriptions);
doctorRouter.post("/symptom-checker", authDoctor, symptomChecker);

export default doctorRouter;
