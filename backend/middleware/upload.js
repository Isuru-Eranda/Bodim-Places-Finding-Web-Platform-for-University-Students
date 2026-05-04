import multer from "multer";
import path from "path";

const fileFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext) && allowed.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG and WebP images are allowed"));
  }
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
});

// Relaxed filter for 360° panoramic images (larger files, any image type)
const fileFilter360 = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed for 360° upload"));
  }
};

export const upload360 = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter360,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB — panoramas can be large
});
