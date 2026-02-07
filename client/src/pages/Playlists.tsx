import React, { useEffect, useState } from 'react';
import { Playlist } from '../types/index';
import { PlaylistCard } from '../components/PlaylistCard';
import { PlaylistForm } from '../components/PlaylistForm';
import { playlistApi } from '../api/client';

export const Playlists: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const data = await playlistApi.getPlaylists();
      setPlaylists(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (
    name: string,
    description: string | undefined,
    coverColor: string
  ) => {
    try {
      await playlistApi.createPlaylist(name, description, coverColor);
      await loadPlaylists();
      setShowForm(false);
    } catch (err) {
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-purple-300 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-slate-400">Loading playlists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">My Playlists</h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all"
          >
            + New Playlist
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-40 rounded-lg">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Playlists Grid */}
        {playlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-800 rounded-lg">
            <p className="text-slate-400 mb-4">No playlists yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Create Your First Playlist
            </button>
          </div>
        )}

        {/* Playlist Form Modal */}
        {showForm && (
          <PlaylistForm
            onSubmit={handleCreatePlaylist}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
};
