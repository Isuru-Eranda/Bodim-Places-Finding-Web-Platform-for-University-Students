import { Router } from "express";
import {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
} from "../controllers/listingController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getAllListings);
router.get("/:id", getListingById);
router.post("/", protect, authorize("owner", "admin"), createListing);
router.put("/:id", protect, updateListing);
router.delete("/:id", protect, deleteListing);

export default router;
