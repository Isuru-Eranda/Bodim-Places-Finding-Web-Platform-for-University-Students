import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import ListingCard from "./ListingCard";

const MOCK_LISTINGS = [
  {
    _id: "mock-1",
    title: "Sunny Room Near University of Colombo",
    location: "Colombo 07, Near University of Colombo",
    price: 12000,
    rating: 4.8,
    images: ["https://placehold.co/400x250/FFEDD5/EA580C?text=Room+1"],
    facilities: ["WiFi", "Kitchen", "Security"],
  },
  {
    _id: "mock-2",
    title: "Modern Boarding House — Peradeniya",
    location: "Kandy, Near University of Peradeniya",
    price: 9500,
    rating: 4.5,
    images: ["https://placehold.co/400x250/F3E8E2/8B5E3C?text=Room+2"],
    facilities: ["WiFi", "Parking", "Laundry"],
  },
  {
    _id: "mock-3",
    title: "Affordable Single Room — Moratuwa",
    location: "Moratuwa, Near University of Moratuwa",
    price: 8000,
    rating: 4.2,
    images: ["https://placehold.co/400x250/FFF7ED/F97316?text=Room+3"],
    facilities: ["WiFi", "Kitchen"],
  },
  {
    _id: "mock-4",
    title: "Spacious Double Room — Kelaniya",
    location: "Kelaniya, Near University of Kelaniya",
    price: 11000,
    rating: 4.6,
    images: ["https://placehold.co/400x250/F3E8E2/6B3E26?text=Room+4"],
    facilities: ["WiFi", "Parking", "Security", "Kitchen"],
  },
];

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <svg
        className="animate-spin w-10 h-10 text-orange-500"
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
      <p className="text-[#6B7280] text-sm">Loading listings...</p>
    </div>
  );
}

export default function ListingsSection({ listings, loading, error }) {
  const displayListings =
    listings === null
      ? MOCK_LISTINGS
      : listings.length > 0
        ? listings.slice(0, 4)
        : [];

  return (
    <section className="bg-[#FFFDFB] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#1F2937]">
              Popular Listings
            </h2>
            <p className="text-[#6B7280] text-sm mt-1">
              {listings && listings.length > 0
                ? `Showing ${Math.min(listings.length, 4)} of ${listings.length} results`
                : "Discover top-rated boarding places near universities"}
            </p>
          </div>
          <Link
            to="/browse"
            className="text-sm font-medium text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
          >
            View All
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Loading */}
        {loading && <Spinner />}

        {/* Error */}
        {!loading && error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-6">
            <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayListings.map((listing) => (
              <ListingCard key={listing._id || listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && !error && listings && listings.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F97316"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
              No listings found
            </h3>
            <p className="text-[#6B7280] text-sm">
              Try adjusting your search filters to find more options.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
