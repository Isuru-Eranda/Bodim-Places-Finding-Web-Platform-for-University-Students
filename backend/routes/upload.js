import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// POST /api/upload — upload up to 10 listing images at once
// Only owners (and admins) may use this endpoint
router.post(
  "/",
  protect,
  authorize("owner", "admin"),
  upload.array("images", 10),
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const urls = req.files.map((f) => `${baseUrl}/uploads/${f.filename}`);
    res.status(201).json({ urls });
  }
);

export default router;
