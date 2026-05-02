import { useEffect, useState, useCallback } from 'react';
import { adminGetReviews, adminDeleteReview } from '../../services/api';
import { Trash2, Star } from 'lucide-react';

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [ratingFilter, setRatingFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');

  const fetchReviews = useCallback(() => {
    setLoading(true);
    setError('');
    adminGetReviews({ rating: ratingFilter, page, limit: 20 })
      .then((r) => {
        setReviews(r.data.reviews);
        setTotal(r.data.total);
        setPages(r.data.pages);
      })
      .catch((err) => setError(err.response?.data?.message || err.message || 'Failed to load reviews. Make sure the backend server is running.'))
      .finally(() => setLoading(false));
  }, [ratingFilter, page]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review? This cannot be undone.')) return;
    setActionLoading(id);
    try {
      await adminDeleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      setTotal((t) => t - 1);
    } catch {
      alert('Failed to delete review');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
        <p className="text-sm text-gray-500 mt-1">{total} total reviews</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={ratingFilter}
          onChange={(e) => { setRatingFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
        >
          <option value="">All Ratings</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No reviews found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">User</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Listing</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Rating</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600 max-w-xs">Comment</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Date</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reviews.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-800">{r.userId?.name ?? 'N/A'}</p>
                      <p className="text-xs text-gray-400">{r.userId?.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-gray-700 max-w-[160px] truncate">{r.listingId?.title ?? 'N/A'}</p>
                      <p className="text-xs text-gray-400">{r.listingId?.location}</p>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col gap-1">
                        <StarRating rating={r.rating} />
                        <span className="text-xs text-gray-400">{r.rating}/5</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 max-w-xs">
                      <p className="line-clamp-2">{r.comment || <span className="text-gray-300 italic">No comment</span>}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-400 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleDelete(r._id)}
                        disabled={actionLoading === r._id}
                        className="p-1.5 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
                        title="Delete review"
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
