import { useEffect, useState } from "react";

const INTERESTS = ["Food", "History", "Nature", "Adventure", "Art", "Shopping"];

export default function TripForm({ onSubmit, isLoading, error, onRetry, missingApiKey }) {
  const [city, setCity] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [interests, setInterests] = useState(["Food", "History"]);
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
            headers: { "User-Agent": "TravelPlanner/1.0" }
          }
        );
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        setCitySuggestions(data.map((item) => item.display_name));
      } catch {
        setCitySuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [city]);

  const toggleInterest = (interest) => {
    setInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((i) => i !== interest);
      }
      return [...prev, interest];
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!city.trim()) {
      return;
    }
    onSubmit({
      city: city.trim(),
      interests,
      budget,
      days
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">City</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search city..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
        />
        {citySuggestions.length > 0 && (
          <div className="mt-1 max-h-32 overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm">
            {citySuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setCity(suggestion);
                  setCitySuggestions([]);
                }}
                className="block w-full border-b border-slate-100 px-3 py-2 text-left text-xs text-slate-600 last:border-b-0 hover:bg-slate-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Interests</label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => {
            const selected = interests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  selected
                    ? "bg-sky-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Budget</label>
        <div className="flex gap-2">
          {["low", "medium", "high"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setBudget(value)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium capitalize ${
                budget === value
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Duration: <span className="font-semibold">{days}</span> days
        </label>
        <input
          type="range"
          min="1"
          max="7"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="w-full accent-sky-600"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {missingApiKey && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          API key required. Add `VITE_OPENROUTER_API_KEY` (or `VITE_XAI_API_KEY` / `VITE_OPENAI_API_KEY` / `VITE_ANTHROPIC_API_KEY`) in `frontend/.env`, then restart `npm run dev`.
        </div>
      )}

      <button
        disabled={isLoading || interests.length === 0}
        className="flex w-full items-center justify-center rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {isLoading ? "Planning..." : "Plan My Trip"}
      </button>
    </form>
  );
}
