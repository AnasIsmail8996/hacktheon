import AppointmentModel from "../models/appointmentModel.js";
import Doctor from "../models/doctorsModel.js";
import User from "../models/usersModel.js";
import Prescription from "../models/prescriptionModel.js";
import DiagnosisLog from "../models/diagnosisLogsModel.js";

// ──────────────────────────────────────────────
// Admin Analytics Dashboard
// ──────────────────────────────────────────────
const getAdminAnalytics = async (req, res) => {
    try {
        const [totalDoctors, totalPatients, allAppointments, totalPrescriptions] = await Promise.all([
            Doctor.countDocuments(),
            User.countDocuments(),
            AppointmentModel.find(),
            Prescription.countDocuments(),
        ]);

        const totalAppointments = allAppointments.length;
        const completedAppointments = allAppointments.filter((a) => a.isCompleted).length;
        const cancelledAppointments = allAppointments.filter((a) => a.cancelled).length;
        const revenue = allAppointments
            .filter((a) => a.isCompleted)
            .reduce((sum, a) => sum + (a.amount || 0), 0);

        // Monthly appointments (last 6 months)
        const now = new Date();
        const monthly = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
            const count = allAppointments.filter((a) => {
                const ad = new Date(a.date);
                return ad.getFullYear() === d.getFullYear() && ad.getMonth() === d.getMonth();
            }).length;
            monthly.push({ month: label, key, count });
        }

        // Most common diagnosis
        const diagnosisLogs = await DiagnosisLog.find();
        const diagnosisCount = {};
        diagnosisLogs.forEach((log) => {
            if (log.possibleConditions?.length) {
                log.possibleConditions.forEach((c) => {
                    diagnosisCount[c] = (diagnosisCount[c] || 0) + 1;
                });
            }
        });
        const topDiagnoses = Object.entries(diagnosisCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));

        // Appointments per doctor
        const doctorStats = await AppointmentModel.aggregate([
            { $group: { _id: "$docId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);

        // Speciality distribution from appointments
        const prescriptions = await Prescription.find().sort({ createdAt: -1 }).limit(5);

        return res.status(200).json({
            status: true,
            data: {
                totalDoctors,
                totalPatients,
                totalAppointments,
                completedAppointments,
                cancelledAppointments,
                totalPrescriptions,
                revenue,
                monthlyAppointments: monthly,
                topDiagnoses,
                doctorStats,
                latestPrescriptions: prescriptions,
            },
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};

// ──────────────────────────────────────────────
// Patient Medical History Timeline
// ──────────────────────────────────────────────
const getPatientHistory = async (req, res) => {
    try {
        const { patientId } = req.params;

        const [appointments, prescriptions, diagnosisLogs] = await Promise.all([
            AppointmentModel.find({ userId: patientId }).sort({ date: -1 }),
            Prescription.find({ patientId }).sort({ createdAt: -1 }),
            DiagnosisLog.find({ patientId }).sort({ createdAt: -1 }),
        ]);

        // Build combined timeline
        const timeline = [];

        appointments.forEach((a) => {
            timeline.push({
                type: "appointment",
                date: new Date(a.date),
                data: {
                    doctor: a.docData?.name || "Doctor",
                    speciality: a.docData?.speciality || "",
                    slotDate: a.slotDate,
                    slotTime: a.slotTime,
                    status: a.cancelled ? "Cancelled" : a.isCompleted ? "Completed" : "Pending",
                },
            });
        });

        prescriptions.forEach((p) => {
            timeline.push({
                type: "prescription",
                date: new Date(p.createdAt),
                data: {
                    doctor: p.doctorName,
                    diagnosis: p.diagnosis,
                    medicineCount: p.medicines.length,
                    id: p._id,
                },
            });
        });

        diagnosisLogs.forEach((d) => {
            timeline.push({
                type: "diagnosis",
                date: new Date(d.createdAt),
                data: {
                    symptoms: d.symptoms,
                    riskLevel: d.riskLevel,
                    possibleConditions: d.possibleConditions,
                },
            });
        });

        // Sort by date descending
        timeline.sort((a, b) => b.date - a.date);

        return res.status(200).json({
            status: true,
            data: {
                timeline,
                summary: {
                    totalAppointments: appointments.length,
                    totalPrescriptions: prescriptions.length,
                    totalDiagnosis: diagnosisLogs.length,
                },
            },
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};

export { getAdminAnalytics, getPatientHistory };
