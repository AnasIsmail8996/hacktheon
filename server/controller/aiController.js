import { GoogleGenerativeAI } from "@google/generative-ai";
import DiagnosisLog from "../models/diagnosisLogsModel.js";
import Prescription from "../models/prescriptionModel.js";

const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY not set in .env");
    return new GoogleGenerativeAI(apiKey);
};

// ──────────────────────────────────────────────
// AI Symptom Checker
// ──────────────────────────────────────────────
const symptomChecker = async (req, res) => {
    try {
        const { doctorId } = req.doctor;
        const { patientId, symptoms, age, gender, history, appointmentId } = req.body;

        if (!symptoms) {
            return res.status(400).json({ status: false, message: "Symptoms are required" });
        }

        let aiResponse = "";
        let possibleConditions = [];
        let riskLevel = "Low";
        let suggestedTests = [];

        try {
            const genAI = getGenAI();
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `You are an experienced medical AI assistant helping a doctor.
Patient Details:
- Age: ${age || "Unknown"}
- Gender: ${gender || "Unknown"}
- Medical History: ${history || "None provided"}
- Current Symptoms: ${symptoms}

Based on these symptoms, provide a structured response with:
1. Top 3 possible conditions/diagnoses (list them as bullet points)
2. Risk level (Low/Medium/High/Critical)
3. Recommended diagnostic tests (list 2-4 tests)
4. Brief clinical notes

Keep the response concise and professional. Format:
POSSIBLE CONDITIONS:
- condition1
- condition2
- condition3

RISK LEVEL: [level]

SUGGESTED TESTS:
- test1
- test2

CLINICAL NOTES:
[brief notes]`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();
            aiResponse = text;

            // Parse conditions
            const condMatch = text.match(/POSSIBLE CONDITIONS:([\s\S]*?)RISK LEVEL:/i);
            if (condMatch) {
                possibleConditions = condMatch[1]
                    .split("\n")
                    .filter((l) => l.trim().startsWith("-"))
                    .map((l) => l.replace("-", "").trim())
                    .filter(Boolean);
            }

            // Parse risk
            const riskMatch = text.match(/RISK LEVEL:\s*(\w+)/i);
            if (riskMatch) {
                const r = riskMatch[1].trim();
                if (["Low", "Medium", "High", "Critical"].includes(r)) riskLevel = r;
            }

            // Parse tests
            const testMatch = text.match(/SUGGESTED TESTS:([\s\S]*?)CLINICAL NOTES:/i);
            if (testMatch) {
                suggestedTests = testMatch[1]
                    .split("\n")
                    .filter((l) => l.trim().startsWith("-"))
                    .map((l) => l.replace("-", "").trim())
                    .filter(Boolean);
            }
        } catch (aiError) {
            // Graceful fallback if AI fails
            aiResponse = "AI service temporarily unavailable. Please proceed with clinical judgment.";
            possibleConditions = ["Manual assessment required"];
            riskLevel = "Medium";
            suggestedTests = ["CBC", "Urinalysis"];
        }

        // Save to DB
        const log = new DiagnosisLog({
            patientId: patientId || "unknown",
            doctorId,
            appointmentId: appointmentId || "",
            symptoms,
            age: age || 0,
            gender: gender || "",
            history: history || "",
            aiResponse,
            possibleConditions,
            riskLevel,
            suggestedTests,
        });

        await log.save();

        return res.status(200).json({
            status: true,
            message: "Symptom analysis complete",
            data: {
                logId: log._id,
                aiResponse,
                possibleConditions,
                riskLevel,
                suggestedTests,
            },
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};

// ──────────────────────────────────────────────
// AI Prescription Explanation (for patient)
// ──────────────────────────────────────────────
const explainPrescription = async (req, res) => {
    try {
        const { prescriptionId, language } = req.body;

        const prescription = await Prescription.findById(prescriptionId);
        if (!prescription) {
            return res.status(404).json({ status: false, message: "Prescription not found" });
        }

        let explanation = "";

        try {
            const genAI = getGenAI();
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const medicineList = prescription.medicines
                .map((m) => `${m.name} (${m.dosage}, ${m.frequency || "as directed"})`)
                .join(", ");

            const lang = language === "urdu" ? "Urdu (Roman/Nastaliq)" : "simple English";

            const prompt = `You are a friendly medical assistant. Explain this prescription to a patient in ${lang}.

Diagnosis: ${prescription.diagnosis}
Medicines: ${medicineList}
Instructions: ${prescription.instructions || "None"}
Follow-up: ${prescription.followUpDate || "Not specified"}

Provide:
1. What the condition means in simple words
2. Why each medicine is given (brief)
3. Important lifestyle advice
4. Warning signs to watch for
5. Dietary recommendations

Keep it friendly, simple, and encouraging. Max 200 words.`;

            const result = await model.generateContent(prompt);
            explanation = result.response.text();
        } catch (aiError) {
            explanation = `Your doctor has prescribed ${prescription.medicines.length} medicine(s) for ${prescription.diagnosis}. Please follow the dosage instructions carefully and consult your doctor if symptoms worsen.`;
        }

        // Save explanation to prescription
        await Prescription.findByIdAndUpdate(prescriptionId, { aiExplanation: explanation });

        return res.status(200).json({
            status: true,
            message: "Prescription explanation generated",
            data: { explanation },
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};

// ──────────────────────────────────────────────
// AI Risk Flagging – check repeated infections
// ──────────────────────────────────────────────
const riskFlagging = async (req, res) => {
    try {
        const { patientId } = req.params;

        const logs = await DiagnosisLog.find({ patientId }).sort({ createdAt: -1 }).limit(10);

        if (!logs.length) {
            return res.status(200).json({ status: true, data: { riskFlags: [], summary: "No history found." } });
        }

        const allSymptoms = logs.map((l) => l.symptoms).join(", ");
        const highRiskCount = logs.filter((l) => ["High", "Critical"].includes(l.riskLevel)).length;

        let riskFlags = [];
        let summary = "";

        try {
            const genAI = getGenAI();
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `Analyze this patient's medical history for risk patterns.
Patient's symptom history (last ${logs.length} visits): ${allSymptoms}
High-risk visits: ${highRiskCount}

Identify:
1. Any repeated infection or chronic patterns (list as bullet points)
2. High-risk symptom combinations
3. Recommendations for preventive care

Format:
RISK FLAGS:
- flag1
- flag2

SUMMARY:
[2-3 sentences]`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            const flagMatch = text.match(/RISK FLAGS:([\s\S]*?)SUMMARY:/i);
            if (flagMatch) {
                riskFlags = flagMatch[1]
                    .split("\n")
                    .filter((l) => l.trim().startsWith("-"))
                    .map((l) => l.replace("-", "").trim())
                    .filter(Boolean);
            }
            const sumMatch = text.match(/SUMMARY:([\s\S]*)/i);
            if (sumMatch) summary = sumMatch[1].trim();
        } catch {
            summary = highRiskCount > 2 ? "Patient has multiple high-risk visits. Consider further evaluation." : "No critical patterns detected automatically.";
        }

        return res.status(200).json({
            status: true,
            data: { riskFlags, summary, totalVisits: logs.length, highRiskVisits: highRiskCount },
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};

// ──────────────────────────────────────────────
// Admin AI Symptom Checker (no doctorId required)
// ──────────────────────────────────────────────
const adminSymptomChecker = async (req, res) => {
    try {
        const { symptoms, age, gender, history } = req.body;

        if (!symptoms) {
            return res.status(400).json({ status: false, message: "Symptoms are required" });
        }

        let aiResponse = "";
        let possibleConditions = [];
        let riskLevel = "Low";
        let suggestedTests = [];

        try {
            const genAI = getGenAI();
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `You are an experienced medical AI assistant.
Patient Details:
- Age: ${age || "Unknown"}
- Gender: ${gender || "Unknown"}
- Medical History: ${history || "None provided"}
- Current Symptoms: ${symptoms}

Based on these symptoms, provide a structured response with:
1. Top 3 possible conditions/diagnoses (list them as bullet points)
2. Risk level (Low/Medium/High/Critical)
3. Recommended diagnostic tests (list 2-4 tests)
4. Brief clinical notes

Format:
POSSIBLE CONDITIONS:
- condition1
- condition2
- condition3

RISK LEVEL: [level]

SUGGESTED TESTS:
- test1
- test2

CLINICAL NOTES:
[brief notes]`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();
            aiResponse = text;

            const condMatch = text.match(/POSSIBLE CONDITIONS:([\s\S]*?)RISK LEVEL:/i);
            if (condMatch) {
                possibleConditions = condMatch[1]
                    .split("\n")
                    .filter((l) => l.trim().startsWith("-"))
                    .map((l) => l.replace("-", "").trim())
                    .filter(Boolean);
            }

            const riskMatch = text.match(/RISK LEVEL:\s*(\w+)/i);
            if (riskMatch) {
                const r = riskMatch[1].trim();
                if (["Low", "Medium", "High", "Critical"].includes(r)) riskLevel = r;
            }

            const testMatch = text.match(/SUGGESTED TESTS:([\s\S]*?)CLINICAL NOTES:/i);
            if (testMatch) {
                suggestedTests = testMatch[1]
                    .split("\n")
                    .filter((l) => l.trim().startsWith("-"))
                    .map((l) => l.replace("-", "").trim())
                    .filter(Boolean);
            }
        } catch (aiError) {
            aiResponse = "AI service temporarily unavailable.";
            possibleConditions = ["Manual assessment required"];
            riskLevel = "Medium";
            suggestedTests = ["CBC", "Urinalysis"];
        }

        return res.status(200).json({
            status: true,
            message: "Symptom analysis complete",
            data: { aiResponse, possibleConditions, riskLevel, suggestedTests },
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
    }
};

export { symptomChecker, explainPrescription, riskFlagging, adminSymptomChecker };
