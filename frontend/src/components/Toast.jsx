import React, { useEffect } from 'react';

const toastTypes = {
  success: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', icon: '✅' },
  error: { bg: 'bg-red-50 border-red-200', text: 'text-red-800', icon: '❌' },
  warning: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', icon: '⚠️' },
  info: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', icon: 'ℹ️' },
};

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const style = toastTypes[type] || toastTypes.info;

  return (
    <div className="fixed top-20 right-4 z-[100] animate-slide-in">
      <div
        className={`flex items-start gap-3 ${style.bg} ${style.text} border rounded-xl shadow-lg px-4 py-3 max-w-sm`}
      >
        <span className="text-lg leading-none">{style.icon}</span>
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 font-bold leading-none"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;
