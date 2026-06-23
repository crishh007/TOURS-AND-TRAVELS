import { useState } from "react";
import PlaceCard, { Stop } from "./PlaceCard";

export const INTERESTS = ["Food", "History", "Nature", "Adventure", "Art", "Shopping"];

export const categoryIcons: Record<string, string> = {
  food: "🍜",
  history: "🏛️",
  nature: "🌿",
  adventure: "🧗",
  art: "🎨",
  shopping: "🛍️"
};

export interface DayPlan {
  day: number;
  title: string;
  stops: Stop[];
}

interface ItineraryProps {
  itinerary: DayPlan[];
  totalCost: number;
  onHoverStop?: (stop: Stop | null) => void;
  onSelectStop?: (stop: Stop) => void;
  onOpenCalendarModal: () => void;
  isLoading: boolean;
  noResults: boolean;
}

export default function Itinerary({
  itinerary,
  totalCost,
  onHoverStop,
  onSelectStop,
  onOpenCalendarModal,
  isLoading,
  noResults
}: ItineraryProps) {
  const [openDay, setOpenDay] = useState(1);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="animate-pulse rounded-xl border border-white/5 bg-white/5 p-4">
            <div className="mb-2.5 h-4 w-2/3 rounded-lg bg-white/10" />
            <div className="h-3 w-full rounded bg-white/5" />
          </div>
        ))}
      </div>
    );
  }

  if (noResults) {
    return (
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-400 leading-relaxed">
        No itinerary results were returned. Try a different city or fewer interests.
      </div>
    );
  }

  if (!itinerary.length) {
    return (
      <div className="rounded-xl border border-white/5 bg-white/5 p-4 text-xs text-white/50 leading-relaxed">
        Fill in trip preferences and click "Plan My Map Trip" above to generate a route.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {itinerary.map((day) => {
        const isOpen = openDay === day.day;
        return (
          <div key={day.day} className="overflow-hidden rounded-xl border border-white/5 bg-white/5 backdrop-blur-md">
            <button
              onClick={() => setOpenDay(isOpen ? -1 : day.day)}
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-all"
            >
              <div>
                <p className="text-xs font-bold text-amber-400">Day {day.day}</p>
                <p className="text-sm font-bold text-white leading-snug mt-0.5">{day.title}</p>
              </div>
              <span className="text-[11px] font-semibold text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                {isOpen ? "Hide" : "Show"}
              </span>
            </button>

            {isOpen && (
              <div className="space-y-3 border-t border-white/5 p-3.5 bg-black/20">
                {day.stops.map((stop, idx) => (
                  <button
                    key={`${day.day}-${stop.name}-${idx}`}
                    onMouseEnter={() => onHoverStop?.(stop)}
                    onMouseLeave={() => onHoverStop?.(null)}
                    onClick={() => onSelectStop?.(stop)}
                    className="w-full rounded-xl text-left transition-all hover:ring-2 hover:ring-amber-500/30 block group"
                  >
                    <div className="mb-1.5 flex items-center gap-2 text-[10px] font-bold text-white/50">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white font-bold">
                        {idx + 1}
                      </span>
                      <span>{categoryIcons[stop.category] ?? "📍"}</span>
                      <span className="capitalize text-white/70">{stop.category}</span>
                      <span>•</span>
                      <span>{stop.duration_hours}h</span>
                      <span>•</span>
                      <span>${stop.estimated_cost_usd}</span>
                    </div>
                    <PlaceCard stop={stop} compact />
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="rounded-xl border border-white/5 bg-white/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md">
        <div>
          <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Total Est. Cost</p>
          <p className="text-lg font-black text-white mt-0.5">
            ${Number(totalCost ?? 0).toFixed(2)}
          </p>
        </div>
        <button
          onClick={onOpenCalendarModal}
          className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-xs font-bold text-white hover:opacity-90 active:scale-[0.98] transition-all shadow-md shadow-cyan-500/15"
        >
          📅 Export Calendar Events
        </button>
      </div>
    </div>
  );
}
