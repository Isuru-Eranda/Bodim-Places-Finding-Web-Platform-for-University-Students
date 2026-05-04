import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import supabase from "../config/supabase.js";
import path from "path";

const router = Router();
const BUCKET = "Bodime_Finder";

// POST /api/upload — upload up to 10 listing images at once
// Only owners (and admins) may use this endpoint
router.post(
  "/",
  protect,
  authorize("owner", "admin"),
  upload.array("images", 10),
  async (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    try {
      const urls = await Promise.all(
        req.files.map(async (file) => {
          const ext = path.extname(file.originalname).toLowerCase();
          const filename = `listing-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

          const { error } = await supabase.storage
            .from(BUCKET)
            .upload(filename, file.buffer, {
              contentType: file.mimetype,
              upsert: false,
            });

          if (error) throw new Error(error.message);

          const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
          return data.publicUrl;
        }),
      );

      res.status(201).json({ urls });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

export default router;
