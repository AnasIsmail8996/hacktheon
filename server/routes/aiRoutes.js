import express from "express";
import { explainPrescription, riskFlagging } from "../controller/aiController.js";
import { authDoctor } from "../middlewares/authDoctor.js";
import { userAuth } from "../middlewares/authUser.js";

const aiRouter = express.Router();

// Patient requests AI explanation of their prescription
aiRouter.post("/explain-prescription", userAuth, explainPrescription);

// Doctor requests risk-flagging for a patient
aiRouter.get("/risk-flags/:patientId", authDoctor, riskFlagging);

export default aiRouter;
