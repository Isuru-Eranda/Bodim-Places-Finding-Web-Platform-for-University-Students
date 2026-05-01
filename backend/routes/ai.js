import { Router } from "express";
import { recommend } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/recommend", protect, recommend);

export default router;
