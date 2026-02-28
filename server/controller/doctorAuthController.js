import Doctor from "../models/doctorsModel.js";
import AppointmentModel from "../models/appointmentModel.js";
import Prescription from "../models/prescriptionModel.js";
import DiagnosisLog from "../models/diagnosisLogsModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ──────────────────────────────────────────────
// Doctor Login
// ──────────────────────────────────────────────
const doctorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: false, message: "Email and password are required" });
        }

        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(404).json({ status: false, message: "Doctor not found" });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.status(401).json({ status: false, message: "Incorrect password" });
        }

        const token = jwt.sign(
            { doctorId: doctor._id, email: doctor.email },
            process.env.SECRET_KEY,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            status: true,
            message: "Doctor login successful",
            token,
            doctor: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                speciality: doctor.speciality,
                image: doctor.image,
            },
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};

// ──────────────────────────────────────────────
// Get Doctor Profile
// ──────────────────────────────────────────────
const getDoctorProfile = async (req, res) => {
    try {
        const { doctorId } = req.doctor;
        const doctor = await Doctor.findById(doctorId).select("-password");
        if (!doctor) return res.status(404).json({ status: false, message: "Doctor not found" });
        return res.status(200).json({ status: true, data: doctor });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};

// ──────────────────────────────────────────────
// Get Doctor Appointments
// ──────────────────────────────────────────────
const getDoctorAppointments = async (req, res) => {
    try {
        const { doctorId } = req.doctor;
        const appointments = await AppointmentModel.find({ docId: doctorId }).sort({ date: -1 });
        return res.status(200).json({ status: true, data: appointments });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};

// ──────────────────────────────────────────────
// Mark Appointment as Completed
// ──────────────────────────────────────────────
const completeAppointment = async (req, res) => {
    try {
        const { doctorId } = req.doctor;
        const { appointmentId } = req.body;

        const apt = await AppointmentModel.findById(appointmentId);
        if (!apt) return res.status(404).json({ status: false, message: "Appointment not found" });
        if (apt.docId.toString() !== doctorId.toString()) {
            return res.status(403).json({ status: false, message: "Unauthorized" });
        }

        await AppointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
        return res.status(200).json({ status: true, message: "Appointment marked as completed" });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};

// ──────────────────────────────────────────────
// Cancel Appointment (by doctor)
// ──────────────────────────────────────────────
const cancelAppointmentByDoctor = async (req, res) => {
    try {
        const { doctorId } = req.doctor;
        const { appointmentId } = req.body;

        const apt = await AppointmentModel.findById(appointmentId);
        if (!apt) return res.status(404).json({ status: false, message: "Appointment not found" });
        if (apt.docId.toString() !== doctorId.toString()) {
            return res.status(403).json({ status: false, message: "Unauthorized" });
        }

        await AppointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
        return res.status(200).json({ status: true, message: "Appointment cancelled" });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};

// ──────────────────────────────────────────────
// Doctor Dashboard Stats
// ──────────────────────────────────────────────
const getDoctorDashboard = async (req, res) => {
    try {
        const { doctorId } = req.doctor;

        const appointments = await AppointmentModel.find({ docId: doctorId });
        const prescriptions = await Prescription.find({ doctorId });
        const diagnosisLogs = await DiagnosisLog.find({ doctorId });

        const earnings = appointments
            .filter((a) => a.isCompleted)
            .reduce((sum, a) => sum + (a.amount || 0), 0);

        const uniquePatients = [...new Set(appointments.map((a) => a.userId))].length;

        // monthly breakdown (last 6 months)
        const monthly = {};
        appointments.forEach((a) => {
            const d = new Date(a.date);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            monthly[key] = (monthly[key] || 0) + 1;
        });

        return res.status(200).json({
            status: true,
            data: {
                totalAppointments: appointments.length,
                completedAppointments: appointments.filter((a) => a.isCompleted).length,
                cancelledAppointments: appointments.filter((a) => a.cancelled).length,
                totalPrescriptions: prescriptions.length,
                totalDiagnosis: diagnosisLogs.length,
                earnings,
                uniquePatients,
                latestAppointments: appointments.slice(-5).reverse(),
                monthlyAppointments: monthly,
            },
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};

export {
    doctorLogin,
    getDoctorProfile,
    getDoctorAppointments,
    completeAppointment,
    cancelAppointmentByDoctor,
    getDoctorDashboard,
};
