import { useMemo, useState } from "react";
import Itinerary from "./components/Itinerary";
import MapView from "./components/MapView";
import TripForm from "./components/TripForm";

const SYSTEM_PROMPT = `You are an expert travel planner. When given a city, interests, budget, and duration,
return ONLY a valid JSON itinerary (no markdown, no explanation) with this exact shape:
{
  itinerary: [{
    day: number,
    title: string,
    stops: [{
      name: string,
      description: string,
      lat: number,
      lon: number,
      duration_hours: number,
      estimated_cost_usd: number,
      category: 'food' | 'history' | 'nature' | 'adventure' | 'art' | 'shopping'
    }]
  }],
  total_estimated_cost_usd: number,
  tips: string[]
}`;

function extractJson(text) {
  const direct = text.trim();
  try {
    return JSON.parse(direct);
  } catch {
    const start = direct.indexOf("{");
    const end = direct.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(direct.slice(start, end + 1));
    }
    throw new Error("Invalid itinerary JSON returned from API.");
  }
}

export default function App() {
  const openRouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const openRouterModel =
    import.meta.env.VITE_OPENROUTER_MODEL || "meta-llama/llama-3.1-8b-instruct:free";
  const xaiApiKey = import.meta.env.VITE_XAI_API_KEY;
  const xaiModel = import.meta.env.VITE_XAI_MODEL || "grok-beta";
  const anthropicApiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const [preferences, setPreferences] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selectedStop, setSelectedStop] = useState(null);
  const [highlightedStop, setHighlightedStop] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tips, setTips] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const noResults = !isLoading && itinerary.length === 0 && Boolean(preferences);

  const createCalendarText = useMemo(
    () => () => {
      if (!preferences || !itinerary.length) {
        return "";
      }
      const startDate = new Date();
      return itinerary
        .map((dayPlan, idx) => {
          const dayDate = new Date(startDate);
          dayDate.setDate(dayDate.getDate() + idx);
          const date = dayDate.toISOString().split("T")[0];
          const stopsText = dayPlan.stops
            .map(
              (stop, stopIdx) =>
                `${stopIdx + 1}. ${stop.name} (${stop.duration_hours}h, $${stop.estimated_cost_usd})`
            )
            .join("\n");
          return `Summary: ${preferences.city} Trip - Day ${dayPlan.day}: ${dayPlan.title}\nDate: ${date}\nDescription:\n${stopsText}`;
        })
        .join("\n\n---\n\n");
    },
    [preferences, itinerary]
  );

  const handlePlanTrip = async (nextPreferences) => {
    setPreferences(nextPreferences);
    setError("");
    setIsLoading(true);
    setSelectedStop(null);

    try {
      if (!openRouterApiKey && !xaiApiKey && !anthropicApiKey && !openaiApiKey) {
        throw new Error(
          "Missing API key. Add VITE_OPENROUTER_API_KEY (or VITE_XAI_API_KEY / VITE_OPENAI_API_KEY / VITE_ANTHROPIC_API_KEY) to frontend/.env and restart npm run dev."
        );
      }

      const userPrompt = `City: ${nextPreferences.city}
Interests: ${nextPreferences.interests.join(", ")}
Budget: ${nextPreferences.budget}
Duration: ${nextPreferences.days} days`;

      let text = "";
      let usedModelLabel = "";
      if (openRouterApiKey) {
        const candidateModels = [
          openRouterModel,
          "openrouter/auto",
          "mistralai/mistral-7b-instruct:free",
          "google/gemma-2-9b-it:free"
        ].filter((value, idx, list) => value && list.indexOf(value) === idx);

        let openRouterLastError = "";
        for (const modelName of candidateModels) {
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${openRouterApiKey}`,
              "content-type": "application/json"
            },
            body: JSON.stringify({
              model: modelName,
              temperature: 0.7,
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userPrompt }
              ]
            })
          });

          if (response.ok) {
            const data = await response.json();
            text = data.choices?.[0]?.message?.content ?? "";
            usedModelLabel = modelName;
            break;
          }

          openRouterLastError = await response.text();
          const isEndpointNotFound =
            response.status === 404 || openRouterLastError.includes("No endpoints found");
          if (!isEndpointNotFound) {
            throw new Error(
              `OpenRouter trip planning failed: ${response.status} ${openRouterLastError}`
            );
          }
        }

        if (!text) {
          throw new Error(
            `OpenRouter trip planning failed: no available model endpoint found. Last error: ${openRouterLastError}`
          );
        }
      } else if (xaiApiKey) {
        const candidateModels = [xaiModel, "grok-beta", "grok-2-1212"].filter(
          (value, idx, list) => value && list.indexOf(value) === idx
        );

        let xaiLastError = "";
        for (const modelName of candidateModels) {
          const response = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${xaiApiKey}`,
              "content-type": "application/json"
            },
            body: JSON.stringify({
              model: modelName,
              temperature: 0.7,
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userPrompt }
              ]
            })
          });

          if (response.ok) {
            const data = await response.json();
            text = data.choices?.[0]?.message?.content ?? "";
            break;
          }

          xaiLastError = await response.text();
          if (!xaiLastError.includes("Model not found")) {
            throw new Error(`xAI trip planning failed: ${response.status} ${xaiLastError}`);
          }
        }

        if (!text) {
          throw new Error(
            `xAI trip planning failed: no available Grok model for this key. Last error: ${xaiLastError}`
          );
        }
      } else if (openaiApiKey) {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
            "content-type": "application/json"
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            temperature: 0.7,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userPrompt }
            ]
          })
        });

        if (!response.ok) {
          const err = await response.text();
          throw new Error(`OpenAI trip planning failed: ${response.status} ${err}`);
        }
        const data = await response.json();
        text = data.choices?.[0]?.message?.content ?? "";
      } else {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": anthropicApiKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1500,
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: userPrompt }]
          })
        });

        if (!response.ok) {
          const err = await response.text();
          throw new Error(`Anthropic trip planning failed: ${response.status} ${err}`);
        }

        const data = await response.json();
        text = data.content?.find((part) => part.type === "text")?.text ?? "";
      }

      const parsed = extractJson(text);

      if (!Array.isArray(parsed.itinerary) || parsed.itinerary.length === 0) {
        setItinerary([]);
        setMarkers([]);
        setTips([]);
        setTotalCost(0);
        return;
      }

      setItinerary(parsed.itinerary);
      const flatStops = parsed.itinerary.flatMap((d) => d.stops ?? []);
      setMarkers(flatStops);
      const modelTip = openRouterApiKey
        ? `AI mode: generated via OpenRouter (${usedModelLabel || openRouterModel}).`
        : xaiApiKey
          ? "AI mode: generated via Grok (xAI)."
          : openaiApiKey
            ? "AI mode: generated via OpenAI."
            : "AI mode: generated via Anthropic.";
      setTips([modelTip, ...(Array.isArray(parsed.tips) ? parsed.tips : [])]);
      setTotalCost(Number(parsed.total_estimated_cost_usd ?? 0));
    } catch (err) {
      setItinerary([]);
      setMarkers([]);
      setTips([]);
      setTotalCost(0);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to plan trip right now. Please retry in a moment."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full bg-slate-50 text-slate-900">
      <div className="flex h-full flex-col md:flex-row">
        <aside className="w-full border-b border-slate-200 bg-white p-4 md:w-[400px] md:overflow-y-auto md:border-b-0 md:border-r">
          <h1 className="mb-1 text-xl font-bold">Map-Based Travel Planner</h1>
          <p className="mb-4 text-sm text-slate-600">
            Plan by interests, visualize stops, and export daily events.
          </p>

          <TripForm
            onSubmit={handlePlanTrip}
            isLoading={isLoading}
            error={error}
            onRetry={() => preferences && handlePlanTrip(preferences)}
            missingApiKey={!openRouterApiKey && !xaiApiKey && !anthropicApiKey && !openaiApiKey}
          />

          {tips.length > 0 && (
            <div className="mt-4 rounded-lg border border-sky-100 bg-sky-50 p-3">
              <h3 className="mb-2 text-sm font-semibold text-sky-900">Tips</h3>
              <ul className="space-y-1 text-xs text-sky-800">
                {tips.map((tip, idx) => (
                  <li key={`${tip}-${idx}`}>• {tip}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <Itinerary
              itinerary={itinerary}
              totalCost={totalCost}
              isLoading={isLoading}
              noResults={noResults}
              onHoverStop={setHighlightedStop}
              onSelectStop={setSelectedStop}
              onOpenCalendarModal={() => setShowCalendarModal(true)}
            />
          </div>
        </aside>

        <main className="flex-1">
          <MapView
            markers={markers}
            selectedStop={selectedStop}
            highlightedStop={highlightedStop}
            isLoading={isLoading}
            noResults={noResults}
          />
        </main>
      </div>

      {showCalendarModal && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Calendar Events</h2>
              <button
                onClick={() => setShowCalendarModal(false)}
                className="rounded px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
            <textarea
              readOnly
              value={createCalendarText()}
              className="h-72 w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-700"
            />
            <button
              onClick={() => navigator.clipboard.writeText(createCalendarText())}
              className="mt-3 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Copy Event Text
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
