import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBugs } from '../context/BugContext';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { cardStyle, badgeStyle, priorityColors } from '../styles/common';

const parseDate = (value) => {
  if (!value) return null;
  const d = new Date(value.includes('T') ? value : value.replace(' ', 'T') + 'Z');
  return isNaN(d) ? null : d;
};

const timeAgo = (value) => {
  const date = parseDate(value);
  if (!date) return '';
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const isToday = (value) => {
  const date = parseDate(value);
  if (!date) return false;
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

const MetricCard = ({ label, value, color }) => (
  <div className={cardStyle}>
    <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
    <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
  </div>
);

const Dashboard = () => {
  const { bugs, analytics, loading, fetchBugs, fetchAnalytics } = useBugs();

  useEffect(() => {
    fetchBugs();
    fetchAnalytics();
  }, [fetchBugs, fetchAnalytics]);

  const total = bugs.length;
  const critical = bugs.filter((b) => b.priority === 'Critical').length;
  const open = bugs.filter((b) => b.status === 'Open').length;
  const resolvedToday = bugs.filter(
    (b) => b.status === 'Resolved' && isToday(b.created_at)
  ).length;

  const recent = bugs.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Bug Report Dashboard 🐛
          </h1>
          <p className="text-slate-500 mt-1">Overview of all reported bugs</p>
        </div>
        <Link
          to="/report"
          className="rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] shadow-sm flex items-center justify-center bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-3 text-sm"
        >
          Report New Bug →
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <MetricCard label="Total Bugs" value={total} color="text-slate-900" />
        <MetricCard label="Critical Bugs" value={critical} color="text-red-600" />
        <MetricCard label="Open Bugs" value={open} color="text-amber-600" />
        <MetricCard label="Resolved Today" value={resolvedToday} color="text-emerald-600" />
      </div>

      <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Bugs</h2>

      {loading && bugs.length === 0 ? (
        <LoadingSkeleton count={4} type="line" />
      ) : recent.length === 0 ? (
        <EmptyState
          icon="🎉"
          title="No bugs reported yet"
          message="When you report bugs, the most recent ones will show up here."
          actionLabel="Report a Bug →"
          actionPath="/report"
        />
      ) : (
        <div className="space-y-3">
          {recent.map((bug) => (
            <Link
              key={bug.id}
              to="/bugs"
              className="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`${badgeStyle} ${priorityColors[bug.priority] || 'bg-slate-100 text-slate-600'}`}>
                  {bug.priority}
                </span>
                <span className="font-semibold text-slate-800 truncate">{bug.title}</span>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap">
                {timeAgo(bug.created_at)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
