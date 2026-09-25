import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function SearchBar({ value, onChange }) {
  const [text, setText] = useState(value || '');
  const debouncedText = useDebounce(text, 500);

  useEffect(() => {
    setText(value || '');
  }, [value]);

  useEffect(() => {
    if (debouncedText !== value) {
      onChange(debouncedText);
    }
  }, [debouncedText, value, onChange]);

  return (
    <div className="relative w-full md:max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-10 py-2 border border-slate-700 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
        placeholder="Search products..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {text && (
        <button
          type="button"
          onClick={() => {
            setText('');
            onChange('');
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
        >
          &times;
        </button>
      )}
    </div>
  );
}
