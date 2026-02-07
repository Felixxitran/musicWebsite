import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { prisma } from "../lib/prisma";

export async function getAll(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { genre, search } = req.query as {
      genre?: string;
      search?: string;
    };

    const where: any = {};

    if (genre) {
      where.genre = genre;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { artist: { contains: search, mode: "insensitive" } },
      ];
    }

    const songs = await prisma.song.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch songs" });
  }
}

export async function getById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const song = await prisma.song.findUnique({
      where: { id: parseInt(id) },
    });

    if (!song) {
      res.status(404).json({ error: "Song not found" });
      return;
    }

    res.json(song);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch song" });
  }
}

export async function getGenres(req: AuthRequest, res: Response): Promise<void> {
  try {
    const genres = await prisma.song.findMany({
      distinct: ["genre"],
      select: { genre: true },
      orderBy: { genre: "asc" },
    });

    const genreList = genres.map((g) => g.genre);

    res.json(genreList);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch genres" });
  }
}
