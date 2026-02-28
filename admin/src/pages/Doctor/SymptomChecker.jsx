import React, { useContext, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

const SymptomChecker = () => {
    const { dToken, backendUrl } = useContext(DoctorContext);
    const [form, setForm] = useState({ patientId: "", symptoms: "", age: "", gender: "", history: "" });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [riskFlags, setRiskFlags] = useState(null);
    const [flagLoading, setFlagLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.symptoms) return toast.error("Symptoms are required");
        setLoading(true);
        setResult(null);
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/doctor/symptom-checker`,
                form,
                { headers: { dtoken: dToken } }
            );
            if (data.status) {
                setResult(data.data);
                toast.success("Analysis complete!");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "AI service error");
        } finally {
            setLoading(false);
        }
    };

    const checkRiskFlags = async () => {
        if (!form.patientId) return toast.error("Enter Patient ID first");
        setFlagLoading(true);
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/ai/risk-flags/${form.patientId}`,
                { headers: { dtoken: dToken } }
            );
            if (data.status) setRiskFlags(data.data);
        } catch (error) {
            toast.error("Could not fetch risk flags");
        } finally {
            setFlagLoading(false);
        }
    };

    const riskColors = {
        Low: "bg-green-100 text-green-700 border-green-300",
        Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
        High: "bg-orange-100 text-orange-700 border-orange-300",
        Critical: "bg-red-100 text-red-700 border-red-300",
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">🤖 AI Symptom Checker</h1>
            <p className="text-gray-500 text-sm mb-6">Enter patient symptoms to get AI-powered possible diagnoses, risk level, and suggested tests.</p>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-5 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Patient ID (optional)</label>
                        <input name="patientId" value={form.patientId} onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 mt-1 text-sm" placeholder="MongoDB patient ID" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Symptoms <span className="text-red-500">*</span></label>
                        <textarea name="symptoms" value={form.symptoms} onChange={handleChange} required
                            className="w-full border rounded-lg px-3 py-2 mt-1 text-sm h-20 resize-none"
                            placeholder="Describe patient symptoms in detail..." />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Age</label>
                            <input type="number" name="age" value={form.age} onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm" placeholder="e.g. 35" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Gender</label>
                            <select name="gender" value={form.gender} onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm">
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Medical History</label>
                        <textarea name="history" value={form.history} onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 mt-1 text-sm h-16 resize-none"
                            placeholder="Diabetes, hypertension, previous surgeries..." />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60">
                        {loading ? "Analyzing..." : "🔍 Analyze Symptoms"}
                    </button>
                    {form.patientId && (
                        <button type="button" onClick={checkRiskFlags} disabled={flagLoading}
                            className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-60">
                            {flagLoading ? "Loading..." : "⚠ Check Risk Flags"}
                        </button>
                    )}
                </form>

                {/* Results */}
                <div className="space-y-4">
                    {result && (
                        <div className="bg-white rounded-xl shadow p-5 space-y-4">
                            <h2 className="font-bold text-gray-800 text-lg">AI Analysis Results</h2>

                            {/* Risk Level */}
                            <div className={`border rounded-lg p-3 ${riskColors[result.riskLevel] || riskColors.Low}`}>
                                <p className="font-semibold text-sm">Risk Level: {result.riskLevel}</p>
                            </div>

                            {/* Conditions */}
                            {result.possibleConditions?.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Possible Conditions:</h3>
                                    <ul className="space-y-1">
                                        {result.possibleConditions.map((c, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                <span className="text-blue-500 mt-0.5">•</span> {c}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Tests */}
                            {result.suggestedTests?.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Suggested Tests:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.suggestedTests.map((t, i) => (
                                            <span key={i} className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Full AI Response */}
                            <details className="text-sm text-gray-600">
                                <summary className="cursor-pointer font-medium text-blue-600">View Full AI Response</summary>
                                <pre className="mt-2 whitespace-pre-wrap text-xs bg-gray-50 p-3 rounded">{result.aiResponse}</pre>
                            </details>
                        </div>
                    )}

                    {/* Risk Flags */}
                    {riskFlags && (
                        <div className="bg-white rounded-xl shadow p-5">
                            <h2 className="font-bold text-gray-800 text-lg mb-3">⚠ Risk Flags</h2>
                            <p className="text-sm text-gray-500 mb-2">Total visits: {riskFlags.totalVisits} | High-risk: {riskFlags.highRiskVisits}</p>
                            {riskFlags.riskFlags?.length > 0 ? (
                                <ul className="space-y-1 mb-3">
                                    {riskFlags.riskFlags.map((f, i) => (
                                        <li key={i} className="text-sm text-orange-700 flex gap-2">
                                            <span>⚠</span> {f}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-green-600">No critical risk flags detected.</p>
                            )}
                            <p className="text-sm text-gray-600 border-t pt-2 mt-2">{riskFlags.summary}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SymptomChecker;
