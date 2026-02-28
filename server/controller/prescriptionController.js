import Prescription from "../models/prescriptionModel.js";
import Doctor from "../models/doctorsModel.js";
import User from "../models/usersModel.js";
import PDFDocument from "pdfkit";

// ──────────────────────────────────────────────
// Create Prescription (by Doctor)
// ──────────────────────────────────────────────
const createPrescription = async (req, res) => {
    try {
        const { doctorId } = req.doctor;
        const { patientId, appointmentId, diagnosis, medicines, instructions, followUpDate } = req.body;

        if (!patientId || !medicines || !diagnosis) {
            return res.status(400).json({ status: false, message: "patientId, diagnosis, and medicines are required" });
        }

        const doctor = await Doctor.findById(doctorId).select("-password");
        const patient = await User.findById(patientId).select("-password");

        const prescription = new Prescription({
            appointmentId: appointmentId || "",
            patientId,
            doctorId,
            patientName: patient?.name || "Patient",
            doctorName: doctor?.name || "Doctor",
            diagnosis,
            medicines: Array.isArray(medicines) ? medicines : JSON.parse(medicines),
            instructions: instructions || "",
            followUpDate: followUpDate || "",
        });

        await prescription.save();

        return res.status(201).json({
            status: true,
            message: "Prescription created successfully",
            data: prescription,
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};

// ──────────────────────────────────────────────
// Get Prescriptions for a Patient (patient view)
// ──────────────────────────────────────────────
const getPatientPrescriptions = async (req, res) => {
    try {
        const { userId } = req.user;
        const prescriptions = await Prescription.find({ patientId: userId }).sort({ createdAt: -1 });
        return res.status(200).json({ status: true, data: prescriptions });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};

// ──────────────────────────────────────────────
// Get Prescriptions written by Doctor
// ──────────────────────────────────────────────
const getDoctorPrescriptions = async (req, res) => {
    try {
        const { doctorId } = req.doctor;
        const prescriptions = await Prescription.find({ doctorId }).sort({ createdAt: -1 });
        return res.status(200).json({ status: true, data: prescriptions });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};

// ──────────────────────────────────────────────
// Get Single Prescription
// ──────────────────────────────────────────────
const getPrescriptionById = async (req, res) => {
    try {
        const { id } = req.params;
        const prescription = await Prescription.findById(id);
        if (!prescription) return res.status(404).json({ status: false, message: "Prescription not found" });
        return res.status(200).json({ status: true, data: prescription });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};

// ──────────────────────────────────────────────
// Download Prescription PDF
// ──────────────────────────────────────────────
const downloadPrescriptionPDF = async (req, res) => {
    try {
        const { id } = req.params;
        const prescription = await Prescription.findById(id);

        if (!prescription) {
            return res.status(404).json({ status: false, message: "Prescription not found" });
        }

        const doc = new PDFDocument({ margin: 50, size: "A4" });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=prescription-${id}.pdf`);
        doc.pipe(res);

        // ── Header ──
        doc.fillColor("#1a5276").fontSize(24).font("Helvetica-Bold").text("AI Clinic Management", { align: "center" });
        doc.fontSize(12).fillColor("#555").text("Smart Diagnosis SaaS", { align: "center" });
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(555, doc.y).strokeColor("#1a5276").lineWidth(2).stroke();
        doc.moveDown(0.5);

        // ── Prescription Info ──
        doc.fillColor("#000").fontSize(14).font("Helvetica-Bold").text("PRESCRIPTION", { align: "center" });
        doc.moveDown(0.5);

        const infoTop = doc.y;
        doc.fontSize(11).font("Helvetica");
        doc.fillColor("#333").text(`Date: ${new Date(prescription.createdAt).toLocaleDateString("en-PK")}`, 50, infoTop);
        doc.text(`Prescription ID: ${prescription._id}`, 300, infoTop, { align: "right" });

        doc.moveDown(1);

        // ── Patient & Doctor ──
        doc.rect(50, doc.y, 240, 70).fillAndStroke("#eaf2ff", "#1a5276");
        const patientBox = doc.y;
        doc.fillColor("#1a5276").fontSize(10).font("Helvetica-Bold").text("PATIENT", 60, patientBox + 8);
        doc.fillColor("#000").font("Helvetica").fontSize(11).text(`Name: ${prescription.patientName}`, 60, patientBox + 22);
        doc.fontSize(10).fillColor("#555").text(`ID: ${prescription.patientId}`, 60, patientBox + 40);

        doc.rect(310, patientBox, 245, 70).fillAndStroke("#eaf2ff", "#1a5276");
        doc.fillColor("#1a5276").fontSize(10).font("Helvetica-Bold").text("DOCTOR", 320, patientBox + 8);
        doc.fillColor("#000").font("Helvetica").fontSize(11).text(`Dr. ${prescription.doctorName}`, 320, patientBox + 22);

        doc.moveDown(5.5);

        // ── Diagnosis ──
        doc.fontSize(12).font("Helvetica-Bold").fillColor("#1a5276").text("Diagnosis:");
        doc.moveDown(0.3);
        doc.fontSize(11).font("Helvetica").fillColor("#000").text(prescription.diagnosis);
        doc.moveDown(0.8);

        // ── Medicines ──
        doc.fontSize(12).font("Helvetica-Bold").fillColor("#1a5276").text("Medicines:");
        doc.moveDown(0.3);

        // Table header
        const colX = [50, 200, 310, 430];
        doc.rect(50, doc.y, 505, 20).fill("#1a5276");
        doc.fillColor("#fff").fontSize(10).font("Helvetica-Bold");
        doc.text("Medicine Name", colX[0] + 5, doc.y - 15);
        doc.text("Dosage", colX[1] + 5, doc.y - 15);
        doc.text("Frequency", colX[2] + 5, doc.y - 15);
        doc.text("Duration", colX[3] + 5, doc.y - 15);
        doc.moveDown(0.4);

        prescription.medicines.forEach((med, i) => {
            const rowY = doc.y;
            const bg = i % 2 === 0 ? "#f0f6ff" : "#ffffff";
            doc.rect(50, rowY, 505, 20).fill(bg);
            doc.fillColor("#000").font("Helvetica").fontSize(10);
            doc.text(med.name || "-", colX[0] + 5, rowY + 5, { width: 140 });
            doc.text(med.dosage || "-", colX[1] + 5, rowY + 5, { width: 105 });
            doc.text(med.frequency || "-", colX[2] + 5, rowY + 5, { width: 115 });
            doc.text(med.duration || "-", colX[3] + 5, rowY + 5);
            doc.moveDown(1.1);
        });

        doc.moveDown(0.5);

        // ── Instructions ──
        if (prescription.instructions) {
            doc.fontSize(12).font("Helvetica-Bold").fillColor("#1a5276").text("Instructions:");
            doc.moveDown(0.3);
            doc.fontSize(11).font("Helvetica").fillColor("#333").text(prescription.instructions);
            doc.moveDown(0.8);
        }

        // ── Follow Up ──
        if (prescription.followUpDate) {
            doc.fontSize(11).font("Helvetica-Bold").fillColor("#e67e22").text(`Follow-up Date: ${prescription.followUpDate}`);
            doc.moveDown(0.8);
        }

        // ── AI Explanation ──
        if (prescription.aiExplanation) {
            doc.moveDown(0.3);
            doc.rect(50, doc.y, 505, 20).fill("#d5f5e3");
            doc.fillColor("#1e8449").fontSize(11).font("Helvetica-Bold").text("AI Health Advice:", 55, doc.y - 14);
            doc.moveDown(0.8);
            doc.fontSize(10).font("Helvetica").fillColor("#333").text(prescription.aiExplanation);
            doc.moveDown(0.5);
        }

        // ── Footer ──
        doc.moveDown(2);
        doc.moveTo(300, doc.y).lineTo(555, doc.y).strokeColor("#000").lineWidth(1).stroke();
        doc.fontSize(10).fillColor("#333").text("Doctor's Signature", 300, doc.y + 5, { align: "right" });

        doc.end();
    } catch (error) {
        return res.status(500).json({ status: false, message: "PDF generation failed", error: error.message });
    }
};

export {
    createPrescription,
    getPatientPrescriptions,
    getDoctorPrescriptions,
    getPrescriptionById,
    downloadPrescriptionPDF,
};
