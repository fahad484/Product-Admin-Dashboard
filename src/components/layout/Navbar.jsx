import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="h-16 flex items-center justify-between px-6 max-w-7xl mx-auto">
        <Link to="/products" className="text-xl font-bold text-indigo-400 tracking-tight">
          ProductHub
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-300 hidden sm:inline">
            {user?.firstName || 'Admin'}
          </span>
          <button
            onClick={logout}
            className="text-sm font-medium text-slate-400 hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
