import { AuthResponse, User, Song, Playlist, PlaylistSong } from '../types/index';

const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(
  method: string,
  endpoint: string,
  body?: unknown
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || data.message || 'An error occurred');
  }

  return response.json() as Promise<T>;
}

export const authApi = {
  login: (email: string, password: string): Promise<AuthResponse> =>
    request<AuthResponse>('POST', '/auth/login', { email, password }),

  register: (email: string, password: string, name: string): Promise<AuthResponse> =>
    request<AuthResponse>('POST', '/auth/register', { email, password, name }),

  getMe: (): Promise<User> =>
    request<User>('GET', '/auth/me'),
};

export const songApi = {
  getSongs: (genre?: string, search?: string): Promise<Song[]> => {
    const params = new URLSearchParams();
    if (genre) params.append('genre', genre);
    if (search) params.append('search', search);
    const query = params.toString();
    return request<Song[]>('GET', `/songs${query ? '?' + query : ''}`);
  },

  getSong: (id: number): Promise<Song> =>
    request<Song>('GET', `/songs/${id}`),

  getGenres: (): Promise<string[]> =>
    request<string[]>('GET', '/songs/genres'),
};

export const playlistApi = {
  getPlaylists: (): Promise<Playlist[]> =>
    request<Playlist[]>('GET', '/playlists'),

  getPlaylist: (id: number): Promise<Playlist> =>
    request<Playlist>('GET', `/playlists/${id}`),

  createPlaylist: (
    name: string,
    description?: string,
    coverColor?: string
  ): Promise<Playlist> =>
    request<Playlist>('POST', '/playlists', {
      name,
      description,
      coverColor,
    }),

  updatePlaylist: (
    id: number,
    name: string,
    description?: string,
    coverColor?: string
  ): Promise<Playlist> =>
    request<Playlist>('PATCH', `/playlists/${id}`, {
      name,
      description,
      coverColor,
    }),

  deletePlaylist: (id: number): Promise<void> =>
    request<void>('DELETE', `/playlists/${id}`),

  addSongToPlaylist: (playlistId: number, songId: number): Promise<PlaylistSong> =>
    request<PlaylistSong>('POST', `/playlists/${playlistId}/songs`, { songId }),

  removeSongFromPlaylist: (playlistId: number, songId: number): Promise<void> =>
    request<void>('DELETE', `/playlists/${playlistId}/songs/${songId}`),
};
