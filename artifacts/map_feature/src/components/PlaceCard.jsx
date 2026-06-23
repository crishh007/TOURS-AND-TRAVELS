const categoryColors = {
  food: "bg-orange-100 text-orange-700",
  history: "bg-purple-100 text-purple-700",
  nature: "bg-green-100 text-green-700",
  adventure: "bg-red-100 text-red-700",
  art: "bg-pink-100 text-pink-700",
  shopping: "bg-blue-100 text-blue-700"
};

export default function PlaceCard({ stop, compact = false }) {
  const badgeClass = categoryColors[stop.category] ?? "bg-slate-100 text-slate-700";

  return (
    <div className={`rounded-lg border border-slate-200 bg-white ${compact ? "p-2" : "p-3"}`}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-slate-900">{stop.name}</h4>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${badgeClass}`}>
          {stop.category}
        </span>
      </div>
      <p className="line-clamp-2 text-xs text-slate-600">{stop.description}</p>
      <div className="mt-2 text-xs text-slate-500">
        <span>{stop.duration_hours}h</span>
        <span className="mx-1">•</span>
        <span>${stop.estimated_cost_usd}</span>
      </div>
    </div>
  );
}
