import { createContext, useState } from "react";
import axios from "axios"
import {toast} from "react-toastify"

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  
 const backendUrl= import.meta.env.VITE_BACKEND_URL;
  const[token, setToken]=useState(localStorage.getItem('token')? localStorage.getItem('token'): '')
  const[doctors, setDoctors]=useState([])

const getAllDoctors = async () => {
  try {
    const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (data.status) {
      setDoctors(data.doctors);
      console.log(data);
      
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error("Error fetching doctors:", error);
    toast.error(error.response?.data?.message || "Failed to fetch doctors");
  }
};

const changeAvailability = async (docId) => {
  try {
    const { data } = await axios.post(
      `${backendUrl}/api/admin/change-availability`,
      { docId }, 
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (data.status) {
      toast.success(data.message);
      getAllDoctors(); 
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error("Error changing availability:", error);
    toast.error(error.response?.data?.message || "Failed to change availability");
  }
};


  const value = {
    token, setToken,
    backendUrl,
    doctors,
    setDoctors,
    getAllDoctors,
    changeAvailability

  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
