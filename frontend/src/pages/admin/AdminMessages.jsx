import { useEffect, useState, useCallback } from 'react';
import {
  adminGetContacts,
  adminUpdateContactStatus,
  adminDeleteContact,
} from '../../services/api';
import {
  Mail,
  MailOpen,
  Trash2,
  X,
  Search,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
];

function StatusBadge({ status }) {
  const cls =
    status === 'unread'
      ? 'bg-orange-100 text-orange-700'
      : 'bg-gray-100 text-gray-600';
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>
      {status}
    </span>
  );
}

function MessageModal({ message, onClose, onStatusChange, onDelete }) {
  const [loading, setLoading] = useState(false);

  const toggleStatus = async () => {
    const next = message.status === 'unread' ? 'read' : 'unread';
    setLoading(true);
    try {
      await onStatusChange(message._id, next);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this message? This cannot be undone.')) return;
    setLoading(true);
    try {
      await onDelete(message._id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <MessageSquare size={18} className="text-orange-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 leading-tight">
                {message.subject}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(message.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contact info */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 w-16 shrink-0">Name</span>
            <span className="font-medium text-gray-800">{message.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 w-16 shrink-0">Email</span>
            <a
              href={`mailto:${message.email}`}
              className="font-medium text-orange-600 hover:underline break-all"
            >
              {message.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 w-16 shrink-0">Status</span>
            <StatusBadge status={message.status} />
          </div>
        </div>

        {/* Message body */}
        <div className="px-6 py-5">
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {message.message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-6 pb-6 pt-2 gap-3">
          <button
            onClick={toggleStatus}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors disabled:opacity-50"
          >
            {message.status === 'unread' ? (
              <>
                <MailOpen size={15} />
                Mark as Read
              </>
            ) : (
              <>
                <Mail size={15} />
                Mark as Unread
              </>
            )}
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-50 hover:bg-red-100 text-red-600 transition-colors disabled:opacity-50"
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  const LIMIT = 20;

  const fetchMessages = useCallback(() => {
    setLoading(true);
    setError('');
    adminGetContacts({ status: statusFilter || undefined, page, limit: LIMIT })
      .then((r) => {
        setMessages(r.data.contacts);
        setTotal(r.data.total);
      })
      .catch((err) =>
        setError(
          err.response?.data?.message || err.message || 'Failed to load messages.',
        ),
      )
      .finally(() => setLoading(false));
  }, [statusFilter, page]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const handleStatusChange = async (id, status) => {
    await adminUpdateContactStatus(id, status);
    setMessages((prev) =>
      prev.map((m) => (m._id === id ? { ...m, status } : m)),
    );
    if (selected?._id === id) setSelected((s) => ({ ...s, status }));
  };

  const handleDelete = async (id) => {
    await adminDeleteContact(id);
    setMessages((prev) => prev.filter((m) => m._id !== id));
    setTotal((t) => t - 1);
  };

  const filtered = search
    ? messages.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.email.toLowerCase().includes(search.toLowerCase()) ||
          m.subject.toLowerCase().includes(search.toLowerCase()),
      )
    : messages;

  const unreadCount = messages.filter((m) => m.status === 'unread').length;
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-sm text-gray-500 mt-1">
            {total} total{unreadCount > 0 && ` · ${unreadCount} unread`}
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email or subject…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {STATUS_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                statusFilter === value
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <RefreshCw size={20} className="animate-spin mr-2" />
            Loading messages…
          </div>
        ) : error ? (
          <div className="py-16 text-center text-sm text-red-500">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-400">
            No messages found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-gray-500 w-8"></th>
                  <th className="px-4 py-3 font-medium text-gray-500">Sender</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Subject</th>
                  <th className="px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">
                    Date
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((msg) => (
                  <tr
                    key={msg._id}
                    onClick={() => {
                      setSelected(msg);
                      if (msg.status === 'unread') handleStatusChange(msg._id, 'read');
                    }}
                    className={`cursor-pointer hover:bg-orange-50/50 transition-colors ${
                      msg.status === 'unread' ? 'bg-orange-50/30' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      {msg.status === 'unread' ? (
                        <Mail size={16} className="text-orange-500" />
                      ) : (
                        <MailOpen size={16} className="text-gray-300" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p
                        className={`font-medium ${
                          msg.status === 'unread' ? 'text-gray-900' : 'text-gray-600'
                        }`}
                      >
                        {msg.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[160px]">
                        {msg.email}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p
                        className={`truncate max-w-[200px] ${
                          msg.status === 'unread'
                            ? 'font-semibold text-gray-900'
                            : 'text-gray-600'
                        }`}
                      >
                        {msg.subject}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={msg.status} />
                    </td>
                    <td
                      className="px-4 py-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() =>
                            handleStatusChange(
                              msg._id,
                              msg.status === 'unread' ? 'read' : 'unread',
                            )
                          }
                          title={
                            msg.status === 'unread'
                              ? 'Mark as read'
                              : 'Mark as unread'
                          }
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          {msg.status === 'unread' ? (
                            <MailOpen size={15} />
                          ) : (
                            <Mail size={15} />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                'Delete this message? This cannot be undone.',
                              )
                            )
                              handleDelete(msg._id);
                          }}
                          title="Delete message"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
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
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <MessageModal
          message={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
