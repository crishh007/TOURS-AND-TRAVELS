import { useMemo, useState } from "react";
import Itinerary, { DayPlan } from "../components/map/Itinerary";
import MapView from "../components/map/MapView";
import TripForm from "../components/map/TripForm";
import { Stop, StopCategory } from "../components/map/PlaceCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Info } from "lucide-react";

const SYSTEM_PROMPT = `You are an expert travel planner. When given a city, interests, budget, and duration,
return ONLY a valid JSON itinerary (no markdown formatting, no explanation, just raw JSON) matching this exact typescript interface shape:
{
  "itinerary": [{
    "day": number,
    "title": string,
    "stops": [{
      "name": string,
      "description": string,
      "lat": number,
      "lon": number,
      "duration_hours": number,
      "estimated_cost_usd": number,
      "category": "food" | "history" | "nature" | "adventure" | "art" | "shopping"
    }]
  }],
  "total_estimated_cost_usd": number,
  "tips": string[]
}
Ensure the coordinates (lat/lon) are accurate for the specific city and points of interest.`;

function extractJson(text: string) {
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

function generateItineraryLocal(city: string, days: number, interests: string[], budget: string, centerLat?: number, centerLon?: number) {
  const lat = centerLat ?? 28.6139;
  const lon = centerLon ?? 77.2090;

  const stopNames: Record<string, string[]> = {
    food: ["Local Spice Kitchen", "Street Food Market", "Traditional Dhaba", "Heritage Sweets Shop", "Sunset Cafe"],
    history: ["Historic Fort Ruins", "Ancient Temple Complex", "City Museum", "Memorial Garden", "Royal Palace Gate"],
    nature: ["Botanical Gardens", "Lakeside Walking Trail", "Scenic Valley Viewpoint", "River Banks Reserve", "Sunrise Hill Park"],
    adventure: ["Zip Line Canopy", "Trekking Base Point", "Outdoor Climbing Wall", "Rocky Gorge Trail", "Rafting Launch Site"],
    art: ["Heritage Crafts center", "Local Arts Gallery", "Traditional Puppet Theater", "Textiles Museum", "Modern Sculpture Park"],
    shopping: ["Central Bazaar", "Handicrafts Emporium", "Spices Market", "Artisans Street Shop", "Sunset Souvenirs Mall"]
  };

  const stopDescriptions: Record<string, string[]> = {
    food: [
      "Enjoy traditional regional recipes prepared by local chefs with authentic spices.",
      "Sample a wide variety of popular street food items and sweet delicacies in a lively market atmosphere.",
      "A rustic dining experience serving fresh, hot tandoori and local curries in a friendly setting.",
      "Taste century-old traditional desserts, milk sweets, and freshly made snacks.",
      "Relax with a panoramic view of the sunset while sipping freshly brewed chai and tasting savory snacks."
    ],
    history: [
      "Explore the magnificent architectural remains and walls of the ancient city fort with a local guide.",
      "Walk through the intricate stone carvings and sacred corridors of this historical temple complex.",
      "Discover the rich cultural collection, artifacts, weaponry, and documents of the region's heritage.",
      "Walk through quiet gardens surrounded by colonial-era monuments and beautiful water fountains.",
      "Take photos at the grand palace entrance showcasing stunning classical archways and royal motifs."
    ],
    nature: [
      "A peaceful stroll among thousands of exotic tropical plant species, green glasshouses, and towering trees.",
      "Enjoy a quiet walk along the scenic lake, watching migratory birds and relaxing in nature.",
      "Take in breathtaking panoramic views of the surrounding hills, valleys, and green scenery.",
      "Relax in the serene park by the rushing river waters, a perfect spot for photography and resting.",
      "Watch the morning sun rise over the misty horizon from this popular high vantage point."
    ],
    adventure: [
      "Experience an exciting zip line ride over the forest canopy, offering a unique aerial perspective.",
      "Begin a guided hike up the local hillside paths, navigating rock scrambles and forest trails.",
      "Challenge yourself on a tall outdoor climbing wall with routes designed for all experience levels.",
      "A rugged hiking path that winds through dramatic rock walls, caves, and scenic lookout points.",
      "Gear up for a thrilling rafting run through white-water rapids along the local mountain river."
    ],
    art: [
      "Watch local artisans demonstrate traditional pottery, wood carving, and metalwork techniques.",
      "A beautiful exhibition space showing off contemporary and historical paintings from regional artists.",
      "Enjoy an entertaining evening puppet performance telling ancient folklore and historic stories.",
      "Admire a stunning collection of hand-woven silks, traditional embroidery, and regional garments.",
      "Walk among impressive stone and metal sculptures placed in a landscaped outdoor park."
    ],
    shopping: [
      "A vibrant market filled with colourful stalls selling garments, jewelry, spices, and handmade items.",
      "Support local cooperatives by shopping for authentic regional handicrafts, wooden carvings, and artwork.",
      "Inhale the aromas of freshly harvested cardamom, saffron, tea leaves, and local spice blends.",
      "Meet local vendors selling handmade leather goods, embroidered bags, and custom accessories.",
      "A modern shopping venue offering curated souvenirs, local brands, and cozy cafes."
    ]
  };

  const itinerary: DayPlan[] = Array.from({ length: days }, (_, dIdx) => {
    const day = dIdx + 1;
    const dayInterests = interests.length > 0 ? interests : ["Food", "History"];
    
    const stops: Stop[] = Array.from({ length: 3 }, (_, sIdx) => {
      const interestIndex = (dIdx * 3 + sIdx) % dayInterests.length;
      const category = dayInterests[interestIndex].toLowerCase() as StopCategory;
      
      const names = stopNames[category] || stopNames.history;
      const descs = stopDescriptions[category] || stopDescriptions.history;
      
      const name = `${names[sIdx % names.length]} - ${city.split(",")[0]}`;
      const description = descs[sIdx % descs.length];
      
      const latOffset = (Math.sin(dIdx * 10 + sIdx) * 0.02) + 0.01;
      const lonOffset = (Math.cos(dIdx * 10 + sIdx) * 0.02) + 0.01;

      return {
        name,
        description,
        lat: lat + latOffset,
        lon: lon + lonOffset,
        duration_hours: 1.5 + (sIdx % 2) * 0.5,
        estimated_cost_usd: 5 + (sIdx * 8),
        category
      };
    });

    return {
      day,
      title: `Day ${day}: Explore best of ${city.split(",")[0]}`,
      stops
    };
  });

  const totalCost = itinerary.flatMap(d => d.stops).reduce((acc, s) => acc + s.estimated_cost_usd, 0);

  return {
    itinerary,
    total_estimated_cost_usd: totalCost,
    tips: [
      `Local Fallback: Displaying curated stops for ${city.split(",")[0]}.`,
      "Dress comfortably and carry comfortable walking shoes for all map stops.",
      "Confirm operating hours of local viewpoints before setting off."
    ]
  };
}

async function generateItineraryGemini(city: string, days: number, interests: string[], budget: string) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  
  const userPrompt = `City: ${city}
Interests: ${interests.join(", ")}
Budget Level: ${budget}
Duration: ${days} days`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: SYSTEM_PROMPT + "\n\n" + userPrompt }] }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error("Empty response from Gemini");
  }

  return JSON.parse(rawText.trim());
}

function PlannerContent() {
  const openRouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const openRouterModel =
    import.meta.env.VITE_OPENROUTER_MODEL || "meta-llama/llama-3.1-8b-instruct:free";
  const xaiApiKey = import.meta.env.VITE_XAI_API_KEY;
  const xaiModel = import.meta.env.VITE_XAI_MODEL || "grok-beta";
  const anthropicApiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const [preferences, setPreferences] = useState<{ city: string; lat?: number; lon?: number; interests: string[]; budget: string; days: number } | null>(null);
  const [itinerary, setItinerary] = useState<DayPlan[]>([]);
  const [markers, setMarkers] = useState<Stop[]>([]);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [highlightedStop, setHighlightedStop] = useState<Stop | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tips, setTips] = useState<string[]>([]);
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
                `${stopIdx + 1}. ${stop.name} (${stop.duration_hours}h, $${stop.estimated_cost_usd}) - ${stop.description}`
            )
            .join("\n");
          return `Summary: ${preferences.city} Trip - Day ${dayPlan.day}: ${dayPlan.title}\nDate: ${date}\nDescription:\n${stopsText}`;
        })
        .join("\n\n---\n\n");
    },
    [preferences, itinerary]
  );

  const handlePlanTrip = async (nextPreferences: { city: string; lat?: number; lon?: number; interests: string[]; budget: string; days: number }) => {
    setPreferences(nextPreferences);
    setError("");
    setIsLoading(true);
    setSelectedStop(null);

    try {
      const userPrompt = `City: ${nextPreferences.city}
Interests: ${nextPreferences.interests.join(", ")}
Budget Level: ${nextPreferences.budget}
Duration: ${nextPreferences.days} days`;

      let text = "";
      let usedModelLabel = "";

      // Prioritize workspace Gemini key fallback if VITE_GEMINI_API_KEY is available and no other primary keys are set
      const hasOtherKey = openRouterApiKey || xaiApiKey || anthropicApiKey || openaiApiKey;

      if (!hasOtherKey) {
        // Run Gemini
        try {
          const parsed = await generateItineraryGemini(
            nextPreferences.city,
            nextPreferences.days,
            nextPreferences.interests,
            nextPreferences.budget
          );
          setItinerary(parsed.itinerary);
          setMarkers(parsed.itinerary.flatMap((d: DayPlan) => d.stops ?? []));
          setTips(["AI Mode: Generated via workspace Gemini API.", ...(Array.isArray(parsed.tips) ? parsed.tips : [])]);
          setTotalCost(Number(parsed.total_estimated_cost_usd ?? 0));
          setIsLoading(false);
          return;
        } catch (geminiError) {
          console.warn("Gemini generation failed, falling back to local simulator:", geminiError);
          // Fall through to local simulation
        }
      }

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
      } else if (anthropicApiKey) {
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
        text = data.content?.find((part: any) => part.type === "text")?.text ?? "";
      }

      if (!text) {
        // Final fallback: Use local simulator
        const parsed = generateItineraryLocal(
          nextPreferences.city,
          nextPreferences.days,
          nextPreferences.interests,
          nextPreferences.budget,
          nextPreferences.lat,
          nextPreferences.lon
        );
        setItinerary(parsed.itinerary);
        setMarkers(parsed.itinerary.flatMap((d) => d.stops ?? []));
        setTips(parsed.tips);
        setTotalCost(parsed.total_estimated_cost_usd);
        return;
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
      setMarkers(parsed.itinerary.flatMap((d: DayPlan) => d.stops ?? []));
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
      console.warn("Primary AI itinerary generation failed. Using local generator fallback.", err);
      // Failover to local generation
      const parsed = generateItineraryLocal(
        nextPreferences.city,
        nextPreferences.days,
        nextPreferences.interests,
        nextPreferences.budget,
        nextPreferences.lat,
        nextPreferences.lon
      );
      setItinerary(parsed.itinerary);
      setMarkers(parsed.itinerary.flatMap((d) => d.stops ?? []));
      setTips([
        `Offline Simulator mode activated due to error: ${err instanceof Error ? err.message : "API request failed"}.`,
        ...parsed.tips
      ]);
      setTotalCost(parsed.total_estimated_cost_usd);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full bg-zinc-950 text-white">
      <div className="flex h-[calc(100vh-80px)] mt-20 flex-col md:flex-row">
        <aside className="w-full border-b border-white/10 bg-zinc-900/60 backdrop-blur-md p-5 md:w-[420px] md:overflow-y-auto md:border-b-0 md:border-r">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center glow-amber shrink-0">
              <MapPin className="w-4.5 h-4.5 text-black" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white">Map Travel Planner</h1>
              <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-widest leading-none mt-0.5">Interactive Stops</p>
            </div>
          </div>
          <p className="mb-6 text-xs text-white/50 leading-relaxed">
            Search a destination in India, check your interest areas, and plan a visual, coordinate-mapped journey.
          </p>

          <TripForm
            onSubmit={handlePlanTrip}
            isLoading={isLoading}
            error={error}
            onRetry={() => preferences && handlePlanTrip(preferences)}
            missingApiKey={!openRouterApiKey && !xaiApiKey && !anthropicApiKey && !openaiApiKey}
          />

          {tips.length > 0 && (
            <div className="mt-5 rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-4">
              <h3 className="mb-2 text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> Planner Advice & Status
              </h3>
              <ul className="space-y-1.5 text-[11px] text-white/70">
                {tips.map((tip, idx) => (
                  <li key={`${tip}-${idx}`} className="leading-relaxed flex items-start gap-1">
                    <span className="text-cyan-400">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5">
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

        <main className="flex-1 p-4 md:p-6 bg-zinc-950">
          <MapView
            markers={markers}
            selectedStop={selectedStop}
            highlightedStop={highlightedStop}
            isLoading={isLoading}
            noResults={noResults}
          />
        </main>
      </div>

      <AnimatePresence>
        {showCalendarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl bg-zinc-900 border border-white/10 p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-white uppercase tracking-wider">Generated Calendar Events</h2>
                <button
                  onClick={() => setShowCalendarModal(false)}
                  className="rounded-xl px-3 py-1.5 text-xs font-semibold text-white/50 hover:bg-white/5 hover:text-white transition-all border border-white/10"
                >
                  Close
                </button>
              </div>
              <textarea
                readOnly
                value={createCalendarText()}
                className="h-72 w-full rounded-xl border border-white/10 bg-black/40 p-4 text-xs text-white/80 font-mono focus:outline-none focus:border-amber-500/30 leading-relaxed"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(createCalendarText());
                  alert("Copied to clipboard!");
                }}
                className="mt-4 w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-xs font-bold text-black hover:opacity-90 active:scale-[0.98] transition-all"
              >
                📋 Copy Event Text
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MapPlannerPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <PlannerContent />
      </div>
    </ProtectedRoute>
  );
}
