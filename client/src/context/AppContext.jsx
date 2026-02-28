import React, { createContext, useEffect, useState } from "react";
import { doctors } from "../assets/assets_frontend/assets.js";
import axios from "axios";
import { toast } from "react-hot-toast";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currencySymbol = "$";

  const [doctorsGet, setDoctorsGet] = useState([]);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Fetch all doctors
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor-list`);
      if (data.status) {
        setDoctorsGet(data.doctors);
        toast.success(data.message || "Doctors fetched successfully!");
      } else {
        toast.error(data.message || "Failed to fetch doctors");
      }
    } catch (error) {
      console.log("Error fetching doctors:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Load logged-in user profile
  const loadProfileData = async () => {
    if (!token) return setUserData(null);

    try {
      setLoadingProfile(true);
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.status && data.data) {
        setUserData(data.data);
      } else {
        setUserData(null);
      }
    } catch (error) {
      setUserData(null);
    } finally {
      setLoadingProfile(false);
    }
  };

  // Run once on mount to fetch doctors
  useEffect(() => {
    getAllDoctors();
  }, []);

  // Run whenever token changes
  useEffect(() => {
    if (token) {
      loadProfileData();
    } else {
      setUserData(null);
    }
  }, [token]);

  const value = {
    doctors: doctorsGet,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadingProfile,
    loadProfileData,
    getAllDoctors,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
