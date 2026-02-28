import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";

const MyAppointments = () => {
  const { backendUrl, token , getAllDoctors} = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUNE",
    "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"
  ];

  const formatSlotDate = (slotDate) => {
    if (!slotDate) return "N/A";
    const parts = slotDate.split("_");
    if (parts.length !== 3) return slotDate;

    const day = parts[0];
    const month = months[Number(parts[1]) - 1] || "";
    const year = parts[2];

    return `${day} ${month} ${year}`;
  };

  const getUserAppointments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointment`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.status) {
        const fixedAppointments = data.data.map((a) => {
          const doc = a.docData || {};
          if (doc.address && typeof doc.address === "string") {
            doc.address = { line1: doc.address, line2: "" };
          }
          return { ...a, docData: doc };
        });

        setAppointments(fixedAppointments.reverse());
      } else {
        toast.error(data.message || "Failed to fetch appointments");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId, userId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.status) {
        toast.success(data.message);

        // Update local state to mark appointment as cancelled
        setAppointments((prev) =>
          prev.map((a) =>
            a._id === appointmentId ? { ...a, cancelled: true } : a
          )
        );

        getUserAppointments()
        getAllDoctors()
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error canceling appointment");
    }
  };

  useEffect(() => {
    getUserAppointments();
  }, [token]);

  return (
    <section className="px-6 md:px-16 py-10 bg-gray-50 min-h-[80vh]">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">
          MY APPOINTMENTS
        </h1>

        {loading ? (
          <p className="text-center text-gray-500 text-lg">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No appointments found.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {appointments.map((item, index) => {
              const doctor = item.docData || {};

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 hover:shadow-lg transition w-full"
                >
                  {/* Doctor Image */}
                  <img
                    src={doctor.image || ""}
                    alt={doctor.name || "Doctor"}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-blue-600"
                  />

                  {/* Doctor Info */}
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <p className="text-xl font-semibold text-gray-800">
                      {doctor.name || "Unknown Doctor"}
                    </p>
                    <p className="text-gray-600">{doctor.speciality || "No speciality"}</p>
                    <p className="text-gray-500 font-medium">Address:</p>
                    <p className="text-gray-700">{doctor.address?.line1 || "Address not available"}</p>
                    <p className="text-gray-700">{doctor.address?.line2 || ""}</p>
                    <p className="text-gray-600 mt-2">
                      <span className="font-medium text-gray-800">Date & Time:</span>{" "}
                      {formatSlotDate(item.slotDate)} | {item.slotTime || ""}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-2 mt-4 sm:mt-0">
                    {!item.cancelled && (
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition w-full sm:w-auto">
                        Pay Online
                      </button>
                    )}

                    <button
                      onClick={() => cancelAppointment(item._id, item.userId)}
                      disabled={item.cancelled}
                      className={`px-4 py-2 rounded-md transition w-full cursor-col-resize sm:w-auto text-white ${
                        item.cancelled
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-300 hover:bg-red-400"
                      }`}
                    >
                      {item.cancelled ? "Cancelled" : "Cancel Appointment"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyAppointments;
