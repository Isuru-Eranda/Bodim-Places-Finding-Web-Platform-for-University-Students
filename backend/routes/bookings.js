import { Router } from "express";
import { createBooking, getUserBookings } from "../controllers/bookingController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, authorize("student", "admin"), createBooking);
router.get("/my", protect, getUserBookings);

export default router;
