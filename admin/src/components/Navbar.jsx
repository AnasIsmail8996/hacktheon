import React, { useContext } from "react";
import { assets } from "../assets/assets_admin/assets.js";
import { AdminContext } from "../context/AdminContext.jsx";
import { DoctorContext } from "../context/DoctorContext.jsx";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { token, setToken } = useContext(AdminContext);
  const { dToken, doctorData, logout: doctorLogout } = useContext(DoctorContext);
  const navigate = useNavigate();

  const logout = () => {
    if (token) { setToken(""); localStorage.removeItem("token"); }
    if (dToken) { doctorLogout(); }
    navigate("/");
  };

  const label = token ? "Admin" : dToken ? `Dr. ${doctorData?.name || "Doctor"}` : "";
  const roleColor = token ? "from-blue-600 to-indigo-600" : "from-emerald-500 to-teal-600";
  const roleBadge = token ? "ADMIN" : "DOCTOR";

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-0 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      {/* Left — Logo + Title */}
      <div className="flex items-center gap-3 py-3">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${roleColor} flex items-center justify-center shadow-md`}>
          <span className="text-white text-sm font-bold">
            {token ? "A" : dToken ? "D" : "C"}
          </span>
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-800 leading-tight">
            {token ? "Admin Panel" : dToken ? "Doctor Panel" : "AI Clinic"}
          </h1>
          <p className="text-xs text-gray-400">MediCare Management</p>
        </div>
      </div>

      {/* Right — Profile + Logout */}
      {(token || dToken) && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <img
              src={dToken && doctorData?.image ? doctorData.image : assets.doctor_icon}
              alt="Profile"
              className="w-8 h-8 rounded-full border-2 border-white shadow object-cover"
            />
            <div className="hidden sm:block">
              <p className="text-xs text-gray-500">Logged in as</p>
              <p className="text-sm font-semibold text-gray-800">{label}</p>
            </div>
            <span className={`hidden sm:inline text-xs font-bold text-white px-2 py-0.5 rounded-full bg-gradient-to-r ${roleColor}`}>
              {roleBadge}
            </span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold text-sm px-4 py-2 rounded-xl transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

