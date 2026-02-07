import { Router } from "express";
import {
  getAll,
  getById,
  create,
  update,
  deletePlaylist,
  addSong,
  removeSong,
} from "../controllers/playlistController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", getAll);
router.post("/", create);
router.get("/:id", getById);
router.patch("/:id", update);
router.delete("/:id", deletePlaylist);
router.post("/:id/songs", addSong);
router.delete("/:id/songs/:songId", removeSong);

export default router;
