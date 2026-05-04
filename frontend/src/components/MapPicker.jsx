import { useState, useCallback, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, Loader2, MapPin } from "lucide-react";

// Fix default marker icons broken by Vite's asset handling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Default center: Sri Lanka
const DEFAULT_CENTER = [7.8731, 80.7718];

// Internal component: handles map click events and re-centering
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

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
  const hasPin = lat != null && lng != null;
  const [mapCenter, setMapCenter] = useState(
    hasPin ? [lat, lng] : DEFAULT_CENTER,
  );
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");

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
        setMapCenter([newLat, newLng]);
        onPinChange(newLat, newLng);
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
    (newLat, newLng) => {
      setMapCenter([newLat, newLng]);
      onPinChange(newLat, newLng);
    },
    [onPinChange],
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
        <MapContainer
          center={mapCenter}
          zoom={hasPin ? 15 : 7}
          style={{ width: "100%", height: "220px" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onMapClick={handleMapClick} />
          <RecenterMap center={mapCenter} />
          {hasPin && <Marker position={[lat, lng]} />}
        </MapContainer>
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
