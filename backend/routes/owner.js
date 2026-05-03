import { Router } from "express";
import {
  getMyListings,
  getMyListingBookings,
  updateBookingStatus,
} from "../controllers/ownerController.js";
import {
  createListing,
  updateListing,
  deleteListing,
} from "../controllers/listingController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// All owner routes require authentication and the "owner" role
router.use(protect, authorize("owner"));

// Listings
router.get("/listings", getMyListings);
router.post("/listings", createListing);
router.put("/listings/:id", updateListing);
router.delete("/listings/:id", deleteListing);

// Bookings for the owner's listings
router.get("/bookings", getMyListingBookings);
router.put("/bookings/:id", updateBookingStatus);

export default router;
