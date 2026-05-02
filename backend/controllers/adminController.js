import User from "../models/User.js";
import Listing from "../models/Listing.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";

// ─── Analytics ────────────────────────────────────────────────────────────────

export const getAnalytics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalListings,
      totalBookings,
      totalReviews,
      verifiedListings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      recentUsers,
      recentBookings,
      usersByRole,
      bookingsByMonth,
    ] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Booking.countDocuments(),
      Review.countDocuments(),
      Listing.countDocuments({ isVerified: true }),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.countDocuments({ status: "cancelled" }),
      User.find().sort({ createdAt: -1 }).limit(5).select("-password"),
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("studentId", "name email")
        .populate("listingId", "title location"),
      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
      Booking.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 12 },
      ]),
    ]);

    res.json({
      stats: {
        totalUsers,
        totalListings,
        totalBookings,
        totalReviews,
        verifiedListings,
        unverifiedListings: totalListings - verifiedListings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
      },
      recentUsers,
      recentBookings,
      usersByRole,
      bookingsByMonth,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── User Management ──────────────────────────────────────────────────────────

export const getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);
    res.json({ users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["student", "owner", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Listing Management ───────────────────────────────────────────────────────

export const getAllListingsAdmin = async (req, res) => {
  try {
    const { search, isVerified, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (isVerified !== undefined) filter.isVerified = isVerified === "true";
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate("ownerId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Listing.countDocuments(filter),
    ]);
    res.json({ listings, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyListing = async (req, res) => {
  try {
    const { isVerified } = req.body;
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { isVerified },
      { new: true }
    ).populate("ownerId", "name email");
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteListingAdmin = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Booking Management ───────────────────────────────────────────────────────

export const getAllBookingsAdmin = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    const skip = (Number(page) - 1) * Number(limit);
    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate("studentId", "name email")
        .populate("listingId", "title location price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Booking.countDocuments(filter),
    ]);
    res.json({ bookings, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingAdmin = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const update = {};
    if (status) update.status = status;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    const booking = await Booking.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate("studentId", "name email")
      .populate("listingId", "title location price");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBookingAdmin = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Review Management ────────────────────────────────────────────────────────

export const getAllReviewsAdmin = async (req, res) => {
  try {
    const { rating, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (rating) filter.rating = Number(rating);
    const skip = (Number(page) - 1) * Number(limit);
    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate("userId", "name email")
        .populate("listingId", "title location")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments(filter),
    ]);
    res.json({ reviews, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReviewAdmin = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
