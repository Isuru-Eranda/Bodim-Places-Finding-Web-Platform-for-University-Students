import { Router } from "express";
import {
  createBooking,
  getUserBookings,
  payBooking,
} from "../controllers/bookingController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, authorize("student", "admin"), createBooking);
router.get("/my", protect, getUserBookings);
router.put("/:id/pay", protect, authorize("student", "admin"), payBooking);

export default router;
