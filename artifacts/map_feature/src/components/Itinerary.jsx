import { useState } from "react";
import PlaceCard from "./PlaceCard";

const categoryIcons = {
  food: "🍜",
  history: "🏛️",
  nature: "🌿",
  adventure: "🧗",
  art: "🎨",
  shopping: "🛍️"
};

export default function Itinerary({
  itinerary,
  totalCost,
  onHoverStop,
  onSelectStop,
  onOpenCalendarModal,
  isLoading,
  noResults
}) {
  const [openDay, setOpenDay] = useState(1);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="animate-pulse rounded-lg border border-slate-200 bg-white p-3">
            <div className="mb-2 h-4 w-2/3 rounded bg-slate-200" />
            <div className="h-3 w-full rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  if (noResults) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        No itinerary results were returned. Try a different city or fewer constraints.
      </div>
    );
  }

  if (!itinerary.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-500">
        Fill in trip preferences and click "Plan My Trip".
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {itinerary.map((day) => {
        const isOpen = openDay === day.day;
        return (
          <div key={day.day} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <button
              onClick={() => setOpenDay(isOpen ? -1 : day.day)}
              className="flex w-full items-center justify-between px-3 py-2 text-left"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">Day {day.day}</p>
                <p className="text-xs text-slate-600">{day.title}</p>
              </div>
              <span className="text-xs text-slate-500">{isOpen ? "Hide" : "Show"}</span>
            </button>

            {isOpen && (
              <div className="space-y-2 border-t border-slate-100 p-3">
                {day.stops.map((stop, idx) => (
                  <button
                    key={`${day.day}-${stop.name}-${idx}`}
                    onMouseEnter={() => onHoverStop?.(stop)}
                    onMouseLeave={() => onHoverStop?.(null)}
                    onClick={() => onSelectStop?.(stop)}
                    className="w-full rounded-lg text-left transition hover:ring-2 hover:ring-sky-200"
                  >
                    <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold">
                        {idx + 1}
                      </span>
                      <span>{categoryIcons[stop.category] ?? "📍"}</span>
                      <span className="capitalize">{stop.category}</span>
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

      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <p className="text-sm font-semibold text-slate-800">
          Total Estimated Cost: ${Number(totalCost ?? 0).toFixed(2)}
        </p>
        <button
          onClick={onOpenCalendarModal}
          className="mt-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Save to Calendar
        </button>
      </div>
    </div>
  );
}
