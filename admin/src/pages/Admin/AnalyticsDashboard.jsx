import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const AnalyticsDashboard = () => {
    const { token, backendUrl } = useContext(AdminContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/analytics/admin`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.status) setData(res.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
            </div>
        );
    }

    if (!data) return <div className="p-4 text-gray-500">Failed to load analytics.</div>;

    const statCards = [
        { label: "Total Doctors", value: data.totalDoctors, bg: "bg-blue-100", color: "text-blue-700" },
        { label: "Total Patients", value: data.totalPatients, bg: "bg-purple-100", color: "text-purple-700" },
        { label: "Total Appointments", value: data.totalAppointments, bg: "bg-yellow-100", color: "text-yellow-700" },
        { label: "Completed", value: data.completedAppointments, bg: "bg-green-100", color: "text-green-700" },
        { label: "Cancelled", value: data.cancelledAppointments, bg: "bg-red-100", color: "text-red-700" },
        {
            label: "Revenue (PKR)",
            value: data.revenue?.toLocaleString() || 0,
            bg: "bg-emerald-100",
            color: "text-emerald-700",
        },
        { label: "Prescriptions", value: data.totalPrescriptions, bg: "bg-pink-100", color: "text-pink-700" },
    ];

    const appointmentStatusData = [
        { name: "Completed", value: data.completedAppointments },
        { name: "Cancelled", value: data.cancelledAppointments },
        {
            name: "Pending",
            value: data.totalAppointments - data.completedAppointments - data.cancelledAppointments,
        },
    ];

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">📊 Analytics Dashboard</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {statCards.map((card, i) => (
                    <div key={i} className={`rounded-xl p-4 ${card.bg} shadow-sm`}>
                        <p className={`text-xs font-medium opacity-70 ${card.color}`}>{card.label}</p>
                        <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Monthly Appointments Bar Chart */}
                <div className="bg-white rounded-xl shadow p-5">
                    <h2 className="font-semibold text-gray-700 mb-4">Monthly Appointments (Last 6 Months)</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={data.monthlyAppointments}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Appointment Status Pie Chart */}
                <div className="bg-white rounded-xl shadow p-5">
                    <h2 className="font-semibold text-gray-700 mb-4">Appointment Status</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={appointmentStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                                {appointmentStatusData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Diagnoses */}
            {data.topDiagnoses?.length > 0 && (
                <div className="bg-white rounded-xl shadow p-5 mb-6">
                    <h2 className="font-semibold text-gray-700 mb-4">🔬 Most Common Diagnoses (AI Logs)</h2>
                    <div className="space-y-2">
                        {data.topDiagnoses.map((d, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 w-48 truncate">{d.name}</span>
                                <div className="flex-1 bg-gray-100 rounded-full h-3">
                                    <div
                                        className="h-3 rounded-full"
                                        style={{
                                            width: `${Math.min(100, (d.count / (data.topDiagnoses[0]?.count || 1)) * 100)}%`,
                                            backgroundColor: COLORS[i % COLORS.length],
                                        }}
                                    />
                                </div>
                                <span className="text-sm font-semibold text-gray-700">{d.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Latest Prescriptions */}
            {data.latestPrescriptions?.length > 0 && (
                <div className="bg-white rounded-xl shadow p-5">
                    <h2 className="font-semibold text-gray-700 mb-4">📋 Latest Prescriptions</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-3">Patient</th>
                                    <th className="p-3">Doctor</th>
                                    <th className="p-3">Diagnosis</th>
                                    <th className="p-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.latestPrescriptions.map((p) => (
                                    <tr key={p._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{p.patientName}</td>
                                        <td className="p-3">Dr. {p.doctorName}</td>
                                        <td className="p-3">{p.diagnosis}</td>
                                        <td className="p-3">{new Date(p.createdAt).toLocaleDateString("en-PK")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsDashboard;
