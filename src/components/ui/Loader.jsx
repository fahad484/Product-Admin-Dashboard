import React from 'react';

const sizes = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export default function Loader({ size = 'md', className = '' }) {
  return (
    <div className={`inline-block ${sizes[size]} ${className}`}>
      <div className="w-full h-full border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
