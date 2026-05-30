import React, { useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useBugs } from '../context/BugContext';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { cardStyle } from '../styles/common';

const PRIORITY_COLORS = {
  Critical: '#dc2626',
  High: '#f97316',
  Medium: '#f59e0b',
  Low: '#10b981',
};

const STATUS_COLORS = {
  Open: '#64748b',
  'In Progress': '#3b82f6',
  Resolved: '#10b981',
};

const toChartData = (obj) =>
  Object.entries(obj || {}).map(([name, value]) => ({ name, value }));

const StatCard = ({ label, value, color }) => (
  <div className={cardStyle}>
    <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
    <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
  </div>
);

const Analytics = () => {
  const { analytics, loading, fetchAnalytics } = useBugs();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading && !analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <LoadingSkeleton count={3} type="card" />
      </div>
    );
  }

  if (!analytics || analytics.total === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">
          Analytics &amp; Insights 📈
        </h1>
        <EmptyState
          icon="📊"
          title="No data to analyze yet"
          message="Report some bugs and analytics charts will appear here."
          actionLabel="Report a Bug →"
          actionPath="/report"
        />
      </div>
    );
  }

  const priorityData = toChartData(analytics.by_priority);
  const moduleData = toChartData(analytics.by_module);
  const statusData = toChartData(analytics.by_status);

  const criticalCount = analytics.by_priority?.Critical || 0;
  const resolvedCount = analytics.by_status?.Resolved || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">
        Analytics &amp; Insights 📈
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Bugs" value={analytics.total} color="text-slate-900" />
        <StatCard label="Critical" value={criticalCount} color="text-red-600" />
        <StatCard label="Duplicates Detected" value={analytics.duplicates_detected} color="text-amber-600" />
        <StatCard label="Resolved" value={resolvedCount} color="text-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={cardStyle}>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Bugs by Priority</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {priorityData.map((entry) => (
                  <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={cardStyle}>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Bugs by Module</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={moduleData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={cardStyle}>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Bugs by Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {statusData.map((entry) => (
                <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
