import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-slate-900 border-b border-purple-500 border-opacity-20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            <span className="text-2xl">♪</span>
            <span>Pluvio</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                isActive('/')
                  ? 'text-purple-400'
                  : 'text-slate-300 hover:text-purple-400'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/library"
              className={`font-medium transition-colors ${
                isActive('/library')
                  ? 'text-purple-400'
                  : 'text-slate-300 hover:text-purple-400'
              }`}
            >
              Library
            </Link>
            <Link
              to="/playlists"
              className={`font-medium transition-colors ${
                isActive('/playlists')
                  ? 'text-purple-400'
                  : 'text-slate-300 hover:text-purple-400'
              }`}
            >
              My Playlists
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            <span className="text-slate-300">{user?.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
