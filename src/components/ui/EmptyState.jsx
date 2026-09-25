import React from 'react';

export default function EmptyState({ message = 'No items found' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-5xl mb-4 opacity-50">📦</div>
      <p className="text-slate-500 text-lg">{message}</p>
    </div>
  );
}
