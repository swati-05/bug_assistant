import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const BugContext = createContext(null);

export const BugProvider = ({ children }) => {
  const [bugs, setBugs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBugs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/bugs/');
      setBugs(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/analytics/');
      setAnalytics(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Returns the created bug so callers (ReportBug) can render the AI result.
  const addBug = useCallback(async (description) => {
    const res = await api.post('/bugs/', { raw_description: description });
    setBugs((prev) => [res.data, ...prev]);
    return res.data;
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    const res = await api.patch(`/bugs/${id}/status`, { status });
    setBugs((prev) => prev.map((b) => (b.id === id ? res.data : b)));
    return res.data;
  }, []);

  const deleteBug = useCallback(async (id) => {
    await api.delete(`/bugs/${id}`);
    setBugs((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const value = {
    bugs,
    analytics,
    loading,
    error,
    fetchBugs,
    fetchAnalytics,
    addBug,
    updateStatus,
    deleteBug,
  };

  return <BugContext.Provider value={value}>{children}</BugContext.Provider>;
};

export const useBugs = () => {
  const context = useContext(BugContext);
  if (!context) {
    throw new Error('useBugs must be used within a BugProvider');
  }
  return context;
};
