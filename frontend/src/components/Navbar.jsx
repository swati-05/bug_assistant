import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { navStyle } from '../styles/common';

const links = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/report', label: 'Report Bug', icon: '🐞' },
  { to: '/bugs', label: 'All Bugs', icon: '📋' },
  { to: '/analytics', label: 'Analytics', icon: '📊' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <nav className={navStyle}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-2xl">🐛</span>
            <span className="text-xl font-extrabold text-indigo-600 tracking-tight">
              BugAI
            </span>
          </NavLink>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-1">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
                <span>{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="sm:hidden pb-4 flex flex-col gap-1 animate-slide-in">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                <span>{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
