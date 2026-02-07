import React, { useState } from 'react';
import { Song, Playlist } from '../types/index';
import { playlistApi } from '../api/client';

interface AddToPlaylistModalProps {
  song: Song;
  playlists: Playlist[];
  onClose: () => void;
  onAdd: () => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  song,
  playlists,
  onClose,
  onAdd,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(
    playlists.length > 0 ? playlists[0].id : null
  );

  const handleAdd = async () => {
    if (!selectedPlaylistId) {
      setError('Please select a playlist');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await playlistApi.addSongToPlaylist(selectedPlaylistId, song.id);
      onAdd();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add song');
    } finally {
      setLoading(false);
    }
  };

  if (playlists.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Add to Playlist</h2>
          <p className="text-slate-400 mb-6">You don't have any playlists yet. Create one first!</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md max-h-96 flex flex-col">
        <h2 className="text-2xl font-bold text-white mb-4">Add to Playlist</h2>

        {/* Song Info */}
        <div className="bg-slate-700 rounded-lg p-3 mb-4">
          <p className="font-medium text-white truncate">{song.title}</p>
          <p className="text-sm text-slate-400 truncate">{song.artist}</p>
        </div>

        {/* Playlist Selection */}
        <div className="mb-4 flex-1 overflow-y-auto">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Select Playlist
          </label>
          <div className="space-y-2">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => setSelectedPlaylistId(playlist.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedPlaylistId === playlist.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <p className="font-medium">{playlist.name}</p>
                {playlist.description && (
                  <p className="text-sm opacity-75 truncate">{playlist.description}</p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};
