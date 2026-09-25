import React from 'react';
import { useToast } from '@/context/ToastContext';

export default function Toast() {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  const variants = {
    success: 'bg-green-900/80 border-green-700 text-green-200',
    error: 'bg-red-900/80 border-red-700 text-red-200',
    info: 'bg-indigo-900/80 border-indigo-700 text-indigo-200'
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between min-w-[300px] px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm ${
            variants[toast.type] || variants.info
          }`}
        >
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 opacity-70 hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
