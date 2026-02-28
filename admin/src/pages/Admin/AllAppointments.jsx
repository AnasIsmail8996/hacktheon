import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AllAppointments = () => {
  const { token, backendUrl } = useContext(AdminContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | cancelled | completed

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/admin/all-appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.status) {
        setAppointments(data.data);
      } else {
        toast.error(data.message || 'Failed to load appointments');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/cancel-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.status) {
        toast.success('Appointment cancelled');
        fetchAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Failed to cancel appointment');
    }
  };

  useEffect(() => {
    if (token) fetchAppointments();
  }, [token]);

  const filtered = appointments.filter(apt => {
    const matchSearch =
      apt.userData?.name?.toLowerCase().includes(search.toLowerCase()) ||
      apt.docData?.name?.toLowerCase().includes(search.toLowerCase());
    if (filter === 'cancelled') return matchSearch && apt.cancelled;
    if (filter === 'completed') return matchSearch && apt.isCompleted && !apt.cancelled;
    if (filter === 'active') return matchSearch && !apt.cancelled && !apt.isCompleted;
    return matchSearch;
  });

  const getStatusBadge = (apt) => {
    if (apt.cancelled) return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">Cancelled</span>;
    if (apt.isCompleted) return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Completed</span>;
    return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Active</span>;
  };

  const stats = {
    total: appointments.length,
    active: appointments.filter(a => !a.cancelled && !a.isCompleted).length,
    completed: appointments.filter(a => a.isCompleted && !a.cancelled).length,
    cancelled: appointments.filter(a => a.cancelled).length,
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Appointments</h1>
        <p className="text-gray-500 text-sm mt-1">Manage and monitor all patient appointments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'bg-indigo-50 text-indigo-700', border: 'border-indigo-100' },
          { label: 'Active', value: stats.active, color: 'bg-blue-50 text-blue-700', border: 'border-blue-100' },
          { label: 'Completed', value: stats.completed, color: 'bg-green-50 text-green-700', border: 'border-green-100' },
          { label: 'Cancelled', value: stats.cancelled, color: 'bg-red-50 text-red-600', border: 'border-red-100' },
        ].map((s, i) => (
          <div key={i} className={`rounded-xl border ${s.border} p-4 ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm font-medium opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient or doctor name..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'completed', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <button onClick={fetchAppointments} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <p className="font-medium">No appointments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Patient</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Doctor</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date & Time</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fees</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((apt, i) => (
                  <tr key={apt._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={apt.userData?.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(apt.userData?.name || 'P')}
                          className="w-8 h-8 rounded-full object-cover border"
                          alt=""
                        />
                        <div>
                          <p className="font-medium text-gray-800">{apt.userData?.name}</p>
                          <p className="text-xs text-gray-400">{apt.userData?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={apt.docData?.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(apt.docData?.name || 'D')}
                          className="w-8 h-8 rounded-full object-cover border"
                          alt=""
                        />
                        <div>
                          <p className="font-medium text-gray-800">{apt.docData?.name}</p>
                          <p className="text-xs text-gray-400">{apt.docData?.speciality}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-700">{apt.slotDate?.replace(/_/g, '/')}</p>
                      <p className="text-xs text-gray-400">{apt.slotTime}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-700">PKR {apt.amount}</td>
                    <td className="px-5 py-4">
                      {apt.payment
                        ? <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Paid</span>
                        : <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Pending</span>
                      }
                    </td>
                    <td className="px-5 py-4">{getStatusBadge(apt)}</td>
                    <td className="px-5 py-4">
                      {!apt.cancelled && !apt.isCompleted ? (
                        <button
                          onClick={() => cancelAppointment(apt._id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-medium transition-all"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-gray-400 mt-3 text-right">Showing {filtered.length} of {appointments.length} appointments</p>
      )}
    </div>
  );
};

export default AllAppointments;