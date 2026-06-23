import { useEffect, useState, FormEvent } from "react";
import { INTERESTS } from "./Itinerary";

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface TripFormProps {
  onSubmit: (preferences: { city: string; lat?: number; lon?: number; interests: string[]; budget: string; days: number }) => void;
  isLoading: boolean;
  error: string;
  onRetry: () => void;
  missingApiKey: boolean;
}

export default function TripForm({ onSubmit, isLoading, error, onRetry, missingApiKey }: TripFormProps) {
  const [city, setCity] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<Suggestion[]>([]);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat?: number; lon?: number }>({});
  const [interests, setInterests] = useState<string[]>(["Food", "History"]);
  const [budget, setBudget] = useState("medium");
  const [days, setDays] = useState(3);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (city.trim().length < 2) {
        setCitySuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            city
          )}&format=json&limit=5`,
          {
            headers: { "User-Agent": "WanderIndiaPlanner/1.0" }
          }
        );
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setCitySuggestions(data.map((item: any) => ({
          display_name: item.display_name,
          lat: item.lat,
          lon: item.lon
        })));
      } catch {
        setCitySuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [city]);

  const toggleInterest = (interest: string) => {
    setInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((i) => i !== interest);
      }
      return [...prev, interest];
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!city.trim()) {
      return;
    }
    onSubmit({
      city: city.trim(),
      lat: selectedCoordinates.lat,
      lon: selectedCoordinates.lon,
      interests,
      budget,
      days
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-white/50 uppercase tracking-wider">City / Destination</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Type a city name (e.g. Udaipur, Goa)..."
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 h-12 text-sm text-white placeholder:text-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
        />
        {citySuggestions.length > 0 && (
          <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-white/10 bg-zinc-900/90 backdrop-blur-md shadow-2xl z-50 relative">
            {citySuggestions.map((suggestion) => (
              <button
                key={suggestion.display_name}
                type="button"
                onClick={() => {
                  setCity(suggestion.display_name);
                  setSelectedCoordinates({
                    lat: parseFloat(suggestion.lat),
                    lon: parseFloat(suggestion.lon)
                  });
                  setCitySuggestions([]);
                }}
                className="block w-full border-b border-white/5 px-4 py-2.5 text-left text-xs text-white/70 last:border-b-0 hover:bg-white/5 hover:text-white transition-all"
              >
                {suggestion.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold text-white/50 uppercase tracking-wider">Interests</label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => {
            const selected = interests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`rounded-xl px-3 py-2 text-xs font-medium border transition-all ${
                  selected
                    ? "bg-amber-500/20 border-amber-500/30 text-amber-400"
                    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold text-white/50 uppercase tracking-wider">Budget Level</label>
        <div className="flex gap-2">
          {["low", "medium", "high"].map((value) => {
            const selected = budget === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setBudget(value)}
                className={`flex-1 rounded-xl py-2.5 text-xs font-medium capitalize border transition-all ${
                  selected
                    ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400 font-bold"
                    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-white/50 uppercase tracking-wider flex justify-between">
          <span>Duration</span>
          <span className="text-amber-400 font-bold">{days} Days</span>
        </label>
        <input
          type="range"
          min="1"
          max="7"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="w-full accent-amber-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
          <p className="leading-relaxed">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2.5 rounded-lg bg-red-500/20 border border-red-500/30 px-3 py-1.5 text-xs font-semibold hover:bg-red-500/30 transition-all text-red-300"
          >
            Retry Planning
          </button>
        </div>
      )}

      {missingApiKey && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-400 leading-relaxed">
          💡 Gemini key is set up! We will use your workspace Gemini API key to generate the itinerary.
        </div>
      )}

      <button
        disabled={isLoading || interests.length === 0}
        className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 h-12 text-sm font-bold text-black hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-500/15"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating Itinerary...
          </span>
        ) : (
          "Plan My Map Trip"
        )}
      </button>
    </form>
  );
}
