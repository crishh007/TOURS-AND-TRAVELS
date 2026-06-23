import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, Polyline, TileLayer, useMap } from "react-leaflet";
import PlaceCard, { Stop, StopCategory } from "./PlaceCard";
import "leaflet/dist/leaflet.css";

const categoryColors: Record<StopCategory, string> = {
  food: "#f97316",
  history: "#9333ea",
  nature: "#22c55e",
  adventure: "#ef4444",
  art: "#ec4899",
  shopping: "#3b82f6"
};

function createNumberedIcon(index: number, color: string, isHighlighted: boolean) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width:${isHighlighted ? "34px" : "28px"};
      height:${isHighlighted ? "34px" : "28px"};
      border-radius:9999px;
      background:${color};
      border:2px solid white;
      box-shadow:0 2px 10px rgba(0,0,0,0.5);
      display:flex;
      align-items:center;
      justify-content:center;
      color:white;
      font-size:11px;
      font-weight:800;
      transition: all 0.2s ease-in-out;
    ">${index}</div>`,
    iconSize: isHighlighted ? [34, 34] : [28, 28],
    iconAnchor: isHighlighted ? [17, 34] : [14, 28]
  });
}

function FitBounds({ points }: { points: Stop[] }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) {
      return;
    }
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lon]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, points]);
  return null;
}

interface MapViewProps {
  markers: Stop[];
  selectedStop: Stop | null;
  highlightedStop: Stop | null;
  isLoading: boolean;
  noResults: boolean;
}

export default function MapView({
  markers,
  selectedStop,
  highlightedStop,
  isLoading,
  noResults
}: MapViewProps) {
  const defaultCenter: L.LatLngExpression = [20.5937, 78.9629];
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!selectedStop || !mapRef.current) {
      return;
    }
    mapRef.current.flyTo([selectedStop.lat, selectedStop.lon], 14, { duration: 1.2 });
  }, [selectedStop]);

  const line = useMemo<L.LatLngExpression[]>(() => markers.map((m) => [m.lat, m.lon]), [markers]);

  return (
    <div className="relative h-[50vh] min-h-[450px] w-full md:h-full overflow-hidden border border-zinc-200 rounded-2xl bg-zinc-100">
      <MapContainer
        center={defaultCenter}
        zoom={4}
        className="h-full w-full z-10"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {markers.map((stop, idx) => {
          const color = categoryColors[stop.category] ?? "#64748b";
          const isHighlighted = highlightedStop?.name === stop.name;

          return (
            <Marker
              key={`${stop.name}-${idx}`}
              position={[stop.lat, stop.lon]}
              icon={createNumberedIcon(idx + 1, color, isHighlighted)}
            >
              <Popup minWidth={250} className="custom-leaflet-popup">
                <PlaceCard stop={stop} />
              </Popup>
            </Marker>
          );
        })}

        {line.length > 1 && <Polyline positions={line} pathOptions={{ color: "#f59e0b", weight: 3, dashArray: "5, 10" }} />}
        <FitBounds points={markers} />
      </MapContainer>

      {isLoading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-xl bg-zinc-900 border border-white/10 px-5 py-3 shadow-2xl">
            <svg className="animate-spin h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-semibold text-white/95">Plotting route on map...</span>
          </div>
        </div>
      )}

      {noResults && !isLoading && (
        <div className="absolute right-4 top-4 z-40 rounded-xl border border-amber-500/20 bg-amber-500/10 backdrop-blur-md px-4 py-2 text-xs text-amber-400 font-semibold shadow-lg">
          No map stops found. Try another destination.
        </div>
      )}
    </div>
  );
}
