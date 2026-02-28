import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";

const DoctorAppointments = () => {
    const { appointments, getDoctorAppointments, completeAppointment, cancelAppointment } =
        useContext(DoctorContext);

    useEffect(() => {
        getDoctorAppointments();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h1>

            {appointments.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
                    No appointments found.
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th className="p-3">#</th>
                                    <th className="p-3">Patient</th>
                                    <th className="p-3">Age / Gender</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Time</th>
                                    <th className="p-3">Fees (PKR)</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((apt, i) => (
                                    <tr key={apt._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 text-gray-500">{i + 1}</td>
                                        <td className="p-3 font-medium">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={apt.userData?.image || "https://via.placeholder.com/32"}
                                                    alt=""
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                                {apt.userData?.name || "Patient"}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            {apt.userData?.dob !== "Not Selected" ? `${apt.userData?.dob}` : "-"} /{" "}
                                            {apt.userData?.gender || "-"}
                                        </td>
                                        <td className="p-3">{apt.slotDate?.replace(/_/g, "/")}</td>
                                        <td className="p-3">{apt.slotTime}</td>
                                        <td className="p-3">{apt.amount}</td>
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
                                        <td className="p-3">
                                            {!apt.cancelled && !apt.isCompleted ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => completeAppointment(apt._id)}
                                                        className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600"
                                                    >
                                                        ✔ Done
                                                    </button>
                                                    <button
                                                        onClick={() => cancelAppointment(apt._id)}
                                                        className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600"
                                                    >
                                                        ✘ Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs">—</span>
                                            )}
                                        </td>
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

export default DoctorAppointments;
