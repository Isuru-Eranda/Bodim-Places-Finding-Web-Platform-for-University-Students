import { useEffect, useState, useCallback } from 'react';
import { adminGetUsers, adminUpdateUserRole, adminDeleteUser } from '../../services/api';
import { Search, Trash2, UserCog } from 'lucide-react';

const ROLES = ['student', 'owner', 'admin'];

function Badge({ role }) {
  const cls =
    role === 'admin' ? 'bg-orange-100 text-orange-700' :
    role === 'owner' ? 'bg-[#1F2937]/10 text-[#1F2937]' :
    'bg-green-100 text-green-700';
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{role}</span>;
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = useCallback(() => {
    setLoading(true);
    setError('');
    adminGetUsers({ search, role: roleFilter, page, limit: 20 })
      .then((r) => {
        setUsers(r.data.users);
        setTotal(r.data.total);
        setPages(r.data.pages);
      })
      .catch((err) => setError(err.response?.data?.message || err.message || 'Failed to load users. Make sure the backend server is running.'))
      .finally(() => setLoading(false));
  }, [search, roleFilter, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleRoleChange = async (id, role) => {
    setActionLoading(id + '_role');
    try {
      const { data } = await adminUpdateUserRole(id, role);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: data.role } : u)));
    } catch {
      alert('Failed to update role');
    } finally {
      setActionLoading('');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setActionLoading(id + '_del');
    try {
      await adminDeleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setTotal((t) => t - 1);
    } catch {
      alert('Failed to delete user');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-sm text-gray-500 mt-1">{total} total users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          <option value="">All Roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
        </select>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Email</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Role</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Joined</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3 font-medium text-gray-800">{u.name}</td>
                    <td className="px-5 py-3 text-gray-500">{u.email}</td>
                    <td className="px-5 py-3">
                      <Badge role={u.role} />
                    </td>
                    <td className="px-5 py-3 text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {/* Role selector */}
                        <div className="relative">
                          <select
                            value={u.role}
                            disabled={actionLoading === u._id + '_role'}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            className="pl-2 pr-6 py-1 text-xs border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white disabled:opacity-50"
                          >
                            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                          </select>
                          <UserCog size={12} className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <button
                          onClick={() => handleDelete(u._id, u.name)}
                          disabled={actionLoading === u._id + '_del'}
                          className="p-1.5 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
                          title="Delete user"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
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
