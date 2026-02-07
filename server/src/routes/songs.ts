import { Router } from "express";
import { getAll, getById, getGenres } from "../controllers/songController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", getAll);
router.get("/genres", getGenres);
router.get("/:id", getById);

export default router;
