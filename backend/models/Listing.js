import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    price: { type: Number, required: true },
    location: { type: String, required: true, trim: true },
    roomsAvailable: { type: Number, default: null },
    facilities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isVerified: { type: Boolean, default: false },
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Listing", listingSchema);
