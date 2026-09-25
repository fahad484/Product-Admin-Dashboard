import React from 'react';

export default function FilterBar({
  category,
  sortBy,
  sortOrder,
  categories = [],
  onCategoryChange,
  onSortByChange,
  onSortOrderChange,
}) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <select
        value={category || ''}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        value={sortBy || ''}
        onChange={(e) => onSortByChange(e.target.value)}
        className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
      >
        <option value="">Sort by: None</option>
        <option value="price">Price</option>
        <option value="rating">Rating</option>
        <option value="title">Title</option>
      </select>

      {sortBy && (
        <button
          onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="bg-transparent hover:bg-slate-800 text-slate-300 font-medium py-2 px-3 border border-slate-700 rounded-lg text-sm transition-colors"
        >
          {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
        </button>
      )}
    </div>
  );
}
