import { useState } from "react";
import { Search, MapPin, DollarSign, Zap } from "lucide-react";
import { getListings } from "../services/api";

const FACILITIES_OPTIONS = [
  "WiFi",
  "Parking",
  "Kitchen",
  "Laundry",
  "Security",
  "Water",
];

export default function SearchBox({ setListings, setLoading, setError }) {
  const [form, setForm] = useState({
    location: "",
    maxPrice: "",
    facilities: [],
  });
  const [searching, setSearching] = useState(false);
  const [inlineError, setInlineError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleFacility = (facility) => {
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSearching(true);
    setInlineError(null);
    setLoading(true);
    setError(null);

    const params = {};
    if (form.location) params.search = form.location;
    if (form.maxPrice) params.maxPrice = form.maxPrice;
    if (form.facilities.length > 0)
      params.facilities = form.facilities.join(",");

    try {
      const res = await getListings(params);
      setListings(res.data?.data || res.data || []);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Search failed. Please try again.";
      setInlineError(msg);
      setError(msg);
    } finally {
      setSearching(false);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-[#E5E7EB] p-6">
      {/* Card Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
          <Search size={16} className="text-orange-500" />
        </div>
        <div>
          <h3 className="font-semibold text-[#1F2937] text-sm">
            Find Your Boarding Place
          </h3>
          <p className="text-xs text-[#6B7280]">
            Search from 1,250+ verified listings
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Location */}
        <div>
          <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
            Location / University
          </label>
          <div className="relative">
            <MapPin
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
            />
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. University of Colombo"
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-[#1F2937] placeholder-[#9CA3AF] bg-[#FFFDFB]"
            />
          </div>
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
            Max Price (LKR/month)
          </label>
          <div className="relative">
            <DollarSign
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
            />
            <input
              type="number"
              name="maxPrice"
              value={form.maxPrice}
              onChange={handleChange}
              placeholder="e.g. 15000"
              min="0"
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-[#1F2937] placeholder-[#9CA3AF] bg-[#FFFDFB]"
            />
          </div>
        </div>

        {/* Facilities */}
        <div>
          <label className="block text-xs font-medium text-[#6B7280] mb-1.5">
            Facilities
          </label>
          <div className="flex flex-wrap gap-2">
            {FACILITIES_OPTIONS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => toggleFacility(f)}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                  form.facilities.includes(f)
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-orange-400 hover:text-orange-500"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Inline Error */}
        {inlineError && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {inlineError}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={searching}
          className="w-full py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {searching ? (
            <>
              <svg
                className="animate-spin w-4 h-4"
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
              Searching...
            </>
          ) : (
            <>
              <Search size={16} />
              Search Listings
            </>
          )}
        </button>

        {/* AI Hint */}
        <p className="text-center text-xs text-[#6B7280] flex items-center justify-center gap-1">
          <Zap size={11} className="text-orange-400" />
          AI-powered matching finds your best options
        </p>
      </form>
    </div>
  );
}
