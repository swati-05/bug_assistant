import React from 'react';
import { buttonStyle, colors } from '../styles/common';

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  type = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  children,
  htmlType = 'button',
}) => {
  const variant = colors[type] || colors.primary;

  return (
    <button
      type={htmlType}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${buttonStyle} ${variant} ${sizes[size]} ${fullWidth ? 'w-full' : ''}`}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
