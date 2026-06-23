export type StopCategory = 'food' | 'history' | 'nature' | 'adventure' | 'art' | 'shopping';

export interface Stop {
  name: string;
  description: string;
  lat: number;
  lon: number;
  duration_hours: number;
  estimated_cost_usd: number;
  category: StopCategory;
}

interface PlaceCardProps {
  stop: Stop;
  compact?: boolean;
}

const categoryColors: Record<StopCategory, string> = {
  food: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  history: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  nature: "bg-green-500/10 text-green-400 border border-green-500/20",
  adventure: "bg-red-500/10 text-red-400 border border-red-500/20",
  art: "bg-pink-500/10 text-pink-400 border border-pink-500/20",
  shopping: "bg-blue-500/10 text-blue-400 border border-blue-500/20"
};

export default function PlaceCard({ stop, compact = false }: PlaceCardProps) {
  const badgeClass = categoryColors[stop.category] ?? "bg-white/10 text-white/80 border border-white/10";

  return (
    <div className={`rounded-xl border border-white/5 bg-black/60 backdrop-blur-md text-white ${compact ? "p-2" : "p-3"}`}>
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <h4 className="text-sm font-bold text-white line-clamp-1 leading-tight">{stop.name}</h4>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize whitespace-nowrap ${badgeClass}`}>
          {stop.category}
        </span>
      </div>
      <p className="line-clamp-2 text-xs text-white/70">{stop.description}</p>
      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-white/50">
        <span>⏱️ {stop.duration_hours}h</span>
        <span>•</span>
        <span>💵 ${stop.estimated_cost_usd}</span>
      </div>
    </div>
  );
}
