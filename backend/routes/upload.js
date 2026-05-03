import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { s3, getPublicUrl } from "../config/supabase.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import path from "path";

const router = Router();

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

          await s3.send(
            new PutObjectCommand({
              Bucket: "listing-images",
              Key: filename,
              Body: file.buffer,
              ContentType: file.mimetype,
            })
          );

          return getPublicUrl("listing-images", filename);
        })
      );

      res.status(201).json({ urls });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;
