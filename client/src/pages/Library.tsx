import React, { useEffect, useState } from 'react';
import { Song, Playlist } from '../types/index';
import { SongCard } from '../components/SongCard';
import { AddToPlaylistModal } from '../components/AddToPlaylistModal';
import { songApi, playlistApi } from '../api/client';

export const Library: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [songsData, genresData, playlistsData] = await Promise.all([
          songApi.getSongs(),
          songApi.getGenres(),
          playlistApi.getPlaylists(),
        ]);
        setSongs(songsData);
        setGenres(genresData);
        setPlaylists(playlistsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load songs');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredSongs = songs.filter((song) => {
    const matchesGenre = !selectedGenre || song.genre === selectedGenre;
    const matchesSearch =
      !searchQuery ||
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  const handleRefreshPlaylists = async () => {
    try {
      const playlistsData = await playlistApi.getPlaylists();
      setPlaylists(playlistsData);
    } catch (err) {
      console.error('Failed to refresh playlists:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-purple-300 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-slate-400">Loading library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <h1 className="text-4xl font-bold text-white mb-8">Music Library</h1>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-40 rounded-lg">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by title or artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20"
          />
        </div>

        {/* Genre Filter */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Filter by Genre</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGenre('')}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedGenre === ''
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Genres
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedGenre === genre
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Songs Grid */}
        {filteredSongs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                onAddToPlaylist={(song) => setSelectedSong(song)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-800 rounded-lg">
            <p className="text-slate-400 mb-2">No songs found</p>
            <p className="text-slate-500 text-sm">Try adjusting your filters</p>
          </div>
        )}

        {/* Add to Playlist Modal */}
        {selectedSong && (
          <AddToPlaylistModal
            song={selectedSong}
            playlists={playlists}
            onClose={() => setSelectedSong(null)}
            onAdd={handleRefreshPlaylists}
          />
        )}
      </div>
    </div>
  );
};
