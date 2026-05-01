import Review from "../models/Review.js";
import Listing from "../models/Listing.js";

export const addReview = async (req, res) => {
  try {
    const { listingId, rating, comment } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    const existing = await Review.findOne({ userId: req.user._id, listingId });
    if (existing) return res.status(409).json({ message: "You have already reviewed this listing" });

    const review = await Review.create({
      userId: req.user._id,
      listingId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getListingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ listingId: req.params.listingId })
      .populate("userId", "name");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
