import React, { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(localStorage.getItem("dtoken") || "");
  const [doctorData, setDoctorData] = useState(
    localStorage.getItem("doctorData") ? JSON.parse(localStorage.getItem("doctorData")) : null
  );
  const [appointments, setAppointments] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);

  const getDoctorAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
        headers: { dtoken: dToken },
      });
      if (data.status) setAppointments(data.data);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch appointments");
    }
  };

  const getDoctorDashboard = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
        headers: { dtoken: dToken },
      });
      if (data.status) setDashboardData(data.data);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch dashboard");
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        { headers: { dtoken: dToken } }
      );
      if (data.status) {
        toast.success(data.message);
        getDoctorAppointments();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        { headers: { dtoken: dToken } }
      );
      if (data.status) {
        toast.success(data.message);
        getDoctorAppointments();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  const getDoctorPrescriptions = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/prescriptions`, {
        headers: { dtoken: dToken },
      });
      if (data.status) setPrescriptions(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("dtoken");
    localStorage.removeItem("doctorData");
    setDToken("");
    setDoctorData(null);
  };

  const value = {
    backendUrl,
    dToken, setDToken,
    doctorData, setDoctorData,
    appointments,
    dashboardData,
    prescriptions,
    getDoctorAppointments,
    getDoctorDashboard,
    completeAppointment,
    cancelAppointment,
    getDoctorPrescriptions,
    logout,
  };

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;

