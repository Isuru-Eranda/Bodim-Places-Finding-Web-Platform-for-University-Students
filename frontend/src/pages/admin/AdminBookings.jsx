import { useEffect, useState, useCallback } from 'react';
import { adminGetBookings, adminUpdateBooking, adminDeleteBooking } from '../../services/api';
import { Trash2 } from 'lucide-react';

const BOOKING_STATUSES = ['pending', 'confirmed', 'cancelled'];
const PAYMENT_STATUSES = ['unpaid', 'paid', 'refunded'];

function StatusBadge({ value, type }) {
  const colorMap = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-orange-100 text-orange-700',
    cancelled: 'bg-red-100 text-red-700',
    paid: 'bg-green-100 text-green-700',
    unpaid: 'bg-gray-100 text-gray-600',
    refunded: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorMap[value] ?? 'bg-gray-100 text-gray-600'}`}>
      {value}
    </span>
  );
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');

  const fetchBookings = useCallback(() => {
    setLoading(true);
    setError('');
    adminGetBookings({ status: statusFilter, paymentStatus: paymentFilter, page, limit: 20 })
      .then((r) => {
        setBookings(r.data.bookings);
        setTotal(r.data.total);
        setPages(r.data.pages);
      })
      .catch((err) => setError(err.response?.data?.message || err.message || 'Failed to load bookings. Make sure the backend server is running.'))
      .finally(() => setLoading(false));
  }, [statusFilter, paymentFilter, page]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleUpdate = async (id, field, value) => {
    setActionLoading(id + '_' + field);
    try {
      const { data } = await adminUpdateBooking(id, { [field]: value });
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, ...data } : b)));
    } catch {
      alert('Failed to update booking');
    } finally {
      setActionLoading('');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking? This cannot be undone.')) return;
    setActionLoading(id + '_del');
    try {
      await adminDeleteBooking(id);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      setTotal((t) => t - 1);
    } catch {
      alert('Failed to delete booking');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
        <p className="text-sm text-gray-500 mt-1">{total} total bookings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          <option value="">All Statuses</option>
          {BOOKING_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select
          value={paymentFilter}
          onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          <option value="">All Payment Statuses</option>
          {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Listing</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Student</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Payment</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Date</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-800">{b.listingId?.title ?? 'N/A'}</p>
                      <p className="text-xs text-gray-400">{b.listingId?.location}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-gray-700">{b.studentId?.name ?? 'N/A'}</p>
                      <p className="text-xs text-gray-400">{b.studentId?.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={b.status}
                        disabled={actionLoading === b._id + '_status'}
                        onChange={(e) => handleUpdate(b._id, 'status', e.target.value)}
                        className="px-2 py-1 text-xs border border-[#E5E7EB] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
                      >
                        {BOOKING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={b.paymentStatus}
                        disabled={actionLoading === b._id + '_paymentStatus'}
                        onChange={(e) => handleUpdate(b._id, 'paymentStatus', e.target.value)}
                        className="px-2 py-1 text-xs border border-[#E5E7EB] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
                      >
                        {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-gray-400 whitespace-nowrap">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleDelete(b._id)}
                        disabled={actionLoading === b._id + '_del'}
                        className="p-1.5 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
                        title="Delete booking"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {page} of {pages}</span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
