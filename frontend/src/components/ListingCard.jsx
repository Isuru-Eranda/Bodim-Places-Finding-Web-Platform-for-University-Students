import { Link } from 'react-router-dom';
import { MapPin, Star, Wifi, Car, UtensilsCrossed, ShieldCheck } from 'lucide-react';

const FACILITY_ICONS = {
  WiFi: Wifi,
  Parking: Car,
  Kitchen: UtensilsCrossed,
  Security: ShieldCheck,
};

const PLACEHOLDER = 'https://placehold.co/400x250/F3E8E2/8B5E3C?text=No+Image';

export default function ListingCard({ listing }) {
  const {
    title = 'Boarding Place',
    location = 'Unknown Location',
    price = 0,
    rating = 0,
    images = [],
    facilities = [],
  } = listing;

  const imageUrl = images && images.length > 0 ? images[0] : PLACEHOLDER;
  const displayRating = typeof rating === 'number' ? rating.toFixed(1) : '0.0';

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
            <ShieldCheck size={10} />
            Verified
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 bg-white/90 text-[#1F2937] text-xs font-medium rounded-full border border-[#E5E7EB]">
            360° View
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-[#1F2937] text-base leading-tight line-clamp-1">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-[#6B7280] text-sm">
          <MapPin size={13} className="text-orange-400 flex-shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* Price & Rating */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-orange-500 font-bold text-lg">
              LKR {Number(price).toLocaleString()}
            </span>
            <span className="text-[#6B7280] text-xs">/month</span>
          </div>
          <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
            <Star size={12} className="text-orange-500 fill-orange-500" />
            <span className="text-sm font-semibold text-[#1F2937]">{displayRating}</span>
          </div>
        </div>

        {/* Facilities */}
        {facilities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[#E5E7EB]">
            {facilities.slice(0, 4).map((facility) => {
              const Icon = FACILITY_ICONS[facility];
              return (
                <span
                  key={facility}
                  className="flex items-center gap-1 px-2 py-0.5 bg-brown-50 text-brown-600 text-xs rounded-full"
                >
                  {Icon && <Icon size={10} />}
                  {facility}
                </span>
              );
            })}
            {facilities.length > 4 && (
              <span className="px-2 py-0.5 bg-[#F3F4F6] text-[#6B7280] text-xs rounded-full">
                +{facilities.length - 4}
              </span>
            )}
          </div>
        )}

        {/* View Button */}
        <Link
          to={`/listings/${listing._id}`}
          className="block w-full py-2 text-sm font-medium text-center text-orange-500 border border-orange-200 rounded-xl hover:bg-orange-50 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
