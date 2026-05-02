import { useEffect, useState, useCallback } from 'react';
import { adminGetListings, adminVerifyListing, adminDeleteListing } from '../../services/api';
import { Search, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function AdminListings() {
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');

  const fetchListings = useCallback(() => {
    setLoading(true);
    setError('');
    const params = { search, page, limit: 20 };
    if (verifiedFilter !== '') params.isVerified = verifiedFilter;
    adminGetListings(params)
      .then((r) => {
        setListings(r.data.listings);
        setTotal(r.data.total);
        setPages(r.data.pages);
      })
      .catch((err) => setError(err.response?.data?.message || err.message || 'Failed to load listings. Make sure the backend server is running.'))
      .finally(() => setLoading(false));
  }, [search, verifiedFilter, page]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const handleVerify = async (id, isVerified) => {
    setActionLoading(id + '_verify');
    try {
      const { data } = await adminVerifyListing(id, isVerified);
      setListings((prev) => prev.map((l) => (l._id === id ? { ...l, isVerified: data.isVerified } : l)));
    } catch {
      alert('Failed to update listing');
    } finally {
      setActionLoading('');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete listing "${title}"? This cannot be undone.`)) return;
    setActionLoading(id + '_del');
    try {
      await adminDeleteListing(id);
      setListings((prev) => prev.filter((l) => l._id !== id));
      setTotal((t) => t - 1);
    } catch {
      alert('Failed to delete listing');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Listing Management</h1>
        <p className="text-sm text-gray-500 mt-1">{total} total listings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or location…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <select
          value={verifiedFilter}
          onChange={(e) => { setVerifiedFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          <option value="">All Listings</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : listings.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No listings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Title</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Location</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Price</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Owner</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Verified</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Date</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {listings.map((l) => (
                  <tr key={l._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3 font-medium text-gray-800 max-w-[180px] truncate">{l.title}</td>
                    <td className="px-5 py-3 text-gray-500">{l.location}</td>
                    <td className="px-5 py-3 text-gray-700">Rs. {l.price?.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <p className="text-gray-700">{l.ownerId?.name ?? 'N/A'}</p>
                      <p className="text-xs text-gray-400">{l.ownerId?.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      {l.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                          <CheckCircle size={12} /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                          <XCircle size={12} /> Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-400 whitespace-nowrap">
                      {new Date(l.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVerify(l._id, !l.isVerified)}
                          disabled={actionLoading === l._id + '_verify'}
                          title={l.isVerified ? 'Unverify' : 'Verify'}
                          className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors disabled:opacity-40 ${
                            l.isVerified
                              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {l.isVerified ? 'Unverify' : 'Verify'}
                        </button>
                        <button
                          onClick={() => handleDelete(l._id, l.title)}
                          disabled={actionLoading === l._id + '_del'}
                          className="p-1.5 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
                          title="Delete listing"
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
