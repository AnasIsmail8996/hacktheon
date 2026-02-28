import React, { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";

const riskColors = {
    Low: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300", dot: "bg-emerald-500" },
    Medium: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300", dot: "bg-amber-500" },
    High: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300", dot: "bg-orange-500" },
    Critical: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300", dot: "bg-red-500" },
};

const AiDashboard = () => {
    const { token, backendUrl } = useContext(AdminContext);

    const [form, setForm] = useState({ symptoms: "", age: "", gender: "", history: "" });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [rawExpanded, setRawExpanded] = useState(false);

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.symptoms.trim()) { setError("Please enter symptoms."); return; }
        setLoading(true);
        setError("");
        setResult(null);

        try {
            const res = await fetch(`${backendUrl}/api/admin/ai-symptom-check`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.status) {
                setResult(data.data);
            } else {
                setError(data.message || "AI analysis failed.");
            }
        } catch (err) {
            setError("Network error. Make sure the server is running.");
        } finally {
            setLoading(false);
        }
    };

    const riskStyle = result ? (riskColors[result.riskLevel] || riskColors.Medium) : null;

    // Extract clinical notes from raw response
    const extractClinicalNotes = (raw) => {
        if (!raw) return "";
        const match = raw.match(/CLINICAL NOTES:([\s\S]*)/i);
        return match ? match[1].trim() : "";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.386A2 2 0 0115 17H9a2 2 0 01-1.414-2.586l-.347-.386z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">AI Symptom Checker</h1>
                        <p className="text-sm text-gray-500">Anas ISmail App</p>
                    </div>
                    <span className="ml-auto px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-semibold border border-violet-200">
                        Beta
                    </span>
                </div>

                {/* Info banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-blue-700">
                        This AI tool assists with preliminary symptom analysis. Results are for reference only — always apply clinical judgment. Patient data is not stored for this admin check.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* Input Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-base font-semibold text-gray-800 mb-5 flex items-center gap-2">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Patient Information
                    </h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Symptoms */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                Symptoms <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="symptoms"
                                value={form.symptoms}
                                onChange={handleChange}
                                rows={4}
                                placeholder="e.g., fever since 3 days, body aches, headache, fatigue, mild cough..."
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 resize-none transition"
                            />
                        </div>

                        {/* Age & Gender row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={form.age}
                                    onChange={handleChange}
                                    placeholder="e.g., 35"
                                    min="0"
                                    max="120"
                                    className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Gender</label>
                                <select
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition bg-white"
                                >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Medical History */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Medical History</label>
                            <textarea
                                name="history"
                                value={form.history}
                                onChange={handleChange}
                                rows={3}
                                placeholder="e.g., Diabetes type 2, hypertension, no known drug allergies..."
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 resize-none transition"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Analyzing with Gemini AI...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.386A2 2 0 0115 17H9a2 2 0 01-1.414-2.586l-.347-.386z" />
                                    </svg>
                                    Analyze Symptoms
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Results Panel */}
                <div>
                    {!result && !loading && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col items-center justify-center text-center gap-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.386A2 2 0 0115 17H9a2 2 0 01-1.414-2.586l-.347-.386z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 text-lg">Ready for Analysis</h3>
                                <p className="text-sm text-gray-400 mt-1 max-w-xs">Enter patient symptoms on the left and click "Analyze" to get AI-powered insights.</p>
                            </div>
                            <div className="grid grid-cols-3 gap-3 w-full mt-2">
                                {["Possible Conditions", "Risk Assessment", "Suggested Tests"].map((f) => (
                                    <div key={f} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                                        <div className="w-6 h-6 bg-gray-200 rounded-full mx-auto mb-1.5 animate-pulse" />
                                        <p className="text-[10px] text-gray-400 font-medium">{f}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center gap-6 min-h-[400px]">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-indigo-100 rounded-full" />
                                <div className="absolute inset-0 w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                <div className="absolute inset-3 w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.386A2 2 0 0115 17H9a2 2 0 01-1.414-2.586l-.347-.386z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-gray-800 text-lg">Gemini AI is analyzing...</p>
                                <p className="text-sm text-gray-400 mt-1">Processing symptoms with medical AI model</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {[0, 1, 2].map((i) => (
                                    <div key={i} className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                ))}
                            </div>
                        </div>
                    )}

                    {result && !loading && (
                        <div className="flex flex-col gap-4">

                            {/* Risk Level Card */}
                            <div className={`rounded-2xl p-5 border-2 ${riskStyle.bg} ${riskStyle.border} flex items-center gap-4`}>
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow ${riskStyle.bg}`}>
                                    <div className={`w-8 h-8 rounded-full ${riskStyle.dot} flex items-center justify-center shadow-md`}>
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <p className={`text-xs font-bold uppercase tracking-widest ${riskStyle.text} opacity-70`}>Risk Level</p>
                                    <p className={`text-2xl font-bold ${riskStyle.text}`}>{result.riskLevel}</p>
                                </div>
                                <button
                                    onClick={() => { setResult(null); setForm({ symptoms: "", age: "", gender: "", history: "" }); }}
                                    className="ml-auto text-xs text-gray-400 hover:text-gray-600 border border-gray-200 bg-white rounded-lg px-3 py-1.5 hover:bg-gray-50 transition"
                                >
                                    New Analysis
                                </button>
                            </div>

                            {/* Conditions + Tests */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Possible Conditions
                                    </h3>
                                    <ul className="flex flex-col gap-2">
                                        {(result.possibleConditions || []).map((c, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                                                <span className="text-sm text-gray-700">{c}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                        Suggested Tests
                                    </h3>
                                    <ul className="flex flex-col gap-2">
                                        {(result.suggestedTests || []).map((t, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-sm text-gray-700">{t}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Clinical Notes */}
                            {extractClinicalNotes(result.aiResponse) && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Clinical Notes
                                    </h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">{extractClinicalNotes(result.aiResponse)}</p>
                                </div>
                            )}

                            {/* Raw Response Toggle */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-4">
                                <button
                                    onClick={() => setRawExpanded(!rawExpanded)}
                                    className="w-full flex items-center justify-between text-xs font-semibold text-gray-400 hover:text-gray-600 transition"
                                >
                                    <span className="uppercase tracking-widest">Full AI Response</span>
                                    <svg className={`w-4 h-4 transition-transform ${rawExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {rawExpanded && (
                                    <pre className="mt-3 text-xs text-gray-600 bg-gray-50 rounded-xl p-4 whitespace-pre-wrap leading-relaxed border border-gray-100 max-h-56 overflow-y-auto">
                                        {result.aiResponse}
                                    </pre>
                                )}
                            </div>

                        </div>
                    )}
                </div>
            </div>

            {/* Footer note */}
            <p className="mt-8 text-center text-xs text-gray-400">
                AI Clinic Pro · AI Symptom Checker · Powered by Google Gemini 1.5 Flash · For clinical assistance only
            </p>
        </div>
    );
};

export default AiDashboard;
