import mongoose from "mongoose";

const diagnosisLogsSchema = new mongoose.Schema(
    {
        patientId: { type: String, required: true },
        doctorId: { type: String, required: true },
        appointmentId: { type: String, default: "" },
        symptoms: { type: String, required: true },
        age: { type: Number, default: 0 },
        gender: { type: String, default: "" },
        history: { type: String, default: "" },
        diagnosis: { type: String, default: "" },
        aiResponse: { type: String, default: "" },
        possibleConditions: [{ type: String }],
        riskLevel: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "Low",
        },
        suggestedTests: [{ type: String }],
    },
    { timestamps: true }
);

const DiagnosisLog =
    mongoose.models.DiagnosisLog ||
    mongoose.model("DiagnosisLog", diagnosisLogsSchema);

export default DiagnosisLog;
