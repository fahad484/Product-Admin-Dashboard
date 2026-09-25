import React from 'react';

export default function Select({ label, options = [], error, className = '', ...rest }) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-400 mb-1">
          {label}
        </label>
      )}
      <select
        className={`w-full bg-slate-800 border rounded-lg px-3 py-2 text-white focus:outline-none transition-colors appearance-none ${
          error ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-indigo-500'
        }`}
        {...rest}
      >
        <option value="" disabled className="text-slate-500">Select an option...</option>
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
