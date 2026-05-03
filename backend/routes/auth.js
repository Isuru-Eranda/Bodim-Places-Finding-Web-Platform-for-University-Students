import { Router } from "express";
import { register, login, getMe, updateProfile, changePassword, updateContactDetails, uploadProfilePicture } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Separate multer config for avatar uploads
const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(__dirname, "../uploads/avatars");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar-${unique}${ext}`);
  },
});

const avatarFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext) && allowed.test(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPEG, PNG and WebP images are allowed"));
};

const uploadAvatar = multer({ storage: avatarStorage, fileFilter: avatarFilter, limits: { fileSize: 2 * 1024 * 1024 } });

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.put("/contact-details", protect, updateContactDetails);
router.post("/profile-picture", protect, uploadAvatar.single("profilePicture"), uploadProfilePicture);

export default router;
