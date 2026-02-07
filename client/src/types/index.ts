export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string | null;
  genre: string;
  duration: number;
  coverColor: string;
  createdAt: string;
}

export interface PlaylistSong {
  id: number;
  playlistId: number;
  songId: number;
  addedAt: string;
  orderIndex: number;
  song: Song;
}

export interface Playlist {
  id: number;
  name: string;
  description: string | null;
  coverColor: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  songs?: PlaylistSong[];
  _count?: { songs: number };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
