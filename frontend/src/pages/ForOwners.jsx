import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  Building2,
  CalendarDays,
  Loader2,
  ChevronDown,
  ChevronUp,
  MapPin,
  DollarSign,
  Wifi,
  ShowerHead,
  UtensilsCrossed,
  Tv,
  Car,
  Shield,
  ImagePlus,
} from "lucide-react";
import {
  ownerGetMyListings,
  ownerCreateListing,
  ownerUpdateListing,
  ownerDeleteListing,
  ownerGetBookings,
  ownerUpdateBookingStatus,
  uploadImages,
} from "../services/api";
import MapPicker from "../components/MapPicker";

const FACILITIES = [
  { value: "WiFi", icon: Wifi },
  { value: "Bathroom", icon: ShowerHead },
  { value: "Kitchen", icon: UtensilsCrossed },
  { value: "TV", icon: Tv },
  { value: "Parking", icon: Car },
  { value: "Security", icon: Shield },
];

const STATUS_BADGE = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

const emptyForm = {
  title: "",
  price: "",
  location: "",
  lat: null,
  lng: null,
  facilities: [],
  existingImageUrls: [],
  newFiles: [],
};

export default function ForOwners() {
  const [tab, setTab] = useState("listings");

  // ── Listings state ──────────────────────────────────────────────────────────
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingError, setListingError] = useState("");

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = create, obj = edit
  const [form, setForm] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // ── Delete confirm ──────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Bookings state ──────────────────────────────────────────────────────────
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingError, setBookingError] = useState("");
  const [expandedListing, setExpandedListing] = useState(null);

  // ── Load data ───────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchListings();
    fetchBookings();
  }, []);

  const fetchListings = async () => {
    setListingsLoading(true);
    setListingError("");
    try {
      const { data } = await ownerGetMyListings();
      setListings(data);
    } catch {
      setListingError("Failed to load listings.");
    } finally {
      setListingsLoading(false);
    }
  };

  const fetchBookings = async () => {
    setBookingsLoading(true);
    setBookingError("");
    try {
      const { data } = await ownerGetBookings();
      setBookings(data);
    } catch {
      setBookingError("Failed to load bookings.");
    } finally {
      setBookingsLoading(false);
    }
  };

  // ── Listing form helpers ────────────────────────────────────────────────────
  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (listing) => {
    setEditTarget(listing);
    setForm({
      title: listing.title,
      price: listing.price,
      location: listing.location,
      lat: listing.coordinates?.lat ?? null,
      lng: listing.coordinates?.lng ?? null,
      facilities: listing.facilities || [],
      existingImageUrls: listing.images || [],
      newFiles: [],
    });
    setFormError("");
    setModalOpen(true);
  };

  const toggleFacility = (val) => {
    setForm((f) => ({
      ...f,
      facilities: f.facilities.includes(val)
        ? f.facilities.filter((x) => x !== val)
        : [...f.facilities, val],
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      // 1. Upload any new files chosen from device
      let uploadedUrls = [];
      if (form.newFiles.length > 0) {
        const fd = new FormData();
        form.newFiles.forEach((file) => fd.append("images", file));
        const { data } = await uploadImages(fd);
        uploadedUrls = data.urls;
      }

      const payload = {
        title: form.title.trim(),
        price: Number(form.price),
        location: form.location.trim(),
        facilities: form.facilities,
        images: [...form.existingImageUrls, ...uploadedUrls],
        ...(form.lat != null && form.lng != null
          ? { coordinates: { lat: form.lat, lng: form.lng } }
          : {}),
      };

      if (editTarget) {
        const { data } = await ownerUpdateListing(editTarget._id, payload);
        setListings((prev) =>
          prev.map((l) => (l._id === data._id ? data : l))
        );
      } else {
        const { data } = await ownerCreateListing(payload);
        setListings((prev) => [data, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(
        err?.response?.data?.message || "Failed to save listing. Try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // ── Delete listing ──────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await ownerDeleteListing(deleteTarget._id);
      setListings((prev) => prev.filter((l) => l._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch {
      // keep modal open so user can retry
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Booking status update ───────────────────────────────────────────────────
  const handleBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await ownerUpdateBookingStatus(bookingId, status);
      setBookings((prev) =>
        prev.map((b) => (b._id === data._id ? data : b))
      );
    } catch {
      // silent fail — could add toast here
    }
  };

  // ── Group bookings by listing ────────────────────────────────────────────────
  const bookingsByListing = bookings.reduce((acc, b) => {
    const key = b.listingId?._id;
    if (!key) return acc;
    if (!acc[key]) acc[key] = { listing: b.listingId, bookings: [] };
    acc[key].bookings.push(b);
    return acc;
  }, {});

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FFFDFB]">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">Owner Dashboard</h1>
          <p className="text-orange-100 text-sm">
            Manage your listings and review student booking requests.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-[#E5E7EB]">
          <button
            onClick={() => setTab("listings")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === "listings"
                ? "border-orange-500 text-orange-500"
                : "border-transparent text-[#6B7280] hover:text-[#1F2937]"
            }`}
          >
            <Building2 size={16} /> My Listings
          </button>
          <button
            onClick={() => setTab("bookings")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === "bookings"
                ? "border-orange-500 text-orange-500"
                : "border-transparent text-[#6B7280] hover:text-[#1F2937]"
            }`}
          >
            <CalendarDays size={16} /> Booking Requests
            {bookings.filter((b) => b.status === "pending").length > 0 && (
              <span className="bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                {bookings.filter((b) => b.status === "pending").length}
              </span>
            )}
          </button>
        </div>

        {/* ── Listings Tab ─────────────────────────────────────────────────── */}
        {tab === "listings" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[#1F2937]">
                Your Listings ({listings.length})
              </h2>
              <button
                onClick={openCreate}
                className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus size={16} /> Add Listing
              </button>
            </div>

            {listingsLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="animate-spin text-orange-400" size={32} />
              </div>
            ) : listingError ? (
              <p className="text-center text-red-500 py-10">{listingError}</p>
            ) : listings.length === 0 ? (
              <div className="text-center py-16 text-[#6B7280]">
                <Building2 size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No listings yet.</p>
                <p className="text-sm mt-1">
                  Click "Add Listing" to post your first property.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {listings.map((listing) => (
                  <ListingCard
                    key={listing._id}
                    listing={listing}
                    onEdit={() => openEdit(listing)}
                    onDelete={() => setDeleteTarget(listing)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Bookings Tab ─────────────────────────────────────────────────── */}
        {tab === "bookings" && (
          <div>
            <h2 className="text-lg font-semibold text-[#1F2937] mb-5">
              Booking Requests
            </h2>

            {bookingsLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="animate-spin text-orange-400" size={32} />
              </div>
            ) : bookingError ? (
              <p className="text-center text-red-500 py-10">{bookingError}</p>
            ) : Object.keys(bookingsByListing).length === 0 ? (
              <div className="text-center py-16 text-[#6B7280]">
                <CalendarDays size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No booking requests yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {Object.values(bookingsByListing).map(({ listing, bookings: bList }) => (
                  <div
                    key={listing._id}
                    className="border border-[#E5E7EB] rounded-xl overflow-hidden"
                  >
                    {/* Listing header */}
                    <button
                      onClick={() =>
                        setExpandedListing((prev) =>
                          prev === listing._id ? null : listing._id
                        )
                      }
                      className="w-full flex items-center justify-between px-5 py-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <Building2 size={18} className="text-orange-500 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-[#1F2937] text-sm">
                            {listing.title}
                          </p>
                          <p className="text-xs text-[#6B7280]">
                            {listing.location} &middot; Rs. {listing.price}/mo
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                          {bList.length} request{bList.length !== 1 ? "s" : ""}
                        </span>
                        {expandedListing === listing._id ? (
                          <ChevronUp size={16} className="text-[#9CA3AF]" />
                        ) : (
                          <ChevronDown size={16} className="text-[#9CA3AF]" />
                        )}
                      </div>
                    </button>

                    {/* Booking rows */}
                    {expandedListing === listing._id && (
                      <div className="divide-y divide-[#F3F4F6]">
                        {bList.map((booking) => (
                          <BookingRow
                            key={booking._id}
                            booking={booking}
                            onAction={handleBookingStatus}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Listing Modal (create/edit) ───────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
              <h3 className="text-base font-semibold text-[#1F2937]">
                {editTarget ? "Edit Listing" : "Add New Listing"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#9CA3AF] hover:text-[#1F2937] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="px-6 py-5 flex flex-col gap-4">
              {formError && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {formError}
                </p>
              )}

              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">
                  Title *
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Cozy room near campus"
                  className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">
                  Monthly Price (Rs.) *
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="e.g. 8000"
                  className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#374151] mb-2">
                  Location *
                </label>
                <MapPicker
                  address={form.location}
                  lat={form.lat}
                  lng={form.lng}
                  onAddressChange={(val) => setForm((f) => ({ ...f, location: val }))}
                  onPinChange={(lat, lng) => setForm((f) => ({ ...f, lat, lng }))}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#374151] mb-2">
                  Facilities
                </label>
                <div className="flex flex-wrap gap-2">
                  {FACILITIES.map(({ value, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleFacility(value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        form.facilities.includes(value)
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-[#6B7280] border-[#D1D5DB] hover:border-orange-400"
                      }`}
                    >
                      <Icon size={13} /> {value}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#374151] mb-2">
                  Images
                </label>

                {/* Existing images (edit mode) */}
                {form.existingImageUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.existingImageUrls.map((url, i) => (
                      <div key={i} className="relative w-16 h-16">
                        <img
                          src={url}
                          alt={`img-${i}`}
                          className="w-16 h-16 object-cover rounded-lg border border-[#E5E7EB]"
                          onError={(e) => { e.currentTarget.style.opacity = "0.3"; }}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              existingImageUrls: f.existingImageUrls.filter(
                                (_, idx) => idx !== i
                              ),
                            }))
                          }
                          className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] hover:bg-red-600"
                        >
                          <X size={9} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* New file previews */}
                {form.newFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.newFiles.map((file, i) => (
                      <div key={i} className="relative w-16 h-16">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-16 h-16 object-cover rounded-lg border border-orange-300"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              newFiles: f.newFiles.filter((_, idx) => idx !== i),
                            }))
                          }
                          className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] hover:bg-red-600"
                        >
                          <X size={9} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* File input trigger */}
                <label className="flex items-center gap-2 cursor-pointer w-fit px-3 py-2 border border-dashed border-[#D1D5DB] rounded-lg text-xs text-[#6B7280] hover:border-orange-400 hover:text-orange-500 transition-colors">
                  <ImagePlus size={14} />
                  <span>Choose images from device</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setForm((f) => ({ ...f, newFiles: [...f.newFiles, ...files] }));
                      e.target.value = "";
                    }}
                  />
                </label>
                <p className="text-[10px] text-[#9CA3AF] mt-1">
                  JPEG, PNG or WebP &middot; max 5 MB each
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-60"
                >
                  {formLoading && <Loader2 size={14} className="animate-spin" />}
                  {editTarget ? "Save Changes" : "Create Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ─────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-base font-semibold text-[#1F2937] mb-2">
              Delete Listing?
            </h3>
            <p className="text-sm text-[#6B7280] mb-5">
              Are you sure you want to delete{" "}
              <span className="font-medium text-[#1F2937]">
                "{deleteTarget.title}"
              </span>
              ? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-60"
              >
                {deleteLoading && <Loader2 size={14} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ListingCard({ listing, onEdit, onDelete }) {
  return (
    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
      {listing.images?.length > 0 ? (
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-40 object-cover"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      ) : (
        <div className="w-full h-40 bg-[#F3E8E2] flex items-center justify-center">
          <Building2 size={36} className="text-orange-300" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[#1F2937] text-sm leading-snug line-clamp-2">
            {listing.title}
          </h3>
          {listing.isVerified && (
            <span className="flex-shrink-0 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Verified
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-[#6B7280]">
          <MapPin size={11} /> {listing.location}
        </div>
        <div className="flex items-center gap-1 mt-0.5 text-xs font-medium text-orange-500">
          LKR {Number(listing.price).toLocaleString()}/mo
        </div>
        {listing.facilities?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {listing.facilities.slice(0, 4).map((f) => (
              <span
                key={f}
                className="text-[10px] bg-[#F3E8E2] text-orange-600 px-1.5 py-0.5 rounded"
              >
                {f}
              </span>
            ))}
            {listing.facilities.length > 4 && (
              <span className="text-[10px] text-[#9CA3AF]">
                +{listing.facilities.length - 4} more
              </span>
            )}
          </div>
        )}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium border border-[#E5E7EB] rounded-lg hover:border-orange-400 hover:text-orange-500 transition-colors text-[#374151]"
          >
            <Pencil size={12} /> Edit
          </button>
          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium border border-[#E5E7EB] rounded-lg hover:border-red-400 hover:text-red-500 transition-colors text-[#374151]"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingRow({ booking, onAction }) {
  const student = booking.studentId;
  const [loading, setLoading] = useState(null); // "confirmed" | "cancelled"

  const handleClick = async (status) => {
    setLoading(status);
    await onAction(booking._id, status);
    setLoading(null);
  };

  return (
    <div className="flex items-center justify-between px-5 py-3.5 gap-4 hover:bg-[#FAFAFA] transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {student?.name?.charAt(0).toUpperCase() || "?"}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#1F2937] truncate">
            {student?.name || "Unknown Student"}
          </p>
          <p className="text-xs text-[#6B7280] truncate">{student?.email}</p>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            {new Date(booking.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[booking.status]}`}
        >
          {booking.status}
        </span>

        {booking.status === "pending" && (
          <>
            <button
              onClick={() => handleClick("confirmed")}
              disabled={!!loading}
              title="Accept"
              className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
            >
              {loading === "confirmed" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle size={16} />
              )}
            </button>
            <button
              onClick={() => handleClick("cancelled")}
              disabled={!!loading}
              title="Reject"
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {loading === "cancelled" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <XCircle size={16} />
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
