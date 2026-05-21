import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  Star,
  Wifi,
  Car,
  UtensilsCrossed,
  ShieldCheck,
  Droplets,
  WashingMachine,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCircle,
  Clock,
  User,
  MessageSquare,
  Send,
  AlertCircle,
  ZoomIn,
  X,
  Phone,
  Mail,
  Home,
  Dumbbell,
  Tv,
  Rotate3D,
} from "lucide-react";
import {
  useJsApiLoader,
  GoogleMap as GMap,
  Marker,
} from "@react-google-maps/api";
import { useAuth } from "../context/AuthContext";
import { Modal360 } from "../components/Viewer360";
import {
  getListingById,
  getReviews,
  addReview,
  createBooking,
  getMyBookings,
  payBooking,
} from "../services/api";

/* ─── Google Maps stable refs ────────────────────────────── */
const MAP_LIBS = [];
const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };
const MAP_OPTIONS = {
  gestureHandling: "cooperative",
  streetViewControl: false,
  mapTypeControl: false,
};

/* ─── Constants ─────────────────────────────────────────── */
const PLACEHOLDER = "https://placehold.co/800x500/F3E8E2/8B5E3C?text=No+Image";

const FACILITY_ICONS = {
  WiFi: Wifi,
  Parking: Car,
  Kitchen: UtensilsCrossed,
  Security: ShieldCheck,
  Water: Droplets,
  Laundry: WashingMachine,
  Gym: Dumbbell,
  TV: Tv,
};

/* ─── Sub-components ─────────────────────────────────────── */
function Spinner({ size = "lg" }) {
  const dim = size === "sm" ? "w-5 h-5" : "w-10 h-10";
  return (
    <svg
      className={`animate-spin ${dim} text-orange-500`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}

function StarRating({ value, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          className={`transition-colors ${readOnly ? "cursor-default" : "cursor-pointer"}`}
        >
          <Star
            size={readOnly ? 14 : 22}
            className={
              (hovered || value) >= star
                ? "text-orange-500 fill-orange-500"
                : "text-gray-300"
            }
          />
        </button>
      ))}
    </div>
  );
}

function ListingMap({ location, coordinates }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: MAP_LIBS,
  });

  const hasPin = coordinates?.lat != null && coordinates?.lng != null;
  const pos = hasPin ? { lat: coordinates.lat, lng: coordinates.lng } : null;

  if (hasPin) {
    if (!isLoaded) {
      return (
        <div
          className="w-full rounded-xl bg-[#F3F4F6] flex items-center justify-center"
          style={{ height: 300 }}
        >
          <svg
            className="animate-spin w-8 h-8 text-orange-400"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </div>
      );
    }
    return (
      <div
        className="w-full rounded-xl overflow-hidden border border-[#E5E7EB] shadow-sm"
        style={{ height: 300 }}
      >
        <GMap
          mapContainerStyle={MAP_CONTAINER_STYLE}
          center={pos}
          zoom={15}
          options={MAP_OPTIONS}
        >
          <Marker position={pos} />
        </GMap>
      </div>
    );
  }

  // Fallback — no coordinates stored yet: use legacy embed
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&z=15&output=embed`;
  return (
    <div
      className="w-full rounded-xl overflow-hidden border border-[#E5E7EB] shadow-sm"
      style={{ height: 300 }}
    >
      <iframe
        title="Listing Location"
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

function ImageGallery({ images }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const imgs = images && images.length > 0 ? images : [PLACEHOLDER];

  const prev = (e) => {
    e.stopPropagation();
    setActive((a) => (a - 1 + imgs.length) % imgs.length);
  };
  const next = (e) => {
    e.stopPropagation();
    setActive((a) => (a + 1) % imgs.length);
  };

  return (
    <>
      {/* Main image */}
      <div
        className="relative rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in group"
        onClick={() => setLightbox(true)}
        style={{ aspectRatio: "16/9" }}
      >
        <img
          src={imgs[active]}
          alt="Listing"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = PLACEHOLDER;
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <ZoomIn
            className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"
            size={36}
          />
        </div>

        {/* Prev / Next arrows */}
        {imgs.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {imgs.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
            {active + 1} / {imgs.length}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {imgs.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {imgs.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                active === i
                  ? "border-orange-500 shadow-md"
                  : "border-transparent hover:border-orange-200"
              }`}
            >
              <img
                src={img}
                alt={`View ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = PLACEHOLDER;
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-orange-400 transition-colors"
            onClick={() => setLightbox(false)}
          >
            <X size={32} />
          </button>

          {/* Lightbox prev arrow */}
          {imgs.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
              onClick={prev}
              aria-label="Previous image"
            >
              <ChevronLeft size={26} />
            </button>
          )}

          <img
            src={imgs[active]}
            alt="Listing"
            className="max-w-full max-h-full rounded-xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              e.target.src = PLACEHOLDER;
            }}
          />

          {/* Lightbox next arrow */}
          {imgs.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
              onClick={next}
              aria-label="Next image"
            >
              <ChevronRight size={26} />
            </button>
          )}

          {imgs.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {imgs.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(i);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${i === active ? "bg-orange-500" : "bg-white/40"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function BookingCard({ listingId, price, user, existingBooking, owner }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(existingBooking || null);
  const [error, setError] = useState("");

  const statusColors = {
    pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
    confirmed: "text-green-600 bg-green-50 border-green-200",
    cancelled: "text-red-600 bg-red-50 border-red-200",
  };

  const handleBook = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await createBooking({ listingId });
      setBooking(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await payBooking(booking._id);
      setBooking(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Payment failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-lg p-6 space-y-5">
      {/* Price */}
      <div className="text-center pb-4 border-b border-[#E5E7EB]">
        <span className="text-3xl font-bold text-orange-500">
          LKR {Number(price).toLocaleString()}
        </span>
        <span className="text-[#6B7280] text-sm ml-1">/month</span>
      </div>

      {/* Booking status or action */}
      {booking ? (
        <div className="space-y-3">
          <div
            className={`flex items-start gap-3 p-4 rounded-xl border ${statusColors[booking.status] || "text-gray-600 bg-gray-50 border-gray-200"}`}
          >
            {booking.status === "confirmed" ? (
              <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
            ) : booking.status === "pending" ? (
              <Clock size={20} className="flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold capitalize">{booking.status}</p>
              <p className="text-xs mt-0.5 opacity-80">
                {booking.status === "pending" &&
                  "Your booking request is under review."}
                {booking.status === "confirmed" &&
                  "Your booking has been confirmed!"}
                {booking.status === "cancelled" &&
                  "This booking was cancelled."}
              </p>
            </div>
          </div>

          <div className="text-xs text-[#6B7280] space-y-1">
            <div className="flex justify-between">
              <span>Booking ID</span>
              <span className="font-mono text-[#1F2937] truncate max-w-[140px]">
                {booking._id}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Payment</span>
              <span
                className={`capitalize font-medium ${booking.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}`}
              >
                {booking.paymentStatus}
              </span>
            </div>
          </div>

          {booking.paymentStatus !== "paid" &&
            booking.status !== "cancelled" && (
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full mt-2 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Spinner size="sm" /> : <Home size={16} />}
                {loading ? "Processing Payment..." : "Pay Now"}
              </button>
            )}
        </div>
      ) : (
        <div className="space-y-4">
          <ul className="space-y-2 text-sm text-[#374151]">
            {[
              { icon: Calendar, text: "Flexible move-in date" },
              { icon: ShieldCheck, text: "Verified & safe listing" },
              { icon: Clock, text: "Owner reviews your request" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2">
                <Icon size={16} className="text-orange-500 flex-shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleBook}
            disabled={loading}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {loading ? <Spinner size="sm" /> : <Calendar size={18} />}
            {loading
              ? "Sending Request..."
              : user
                ? "Request to Book"
                : "Login to Request"}
          </button>

          {!user && (
            <p className="text-center text-xs text-[#6B7280]">
              <Link
                to="/login"
                className="text-orange-500 font-medium hover:underline"
              >
                Sign in
              </Link>{" "}
              to send a booking request
            </p>
          )}
        </div>
      )}

      {/* Contact Owner */}
      <div className="pt-4 border-t border-[#E5E7EB] space-y-2">
        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
          Contact Owner
        </p>
        {owner?.name && (
          <div className="flex items-center gap-2 text-sm text-[#374151]">
            <User size={15} className="text-orange-400 flex-shrink-0" />
            <span className="font-medium">{owner.name}</span>
          </div>
        )}
        {owner?.email && (
          <a
            href={`mailto:${owner.email}`}
            className="flex items-center gap-2 text-sm text-[#374151] hover:text-orange-500 transition-colors"
          >
            <Mail size={15} className="text-orange-400 flex-shrink-0" />
            <span className="truncate">{owner.email}</span>
          </a>
        )}
        {owner?.contactNumber && (
          <a
            href={`tel:${owner.contactNumber}`}
            className="flex items-center gap-2 text-sm text-[#374151] hover:text-orange-500 transition-colors"
          >
            <Phone size={15} className="text-orange-400 flex-shrink-0" />
            <span>{owner.contactNumber}</span>
          </a>
        )}
        {owner?.whatsapp && (
          <a
            href={`https://wa.me/${owner.whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[#374151] hover:text-green-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="w-4 h-4 flex-shrink-0"
              fill="#25D366"
              aria-hidden="true"
            >
              <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.737 5.469 2.027 7.77L0 32l8.43-2.01A15.938 15.938 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.77-1.848l-.485-.29-5.003 1.194 1.218-4.868-.317-.5A13.267 13.267 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.87c-.398-.199-2.355-1.162-2.72-1.295-.366-.133-.632-.199-.898.199-.266.398-1.031 1.295-1.264 1.561-.233.266-.465.299-.863.1-.398-.199-1.681-.619-3.202-1.977-1.183-1.056-1.982-2.361-2.215-2.759-.233-.398-.025-.613.175-.811.18-.178.398-.465.597-.698.199-.233.266-.398.398-.664.133-.266.067-.498-.033-.697-.1-.199-.898-2.163-1.231-2.961-.324-.778-.654-.672-.898-.685l-.765-.013c-.266 0-.697.1-1.063.498-.366.398-1.396 1.363-1.396 3.326s1.43 3.858 1.629 4.124c.199.266 2.814 4.297 6.818 6.027.953.411 1.697.656 2.277.839.956.304 1.827.261 2.515.158.767-.114 2.355-.963 2.688-1.893.333-.93.333-1.727.233-1.893-.1-.166-.366-.266-.764-.465z" />
            </svg>
            <span>{owner.whatsapp}</span>
          </a>
        )}
        {!owner?.contactNumber && !owner?.whatsapp && (
          <p className="text-xs text-[#9CA3AF] italic">
            No contact details provided yet.
          </p>
        )}
      </div>
    </div>
  );
}

function ReviewsSection({ listingId, reviews, user }) {
  const navigate = useNavigate();
  const [allReviews, setAllReviews] = useState(reviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Check if user already reviewed
  const alreadyReviewed =
    user &&
    allReviews.some(
      (r) => (r.userId?._id || r.userId) === (user._id || user.id),
    );

  const avgRating = allReviews.length
    ? (
        allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
      ).toFixed(1)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a comment.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await addReview({
        listingId,
        rating,
        comment: comment.trim(),
      });
      const newReview = {
        ...res.data,
        userId: { _id: user._id || user.id, name: user.name || user.email },
      };
      setAllReviews((prev) => [newReview, ...prev]);
      setComment("");
      setRating(5);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#1F2937] flex items-center gap-2">
          <MessageSquare size={20} className="text-orange-500" />
          Reviews
          {allReviews.length > 0 && (
            <span className="text-sm font-normal text-[#6B7280]">
              ({allReviews.length})
            </span>
          )}
        </h2>
        {avgRating && (
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100">
            <Star size={16} className="text-orange-500 fill-orange-500" />
            <span className="font-bold text-[#1F2937]">{avgRating}</span>
            <span className="text-[#6B7280] text-sm">/ 5</span>
          </div>
        )}
      </div>

      {/* Add review form */}
      {!alreadyReviewed && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#E5E7EB] p-5 space-y-4"
        >
          <p className="font-semibold text-[#1F2937] text-sm">
            {user ? "Share your experience" : "Login to leave a review"}
          </p>

          <div className="space-y-1">
            <label className="text-xs text-[#6B7280] font-medium">
              Your Rating
            </label>
            <StarRating value={rating} onChange={setRating} readOnly={!user} />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[#6B7280] font-medium">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={!user}
              placeholder={
                user
                  ? "Tell others about this place..."
                  : "Login to write a review"
              }
              rows={3}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-xl text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 resize-none disabled:bg-gray-50 disabled:cursor-not-allowed transition"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
              <CheckCircle size={15} />
              <span>Review submitted successfully!</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !user}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            {loading ? <Spinner size="sm" /> : <Send size={15} />}
            {user
              ? loading
                ? "Submitting..."
                : "Submit Review"
              : "Login to Review"}
          </button>
        </form>
      )}

      {alreadyReviewed && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-600 text-sm">
          <CheckCircle size={16} />
          <span>You have already reviewed this listing.</span>
        </div>
      )}

      {/* Review list */}
      {allReviews.length === 0 ? (
        <div className="text-center py-10 text-[#6B7280]">
          <MessageSquare size={32} className="mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No reviews yet</p>
          <p className="text-sm mt-1">Be the first to review this listing.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allReviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#1F2937]">
                      {review.userId?.name || "Anonymous"}
                    </p>
                    <p className="text-xs text-[#9CA3AF]">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <StarRating value={review.rating} readOnly />
              </div>
              {review.comment && (
                <p className="text-sm text-[#374151] leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [existingBooking, setExistingBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show360Modal, setShow360Modal] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [listingRes, reviewsRes] = await Promise.all([
        getListingById(id),
        getReviews(id),
      ]);
      setListing(listingRes.data);
      setReviews(reviewsRes.data);

      if (user) {
        try {
          const bookingsRes = await getMyBookings();
          const found = bookingsRes.data.find(
            (b) => (b.listingId?._id || b.listingId) === id,
          );
          if (found) setExistingBooking(found);
        } catch {
          // non-critical
        }
      }
    } catch {
      setError("Failed to load listing details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* Loading state */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDFB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          <p className="text-[#6B7280] text-sm">Loading listing details...</p>
        </div>
      </div>
    );
  }

  /* Error state */
  if (error || !listing) {
    return (
      <div className="min-h-screen bg-[#FFFDFB] flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={28} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-[#1F2937]">
            Listing Not Found
          </h2>
          <p className="text-[#6B7280] text-sm">
            {error || "This listing does not exist."}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-[#E5E7EB] rounded-xl text-sm text-[#374151] hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
            <Link
              to="/browse"
              className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              Browse Listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const {
    title = "Boarding Place",
    description = "",
    location = "Unknown Location",
    price = 0,
    images = [],
    facilities = [],
    roomsAvailable = null,
    isVerified = false,
    createdAt,
    coordinates = null,
    image360 = null,
  } = listing;

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-[#FFFDFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Breadcrumb & Back ── */}
        <div className="flex items-center gap-2 mb-6 text-sm text-[#6B7280]">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 hover:text-orange-500 transition-colors font-medium"
          >
            <ChevronLeft size={18} />
            Back
          </button>
          <span>/</span>
          <Link
            to="/browse"
            className="hover:text-orange-500 transition-colors"
          >
            Browse
          </Link>
          <span>/</span>
          <span className="text-[#1F2937] font-medium line-clamp-1 max-w-[200px]">
            {title}
          </span>
        </div>

        {/* ── Title row ── */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {isVerified && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 bg-orange-100 text-orange-600 text-xs font-semibold rounded-full border border-orange-200">
                  <ShieldCheck size={12} />
                  Verified
                </span>
              )}
              {createdAt &&
                new Date(createdAt) >
                  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                  <span className="px-2.5 py-0.5 bg-green-100 text-green-600 text-xs font-semibold rounded-full border border-green-200">
                    New
                  </span>
                )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B7280]">
              <span className="flex items-center gap-1.5">
                <MapPin size={15} className="text-orange-400" />
                {location}
              </span>
              {avgRating && (
                <span className="flex items-center gap-1.5">
                  <Star size={15} className="text-orange-500 fill-orange-500" />
                  <strong className="text-[#1F2937]">{avgRating}</strong>
                  <span>
                    ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                  </span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Home size={15} className="text-[#9CA3AF]" />
                Listed{" "}
                {new Date(createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column (content) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <ImageGallery images={images} />

            {/* 360° View */}
            {image360 ? (
              <button
                onClick={() => setShow360Modal(true)}
                className="relative w-full rounded-2xl overflow-hidden group shadow-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                style={{ height: "220px" }}
                aria-label="Open 360° Virtual Tour"
              >
                {/* Preview image */}
                <img
                  src={image360}
                  alt="360° preview"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 group-hover:from-black/80 group-hover:via-black/40 transition-colors duration-300" />
                {/* Centred icon + label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-orange-500/90 group-hover:bg-orange-500 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Rotate3D size={28} className="text-white" />
                  </div>
                  <span className="text-white font-bold text-base drop-shadow">
                    360° Virtual Tour
                  </span>
                  <span className="text-white/70 text-xs">
                    Click to explore this space in 360°
                  </span>
                </div>
                {/* Corner badge */}
                <span className="absolute top-3 left-3 text-[10px] font-bold text-white bg-orange-500 px-2 py-0.5 rounded-full shadow">
                  360°
                </span>
              </button>
            ) : null}

            {/* Description */}
            {description && (
              <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                <h2 className="font-bold text-[#1F2937] text-lg mb-3">
                  About this place
                </h2>
                <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </section>
            )}

            {/* Rooms available */}
            {roomsAvailable != null && (
              <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                  <Home size={20} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wide">
                    Rooms Available
                  </p>
                  <p className="text-lg font-bold text-[#1F2937]">
                    {roomsAvailable}
                  </p>
                </div>
              </section>
            )}

            {/* Facilities */}
            <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
              <h2 className="font-bold text-[#1F2937] text-lg mb-4">
                Facilities & Amenities
              </h2>
              {facilities.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {facilities.map((facility) => {
                    const Icon = FACILITY_ICONS[facility] || Home;
                    return (
                      <div
                        key={facility}
                        className="flex items-center gap-2.5 px-4 py-3 bg-orange-50 border border-orange-100 rounded-xl text-sm font-medium text-[#374151]"
                      >
                        <Icon
                          size={17}
                          className="text-orange-500 flex-shrink-0"
                        />
                        {facility}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-[#9CA3AF]">No facilities listed.</p>
              )}
            </section>

            {/* Location & Map */}
            <section className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4">
              <h2 className="font-bold text-[#1F2937] text-lg flex items-center gap-2">
                <MapPin size={18} className="text-orange-500" />
                Location
              </h2>
              <div className="flex items-center gap-2 text-sm text-[#374151] mb-3">
                <MapPin size={15} className="text-orange-400 flex-shrink-0" />
                <span>{location}</span>
                <a
                  href={
                    coordinates?.lat != null && coordinates?.lng != null
                      ? `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`
                      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-orange-500 hover:text-orange-600 font-medium text-xs underline-offset-2 hover:underline flex-shrink-0"
                >
                  Open in Maps ↗
                </a>
              </div>
              <ListingMap location={location} coordinates={coordinates} />
            </section>

            {/* Reviews */}
            <section className="bg-[#FFFDFB] rounded-2xl">
              <ReviewsSection listingId={id} reviews={reviews} user={user} />
            </section>
          </div>

          {/* Right column (booking card) – sticky on desktop */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <BookingCard
                listingId={id}
                price={price}
                user={user}
                existingBooking={existingBooking}
                owner={listing.ownerId}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 360° Modal */}
      {show360Modal && image360 && (
        <Modal360 image={image360} onClose={() => setShow360Modal(false)} />
      )}
    </div>
  );
}
