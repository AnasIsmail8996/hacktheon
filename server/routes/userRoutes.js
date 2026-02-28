import express from "express";
import { getProfile, registerUser, updateProfile, userLogin , bookAppointment ,listAppointment, cancelAppointments } from "../controller/userController.js";
import { userAuth } from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";


const userRoute = express.Router();


userRoute.post("/register", registerUser);
userRoute.post("/login", userLogin);
userRoute.get("/get-profile", userAuth ,  getProfile);
userRoute.post("/update-profile", upload.single('image') , userAuth , updateProfile);
userRoute.post("/book-appointment" , userAuth , bookAppointment);
userRoute.get("/appointment" , userAuth ,listAppointment);
userRoute.post("/cancel-appointment" , userAuth , cancelAppointments);


export default userRoute;
