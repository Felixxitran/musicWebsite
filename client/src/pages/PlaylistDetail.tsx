import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Playlist, Song, formatDuration } from '../types/index';
import { playlistApi, songApi } from '../api/client';
import { PlaylistForm } from '../components/PlaylistForm';

export const PlaylistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);

  const playlistId = id ? parseInt(id) : null;

  useEffect(() => {
    if (!playlistId) return;
    loadPlaylist();
  }, [playlistId]);

  const loadPlaylist = async () => {
    if (!playlistId) return;
    try {
      setLoading(true);
      const data = await playlistApi.getPlaylist(playlistId);
      setPlaylist(data);

      // Extract songs from playlistSongs
      if (data.songs) {
        const songList = data.songs.map((ps) => ps.song);
        setSongs(songList);
      }
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load playlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSong = async (songId: number) => {
    if (!playlistId) return;
    try {
      await playlistApi.removeSongFromPlaylist(playlistId, songId);
      setSongs(songs.filter((s) => s.id !== songId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove song');
    }
  };

  const handleUpdatePlaylist = async (
    name: string,
    description: string | undefined,
    coverColor: string
  ) => {
    if (!playlistId) return;
    try {
      const updated = await playlistApi.updatePlaylist(playlistId, name, description, coverColor);
      setPlaylist(updated);
      setShowEditForm(false);
    } catch (err) {
      throw err;
    }
  };

  const handleDeletePlaylist = async () => {
    if (!playlistId) return;
    if (!confirm('Are you sure you want to delete this playlist?')) return;

    try {
      await playlistApi.deletePlaylist(playlistId);
      navigate('/playlists');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete playlist');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-purple-300 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-slate-400">Loading playlist...</p>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Playlist not found</p>
          <button
            onClick={() => navigate('/playlists')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Back to Playlists
          </button>
        </div>
      </div>
    );
  }

  const totalDuration = songs.reduce((acc, song) => acc + song.duration, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Header with colored background */}
      <div
        className="py-12"
        style={{
          background: `linear-gradient(135deg, ${playlist.coverColor}, ${playlist.coverColor}cc)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-white mb-4">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-slate-200 mb-4">{playlist.description}</p>
          )}
          <div className="flex items-center gap-6 text-slate-100 text-sm">
            <span>{songs.length} songs</span>
            <span>{formatDuration(totalDuration)} total</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-40 rounded-lg">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setShowEditForm(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Edit Playlist
          </button>
          <button
            onClick={handleDeletePlaylist}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Delete Playlist
          </button>
        </div>

        {/* Songs List */}
        {songs.length > 0 ? (
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-900 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">#</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Artist</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Album</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Duration</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song, index) => (
                  <tr key={song.id} className="border-b border-slate-700 hover:bg-slate-700 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-400">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-white">{song.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{song.artist}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{song.album || '-'}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{formatDuration(song.duration)}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleRemoveSong(song.id)}
                        className="text-red-400 hover:text-red-300 font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-800 rounded-lg">
            <p className="text-slate-400 mb-4">No songs in this playlist</p>
            <button
              onClick={() => navigate('/library')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Browse Library to Add Songs
            </button>
          </div>
        )}

        {/* Edit Form Modal */}
        {showEditForm && (
          <PlaylistForm
            initialValues={playlist}
            onSubmit={handleUpdatePlaylist}
            onCancel={() => setShowEditForm(false)}
          />
        )}
      </div>
    </div>
  );
};
