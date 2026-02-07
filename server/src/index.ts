import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import songRoutes from "./routes/songs";
import playlistRoutes from "./routes/playlists";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/playlists", playlistRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
