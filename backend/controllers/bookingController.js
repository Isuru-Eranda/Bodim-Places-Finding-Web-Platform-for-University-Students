import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";

export const createBooking = async (req, res) => {
  try {
    const { listingId } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    const booking = await Booking.create({
      studentId: req.user._id,
      listingId,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ studentId: req.user._id }).populate(
      "listingId",
      "title price location",
    );
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const payBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.studentId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to pay for this booking" });
    }
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({ message: "Booking is already paid" });
    }
    if (booking.status === "cancelled") {
      return res
        .status(400)
        .json({ message: "Cannot pay for a cancelled booking" });
    }

    booking.paymentStatus = "paid";
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
