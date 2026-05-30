import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BugProvider } from './context/BugContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ReportBug from './pages/ReportBug';
import BugList from './pages/BugList';
import Analytics from './pages/Analytics';

function App() {
  return (
    <BugProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <main className="pb-12">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/report" element={<ReportBug />} />
              <Route path="/bugs" element={<BugList />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </main>
          <footer className="bg-white border-t border-slate-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-slate-500">
              <p>© {new Date().getFullYear()} AI Bug Report Assistant. Powered by Gemini AI.</p>
            </div>
          </footer>
        </div>
      </Router>
    </BugProvider>
  );
}

export default App;
