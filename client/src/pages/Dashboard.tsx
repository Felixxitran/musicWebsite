import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Playlist, Song } from '../types/index';
import { PlaylistCard } from '../components/PlaylistCard';
import { playlistApi, songApi } from '../api/client';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [playlistsData, songsData] = await Promise.all([
          playlistApi.getPlaylists(),
          songApi.getSongs(),
        ]);
        setPlaylists(playlistsData);
        setSongs(songsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-purple-300 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  const recentPlaylists = playlists.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-slate-400">Your music library awaits</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-40 rounded-lg">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Songs */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6">
            <p className="text-purple-200 text-sm font-medium mb-2">Total Songs</p>
            <p className="text-4xl font-bold text-white">{songs.length}</p>
          </div>

          {/* My Playlists */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg p-6">
            <p className="text-indigo-200 text-sm font-medium mb-2">My Playlists</p>
            <p className="text-4xl font-bold text-white">{playlists.length}</p>
          </div>

          {/* Songs in Playlists */}
          <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-lg p-6">
            <p className="text-pink-200 text-sm font-medium mb-2">Songs in Playlists</p>
            <p className="text-4xl font-bold text-white">
              {playlists.reduce((acc, p) => acc + (p._count?.songs || 0), 0)}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <button
            onClick={() => navigate('/library')}
            className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors border border-purple-500 border-opacity-20"
          >
            Browse Library
          </button>
          <button
            onClick={() => navigate('/playlists')}
            className="px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Create New Playlist
          </button>
        </div>

        {/* Recent Playlists */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Recent Playlists</h2>
          {recentPlaylists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-800 rounded-lg">
              <p className="text-slate-400 mb-4">No playlists yet</p>
              <button
                onClick={() => navigate('/playlists')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Create Your First Playlist
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
