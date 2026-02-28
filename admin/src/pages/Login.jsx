import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext.jsx";
import { DoctorContext } from "../context/DoctorContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setToken, backendUrl } = useContext(AdminContext);
  const { setDToken, setDoctorData } = useContext(DoctorContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (state === "Admin") {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password });
        if (data.status) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Welcome back, Admin!");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password });
        if (data.status) {
          localStorage.setItem("dtoken", data.token);
          localStorage.setItem("doctorData", JSON.stringify(data.doctor));
          setDToken(data.token);
          setDoctorData(data.doctor);
          toast.success("Welcome, Doctor!");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error, try again later!");
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = state === "Admin";

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className={`hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden ${isAdmin ? "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" : "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700"}`}>
        {/* Background circles */}
        <div className="absolute top-[-80px] left-[-80px] w-80 h-80 rounded-full bg-white opacity-5" />
        <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full bg-white opacity-5" />
        <div className="absolute top-1/3 right-[-40px] w-48 h-48 rounded-full bg-white opacity-5" />

        <div className="relative z-10 text-center text-white">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            {isAdmin ? (
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            ) : (
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            )}
          </div>
          <h2 className="text-3xl font-bold mb-3">
            {isAdmin ? "Admin Portal" : "Doctor Portal"}
          </h2>
          <p className="text-blue-100 text-base max-w-xs mx-auto leading-relaxed">
            {isAdmin
              ? "Manage your clinic, doctors, appointments and analytics all in one place."
              : "Access your appointments, write prescriptions and use AI-powered tools."}
          </p>
          <div className="mt-8 flex flex-col gap-3 text-sm text-blue-100">
            {isAdmin ? (
              <>
                <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xs">✓</span> Full analytics dashboard</div>
                <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xs">✓</span> Manage doctors & patients</div>
                <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xs">✓</span> Subscription management</div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xs">✓</span> AI Symptom Checker</div>
                <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xs">✓</span> Digital Prescriptions</div>
                <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xs">✓</span> Appointment Management</div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isAdmin ? "bg-blue-600" : "bg-emerald-500"}`}>
                <span className="text-white text-sm font-bold">{isAdmin ? "A" : "D"}</span>
              </div>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">AI Clinic Management</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Sign in to your account</h1>
            <p className="text-gray-500 text-sm mt-1">Enter your credentials to access the {isAdmin ? "admin" : "doctor"} panel</p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 mb-6 shadow-sm">
            <button
              onClick={() => setState("Admin")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${state === "Admin" ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}
            >
              Admin Login
            </button>
            <button
              onClick={() => setState("Doctor")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${state === "Doctor" ? "bg-emerald-500 text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}
            >
              Doctor Login
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white text-sm font-semibold transition-all shadow-md ${isAdmin
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                } ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {loading ? "Signing in..." : `Sign in as ${state}`}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            AI Clinic Management System &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;