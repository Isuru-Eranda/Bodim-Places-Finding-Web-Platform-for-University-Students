import { Router } from "express";
import { register, login, getMe, updateProfile, changePassword, updateContactDetails, uploadProfilePicture } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

const avatarFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext) && allowed.test(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPEG, PNG and WebP images are allowed"));
};

const uploadAvatar = multer({
  storage: multer.memoryStorage(),
  fileFilter: avatarFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.put("/contact-details", protect, updateContactDetails);
router.post("/profile-picture", protect, uploadAvatar.single("profilePicture"), uploadProfilePicture);

export default router;
