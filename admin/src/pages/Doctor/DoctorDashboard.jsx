import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";

const DoctorDashboard = () => {
    const { dashboardData, getDoctorDashboard, doctorData, completeAppointment, cancelAppointment } =
        useContext(DoctorContext);

    useEffect(() => {
        getDoctorDashboard();
    }, []);

    if (!dashboardData) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
            </div>
        );
    }

    const statCards = [
        { label: "Total Appointments", value: dashboardData.totalAppointments, color: "bg-blue-100 text-blue-700" },
        { label: "Completed", value: dashboardData.completedAppointments, color: "bg-green-100 text-green-700" },
        { label: "Cancelled", value: dashboardData.cancelledAppointments, color: "bg-red-100 text-red-700" },
        { label: "Unique Patients", value: dashboardData.uniquePatients, color: "bg-purple-100 text-purple-700" },
        { label: "Prescriptions", value: dashboardData.totalPrescriptions, color: "bg-yellow-100 text-yellow-700" },
        {
            label: "Earnings (PKR)",
            value: dashboardData.earnings?.toLocaleString() || 0,
            color: "bg-emerald-100 text-emerald-700",
        },
    ];

    return (
        <div className="p-4">
            {/* Welcome */}
            <div className="mb-6 flex items-center gap-4">
                <img
                    src={doctorData?.image || "https://via.placeholder.com/60"}
                    alt="Doctor"
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-400"
                />
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dr. {doctorData?.name}</h1>
                    <p className="text-gray-500 text-sm">{doctorData?.speciality}</p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {statCards.map((card, i) => (
                    <div key={i} className={`rounded-xl p-4 ${card.color} shadow-sm`}>
                        <p className="text-sm font-medium opacity-70">{card.label}</p>
                        <p className="text-3xl font-bold mt-1">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Latest Appointments */}
            <div className="bg-white rounded-xl shadow p-4">
                <h2 className="font-semibold text-lg mb-4 text-gray-700">Recent Appointments</h2>
                {dashboardData.latestAppointments?.length === 0 ? (
                    <p className="text-gray-400 text-sm">No appointments yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600">
                                    <th className="p-3">Patient</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Time</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData.latestAppointments?.map((apt) => (
                                    <tr key={apt._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium">{apt.userData?.name || "Patient"}</td>
                                        <td className="p-3">{apt.slotDate?.replace(/_/g, "/")}</td>
                                        <td className="p-3">{apt.slotTime}</td>
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${apt.cancelled
                                                        ? "bg-red-100 text-red-600"
                                                        : apt.isCompleted
                                                            ? "bg-green-100 text-green-600"
                                                            : "bg-yellow-100 text-yellow-600"
                                                    }`}
                                            >
                                                {apt.cancelled ? "Cancelled" : apt.isCompleted ? "Completed" : "Pending"}
                                            </span>
                                        </td>
                                        <td className="p-3 flex gap-2">
                                            {!apt.cancelled && !apt.isCompleted && (
                                                <>
                                                    <button
                                                        onClick={() => completeAppointment(apt._id)}
                                                        className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600"
                                                    >
                                                        Complete
                                                    </button>
                                                    <button
                                                        onClick={() => cancelAppointment(apt._id)}
                                                        className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
