import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, default: "" },
    duration: { type: String, default: "" },
});

const prescriptionSchema = new mongoose.Schema(
    {
        appointmentId: { type: String, default: "" },
        patientId: { type: String, required: true },
        doctorId: { type: String, required: true },
        patientName: { type: String, default: "" },
        doctorName: { type: String, default: "" },
        diagnosis: { type: String, default: "" },
        medicines: [medicineSchema],
        instructions: { type: String, default: "" },
        followUpDate: { type: String, default: "" },
        aiExplanation: { type: String, default: "" },
    },
    { timestamps: true }
);

const Prescription =
    mongoose.models.Prescription ||
    mongoose.model("Prescription", prescriptionSchema);

export default Prescription;
