import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, Polyline, TileLayer, useMap } from "react-leaflet";
import PlaceCard from "./PlaceCard";

const categoryColors = {
  food: "#f97316",
  history: "#9333ea",
  nature: "#22c55e",
  adventure: "#ef4444",
  art: "#ec4899",
  shopping: "#3b82f6"
};

function createNumberedIcon(index, color, isHighlighted) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width:${isHighlighted ? "34px" : "28px"};
      height:${isHighlighted ? "34px" : "28px"};
      border-radius:9999px;
      background:${color};
      border:2px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.25);
      display:flex;
      align-items:center;
      justify-content:center;
      color:white;
      font-size:12px;
      font-weight:700;
    ">${index}</div>`,
    iconSize: isHighlighted ? [34, 34] : [28, 28],
    iconAnchor: isHighlighted ? [17, 34] : [14, 28]
  });
}

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) {
      return;
    }
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lon]));
    map.fitBounds(bounds, { padding: [30, 30] });
  }, [map, points]);
  return null;
}

export default function MapView({
  markers,
  selectedStop,
  highlightedStop,
  isLoading,
  noResults
}) {
  const defaultCenter = [20.5937, 78.9629];
  const mapRef = useRef(null);

  useEffect(() => {
    if (!selectedStop || !mapRef.current) {
      return;
    }
    mapRef.current.flyTo([selectedStop.lat, selectedStop.lon], 14, { duration: 1.2 });
  }, [selectedStop]);

  const line = useMemo(() => markers.map((m) => [m.lat, m.lon]), [markers]);

  return (
    <div className="relative h-[50vh] min-h-[420px] w-full md:h-full">
      <MapContainer
        center={defaultCenter}
        zoom={4}
        className="h-full w-full rounded-none md:rounded-l-2xl"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((stop, idx) => {
          const color = categoryColors[stop.category] ?? "#334155";
          const isHighlighted = highlightedStop?.name === stop.name;

          return (
            <Marker
              key={`${stop.name}-${idx}`}
              position={[stop.lat, stop.lon]}
              icon={createNumberedIcon(idx + 1, color, isHighlighted)}
            >
              <Popup minWidth={230}>
                <PlaceCard stop={stop} />
              </Popup>
            </Marker>
          );
        })}

        {line.length > 1 && <Polyline positions={line} pathOptions={{ color: "#0ea5e9", weight: 4 }} />}
        <FitBounds points={markers} />
      </MapContainer>

      {isLoading && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center bg-white/60">
          <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" />
            <span className="text-sm font-medium text-slate-600">Planning route...</span>
          </div>
        </div>
      )}

      {noResults && !isLoading && (
        <div className="absolute right-3 top-3 z-[999] rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          No map stops found yet. Try another city.
        </div>
      )}
    </div>
  );
}
