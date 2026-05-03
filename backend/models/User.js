import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "owner", "admin"], default: "student" },
    profilePicture: { type: String, default: null },
    contactNumber: { type: String, default: null, trim: true },
    whatsapp: { type: String, default: null, trim: true },
    guardianMobile: { type: String, default: null, trim: true }, // students only
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
