import React from 'react';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'primary',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 animate-slide-in">
        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button type="secondary" size="md" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            type={type === 'danger' ? 'danger' : 'primary'}
            size="md"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
