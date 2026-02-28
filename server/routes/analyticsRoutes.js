import express from "express";
import { getAdminAnalytics, getPatientHistory } from "../controller/analyticsController.js";
import { authAdmin } from "../middlewares/authAdmin.js";
import { userAuth } from "../middlewares/authUser.js";

const analyticsRouter = express.Router();

// Admin analytics dashboard
analyticsRouter.get("/admin", authAdmin, getAdminAnalytics);

// Patient medical history timeline (accessible by patient)
analyticsRouter.get("/patient-history/:patientId", userAuth, getPatientHistory);

export default analyticsRouter;
