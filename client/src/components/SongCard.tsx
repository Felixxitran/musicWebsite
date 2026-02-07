import React from 'react';
import { Song, formatDuration } from '../types/index';

interface SongCardProps {
  song: Song;
  onAddToPlaylist: (song: Song) => void;
}

export const SongCard: React.FC<SongCardProps> = ({ song, onAddToPlaylist }) => {
  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-700 transition-colors">
      <div className="p-4">
        {/* Cover Color Square */}
        <div
          className="w-full aspect-square rounded-lg mb-4"
          style={{ backgroundColor: song.coverColor }}
        />

        {/* Song Info */}
        <h3 className="font-bold text-white truncate mb-1">{song.title}</h3>
        <p className="text-sm text-slate-400 truncate mb-1">{song.artist}</p>
        {song.album && <p className="text-xs text-slate-500 truncate mb-3">{song.album}</p>}

        {/* Genre Badge and Duration */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-block px-2 py-1 bg-purple-600 bg-opacity-30 text-purple-300 text-xs rounded-full">
            {song.genre}
          </span>
          <span className="text-sm text-slate-400">{formatDuration(song.duration)}</span>
        </div>

        {/* Add Button */}
        <button
          onClick={() => onAddToPlaylist(song)}
          className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Add to Playlist
        </button>
      </div>
    </div>
  );
};
