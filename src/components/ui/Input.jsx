import React from 'react';

export default function Input({ label, error, className = '', ...rest }) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-400 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-slate-800 border rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none transition-colors ${
          error ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-indigo-500'
        }`}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
