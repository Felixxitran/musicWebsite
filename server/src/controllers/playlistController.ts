import { Response } from "express";
import { z } from "zod";
import { AuthRequest } from "../middleware/auth";
import { prisma } from "../lib/prisma";

const createPlaylistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  coverColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color").optional(),
});

const updatePlaylistSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  coverColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color").optional(),
});

const addSongSchema = z.object({
  songId: z.number().int().positive("Song ID must be a positive integer"),
});

export async function getAll(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const playlists = await prisma.playlist.findMany({
      where: { userId: req.userId },
      include: { _count: { select: { songs: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
}

export async function getById(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;

    const playlist = await prisma.playlist.findUnique({
      where: { id: parseInt(id) },
      include: {
        songs: {
          include: { song: true },
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    if (!playlist) {
      res.status(404).json({ error: "Playlist not found" });
      return;
    }

    if (playlist.userId !== req.userId) {
      res.status(403).json({ error: "You do not have access to this playlist" });
      return;
    }

    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch playlist" });
  }
}

export async function create(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const data = createPlaylistSchema.parse(req.body);

    const playlist = await prisma.playlist.create({
      data: {
        name: data.name,
        description: data.description,
        coverColor: data.coverColor || "#8b5cf6",
        userId: req.userId,
      },
    });

    res.status(201).json(playlist);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
    } else {
      res.status(500).json({ error: "Failed to create playlist" });
    }
  }
}

export async function update(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const data = updatePlaylistSchema.parse(req.body);

    const playlist = await prisma.playlist.findUnique({
      where: { id: parseInt(id) },
    });

    if (!playlist) {
      res.status(404).json({ error: "Playlist not found" });
      return;
    }

    if (playlist.userId !== req.userId) {
      res.status(403).json({ error: "You do not have access to this playlist" });
      return;
    }

    const updatedPlaylist = await prisma.playlist.update({
      where: { id: parseInt(id) },
      data,
    });

    res.json(updatedPlaylist);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
    } else {
      res.status(500).json({ error: "Failed to update playlist" });
    }
  }
}

export async function deletePlaylist(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;

    const playlist = await prisma.playlist.findUnique({
      where: { id: parseInt(id) },
    });

    if (!playlist) {
      res.status(404).json({ error: "Playlist not found" });
      return;
    }

    if (playlist.userId !== req.userId) {
      res.status(403).json({ error: "You do not have access to this playlist" });
      return;
    }

    await prisma.playlist.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Playlist deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete playlist" });
  }
}

export async function addSong(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const data = addSongSchema.parse(req.body);

    const playlist = await prisma.playlist.findUnique({
      where: { id: parseInt(id) },
    });

    if (!playlist) {
      res.status(404).json({ error: "Playlist not found" });
      return;
    }

    if (playlist.userId !== req.userId) {
      res.status(403).json({ error: "You do not have access to this playlist" });
      return;
    }

    const song = await prisma.song.findUnique({
      where: { id: data.songId },
    });

    if (!song) {
      res.status(404).json({ error: "Song not found" });
      return;
    }

    const existingEntry = await prisma.playlistSong.findUnique({
      where: {
        playlistId_songId: {
          playlistId: parseInt(id),
          songId: data.songId,
        },
      },
    });

    if (existingEntry) {
      res.status(400).json({ error: "Song is already in this playlist" });
      return;
    }

    const maxOrderIndex = await prisma.playlistSong.findFirst({
      where: { playlistId: parseInt(id) },
      orderBy: { orderIndex: "desc" },
      select: { orderIndex: true },
    });

    const nextOrderIndex = (maxOrderIndex?.orderIndex ?? -1) + 1;

    const playlistSong = await prisma.playlistSong.create({
      data: {
        playlistId: parseInt(id),
        songId: data.songId,
        orderIndex: nextOrderIndex,
      },
      include: { song: true },
    });

    res.status(201).json(playlistSong);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors[0].message });
    } else {
      res.status(500).json({ error: "Failed to add song to playlist" });
    }
  }
}

export async function removeSong(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id, songId } = req.params;

    const playlist = await prisma.playlist.findUnique({
      where: { id: parseInt(id) },
    });

    if (!playlist) {
      res.status(404).json({ error: "Playlist not found" });
      return;
    }

    if (playlist.userId !== req.userId) {
      res.status(403).json({ error: "You do not have access to this playlist" });
      return;
    }

    const playlistSong = await prisma.playlistSong.findUnique({
      where: {
        playlistId_songId: {
          playlistId: parseInt(id),
          songId: parseInt(songId),
        },
      },
    });

    if (!playlistSong) {
      res.status(404).json({ error: "Song not found in playlist" });
      return;
    }

    await prisma.playlistSong.delete({
      where: {
        playlistId_songId: {
          playlistId: parseInt(id),
          songId: parseInt(songId),
        },
      },
    });

    res.json({ message: "Song removed" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove song from playlist" });
  }
}
