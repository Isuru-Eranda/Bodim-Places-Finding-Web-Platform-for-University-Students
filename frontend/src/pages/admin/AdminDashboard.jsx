import { useEffect, useState } from 'react';
import { adminGetAnalytics } from '../../services/api';
import {
  Users,
  Building2,
  CalendarCheck,
  Star,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value ?? '—'}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function BookingBar({ label, count, total, color }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-800">{count} ({pct}%)</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminGetAnalytics()
      .then((r) => setData(r.data))
      .catch((err) => setError(err.response?.data?.message || err.message || 'Failed to load analytics. Make sure the backend server is running.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="mt-10 mx-auto max-w-md bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 font-medium mb-1">Failed to load</p>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );

  const { stats, recentUsers, recentBookings, usersByRole, bookingsByMonth } = data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Platform overview</p>
      </div>

      {/* Primary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="bg-orange-500" />
        <StatCard label="Total Listings" value={stats.totalListings} icon={Building2} color="bg-[#1F2937]" />
        <StatCard label="Total Bookings" value={stats.totalBookings} icon={CalendarCheck} color="bg-emerald-500" />
        <StatCard label="Total Reviews" value={stats.totalReviews} icon={Star} color="bg-amber-500" />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Verified Listings" value={stats.verifiedListings} icon={CheckCircle} color="bg-teal-500" />
        <StatCard label="Pending Bookings" value={stats.pendingBookings} icon={Clock} color="bg-orange-500" />
        <StatCard label="Confirmed Bookings" value={stats.confirmedBookings} icon={TrendingUp} color="bg-green-500" />
        <StatCard label="Cancelled Bookings" value={stats.cancelledBookings} icon={XCircle} color="bg-red-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking status breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Booking Status</h2>
          <div className="space-y-3">
            <BookingBar label="Confirmed" count={stats.confirmedBookings} total={stats.totalBookings} color="bg-green-500" />
            <BookingBar label="Pending" count={stats.pendingBookings} total={stats.totalBookings} color="bg-orange-400" />
            <BookingBar label="Cancelled" count={stats.cancelledBookings} total={stats.totalBookings} color="bg-red-400" />
          </div>
        </div>

        {/* Users by role */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Users by Role</h2>
          <div className="space-y-3">
            {usersByRole.map((r) => (
              <BookingBar
                key={r._id}
                label={r._id.charAt(0).toUpperCase() + r._id.slice(1)}
                count={r.count}
                total={stats.totalUsers}
                color={r._id === 'admin' ? 'bg-orange-500' : r._id === 'owner' ? 'bg-[#1F2937]' : 'bg-emerald-500'}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bookings over time */}
      {bookingsByMonth.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Bookings by Month</h2>
          <div className="flex items-end gap-2 h-32">
            {bookingsByMonth.map((m) => {
              const maxCount = Math.max(...bookingsByMonth.map((x) => x.count));
              const heightPct = maxCount ? (m.count / maxCount) * 100 : 0;
              const monthLabel = new Date(m._id.year, m._id.month - 1).toLocaleString('default', { month: 'short' });
              return (
                <div key={`${m._id.year}-${m._id.month}`} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-gray-700">{m.count}</span>
                  <div className="w-full flex items-end" style={{ height: '80px' }}>
                    <div
                      className="w-full bg-orange-500 rounded-t-sm"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{monthLabel}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Recent Users</h2>
          <ul className="space-y-3">
            {recentUsers.map((u) => (
              <li key={u._id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  u.role === 'admin' ? 'bg-orange-100 text-orange-700' :
                  u.role === 'owner' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {u.role}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Recent Bookings</h2>
          <ul className="space-y-3">
            {recentBookings.map((b) => (
              <li key={b._id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{b.listingId?.title ?? 'N/A'}</p>
                  <p className="text-xs text-gray-400">{b.studentId?.name ?? 'N/A'}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  b.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {b.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
