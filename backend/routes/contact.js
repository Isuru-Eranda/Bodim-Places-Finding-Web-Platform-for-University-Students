import { Router } from "express";
import {
  submitContact,
  getContacts,
  updateContactStatus,
  deleteContact,
} from "../controllers/contactController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

// Public — anyone can submit a contact message
router.post("/", submitContact);

// Admin only
router.get("/", protect, authorize("admin"), getContacts);
router.put("/:id/status", protect, authorize("admin"), updateContactStatus);
router.delete("/:id", protect, authorize("admin"), deleteContact);

export default router;
