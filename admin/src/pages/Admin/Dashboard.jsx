import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { token, backendUrl, doctors, getAllDoctors } = useContext(AdminContext);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAllDoctors();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/analytics/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.status) setStats(data.data);
    } catch { }
  };

  const cards = stats
    ? [
      { label: "Total Appointments", value: stats.totalAppointments, color: "bg-blue-100 text-blue-700", icon: "📅" },
      { label: "Total Patients", value: stats.totalPatients, color: "bg-purple-100 text-purple-700", icon: "👥" },
      { label: "Total Doctors", value: stats.totalDoctors, color: "bg-green-100 text-green-700", icon: "👨‍⚕️" },
      { label: "Revenue (PKR)", value: stats.revenue?.toLocaleString() || 0, color: "bg-emerald-100 text-emerald-700", icon: "💰" },
    ]
    : [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {cards.map((card, i) => (
            <div key={i} className={`rounded-xl p-4 shadow-sm ${card.color}`}>
              <div className="text-2xl mb-1">{card.icon}</div>
              <p className="text-xs font-medium opacity-70">{card.label}</p>
              <p className="text-2xl font-bold mt-1">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Add Doctor", path: "/add-doctor", color: "bg-blue-600" },
          { label: "View Appointments", path: "/all-appointments", color: "bg-green-600" },
          { label: "Analytics", path: "/analytics", color: "bg-purple-600" },
          { label: "Receptionist Panel", path: "/receptionist", color: "bg-orange-500" },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={() => navigate(btn.path)}
            className={`${btn.color} text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-700 text-lg">Doctors Overview</h2>
          <button onClick={() => navigate("/doctor-list")} className="text-blue-600 text-sm hover:underline">
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Doctor</th>
                <th className="p-3">Speciality</th>
                <th className="p-3">Fees (PKR)</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {doctors.slice(0, 5).map((doc) => (
                <tr key={doc._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-2 font-medium">
                    <img src={doc.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                    {doc.name}
                  </td>
                  <td className="p-3">{doc.speciality}</td>
                  <td className="p-3">{doc.fees}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${doc.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {doc.available ? "Available" : "Unavailable"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
