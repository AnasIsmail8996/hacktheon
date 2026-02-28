import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MedicalHistory = () => {
    const { token, backendUrl, userData } = useContext(AppContext);
    const [timeline, setTimeline] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        if (userData?._id) fetchHistory();
    }, [token, userData]);

    const fetchHistory = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/analytics/patient-history/${userData._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.status) {
                setTimeline(data.data.timeline);
                setSummary(data.data.summary);
            }
        } catch {
            toast.error("Failed to load medical history");
        } finally {
            setLoading(false);
        }
    };

    const typeConfig = {
        appointment: { color: "bg-blue-500", icon: "📅", label: "Appointment" },
        prescription: { color: "bg-green-500", icon: "💊", label: "Prescription" },
        diagnosis: { color: "bg-purple-500", icon: "🔬", label: "Diagnosis" },
    };

    const riskColors = {
        Low: "text-green-600 bg-green-50",
        Medium: "text-yellow-600 bg-yellow-50",
        High: "text-orange-600 bg-orange-50",
        Critical: "text-red-600 bg-red-50",
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">🏥 Medical History</h1>
            <p className="text-gray-500 text-sm mb-6">Your complete health timeline</p>

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-blue-700">{summary.totalAppointments}</p>
                        <p className="text-xs text-blue-600">Appointments</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-green-700">{summary.totalPrescriptions}</p>
                        <p className="text-xs text-green-600">Prescriptions</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-purple-700">{summary.totalDiagnosis}</p>
                        <p className="text-xs text-purple-600">AI Diagnoses</p>
                    </div>
                </div>
            )}

            {/* Timeline */}
            {timeline.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
                    <div className="text-5xl mb-4">📋</div>
                    <p>No medical history found yet.</p>
                </div>
            ) : (
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                    <div className="space-y-6">
                        {timeline.map((item, i) => {
                            const cfg = typeConfig[item.type] || typeConfig.appointment;
                            return (
                                <div key={i} className="flex gap-4 relative">
                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-full ${cfg.color} flex items-center justify-center text-xl flex-shrink-0 z-10 shadow`}>
                                        {cfg.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="bg-white rounded-xl shadow p-4 flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.color} text-white`}>
                                                {cfg.label}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(item.date).toLocaleDateString("en-PK", {
                                                    day: "numeric", month: "short", year: "numeric"
                                                })}
                                            </span>
                                        </div>

                                        {/* Appointment Details */}
                                        {item.type === "appointment" && (
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">{item.data.doctor}</p>
                                                <p className="text-xs text-gray-500">{item.data.speciality}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-gray-500">
                                                        {item.data.slotDate?.replace(/_/g, "/")} at {item.data.slotTime}
                                                    </span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.data.status === "Completed" ? "bg-green-100 text-green-600"
                                                            : item.data.status === "Cancelled" ? "bg-red-100 text-red-600"
                                                                : "bg-yellow-100 text-yellow-600"
                                                        }`}>
                                                        {item.data.status}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Prescription Details */}
                                        {item.type === "prescription" && (
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">{item.data.diagnosis}</p>
                                                <p className="text-xs text-gray-500">Dr. {item.data.doctor} — {item.data.medicineCount} medicine(s)</p>
                                                <button
                                                    onClick={() => navigate("/my-prescriptions")}
                                                    className="text-xs text-blue-600 hover:underline mt-1"
                                                >
                                                    View Prescription →
                                                </button>
                                            </div>
                                        )}

                                        {/* Diagnosis Details */}
                                        {item.type === "diagnosis" && (
                                            <div>
                                                <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Symptoms:</span> {item.data.symptoms}</p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${riskColors[item.data.riskLevel] || riskColors.Low}`}>
                                                    Risk: {item.data.riskLevel}
                                                </span>
                                                {item.data.possibleConditions?.length > 0 && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Conditions: {item.data.possibleConditions.slice(0, 2).join(", ")}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalHistory;
