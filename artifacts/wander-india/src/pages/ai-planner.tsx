import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useSearch } from "wouter";
import { useGenerateItinerary, useCreateTrip, getListTripsQueryKey, listDestinations } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Plane, MapPin, Utensils, Home, Lightbulb, Save, Loader2, ChevronDown, ChevronUp, DollarSign } from "lucide-react";

const schema = z.object({
  destination: z.string().min(2, "Enter a destination"),
  days: z.coerce.number().min(1).max(30),
  mood: z.string().min(1, "Select a mood"),
  budget: z.coerce.number().min(1000, "Enter a budget"),
});
type FormData = z.infer<typeof schema>;

const MOODS = ["relaxed", "adventurous", "romantic", "energetic", "stressed", "family", "party", "solo"];
const POPULAR = ["Goa", "Rajasthan", "Kerala", "Ladakh", "Himachal Pradesh", "Rishikesh", "Varanasi", "Andaman"];

function generateItineraryLocal(destination: string, days: number, mood: string, budget: number) {
  const getDayTitleLocal = (dest: string, d: number, total: number) => {
    if (d === 1) return `Arrival & First Impressions of ${dest}`;
    if (d === total) return `Final Day & Farewell to ${dest}`;
    const titles = [
      `Exploring ${dest}'s Heritage`,
      `Cultural Immersion in ${dest}`,
      `Adventure Day in ${dest}`,
      `Local Life & Hidden Spots`,
      `Spiritual & Cultural Journey`,
      `Day Trip & Scenic Exploration`,
    ];
    return titles[(d - 2) % titles.length];
  };

  const generateDayActivitiesLocal = (dest: string, m: string, d: number) => {
    const baseActivities = [
      `Morning walk through ${dest}'s old quarter`,
      `Visit the most iconic landmark of ${dest}`,
      `Local street food tour at the central market`,
      `Sunset viewpoint photography session`,
      `Evening cultural performance or sound & light show`,
    ];

    const moodActivities: Record<string, string[]> = {
      adventurous: [`Adventure sports activity near ${dest}`, "Offbeat trail exploration", "Local village interaction"],
      romantic: [`Romantic dinner with view`, `Couples spa experience`, `Sunrise boat ride`],
      relaxed: [`Leisurely breakfast at a heritage cafe`, `Afternoon nap in the garden`, `Evening lakeside stroll`],
      energetic: [`Early morning cycling tour`, `Water sports session`, `High-energy local festival`],
      family: [`Interactive museum visit`, `Wildlife sanctuary tour`, `Cooking class with local family`],
      stressed: [`Sunrise meditation session`, `Relaxing spa treatment`, `Quiet walk in nature`],
      party: [`Sunset beach lounge party`, `Night clubbing at top venue`, `Late-night street food crawl`],
      solo: [`Solo sightseeing journey`, `Coffee shop journaling session`, `Hostel social evening`],
    };

    const extras = moodActivities[m] || moodActivities.relaxed;
    return [...baseActivities.slice(0, 3 - Math.min(d - 1, 1)), ...extras.slice(0, 2 + Math.min(d - 1, 1))];
  };

  const generateMealsLocal = (d: number) => {
    const meals = [
      [`Morning chai with local breakfast`, `Traditional lunch thali`, `Dinner at rooftop restaurant with view`],
      [`Healthy continental breakfast`, `Street food lunch sampler`, `Dinner with local traditional music`],
      [`Fruit and fresh juice breakfast`, `Famous local specialty biryani`, `Premium dinner at fine dining spot`],
      [`Hot pancakes or local dosa`, `Fresh seafood or curry lunch`, `Tandoori platter dinner`],
    ];
    return meals[(d - 1) % meals.length];
  };

  const getAccommodationLocal = (dest: string, b: number, m: string) => {
    const budgetPerNight = b / 7;
    if (budgetPerNight > 5000 || m === "romantic") return `Heritage palace hotel or boutique stay in ${dest}`;
    if (budgetPerNight > 2000) return `Comfortable 3-star hotel near ${dest}'s main attractions`;
    return `Clean guesthouse or hostel in the heart of ${dest}`;
  };

  const getDayTipLocal = (d: number) => {
    const tips = [
      "Carry cash as many small shops don't accept cards.",
      "Dress modestly when visiting religious sites.",
      "Bargain respectfully at local markets — it's part of the culture!",
      "Try the local transport for an authentic experience.",
      "Always have water and snacks when exploring remote areas.",
    ];
    return tips[(d - 1) % tips.length];
  };

  const itinerary = Array.from({ length: days }, (_, i) => {
    const day = i + 1;
    return {
      day,
      title: `Day ${day}: ${getDayTitleLocal(destination, day, days)}`,
      activities: generateDayActivitiesLocal(destination, mood, day),
      meals: generateMealsLocal(day),
      accommodation: getAccommodationLocal(destination, budget, mood),
      tips: getDayTipLocal(day),
    };
  });

  return {
    destination,
    days,
    itinerary,
    tips: [
      `Best time to visit ${destination} depends on the season — plan accordingly.`,
      "Always carry a reusable water bottle and local currency.",
      "Respect local customs and dress codes at religious sites.",
      `Your estimated daily budget: ₹${Math.round(budget / days).toLocaleString("en-IN")}`,
      "Book accommodations in advance during peak season.",
    ],
    estimatedCost: budget,
  };
}

async function generateItineraryGemini(destination: string, days: number, mood: string, budget: number) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  
  const prompt = `Generate a highly detailed day-by-day travel itinerary for ${destination} for ${days} days.
The traveler mood is ${mood} and the total budget is ₹${budget}.
You must output a valid JSON object matching this schema:
{
  "destination": "${destination}",
  "days": ${days},
  "itinerary": [
    {
      "day": 1,
      "title": "Day 1 Title",
      "activities": ["Activity 1", "Activity 2", "Activity 3"],
      "meals": ["Breakfast recommendation", "Lunch recommendation", "Dinner recommendation"],
      "accommodation": "Recommended budget-appropriate hotel or hostel",
      "tips": "Day 1 local tips"
    }
  ],
  "tips": [
    "General travel tip 1",
    "General travel tip 2",
    "General travel tip 3"
  ],
  "estimatedCost": ${budget}
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
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

export default function AIPlannerPage() {
  return <ProtectedRoute><PlannerContent /></ProtectedRoute>;
}

function PlannerContent() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const preDestination = params.get("destination") || "";

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const generateMutation = useGenerateItinerary();
  const createTripMutation = useCreateTrip();
  const [result, setResult] = useState<any>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { destination: preDestination, days: 5, mood: "adventurous", budget: 15000 },
  });

  const onSubmit = async (data: FormData) => {
    setResult(null);
    setIsGenerating(true);
    try {
      const res = await generateMutation.mutateAsync({ data: { ...data, interests: [] } });
      if (!res || typeof res !== "object" || !res.itinerary) {
        throw new Error("Invalid server response format");
      }
      setResult(res);
      setExpandedDay(0);
    } catch (err) {
      console.warn("Backend itinerary generation failed, trying Gemini API fallback:", err);
      try {
        const res = await generateItineraryGemini(data.destination, data.days, data.mood, data.budget);
        setResult(res);
        setExpandedDay(0);
        toast({
          title: "Itinerary Generated (AI Fallback)",
          description: `Successfully generated itinerary for ${data.destination} via Gemini!`,
        });
      } catch (geminiErr) {
        console.warn("Gemini fallback failed, generating itinerary locally:", geminiErr);
        try {
          const res = generateItineraryLocal(data.destination, data.days, data.mood, data.budget);
          setResult(res);
          setExpandedDay(0);
          toast({
            title: "Itinerary Generated (Local Fallback)",
            description: `Generated a rule-based travel plan for ${data.destination} locally.`,
          });
        } catch (localErr) {
          console.error("Local fallback failed:", localErr);
          toast({ title: "Failed to generate itinerary", variant: "destructive" });
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!result) return;
    const vals = form.getValues();
    const today = new Date();
    const end = new Date(today);
    end.setDate(end.getDate() + result.days - 1);

    let destinationId = 1;
    let destinationImage = result.destinationImage || undefined;

    try {
      const dests = await listDestinations({ search: result.destination });
      if (dests && dests.length > 0) {
        const match = dests.find(
          d => d.name.toLowerCase() === result.destination.toLowerCase()
        ) || dests[0];
        destinationId = match.id;
        if (!destinationImage && match.imageUrl) {
          destinationImage = match.imageUrl;
        }
      }
    } catch (e) {
      console.warn("Could not fetch matching destination ID, defaulting to 1", e);
    }

    try {
      await createTripMutation.mutateAsync({
        data: {
          destinationId,
          destinationName: result.destination,
          destinationImage,
          startDate: today.toISOString().split("T")[0],
          endDate: end.toISOString().split("T")[0],
          totalBudget: vals.budget,
          itinerary: JSON.stringify(result.itinerary),
          notes: `Mood: ${vals.mood}`,
        }
      });
      queryClient.invalidateQueries({ queryKey: getListTripsQueryKey() });
      toast({ title: "Trip saved!", description: `${result.destination} trip saved to your trips.` });
    } catch {
      toast({ title: "Failed to save trip", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 glow-amber">
            <Brain className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">AI Itinerary Generator</h1>
          <p className="text-muted-foreground">Tell us your destination and mood — our AI will craft a perfect day-by-day plan for you.</p>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-8 mb-8">
          {/* Popular destinations */}
          <div className="mb-6">
            <p className="text-muted-foreground text-sm mb-3">Popular destinations:</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR.map(d => (
                <button
                  key={d}
                  onClick={() => form.setValue("destination", d)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-amber-500/20 rounded-xl text-sm text-white/70 hover:text-amber-400 transition-all border border-white/5 hover:border-amber-500/30"
                  data-testid={`quick-dest-${d.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField control={form.control} name="destination" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Destination</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                        <Input {...field} placeholder="e.g. Goa, Kerala, Rajasthan" className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground rounded-xl" data-testid="input-destination" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="days" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Number of Days</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={1} max={30} placeholder="5" className="h-12 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground rounded-xl" data-testid="input-days" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="mood" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Travel Mood</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white rounded-xl" data-testid="select-mood">
                          <SelectValue placeholder="Select your mood" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card border-white/10">
                        {MOODS.map(m => (
                          <SelectItem key={m} value={m} className="text-white capitalize hover:bg-white/5">{m.charAt(0).toUpperCase() + m.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="budget" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Total Budget (₹)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                        <Input {...field} type="number" min={1000} placeholder="15000" className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground rounded-xl" data-testid="input-budget" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <Button
                type="submit"
                disabled={isGenerating}
                className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-xl border-0 hover:opacity-90 glow-amber text-base"
                data-testid="btn-generate"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Generating Your Perfect Itinerary...</span>
                ) : (
                  <span className="flex items-center gap-2"><Brain className="w-5 h-5" /> Generate AI Itinerary</span>
                )}
              </Button>
            </form>
          </Form>
        </motion.div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Summary */}
              <div className="glass-card rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">{result.destination} — {result.days} Day{result.days > 1 ? "s" : ""}</h2>
                  <p className="text-muted-foreground text-sm mt-1">Estimated cost: ₹{result.estimatedCost?.toLocaleString("en-IN")}</p>
                </div>
                <Button
                  onClick={handleSaveTrip}
                  disabled={createTripMutation.isPending}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold border-0 rounded-xl h-10 px-6"
                  data-testid="btn-save-trip"
                >
                  {createTripMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Trip</>}
                </Button>
              </div>

              {/* Days */}
              {result.itinerary?.map((day: any, idx: number) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="glass-card rounded-2xl overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between p-5 text-left"
                    onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
                    data-testid={`day-${day.day}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                        D{day.day}
                      </div>
                      <div>
                        <div className="text-white font-bold">{day.title}</div>
                        <div className="text-muted-foreground text-xs mt-0.5">{day.activities?.length} activities · {day.meals?.length} meals</div>
                      </div>
                    </div>
                    {expandedDay === idx ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                  </button>

                  <AnimatePresence>
                    {expandedDay === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 px-5 pb-5 space-y-5 overflow-hidden"
                      >
                        <div className="grid md:grid-cols-3 gap-5 pt-5">
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Plane className="w-4 h-4 text-amber-400" />
                              <span className="text-white font-semibold text-sm">Activities</span>
                            </div>
                            <ul className="space-y-2">
                              {day.activities?.map((a: string, i: number) => (
                                <li key={i} className="text-muted-foreground text-sm flex gap-2">
                                  <span className="text-amber-400 flex-shrink-0">·</span>{a}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Utensils className="w-4 h-4 text-cyan-400" />
                              <span className="text-white font-semibold text-sm">Meals</span>
                            </div>
                            <ul className="space-y-2">
                              {day.meals?.map((m: string, i: number) => (
                                <li key={i} className="text-muted-foreground text-sm flex gap-2">
                                  <span className="text-cyan-400 flex-shrink-0">·</span>{m}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Home className="w-4 h-4 text-purple-400" />
                              <span className="text-white font-semibold text-sm">Stay</span>
                            </div>
                            <p className="text-muted-foreground text-sm">{day.accommodation}</p>
                            {day.tips && (
                              <div className="mt-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                                  <span className="text-white font-semibold text-sm">Tip</span>
                                </div>
                                <p className="text-muted-foreground text-sm">{day.tips}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Tips */}
              {result.tips?.length > 0 && (
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-yellow-400" /> Travel Tips</h3>
                  <ul className="space-y-2">
                    {result.tips.map((tip: string, i: number) => (
                      <li key={i} className="text-muted-foreground text-sm flex gap-3">
                        <span className="text-amber-400 font-bold flex-shrink-0">{i + 1}.</span>{tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
