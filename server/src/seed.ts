import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma";

async function main() {
  try {
    // Clean existing data
    await prisma.playlistSong.deleteMany();
    await prisma.playlist.deleteMany();
    await prisma.song.deleteMany();
    await prisma.user.deleteMany();

    // Create demo user
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
      data: {
        email: "demo@pluvio.app",
        name: "Demo User",
        password: hashedPassword,
      },
    });

    // Create songs across various genres
    const songs = await prisma.song.createMany({
      data: [
        {
          title: "Midnight Echo",
          artist: "Luminous Waves",
          album: "Neon Dreams",
          genre: "Electronic",
          duration: 245,
          coverColor: "#ef4444",
        },
        {
          title: "Sunset Boulevard",
          artist: "Velvet Horizon",
          album: "Urban Lights",
          genre: "Indie",
          duration: 268,
          coverColor: "#f59e0b",
        },
        {
          title: "Jazz Odyssey",
          artist: "Blue Note Collective",
          album: "Standards",
          genre: "Jazz",
          duration: 312,
          coverColor: "#3b82f6",
        },
        {
          title: "Electric Pulse",
          artist: "Synth Kings",
          album: "Digital Age",
          genre: "Electronic",
          duration: 234,
          coverColor: "#8b5cf6",
        },
        {
          title: "Chill Sessions",
          artist: "Ambient Dreams",
          album: "Serenity",
          genre: "Electronic",
          duration: 289,
          coverColor: "#10b981",
        },
        {
          title: "Rock Anthem",
          artist: "Thunder Road",
          album: "Highway Nights",
          genre: "Rock",
          duration: 276,
          coverColor: "#dc2626",
        },
        {
          title: "Pop Sensation",
          artist: "Bright Stars",
          album: "Euphoria",
          genre: "Pop",
          duration: 218,
          coverColor: "#ec4899",
        },
        {
          title: "Classical Suite",
          artist: "Symphony Orchestra",
          album: "Masterpieces",
          genre: "Classical",
          duration: 445,
          coverColor: "#6366f1",
        },
        {
          title: "Hip Hop Revolution",
          artist: "Urban Legends",
          album: "Street Vibes",
          genre: "Hip-Hop",
          duration: 256,
          coverColor: "#1f2937",
        },
        {
          title: "R&B Smooth",
          artist: "Soul Essence",
          album: "Velvet Nights",
          genre: "R&B",
          duration: 298,
          coverColor: "#a855f7",
        },
        {
          title: "Moonlit Jazz",
          artist: "Midnight Quartet",
          album: "Night Sessions",
          genre: "Jazz",
          duration: 334,
          coverColor: "#0ea5e9",
        },
        {
          title: "Energy Surge",
          artist: "Pulse Dynamics",
          album: "Beats & Rhythms",
          genre: "Electronic",
          duration: 242,
          coverColor: "#f97316",
        },
        {
          title: "Acoustic Vibes",
          artist: "Wooden Echo",
          album: "Stripped Down",
          genre: "Indie",
          duration: 263,
          coverColor: "#c4b5fd",
        },
        {
          title: "Pop Euphoria",
          artist: "Starlight Avenue",
          album: "Golden Hours",
          genre: "Pop",
          duration: 226,
          coverColor: "#fb7185",
        },
        {
          title: "Rock Majesty",
          artist: "Stone Symphony",
          album: "Legends Rise",
          genre: "Rock",
          duration: 289,
          coverColor: "#b91c1c",
        },
        {
          title: "Classical Elegance",
          artist: "Grand Composer",
          album: "Timeless Classics",
          genre: "Classical",
          duration: 412,
          coverColor: "#7e22ce",
        },
        {
          title: "Hip Hop Freestyle",
          artist: "Cipher Masters",
          album: "Street Poetry",
          genre: "Hip-Hop",
          duration: 278,
          coverColor: "#292524",
        },
        {
          title: "R&B Serenade",
          artist: "Smooth Operators",
          album: "Love Letters",
          genre: "R&B",
          duration: 312,
          coverColor: "#d946ef",
        },
        {
          title: "Ambient Peace",
          artist: "Ethereal Sounds",
          album: "Zen Garden",
          genre: "Electronic",
          duration: 356,
          coverColor: "#06b6d4",
        },
        {
          title: "Indie Pop Blend",
          artist: "Dreamer's Tale",
          album: "Melodies",
          genre: "Indie",
          duration: 254,
          coverColor: "#f472b6",
        },
      ],
    });

    console.log(`Created ${songs.count} songs`);

    // Get all created songs for playlist assignment
    const allSongs = await prisma.song.findMany();

    // Create 3 playlists
    const chilVibes = await prisma.playlist.create({
      data: {
        name: "Chill Vibes",
        description: "Relaxing tracks to unwind",
        coverColor: "#8b5cf6",
        userId: user.id,
      },
    });

    const workoutEnergy = await prisma.playlist.create({
      data: {
        name: "Workout Energy",
        description: "Upbeat tracks to keep you moving",
        coverColor: "#ef4444",
        userId: user.id,
      },
    });

    const lateNightJazz = await prisma.playlist.create({
      data: {
        name: "Late Night Jazz",
        description: "Smooth jazz for late night sessions",
        coverColor: "#3b82f6",
        userId: user.id,
      },
    });

    // Add songs to "Chill Vibes" playlist (5 songs)
    const chillSongs = [
      allSongs.find((s) => s.title === "Chill Sessions"),
      allSongs.find((s) => s.title === "Ambient Peace"),
      allSongs.find((s) => s.title === "Moonlit Jazz"),
      allSongs.find((s) => s.title === "Sunset Boulevard"),
      allSongs.find((s) => s.title === "Acoustic Vibes"),
    ];

    for (let i = 0; i < chillSongs.length; i++) {
      if (chillSongs[i]) {
        await prisma.playlistSong.create({
          data: {
            playlistId: chilVibes.id,
            songId: chillSongs[i].id,
            orderIndex: i,
          },
        });
      }
    }

    // Add songs to "Workout Energy" playlist (5 songs)
    const workoutSongs = [
      allSongs.find((s) => s.title === "Energy Surge"),
      allSongs.find((s) => s.title === "Rock Anthem"),
      allSongs.find((s) => s.title === "Pop Sensation"),
      allSongs.find((s) => s.title === "Hip Hop Revolution"),
      allSongs.find((s) => s.title === "Electric Pulse"),
    ];

    for (let i = 0; i < workoutSongs.length; i++) {
      if (workoutSongs[i]) {
        await prisma.playlistSong.create({
          data: {
            playlistId: workoutEnergy.id,
            songId: workoutSongs[i].id,
            orderIndex: i,
          },
        });
      }
    }

    // Add songs to "Late Night Jazz" playlist (4 songs)
    const jazzSongs = [
      allSongs.find((s) => s.title === "Jazz Odyssey"),
      allSongs.find((s) => s.title === "Moonlit Jazz"),
      allSongs.find((s) => s.title === "R&B Serenade"),
      allSongs.find((s) => s.title === "Midnight Echo"),
    ];

    for (let i = 0; i < jazzSongs.length; i++) {
      if (jazzSongs[i]) {
        await prisma.playlistSong.create({
          data: {
            playlistId: lateNightJazz.id,
            songId: jazzSongs[i].id,
            orderIndex: i,
          },
        });
      }
    }

    console.log("Seeding complete");
  } catch (error) {
    console.error("Seeding error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
