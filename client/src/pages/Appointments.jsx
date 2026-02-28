import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctor from "../components/RelatedDoctor";
import toast from "react-hot-toast";
import axios from "axios";

const Appointments = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, getAllDoctors, backendUrl, token } =
    useContext(AppContext);

  const navigate = useNavigate();
  const [docInformation, setDocInformation] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotsIndex, setSlotsIndex] = useState(0);
  const [slotsTime, setSlotsTime] = useState("");

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // ✅ Generate 7 days of slots from today (10 AM - 9 PM)
  const getAvailableSlots = () => {
    const today = new Date();
    const slots = [];

    for (let i = 0; i < 7; i++) {
      let day = new Date();
      day.setDate(today.getDate() + i);
      day.setHours(10, 0, 0, 0);

      const endTime = new Date(day);
      endTime.setHours(21, 0, 0, 0);

      const daySlots = [];
      while (day <= endTime) {
        daySlots.push({
          dateTime: new Date(day),
          time: day.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
        day.setMinutes(day.getMinutes() + 30);
      }

      slots.push(daySlots);
    }

    setDocSlots(slots);
  };

  // ✅ Load doctor info
  const loadDoctorInfo = () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInformation(docInfo || null);
  };
const bookAppointment = async () => {
  try {
    if (!token) {
      toast.error("Please login to book appointment");
      return navigate("/login");
    }

    const date = docSlots[slotsIndex][0].dateTime;
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();

    const slotDate = `${day}_${month}_${year}`;
    const slotTime = "10:00 AM";

    const { data } = await axios.post(
      `${backendUrl}/api/user/book-appointment`,
      { docId, slotDate, slotTime },
      {
        headers: {
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json", 
        },
      }
    );

    if (data.status) {
      toast.success("Appointment booked successfully!");
      getAllDoctors();
      navigate("/my-appointments");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error("❌ Error booking appointment:", error);
    toast.error(error.response?.data?.message || "Something went wrong!");
  }
};

  useEffect(() => {
    if (doctors.length > 0) loadDoctorInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInformation) getAvailableSlots();
  }, [docInformation]);

  if (!docInformation) return null;

  return (
    <div className="px-6 md:px-16 py-10">
      {/* Doctor Info */}
      <div className="flex flex-col sm:flex-row gap-6">
        <img
          src={docInformation.image}
          className="w-40 h-40 rounded-full object-cover"
          alt="Doctor"
        />

        <div className="flex-1 border p-5 rounded-lg shadow-sm">
          <p className="text-2xl font-semibold flex items-center gap-2">
            {docInformation.name}
            <img src={assets.verified_icon} className="w-5" alt="Verified" />
          </p>

          <p className="text-gray-700 mt-2">
            {docInformation.degree} — {docInformation.speciality}
          </p>

          <button className="mt-3 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded">
            {docInformation.experience}
          </button>

          <div className="mt-4">
            <p className="font-medium flex items-center gap-2">
              About <img src={assets.info_icon} className="w-4" alt="Info" />
            </p>
            <p className="text-gray-600 text-sm mt-1">{docInformation.about}</p>
          </div>

          <p className="mt-4 font-medium">
            Appointment Fee:
            <span className="text-blue-600 font-semibold">
              {" "}
              {currencySymbol}
              {docInformation.fees}
            </span>
          </p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className="mt-10">
        <p className="text-lg font-semibold mb-4 text-center">Booking Slots</p>

        {/* Date Tabs */}
        <div className="flex justify-center">
          <div className="flex gap-3 overflow-x-auto pb-3 max-w-full justify-center">
            {docSlots.map((daySlots, index) => (
              <div
                key={index}
                onClick={() => setSlotsIndex(index)}
                className={`cursor-pointer px-4 py-2 rounded-md text-center min-w-[70px] 
                ${
                  slotsIndex === index
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <p>{daysOfWeek[daySlots[0].dateTime.getDay()]}</p>
                <p>{daySlots[0].dateTime.getDate()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          {docSlots[slotsIndex]?.map((slot, index) => (
            <p
              key={index}
              onClick={() => setSlotsTime(slot.time)}
              className={`px-4 py-2 rounded-md cursor-pointer border
              ${
                slotsTime === slot.time
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {slot.time.toLowerCase()}
            </p>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={bookAppointment}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
          >
            Book Appointment
          </button>
        </div>
      </div>

      {/* Related Doctors */}
      <RelatedDoctor
        docId={docId}
        speciality={docInformation.speciality}
      />
    </div>
  );
};

export default Appointments;
