import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";

const AddPrescription = () => {
    const { dToken, backendUrl, appointments, getDoctorAppointments } = useContext(DoctorContext);

    const [patientId, setPatientId] = useState("");
    const [appointmentId, setAppointmentId] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [instructions, setInstructions] = useState("");
    const [followUpDate, setFollowUpDate] = useState("");
    const [medicines, setMedicines] = useState([{ name: "", dosage: "", frequency: "", duration: "" }]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getDoctorAppointments();
    }, []);

    const addMedicineRow = () => {
        setMedicines([...medicines, { name: "", dosage: "", frequency: "", duration: "" }]);
    };

    const removeMedicineRow = (i) => {
        setMedicines(medicines.filter((_, idx) => idx !== i));
    };

    const updateMedicine = (i, field, value) => {
        const updated = [...medicines];
        updated[i][field] = value;
        setMedicines(updated);
    };

    const handleAptSelect = (e) => {
        const val = e.target.value;
        setAppointmentId(val);
        const apt = appointments.find((a) => a._id === val);
        if (apt) setPatientId(apt.userId);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!patientId || !diagnosis || medicines.some((m) => !m.name || !m.dosage)) {
            toast.error("Fill all required fields including medicine name and dosage.");
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/prescription/create`,
                { patientId, appointmentId, diagnosis, medicines, instructions, followUpDate },
                { headers: { dtoken: dToken } }
            );
            if (data.status) {
                toast.success("Prescription created successfully!");
                setDiagnosis("");
                setInstructions("");
                setFollowUpDate("");
                setMedicines([{ name: "", dosage: "", frequency: "", duration: "" }]);
                setPatientId("");
                setAppointmentId("");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create prescription");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Write Prescription</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
                {/* Appointment Select */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Appointment <span className="text-red-500">*</span>
                    </label>
                    <select
                        className="w-full border rounded-lg px-3 py-2"
                        value={appointmentId}
                        onChange={handleAptSelect}
                        required
                    >
                        <option value="">-- Select Appointment --</option>
                        {appointments
                            .filter((a) => !a.cancelled && a.isCompleted)
                            .map((a) => (
                                <option key={a._id} value={a._id}>
                                    {a.userData?.name} — {a.slotDate?.replace(/_/g, "/")} {a.slotTime}
                                </option>
                            ))}
                    </select>
                    <p className="text-xs text-gray-400 mt-1">Only completed appointments shown</p>
                </div>

                {/* Diagnosis */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Diagnosis <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full border rounded-lg px-3 py-2"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        placeholder="e.g., Acute Pharyngitis"
                        required
                    />
                </div>

                {/* Medicines */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Medicines <span className="text-red-500">*</span>
                        </label>
                        <button
                            type="button"
                            onClick={addMedicineRow}
                            className="text-blue-600 text-sm font-semibold hover:underline"
                        >
                            + Add Medicine
                        </button>
                    </div>
                    {medicines.map((med, i) => (
                        <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                            <input
                                className="border rounded px-2 py-1 text-sm col-span-1"
                                placeholder="Medicine name*"
                                value={med.name}
                                onChange={(e) => updateMedicine(i, "name", e.target.value)}
                                required
                            />
                            <input
                                className="border rounded px-2 py-1 text-sm"
                                placeholder="Dosage* (e.g. 500mg)"
                                value={med.dosage}
                                onChange={(e) => updateMedicine(i, "dosage", e.target.value)}
                                required
                            />
                            <input
                                className="border rounded px-2 py-1 text-sm"
                                placeholder="Frequency (e.g. 3x/day)"
                                value={med.frequency}
                                onChange={(e) => updateMedicine(i, "frequency", e.target.value)}
                            />
                            <div className="flex gap-1">
                                <input
                                    className="border rounded px-2 py-1 text-sm flex-1"
                                    placeholder="Duration"
                                    value={med.duration}
                                    onChange={(e) => updateMedicine(i, "duration", e.target.value)}
                                />
                                {medicines.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeMedicineRow(i)}
                                        className="text-red-500 px-2 rounded hover:bg-red-50"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Instructions */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                    <textarea
                        className="w-full border rounded-lg px-3 py-2 h-20 resize-none"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="Additional instructions for the patient..."
                    />
                </div>

                {/* Follow Up */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                    <input
                        type="date"
                        className="w-full border rounded-lg px-3 py-2"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
                >
                    {loading ? "Creating..." : "Create Prescription"}
                </button>
            </form>
        </div>
    );
};

export default AddPrescription;
