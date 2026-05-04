import cron from "node-cron";
import Listing from "../models/Listing.js";

const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000; // ~6 months in ms

/**
 * Runs every day at midnight.
 * Unverifies any listing whose images have not been updated in the last 6 months.
 * Listings that have never had images (imagesUpdatedAt is null) are also unverified
 * if they are currently verified.
 */
export function scheduleUnverifyStaleListings() {
  cron.schedule("0 0 * * *", async () => {
    try {
      const cutoff = new Date(Date.now() - SIX_MONTHS_MS);

      const result = await Listing.updateMany(
        {
          isVerified: true,
          $or: [
            { imagesUpdatedAt: null },
            { imagesUpdatedAt: { $lt: cutoff } },
          ],
        },
        { $set: { isVerified: false } }
      );

      if (result.modifiedCount > 0) {
        console.log(
          `[CRON] Unverified ${result.modifiedCount} listing(s) with stale or missing images.`
        );
      }
    } catch (err) {
      console.error("[CRON] Error running unverifyStaleListings job:", err.message);
    }
  });

  console.log("[CRON] Scheduled: unverify stale listings job (runs daily at midnight)");
}
