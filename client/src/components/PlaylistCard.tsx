import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Playlist } from '../types/index';

interface PlaylistCardProps {
  playlist: Playlist;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const navigate = useNavigate();

  const songCount = playlist._count?.songs || playlist.songs?.length || 0;

  return (
    <div
      onClick={() => navigate(`/playlists/${playlist.id}`)}
      className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-700 transition-colors cursor-pointer"
    >
      {/* Cover Area */}
      <div
        className="w-full aspect-square"
        style={{
          background: `linear-gradient(135deg, ${playlist.coverColor}, ${playlist.coverColor}cc)`,
        }}
      />

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-white truncate mb-1">{playlist.name}</h3>
        {playlist.description && (
          <p className="text-sm text-slate-400 truncate mb-3">{playlist.description}</p>
        )}
        <p className="text-xs text-slate-500">
          {songCount} {songCount === 1 ? 'song' : 'songs'}
        </p>
      </div>
    </div>
  );
};
