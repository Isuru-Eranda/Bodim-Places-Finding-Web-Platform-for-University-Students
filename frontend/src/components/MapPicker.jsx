import { useState, useCallback, useRef } from "react";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { Search, Loader2, MapPin } from "lucide-react";

// Stable reference — must not be defined inline or inside a component
const LIBRARIES = [];

const MAP_CONTAINER_STYLE = { width: "100%", height: "220px" };

// Default center: Sri Lanka
const DEFAULT_CENTER = { lat: 7.8731, lng: 80.7718 };

const MAP_OPTIONS = {
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
export default function MapPicker({ address, lat, lng, onAddressChange, onPinChange }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBRARIES,
  });

  const hasPin = lat != null && lng != null;
  const [mapCenter, setMapCenter] = useState(hasPin ? { lat, lng } : DEFAULT_CENTER);
  const [geocoding, setGeocoding] = useState(false);
  const geocoderRef = useRef(null);

  const handleSearch = useCallback(() => {
    if (!address.trim() || !window.google) return;
    setGeocoding(true);
    if (!geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }
    geocoderRef.current.geocode({ address }, (results, status) => {
      setGeocoding(false);
      if (status === "OK" && results[0]) {
        const loc = results[0].geometry.location;
        const newLat = loc.lat();
        const newLng = loc.lng();
        setMapCenter({ lat: newLat, lng: newLng });
        onPinChange(newLat, newLng);
      }
    });
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
      setMapCenter({ lat: newLat, lng: newLng });
      onPinChange(newLat, newLng);
    },
    [onPinChange]
  );

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
          disabled={geocoding || !isLoaded || !address.trim()}
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

      {/* Map */}
      {loadError ? (
        <div className="w-full h-[220px] bg-red-50 rounded-xl flex items-center justify-center text-xs text-red-500">
          Failed to load Google Maps. Check your API key.
        </div>
      ) : !isLoaded ? (
        <div className="w-full h-[220px] bg-[#F3F4F6] rounded-xl flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-orange-400" />
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden border border-[#E5E7EB]">
          <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={mapCenter}
            zoom={hasPin ? 15 : 7}
            onClick={handleMapClick}
            options={MAP_OPTIONS}
          >
            {hasPin && <Marker position={{ lat, lng }} />}
          </GoogleMap>
        </div>
      )}

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
