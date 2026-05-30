import React from 'react';
import { Link } from 'react-router-dom';
import { buttonStyle, colors } from '../styles/common';

const EmptyState = ({ icon = '📭', title, message, actionLabel, actionPath }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-md mb-6">{message}</p>
      {actionLabel && actionPath && (
        <Link
          to={actionPath}
          className={`${buttonStyle} ${colors.primary} px-6 py-3 text-sm`}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
