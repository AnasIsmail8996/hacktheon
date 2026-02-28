import User from "../models/usersModel.js";
import AppointmentModel from "../models/appointmentModel.js";
import Doctor from "../models/doctorsModel.js";
import bcrypt from "bcrypt";
import validator from "validator";

// ──────────────────────────────────────────────
// Register a New Patient (by Receptionist)
// ──────────────────────────────────────────────
const registerPatient = async (req, res) => {
    try {
        const { name, email, password, phone, gender, dob, address } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ status: false, message: "Name, email, and password are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ status: false, message: "Invalid email format" });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ status: false, message: "Patient with this email already exists" });
        }

        const hashPass = await bcrypt.hash(password || "Clinic@123", 10);

        const patient = await User.create({
            name,
            email,
            password: hashPass,
            phone: phone || "0000000000",
            gender: gender || "Not Selected",
            dob: dob || "Not Selected",
            address: address ? (typeof address === "string" ? JSON.parse(address) : address) : { line1: "", line2: "" },
            role: "patient",
        });

        return res.status(201).json({
            status: true,
            message: "Patient registered successfully",
            data: {
                id: patient._id,
                name: patient.name,
                email: patient.email,
            },
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};

// ──────────────────────────────────────────────
// Get All Patients
// ──────────────────────────────────────────────
const getAllPatients = async (req, res) => {
    try {
        const patients = await User.find({ role: "patient" }).select("-password").sort({ createdAt: -1 });
        return res.status(200).json({ status: true, data: patients });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};

// ──────────────────────────────────────────────
// Book Appointment (by Receptionist)
// ──────────────────────────────────────────────
const bookAppointmentReceptionist = async (req, res) => {
    try {
        const { patientId, docId, slotDate, slotTime } = req.body;

        if (!patientId || !docId || !slotDate || !slotTime) {
            return res.status(400).json({ status: false, message: "patientId, docId, slotDate, slotTime are required" });
        }

        const docData = await Doctor.findById(docId).select("-password");
        if (!docData) return res.status(404).json({ status: false, message: "Doctor not found" });

        if (!docData.available) {
            return res.status(400).json({ status: false, message: "Doctor is not available" });
        }

        let slots_booked = docData.slots_booked || {};
        if (slots_booked[slotDate]?.includes(slotTime)) {
            return res.status(400).json({ status: false, message: "Time slot already booked" });
        }

        slots_booked[slotDate] = slots_booked[slotDate] ? [...slots_booked[slotDate], slotTime] : [slotTime];

        const userData = await User.findById(patientId).select("-password");
        if (!userData) return res.status(404).json({ status: false, message: "Patient not found" });

        const { slots_booked: _, ...doctorInfo } = docData._doc;

        const appointment = new AppointmentModel({
            userId: patientId,
            docId,
            userData,
            docData: doctorInfo,
            amount: docData.fees,
            slotDate,
            slotTime,
            date: Date.now(),
        });

        await appointment.save();
        await Doctor.findByIdAndUpdate(docId, { slots_booked });

        return res.status(200).json({
            status: true,
            message: "Appointment booked successfully",
            data: appointment,
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};

// ──────────────────────────────────────────────
// Get Today's Schedule
// ──────────────────────────────────────────────
const getTodaySchedule = async (req, res) => {
    try {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();
        const todayStr = `${dd}_${mm}_${yyyy}`;

        const appointments = await AppointmentModel.find({
            slotDate: todayStr,
            cancelled: false,
        }).sort({ slotTime: 1 });

        return res.status(200).json({ status: true, data: appointments, date: todayStr });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};

export { registerPatient, getAllPatients, bookAppointmentReceptionist, getTodaySchedule };
