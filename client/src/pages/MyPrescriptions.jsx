import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MyPrescriptions = () => {
    const { token, backendUrl } = useContext(AppContext);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchPrescriptions();
    }, [token]);

    const fetchPrescriptions = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/prescription/my-prescriptions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.status) setPrescriptions(data.data);
        } catch (error) {
            toast.error("Failed to load prescriptions");
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = (prescriptionId) => {
        window.open(`${backendUrl}/api/prescription/pdf/${prescriptionId}`, "_blank");
    };

    const getAIExplanation = async (prescriptionId, lang = "english") => {
        setAiLoading((prev) => ({ ...prev, [prescriptionId]: true }));
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/ai/explain-prescription`,
                { prescriptionId, language: lang },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.status) {
                toast.success("AI explanation generated!");
                fetchPrescriptions(); // refresh to show explanation
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("AI service temporary unavailable");
        } finally {
            setAiLoading((prev) => ({ ...prev, [prescriptionId]: false }));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">📋 My Prescriptions</h1>

            {prescriptions.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
                    <div className="text-5xl mb-4">💊</div>
                    <p>No prescriptions found.</p>
                    <p className="text-sm mt-1">Your doctor's prescriptions will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {prescriptions.map((p) => (
                        <div key={p._id} className="bg-white rounded-xl shadow p-5">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h2 className="font-bold text-gray-800 text-lg">{p.diagnosis}</h2>
                                    <p className="text-sm text-gray-500">
                                        Dr. {p.doctorName} — {new Date(p.createdAt).toLocaleDateString("en-PK")}
                                    </p>
                                </div>
                                <div className="flex gap-2 flex-wrap justify-end">
                                    <button
                                        onClick={() => downloadPDF(p._id)}
                                        className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 flex items-center gap-1"
                                    >
                                        ⬇ Download PDF
                                    </button>
                                    {!p.aiExplanation && (
                                        <button
                                            onClick={() => getAIExplanation(p._id, "english")}
                                            disabled={aiLoading[p._id]}
                                            className="bg-purple-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-purple-700 disabled:opacity-60 flex items-center gap-1"
                                        >
                                            🤖 {aiLoading[p._id] ? "Loading..." : "AI Explain"}
                                        </button>
                                    )}
                                    {!p.aiExplanation && (
                                        <button
                                            onClick={() => getAIExplanation(p._id, "urdu")}
                                            disabled={aiLoading[p._id]}
                                            className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-60"
                                        >
                                            🌙 اردو
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Medicines */}
                            <div className="mb-3">
                                <p className="text-sm font-semibold text-gray-600 mb-2">Medicines:</p>
                                <div className="space-y-1">
                                    {p.medicines?.map((med, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                            <span className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></span>
                                            <span className="font-medium">{med.name}</span>
                                            <span className="text-gray-400">|</span>
                                            <span>{med.dosage}</span>
                                            {med.frequency && <><span className="text-gray-400">|</span><span>{med.frequency}</span></>}
                                            {med.duration && <><span className="text-gray-400">|</span><span className="text-gray-500">{med.duration}</span></>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Instructions */}
                            {p.instructions && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                                    <p className="text-xs font-semibold text-yellow-700 mb-1">Instructions:</p>
                                    <p className="text-sm text-gray-700">{p.instructions}</p>
                                </div>
                            )}

                            {/* Follow Up */}
                            {p.followUpDate && (
                                <div className="text-sm text-orange-600 font-semibold">
                                    📅 Follow-up: {p.followUpDate}
                                </div>
                            )}

                            {/* AI Explanation */}
                            {p.aiExplanation && (
                                <div className="mt-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                                    <p className="text-xs font-bold text-purple-700 mb-2">🤖 AI Health Explanation:</p>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{p.aiExplanation}</p>
                                    <button
                                        onClick={() => getAIExplanation(p._id, "english")}
                                        disabled={aiLoading[p._id]}
                                        className="text-xs text-purple-600 hover:underline mt-2 disabled:opacity-60"
                                    >
                                        🔄 Refresh AI Explanation
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPrescriptions;
