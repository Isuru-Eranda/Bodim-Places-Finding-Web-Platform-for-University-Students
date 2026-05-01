import { Router } from "express";
import { addReview, getListingReviews } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, addReview);
router.get("/:listingId", getListingReviews);

export default router;
