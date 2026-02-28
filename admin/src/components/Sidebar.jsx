import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets_admin/assets";

const Sidebar = () => {
  const { token } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200"
      : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
    }`;

  const doctorLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-200"
      : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
    }`;

  return (
    <div className="min-h-screen w-64 bg-white border-r border-gray-100 fixed left-0 top-0 pt-[72px] hidden md:flex flex-col overflow-y-auto">
      <div className="flex flex-col p-4 gap-1 flex-1">

        {/* Admin Sidebar */}
        {token && (
          <div>
            <div className="flex items-center gap-2 px-2 mb-3 mt-2">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Admin Menu</span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            <ul className="flex flex-col gap-1">
              <NavLink to="/admin-dashboard" className={linkClass}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h7v7H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 18h7v3H3z" /></svg>
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/all-appointments" className={linkClass}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span>Appointments</span>
              </NavLink>
              <NavLink to="/add-doctor" className={linkClass}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                <span>Add Doctor</span>
              </NavLink>
              <NavLink to="/doctor-list" className={linkClass}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                <span>Doctors List</span>
              </NavLink>
              <NavLink to="/analytics" className={linkClass}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                <span>Analytics</span>
              </NavLink>
              <NavLink to="/receptionist" className={linkClass}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <span>Receptionist</span>
              </NavLink>

              {/* AI Tools divider */}
              <div className="flex items-center gap-2 px-2 mb-1 mt-3">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-[10px] text-violet-400 font-bold tracking-widest uppercase">AI Tools</span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>

              <NavLink to="/ai-dashboard" className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200"
                  : "text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                }`
              }>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.386A2 2 0 0115 17H9a2 2 0 01-1.414-2.586l-.347-.386z" /></svg>
                <span>AI Symptom Checker</span>
                <span className="ml-auto text-[9px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full font-bold">NEW</span>
              </NavLink>
            </ul>
          </div>
        )}

        {/* Doctor Sidebar */}
        {dToken && (
          <div>
            <div className="flex items-center gap-2 px-2 mb-3 mt-2">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Doctor Menu</span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            <ul className="flex flex-col gap-1">
              <NavLink to="/doctor-dashboard" className={doctorLinkClass}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h7v7H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 18h7v3H3z" /></svg>
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/doctor-appointments" className={doctorLinkClass}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span>Appointments</span>
              </NavLink>
              <NavLink to="/add-prescription" className={doctorLinkClass}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <span>Write Prescription</span>
              </NavLink>
              <NavLink to="/symptom-checker" className={doctorLinkClass}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-1" /></svg>
                <span>AI Symptom Checker</span>
              </NavLink>
            </ul>
          </div>
        )}
      </div>

      {/* Bottom branding */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3">
          <p className="text-xs font-semibold text-blue-700">AI Clinic Pro</p>
          <p className="text-[10px] text-blue-500 mt-0.5">Powered by Gemini AI</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;