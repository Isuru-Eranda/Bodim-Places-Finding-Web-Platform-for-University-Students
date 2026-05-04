import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { supabaseAdmin } from "./config/supabase.js";

import authRoutes from "./routes/auth.js";
import listingRoutes from "./routes/listings.js";
import bookingRoutes from "./routes/bookings.js";
import reviewRoutes from "./routes/reviews.js";
import aiRoutes from "./routes/ai.js";
import adminRoutes from "./routes/admin.js";
import contactRoutes from "./routes/contact.js";
import ownerRoutes from "./routes/owner.js";
import uploadRoutes from "./routes/upload.js";
import { scheduleUnverifyStaleListings } from "./jobs/unverifyStaleListings.js";

connectDB();

// Start scheduled jobs
scheduleUnverifyStaleListings();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      // and any localhost / 127.0.0.1 origin for development
      if (
        !origin ||
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }
      // In production, restrict to your deployed frontend domain via VITE_API_URL
      const allowed = process.env.ALLOWED_ORIGIN;
      if (allowed && origin === allowed) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.json({ message: "API Running" }));

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/upload", uploadRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, req, res, next) => {
  if (err.name === "MulterError") {
    const status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    return res.status(status).json({ message: err.message });
  }
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Ensure the Supabase 360° image bucket exists at startup
(async () => {
  const { error } = await supabaseAdmin.storage.createBucket("listing-360", {
    public: true,
    allowedMimeTypes: ["image/*"],
  });
  if (error && !error.message?.toLowerCase().includes("already exist")) {
    console.warn("[supabase] Could not create listing-360 bucket:", error.message);
  } else {
    console.log("[supabase] listing-360 bucket ready");
  }
})();
