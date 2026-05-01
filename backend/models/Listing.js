import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    location: { type: String, required: true, trim: true },
    facilities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Listing", listingSchema);
