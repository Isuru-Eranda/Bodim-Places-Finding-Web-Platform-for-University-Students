import Listing from "../models/Listing.js";
import Booking from "../models/Booking.js";

// GET /api/owner/listings — all listings belonging to the authenticated owner
export const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ ownerId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/owner/bookings — all bookings for all of the owner's listings
export const getMyListingBookings = async (req, res) => {
  try {
    const listings = await Listing.find({ ownerId: req.user._id }).select(
      "_id"
    );
    const listingIds = listings.map((l) => l._id);

    const bookings = await Booking.find({ listingId: { $in: listingIds } })
      .populate("studentId", "name email")
      .populate("listingId", "title price location")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/owner/bookings/:id — accept or reject a booking request
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["confirmed", "cancelled"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be 'confirmed' or 'cancelled'" });
    }

    const booking = await Booking.findById(req.params.id).populate("listingId");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Ensure the booking belongs to one of the owner's listings
    if (booking.listingId.ownerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this booking" });
    }

    booking.status = status;
    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate("studentId", "name email")
      .populate("listingId", "title price location");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
