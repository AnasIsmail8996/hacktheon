import express from "express";
import {
    createPrescription,
    getPatientPrescriptions,
    getPrescriptionById,
    downloadPrescriptionPDF,
} from "../controller/prescriptionController.js";
import { authDoctor } from "../middlewares/authDoctor.js";
import { userAuth } from "../middlewares/authUser.js";

const prescriptionRouter = express.Router();

// Doctor creates prescription
prescriptionRouter.post("/create", authDoctor, createPrescription);

// Patient views their prescriptions
prescriptionRouter.get("/my-prescriptions", userAuth, getPatientPrescriptions);

// Get single prescription (both doctor and patient may access)
prescriptionRouter.get("/:id", getPrescriptionById);

// Download PDF (open/unauthenticated for easy download link sharing)
prescriptionRouter.get("/pdf/:id", downloadPrescriptionPDF);

export default prescriptionRouter;
