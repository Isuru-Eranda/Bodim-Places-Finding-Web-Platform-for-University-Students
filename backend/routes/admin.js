import { Router } from "express";
import {
  getAnalytics,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllListingsAdmin,
  verifyListing,
  deleteListingAdmin,
  getAllBookingsAdmin,
  updateBookingAdmin,
  deleteBookingAdmin,
  getAllReviewsAdmin,
  deleteReviewAdmin,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// All admin routes require authentication and admin role
router.use(protect, authorize("admin"));

// Analytics
router.get("/analytics", getAnalytics);

// User management
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// Listing management
router.get("/listings", getAllListingsAdmin);
router.put("/listings/:id/verify", verifyListing);
router.delete("/listings/:id", deleteListingAdmin);

// Booking management
router.get("/bookings", getAllBookingsAdmin);
router.put("/bookings/:id", updateBookingAdmin);
router.delete("/bookings/:id", deleteBookingAdmin);

// Review management
router.get("/reviews", getAllReviewsAdmin);
router.delete("/reviews/:id", deleteReviewAdmin);

export default router;
