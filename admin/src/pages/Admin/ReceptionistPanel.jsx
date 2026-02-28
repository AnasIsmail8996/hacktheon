import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

const ReceptionistPanel = () => {
    const { token, backendUrl, doctors, getAllDoctors } = useContext(AdminContext);
    const [tab, setTab] = useState("register"); // register | book | schedule | patients
    const [patients, setPatients] = useState([]);
    const [todaySchedule, setTodaySchedule] = useState([]);
    const [scheduleError, setScheduleError] = useState("");
    const [scheduleLoading, setScheduleLoading] = useState(false);
    const [todayDateStr, setTodayDateStr] = useState("");

    // Register Patient
    const [patientForm, setPatientForm] = useState({ name: "", email: "", password: "", phone: "", gender: "", dob: "" });
    const [regLoading, setRegLoading] = useState(false);

    // Book Appointment
    const [bookForm, setBookForm] = useState({ patientId: "", docId: "", slotDate: "", slotTime: "" });
    const [bookLoading, setBookLoading] = useState(false);

    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        getAllDoctors();
        fetchPatients();
        fetchSchedule();
    }, []);

    const fetchPatients = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/receptionist/patients`, authHeader);
            if (data.status) setPatients(data.data);
        } catch { }
    };

    const fetchSchedule = async () => {
        setScheduleLoading(true);
        setScheduleError("");
        try {
            const { data } = await axios.get(`${backendUrl}/api/receptionist/today-schedule`, authHeader);
            if (data.status) {
                setTodaySchedule(data.data);
                setTodayDateStr(data.date || "");
            } else {
                setScheduleError(data.message || "Failed to load schedule");
            }
        } catch (err) {
            setScheduleError(err.response?.data?.message || err.message || "Network error — server may not be running");
        } finally {
            setScheduleLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegLoading(true);
        try {
            const { data } = await axios.post(`${backendUrl}/api/receptionist/register-patient`, patientForm, authHeader);
            if (data.status) {
                toast.success("Patient registered!");
                setPatientForm({ name: "", email: "", password: "", phone: "", gender: "", dob: "" });
                fetchPatients();
            } else toast.error(data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || "Error registering patient");
        } finally {
            setRegLoading(false);
        }
    };

    const handleBook = async (e) => {
        e.preventDefault();
        setBookLoading(true);
        try {
            const { data } = await axios.post(`${backendUrl}/api/receptionist/book-appointment`, bookForm, authHeader);
            if (data.status) {
                toast.success("Appointment booked!");
                setBookForm({ patientId: "", docId: "", slotDate: "", slotTime: "" });
                fetchSchedule();
            } else toast.error(data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || "Error booking appointment");
        } finally {
            setBookLoading(false);
        }
    };

    const tabs = [
        { id: "register", label: "Register Patient" },
        { id: "book", label: "Book Appointment" },
        { id: "schedule", label: "Today's Schedule" },
        { id: "patients", label: "Patients List" },
    ];

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">🏥 Receptionist Panel</h1>

            {/* Tabs */}
            <div className="flex gap-2 flex-wrap mb-6 border-b pb-2">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Register Patient */}
            {tab === "register" && (
                <form onSubmit={handleRegister} className="bg-white rounded-xl shadow p-6 max-w-lg space-y-4">
                    <h2 className="font-semibold text-gray-700 text-lg mb-2">Register New Patient</h2>
                    {[
                        { label: "Full Name *", name: "name", type: "text", placeholder: "Patient name" },
                        { label: "Email *", name: "email", type: "email", placeholder: "email@example.com" },
                        { label: "Password *", name: "password", type: "password", placeholder: "Minimum 8 characters" },
                        { label: "Phone", name: "phone", type: "text", placeholder: "0300-0000000" },
                        { label: "Date of Birth", name: "dob", type: "date", placeholder: "" },
                    ].map((f) => (
                        <div key={f.name}>
                            <label className="text-sm font-medium text-gray-700">{f.label}</label>
                            <input
                                type={f.type}
                                name={f.name}
                                value={patientForm[f.name]}
                                onChange={(e) => setPatientForm({ ...patientForm, [f.name]: e.target.value })}
                                placeholder={f.placeholder}
                                required={f.label.includes("*")}
                                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                            />
                        </div>
                    ))}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Gender</label>
                        <select
                            value={patientForm.gender}
                            onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={regLoading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
                    >
                        {regLoading ? "Registering..." : "Register Patient"}
                    </button>
                </form>
            )}

            {/* Book Appointment */}
            {tab === "book" && (
                <form onSubmit={handleBook} className="bg-white rounded-xl shadow p-6 max-w-lg space-y-4">
                    <h2 className="font-semibold text-gray-700 text-lg mb-2">Book Appointment</h2>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Patient *</label>
                        <select
                            value={bookForm.patientId}
                            onChange={(e) => setBookForm({ ...bookForm, patientId: e.target.value })}
                            required
                            className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                        >
                            <option value="">-- Select Patient --</option>
                            {patients.map((p) => (
                                <option key={p._id} value={p._id}>{p.name} ({p.email})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Doctor *</label>
                        <select
                            value={bookForm.docId}
                            onChange={(e) => setBookForm({ ...bookForm, docId: e.target.value })}
                            required
                            className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                        >
                            <option value="">-- Select Doctor --</option>
                            {doctors.filter((d) => d.available).map((d) => (
                                <option key={d._id} value={d._id}>{d.name} — {d.speciality}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Slot Date * (format: DD_MM_YYYY)</label>
                        <input
                            type="text"
                            placeholder="e.g. 15_03_2026"
                            value={bookForm.slotDate}
                            onChange={(e) => setBookForm({ ...bookForm, slotDate: e.target.value })}
                            required
                            className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Slot Time *</label>
                        <input
                            type="text"
                            placeholder="e.g. 10:00 AM"
                            value={bookForm.slotTime}
                            onChange={(e) => setBookForm({ ...bookForm, slotTime: e.target.value })}
                            required
                            className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={bookLoading}
                        className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-60"
                    >
                        {bookLoading ? "Booking..." : "Book Appointment"}
                    </button>
                </form>
            )}

            {/* Today's Schedule */}
            {tab === "schedule" && (
                <div className="bg-white rounded-xl shadow p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="font-semibold text-gray-700 text-lg">Today's Schedule</h2>
                            {todayDateStr && <p className="text-xs text-gray-400 mt-0.5">Date key: {todayDateStr}</p>}
                        </div>
                        <button
                            onClick={fetchSchedule}
                            className="flex items-center gap-1.5 text-xs border border-blue-200 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
                        >
                            <svg className={`w-3.5 h-3.5 ${scheduleLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            Refresh
                        </button>
                    </div>
                    {scheduleError ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {scheduleError}
                        </div>
                    ) : todaySchedule.length === 0 ? (
                        <div className="text-center py-10">
                            <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <p className="text-gray-400 text-sm font-medium">No appointments for today</p>
                            <p className="text-gray-300 text-xs mt-1">Use "Book Appointment" tab to schedule one</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-3">Time</th>
                                        <th className="p-3">Patient</th>
                                        <th className="p-3">Doctor</th>
                                        <th className="p-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {todaySchedule.map((apt) => (
                                        <tr key={apt._id} className="border-b hover:bg-gray-50">
                                            <td className="p-3 font-medium">{apt.slotTime}</td>
                                            <td className="p-3">{apt.userData?.name || "—"}</td>
                                            <td className="p-3">{apt.docData?.name ? `Dr. ${apt.docData.name}` : "—"}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${apt.isCompleted ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
                                                    {apt.isCompleted ? "Done" : "Pending"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* All Patients */}
            {tab === "patients" && (
                <div className="bg-white rounded-xl shadow p-5">
                    <h2 className="font-semibold text-gray-700 text-lg mb-4">Registered Patients ({patients.length})</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Phone</th>
                                    <th className="p-3">Gender</th>
                                    <th className="p-3">Plan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map((p) => (
                                    <tr key={p._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium">{p.name}</td>
                                        <td className="p-3">{p.email}</td>
                                        <td className="p-3">{p.phone}</td>
                                        <td className="p-3">{p.gender}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.subscriptionPlan === "pro" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>
                                                {p.subscriptionPlan || "free"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReceptionistPanel;
