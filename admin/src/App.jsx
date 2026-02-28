import React, { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import { AdminContext } from "./context/AdminContext";
import { DoctorContext } from "./context/DoctorContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";

// Admin Pages
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import DoctorsList from "./pages/Admin/DoctorsList";
import AddDoctor from "./pages/Admin/AddDoctor";
import AnalyticsDashboard from "./pages/Admin/AnalyticsDashboard";
import ReceptionistPanel from "./pages/Admin/ReceptionistPanel";
import AiDashboard from "./pages/Admin/AiDashboard";

// Doctor Pages
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import AddPrescription from "./pages/Doctor/AddPrescription";
import SymptomChecker from "./pages/Doctor/SymptomChecker";

const App = () => {
  const { token } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  const isLoggedIn = token || dToken;

  return isLoggedIn ? (
    <div className="bg-gray-100 min-h-screen">
      <ToastContainer />
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-0 md:ml-64 p-6">
          <Routes>
            {/* Admin Routes */}
            {token && (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/admin-dashboard" element={<Dashboard />} />
                <Route path="/all-appointments" element={<AllAppointments />} />
                <Route path="/add-doctor" element={<AddDoctor />} />
                <Route path="/doctor-list" element={<DoctorsList />} />
                <Route path="/analytics" element={<AnalyticsDashboard />} />
                <Route path="/receptionist" element={<ReceptionistPanel />} />
                <Route path="/ai-dashboard" element={<AiDashboard />} />
              </>
            )}

            {/* Doctor Routes */}
            {dToken && (
              <>
                <Route path="/" element={<DoctorDashboard />} />
                <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor-appointments" element={<DoctorAppointments />} />
                <Route path="/add-prescription" element={<AddPrescription />} />
                <Route path="/symptom-checker" element={<SymptomChecker />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <Login />
      <ToastContainer />
    </div>
  );
};

export default App;

