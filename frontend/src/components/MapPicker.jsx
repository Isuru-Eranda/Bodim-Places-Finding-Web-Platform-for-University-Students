import { useState, useCallback, useRef } from "react";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { Search, Loader2, MapPin } from "lucide-react";

// Default center: Sri Lanka
const DEFAULT_CENTER = { lat: 7.8731, lng: 80.7718 };
const MAP_LIBS = [];
const MAP_CONTAINER_STYLE = { width: "100%", height: "220px" };
const MAP_OPTIONS = {
  gestureHandling: "cooperative",
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

/**
 * MapPicker
 *
 * Props:
 *   address        {string}           - controlled text input value (location name)
 *   lat            {number|null}      - current pin latitude
 *   lng            {number|null}      - current pin longitude
 *   onAddressChange(text)             - called when user edits the address input
 *   onPinChange(lat, lng)             - called when pin position changes (click or geocode)
 */
export default function MapPicker({
  address,
  lat,
  lng,
  onAddressChange,
  onPinChange,
}) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: MAP_LIBS,
  });

  const hasPin = lat != null && lng != null;
  const pinPos = hasPin ? { lat, lng } : null;
  const center = hasPin ? { lat, lng } : DEFAULT_CENTER;

  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");
  const mapRef = useRef(null);

  const handleSearch = useCallback(async () => {
    if (!address.trim()) return;
    setGeocoding(true);
    setGeocodeError("");
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
        { headers: { "Accept-Language": "en" } },
      );
      const results = await res.json();
      if (results.length > 0) {
        const newLat = parseFloat(results[0].lat);
        const newLng = parseFloat(results[0].lon);
        onPinChange(newLat, newLng);
        mapRef.current?.panTo({ lat: newLat, lng: newLng });
        mapRef.current?.setZoom(15);
      } else {
        setGeocodeError("Location not found. Try a more specific name.");
      }
    } catch {
      setGeocodeError("Search failed. Check your connection.");
    } finally {
      setGeocoding(false);
    }
  }, [address, onPinChange]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleMapClick = useCallback(
    (e) => {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      onPinChange(newLat, newLng);
    },
    [onPinChange],
  );

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  return (
    <div className="space-y-2">
      {/* Address search row */}
      <div className="flex gap-2">
        <input
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Kandy, Sri Lanka"
          required
          className="flex-1 border border-[#D1D5DB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={geocoding || !address.trim()}
          className="flex items-center gap-1.5 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-60 flex-shrink-0"
        >
          {geocoding ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Search size={14} />
          )}
          Find
        </button>
      </div>

      {geocodeError && (
        <p className="text-[10px] text-red-500">{geocodeError}</p>
      )}

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-[#E5E7EB]">
        {!isLoaded ? (
          <div
            className="w-full bg-[#F3F4F6] flex items-center justify-center"
            style={{ height: "220px" }}
          >
            <Loader2 className="animate-spin w-6 h-6 text-orange-400" />
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={center}
            zoom={hasPin ? 15 : 7}
            options={MAP_OPTIONS}
            onClick={handleMapClick}
            onLoad={onMapLoad}
          >
            {pinPos && <Marker position={pinPos} />}
          </GoogleMap>
        )}
      </div>

      {/* Pin status hint */}
      {hasPin ? (
        <p className="flex items-center gap-1 text-[10px] text-green-600">
          <MapPin size={10} />
          Pin set ({lat.toFixed(5)}, {lng.toFixed(5)}) — click map to reposition
        </p>
      ) : (
        <p className="text-[10px] text-[#9CA3AF]">
          Search an address or click anywhere on the map to drop a pin
        </p>
      )}
    </div>
  );
}
