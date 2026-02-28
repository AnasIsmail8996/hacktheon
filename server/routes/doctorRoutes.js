import express from "express";
import { doctorsList } from "../controller/doctorsController.js";

const doctorsRoute = express.Router();

// route definition
doctorsRoute.get("/doctor-list", doctorsList);

export default doctorsRoute;
