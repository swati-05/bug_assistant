import React from 'react';
import { inputStyle, labelStyle } from '../styles/common';

const Input = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  required = false,
}) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className={labelStyle}>
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${inputStyle} ${error ? 'border-red-400 focus:ring-red-200 focus:border-red-500' : ''}`}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
