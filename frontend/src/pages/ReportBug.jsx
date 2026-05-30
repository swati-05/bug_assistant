import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBugs } from '../context/BugContext';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { cardStyle, badgeStyle, priorityColors } from '../styles/common';

const MAX_CHARS = 500;
const MIN_CHARS = 20;

const ReportBug = () => {
  const { addBug } = useBugs();
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setBugResult] = useState(null);
  const [toast, setToast] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const value = e.target.value.slice(0, MAX_CHARS);
    setDescription(value);
    setCharCount(value.length);
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (description.trim().length < MIN_CHARS) {
      setError(`Please describe the bug in at least ${MIN_CHARS} characters.`);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const bug = await addBug(description.trim());
      setBugResult(bug);
      setToast({ message: 'Bug report generated successfully!', type: 'success' });
    } catch (err) {
      setToast({
        message: err.response?.data?.detail || 'Something went wrong.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReportAnother = () => {
    setBugResult(null);
    setDescription('');
    setCharCount(0);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Report a Bug 🐞
        </h1>
        <p className="text-slate-500 mt-1">Describe the bug in plain English</p>
      </div>

      <form onSubmit={handleSubmit} className={cardStyle}>
        <textarea
          name="description"
          value={description}
          onChange={handleChange}
          rows={5}
          placeholder="e.g.  I click the submit button on theWhen login page, the page reloads and the OTP never arrives..."
          className={`w-full px-4 py-3 rounded-xl border ${
            error ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-200 focus:border-indigo-500'
          } focus:outline-none focus:ring-2 transition-all duration-200 placeholder:text-slate-400 text-slate-900 resize-none`}
        />
        <div className="flex items-center justify-between mt-2">
          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : (
            <span className="text-xs text-slate-400">
              Minimum {MIN_CHARS} characters
            </span>
          )}
          <span className="text-xs font-medium text-slate-400">
            {charCount}/{MAX_CHARS}
          </span>
        </div>

<div className="mt-6">
          <Button htmlType="submit" type="primary" size="lg" loading={loading} fullWidth>
            ✨ Generate Bug Report with AI
          </Button>
        </div>
      </form>

      {result && (
        <div className={`${cardStyle} mt-6`}>
          {result.is_duplicate && (
            <div className="mb-5 flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm font-medium">
              ⚠️ Possible Duplicate Detected — Similar bug already exists
              {result.duplicate_of_id ? ` (ID: #${result.duplicate_of_id})` : ''}
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              AI Generated Report
            </span>
            <span
              className={`${badgeStyle} ${priorityColors[result.priority] || 'bg-slate-100 text-slate-600'}`}
            >
              {result.priority}
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-3">{result.title}</h2>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className={`${badgeStyle} bg-indigo-50 text-indigo-700`}>
              {result.module}
            </span>
            <span className={`${badgeStyle} bg-purple-50 text-purple-700`}>
              {result.bug_type}
            </span>
          </div>

          <div className="mb-5">
            <h3 className="text-sm font-bold text-slate-700 mb-2">Steps to Reproduce</h3>
            <div className="text-sm text-slate-600 whitespace-pre-line bg-slate-50 rounded-xl p-4">
              {result.steps}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-700 mb-2">Suggested Fix</h3>
            <div className="text-sm text-blue-800 bg-blue-50 border border-blue-100 rounded-xl p-4">
              {result.fix_suggestion}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/bugs"
              className="flex-1 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] shadow-sm flex items-center justify-center bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-3 text-sm"
            >
              View All Bugs →
            </Link>
            <Button type="secondary" size="lg" fullWidth onClick={handleReportAnother}>
              Report Another Bug
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportBug;
