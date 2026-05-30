import React, { useEffect, useState } from 'react';
import { useBugs } from '../context/BugContext';
import Toast from '../components/Toast';
import Modal from '../components/Modal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { cardStyle, badgeStyle, priorityColors, statusColors } from '../styles/common';

const PRIORITIES = ['All', 'Critical', 'High', 'Medium', 'Low'];
const MODULES = ['All', 'Login', 'Payment', 'Dashboard', 'Profile', 'API', 'UI', 'Other'];
const STATUSES = ['All', 'Open', 'In Progress', 'Resolved'];

const formatDate = (value) => {
  if (!value) return '';
  // SQLite datetime('now') is UTC without timezone marker — treat as UTC.
  const date = new Date(value.includes('T') ? value : value.replace(' ', 'T') + 'Z');
  if (isNaN(date)) return value;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const BugList = () => {
  const { bugs, loading, fetchBugs, updateStatus, deleteBug } = useBugs();

  const [filters, setFilters] = useState({ priority: 'All', module: 'All', status: 'All' });
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchBugs();
  }, [fetchBugs]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus(id, newStatus);
      setToast({ message: `Status updated to "${newStatus}".`, type: 'success' });
    } catch (err) {
      setToast({
        message: err.response?.data?.detail || 'Something went wrong.',
        type: 'error',
      });
    }
  };

  const confirmDelete = async () => {
    const id = deleteTarget;
    setDeleteTarget(null);
    try {
      await deleteBug(id);
      setToast({ message: 'Bug deleted successfully.', type: 'success' });
    } catch (err) {
      setToast({
        message: err.response?.data?.detail || 'Something went wrong.',
        type: 'error',
      });
    }
  };

  const filtered = bugs.filter(
    (b) =>
      (filters.priority === 'All' || b.priority === filters.priority) &&
      (filters.module === 'All' || b.module === filters.module) &&
      (filters.status === 'All' || b.status === filters.status)
  );

  const selectClass =
    'px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white';

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Bug Report"
        message="Are you sure you want to delete this bug report? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">All Bug Reports</h1>
        <span className="px-3 py-1 rounded-full text-sm font-bold bg-indigo-100 text-indigo-700">
          {bugs.length}
        </span>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select name="priority" value={filters.priority} onChange={handleFilterChange} className={selectClass}>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p === 'All' ? 'All Priorities' : p}</option>
          ))}
        </select>
        <select name="module" value={filters.module} onChange={handleFilterChange} className={selectClass}>
          {MODULES.map((m) => (
            <option key={m} value={m}>{m === 'All' ? 'All Modules' : m}</option>
          ))}
        </select>
        <select name="status" value={filters.status} onChange={handleFilterChange} className={selectClass}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSkeleton count={6} type="card" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No bugs found"
          message={
            bugs.length === 0
              ? 'No bug reports yet. Report your first bug to get started.'
              : 'No bugs match the selected filters. Try adjusting them.'
          }
          actionLabel={bugs.length === 0 ? 'Report a Bug →' : undefined}
          actionPath={bugs.length === 0 ? '/report' : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((bug) => (
            <div key={bug.id} className={cardStyle}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-slate-400">#{bug.id}</span>
                <span className={`${badgeStyle} ${priorityColors[bug.priority] || 'bg-slate-100 text-slate-600'}`}>
                  {bug.priority}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2">{bug.title}</h3>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`${badgeStyle} bg-indigo-50 text-indigo-700`}>{bug.module}</span>
                <span className={`${badgeStyle} bg-purple-50 text-purple-700`}>{bug.bug_type}</span>
                {bug.is_duplicate && (
                  <span className={`${badgeStyle} bg-amber-100 text-amber-700`}>Duplicate</span>
                )}
              </div>

              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{bug.raw_description}</p>

              <div className="text-xs text-slate-400 mb-4">{formatDate(bug.created_at)}</div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <select
                  value={bug.status}
                  onChange={(e) => handleStatusChange(bug.id, e.target.value)}
                  className={`text-xs font-semibold rounded-full px-3 py-1.5 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-200 ${statusColors[bug.status] || 'bg-slate-100 text-slate-700'}`}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>

                <button
                  onClick={() => setDeleteTarget(bug.id)}
                  className="text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BugList;
