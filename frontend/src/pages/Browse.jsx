import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import ListingCard from '../components/ListingCard';
import { getListings } from '../services/api';

const DEBOUNCE_MS = 400;

const FACILITIES_OPTIONS = ['WiFi', 'Parking', 'Kitchen', 'Laundry', 'Security', 'Water'];

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'oldest',     label: 'Oldest First' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'price_asc',  label: 'Price: Low to High' },
];

const PRICE_PRESETS = [
  { label: 'Any', min: '', max: '' },
  { label: 'Under 8k', min: '', max: '8000' },
  { label: '8k – 12k', min: '8000', max: '12000' },
  { label: '12k – 20k', min: '12000', max: '20000' },
  { label: 'Above 20k', min: '20000', max: '' },
];

const ITEMS_PER_PAGE = 9;

const DEFAULT_FILTERS = {
  search: '',
  location: '',
  minPrice: '',
  maxPrice: '',
  facilities: [],
  isVerified: false,
  sort: 'newest',
};

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <svg className="animate-spin w-10 h-10 text-orange-500" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      <p className="text-[#6B7280] text-sm">Loading listings...</p>
    </div>
  );
}

function EmptyState({ onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
        <Search size={28} className="text-orange-300" />
      </div>
      <div>
        <p className="text-[#1F2937] font-semibold text-lg">No listings found</p>
        <p className="text-[#6B7280] text-sm mt-1">
          Try adjusting your filters or search terms
        </p>
      </div>
      <button
        onClick={onClear}
        className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
}

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const delta = 2;
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);
  const pages = [1];
  if (left > 2) pages.push('...');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push('...');
  pages.push(total);
  return pages;
}

// FilterPanel is defined outside Browse to avoid focus-loss on re-render.
// Receives the full filters state + granular change handlers.
function FilterPanel({ filters, onTextChange, onChange, onClear }) {
  const toggleFacility = (f) => {
    const next = filters.facilities.includes(f)
      ? filters.facilities.filter((x) => x !== f)
      : [...filters.facilities, f];
    onChange({ facilities: next });
  };

  return (
    <div className="space-y-6">
      {/* Keyword Search */}
      <div>
        <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
          Keyword Search
        </label>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="e.g. near university..."
            value={filters.search}
            onChange={(e) => onTextChange('search', e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 bg-[#FAFAFA]"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
          Location
        </label>
        <div className="relative">
          <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="e.g. Colombo, Kandy..."
            value={filters.location}
            onChange={(e) => onTextChange('location', e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 bg-[#FAFAFA]"
          />
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
          Price Range (LKR / month)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            min="0"
            value={filters.minPrice}
            onChange={(e) => onTextChange('minPrice', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 bg-[#FAFAFA]"
          />
          <input
            type="number"
            placeholder="Max"
            min="0"
            value={filters.maxPrice}
            onChange={(e) => onTextChange('maxPrice', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 bg-[#FAFAFA]"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {PRICE_PRESETS.map((preset) => {
            const active =
              filters.minPrice === preset.min && filters.maxPrice === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() =>
                  onChange({ minPrice: preset.min, maxPrice: preset.max })
                }
                className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                  active
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-orange-300'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Facilities */}
      <div>
        <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
          Facilities
        </label>
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-2">
          {FACILITIES_OPTIONS.map((f) => (
            <label key={f} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.facilities.includes(f)}
                onChange={() => toggleFacility(f)}
                className="w-3.5 h-3.5 accent-orange-500 flex-shrink-0"
              />
              <span className="text-sm text-[#374151] group-hover:text-orange-500 transition-colors">
                {f}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Verified Only */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.isVerified}
            onChange={(e) => onChange({ isVerified: e.target.checked })}
            className="w-3.5 h-3.5 accent-orange-500"
          />
          <ShieldCheck size={14} className="text-orange-500" />
          <span className="text-sm font-medium text-[#374151]">Verified Listings Only</span>
        </label>
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-[#E5E7EB]">
        <button
          onClick={onClear}
          className="w-full py-2.5 border border-[#E5E7EB] text-[#6B7280] text-sm rounded-xl hover:bg-gray-50 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}

export default function Browse() {
  // `filters` = what the inputs show (UI state, updates immediately)
  // `query`   = what's actually sent to the API (lags behind for text inputs)
  // Separating them means: sort/checkboxes/presets update the API immediately,
  // while typing debounces the API call without messing up controlled inputs.
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });
  const [query, setQuery] = useState({ ...DEFAULT_FILTERS });
  const [page, setPage] = useState(1);
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const debounceRef = useRef(null);

  // ─── API Fetch ─────────────────────────────────────────────────────────────
  // Runs whenever `query` or `page` changes. AbortController cancels the
  // previous in-flight request so stale responses never overwrite fresh ones.
  useEffect(() => {
    const controller = new AbortController();

    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { sort: query.sort, page, limit: ITEMS_PER_PAGE };
        if (query.search)            params.search     = query.search;
        if (query.location)          params.location   = query.location;
        if (query.minPrice)          params.minPrice   = query.minPrice;
        if (query.maxPrice)          params.maxPrice   = query.maxPrice;
        if (query.facilities.length) params.facilities = query.facilities.join(',');
        if (query.isVerified)        params.isVerified = 'true';

        const res = await getListings(params, controller.signal);
        const resData = res.data;
        if (resData && Array.isArray(resData.data)) {
          setListings(resData.data);
          setTotal(resData.total ?? resData.data.length);
          setPages(resData.pages ?? 1);
        } else {
          const arr = Array.isArray(resData) ? resData : [];
          setListings(arr);
          setTotal(arr.length);
          setPages(1);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.response?.data?.message || 'Failed to load listings. Please try again.');
          setListings([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchListings();
    return () => controller.abort();
  }, [query, page]);

  // ─── Text field handler ───────────────────────────────────────────────────
  // Updates the input immediately (controlled), but delays the API call.
  const handleTextChange = useCallback((field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery((prev) => ({ ...prev, [field]: value }));
      setPage(1);
    }, DEBOUNCE_MS);
  }, []);

  // ─── Immediate change handler (sort, checkboxes, price presets) ──────────
  const handleChange = useCallback((updates) => {
    clearTimeout(debounceRef.current);
    setFilters((prev) => ({ ...prev, ...updates }));
    setQuery((prev) => ({ ...prev, ...updates }));
    setPage(1);
  }, []);

  // ─── Clear all ───────────────────────────────────────────────────────────
  const handleClear = useCallback(() => {
    clearTimeout(debounceRef.current);
    setFilters({ ...DEFAULT_FILTERS });
    setQuery({ ...DEFAULT_FILTERS });
    setPage(1);
    setDrawerOpen(false);
  }, []);

  // ─── Remove single chip ──────────────────────────────────────────────────
  const removeChip = useCallback((key, value) => {
    clearTimeout(debounceRef.current);
    const updates =
      key === 'facility'
        ? { facilities: filters.facilities.filter((f) => f !== value) }
        : key === 'price'
        ? { minPrice: '', maxPrice: '' }
        : { [key]: DEFAULT_FILTERS[key] };
    setFilters((prev) => ({ ...prev, ...updates }));
    setQuery((prev) => ({ ...prev, ...updates }));
    setPage(1);
  }, [filters.facilities]);

  const activeCount =
    (filters.search ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.minPrice || filters.maxPrice ? 1 : 0) +
    filters.facilities.length +
    (filters.isVerified ? 1 : 0);

  const pageNumbers = getPageNumbers(page, pages);

  return (
    <div className="bg-[#FFFDFB] min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#1F2937]">Browse Listings</h1>
          <p className="text-[#6B7280] text-sm mt-1">
            Find verified boarding places near universities across Sri Lanka
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sticky top-20">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-[#1F2937]">Filters</h2>
                {activeCount > 0 && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                    {activeCount} active
                  </span>
                )}
              </div>
              <FilterPanel
                filters={filters}
                onTextChange={handleTextChange}
                onChange={handleChange}
                onClear={handleClear}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-4">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal size={14} />
                Filters
                {activeCount > 0 && (
                  <span className="bg-orange-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
              </button>

              {/* Results count */}
              <p className="text-[#6B7280] text-sm flex-1">
                {loading
                  ? 'Searching...'
                  : `${total.toLocaleString()} listing${total !== 1 ? 's' : ''} found`}
              </p>

              {/* Sort dropdown */}
              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={(e) => handleChange({ sort: e.target.value })}
                  className="pl-3 pr-8 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white text-[#374151] focus:outline-none focus:ring-2 focus:ring-orange-300 appearance-none cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
                />
              </div>
            </div>

            {/* Active filter chips */}
            {activeCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.search && (
                  <Chip
                    label={`Search: "${filters.search}"`}
                    onRemove={() => removeChip('search')}
                  />
                )}
                {filters.location && (
                  <Chip
                    label={`Location: ${filters.location}`}
                    onRemove={() => removeChip('location')}
                  />
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <Chip
                    label={`Price: ${filters.minPrice ? `LKR ${Number(filters.minPrice).toLocaleString()}` : '0'} – ${filters.maxPrice ? `LKR ${Number(filters.maxPrice).toLocaleString()}` : '∞'}`}
                    onRemove={() => removeChip('price')}
                  />
                )}
                {filters.facilities.map((f) => (
                  <Chip key={f} label={f} onRemove={() => removeChip('facility', f)} />
                ))}
                {filters.isVerified && (
                  <Chip label="Verified Only" onRemove={() => removeChip('isVerified')} />
                )}
                <button
                  onClick={handleClear}
                  className="px-3 py-1 text-xs text-[#6B7280] hover:text-red-500 transition-colors underline self-center"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Results */}
            {loading ? (
              <Spinner />
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <p className="text-red-500 text-sm">{error}</p>
                <button
                  onClick={() => setQuery((q) => ({ ...q }))}
                  className="text-orange-500 text-sm underline"
                >
                  Retry
                </button>
              </div>
            ) : listings.length === 0 ? (
              <EmptyState onClear={handleClear} />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {listings.map((listing) => (
                    <ListingCard key={listing._id} listing={listing} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-10">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>

                    {pageNumbers.map((p, idx) =>
                      p === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-[#9CA3AF] text-sm select-none">
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                            page === p
                              ? 'bg-orange-500 text-white'
                              : 'border border-[#E5E7EB] text-[#374151] hover:bg-gray-50'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => setPage((p) => Math.min(pages, p + 1))}
                      disabled={page === pages}
                      className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] flex-shrink-0">
              <h2 className="font-semibold text-[#1F2937]">Filters</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterPanel
                filters={filters}
                onTextChange={handleTextChange}
                onChange={handleChange}
                onClear={handleClear}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 text-xs rounded-full border border-orange-200">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-orange-900 flex items-center transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X size={11} />
      </button>
    </span>
  );
}
