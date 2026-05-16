import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { useGetDestination, getGetDestinationQueryKey, useGetWeather, getGetWeatherQueryKey } from "@workspace/api-client-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MapPin, Clock, DollarSign, Cloud, Droplets, Wind, ArrowLeft, Brain, Plane, Thermometer } from "lucide-react";

export default function DestinationDetailPage() {
  const [, params] = useRoute("/destinations/:id");
  const id = Number(params?.id);

  const { data: dest, isLoading } = useGetDestination(id, {
    query: { enabled: !!id, queryKey: getGetDestinationQueryKey(id) },
  });
  const { data: weather } = useGetWeather(dest?.name?.toLowerCase() || "", {
    query: { enabled: !!dest?.name, queryKey: getGetWeatherQueryKey(dest?.name?.toLowerCase() || "") },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 pt-32 pb-20">
          <Skeleton className="h-96 rounded-3xl mb-8" />
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!dest) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold">Destination not found</h2>
          <Link href="/destinations"><Button className="mt-4" variant="outline">Back to Destinations</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-28 pb-20">
        {/* Back */}
        <Link href="/destinations">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white mb-6 gap-2" data-testid="btn-back">
            <ArrowLeft className="w-4 h-4" /> Back to Destinations
          </Button>
        </Link>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative h-80 md:h-[420px] rounded-3xl overflow-hidden mb-8"
        >
          <img src={dest.imageUrl} alt={dest.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <div className="flex items-center gap-2 mb-2">
              {dest.isTrending && <span className="px-3 py-1 bg-amber-500/90 rounded-full text-black text-xs font-bold">Trending</span>}
              {dest.isHiddenGem && <span className="px-3 py-1 bg-purple-500/90 rounded-full text-white text-xs font-bold">Hidden Gem</span>}
              <span className="px-3 py-1 bg-black/60 rounded-full text-white text-xs">{dest.category}</span>
            </div>
            <h1 className="text-4xl font-black text-white">{dest.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span className="text-white/80">{dest.state}</span>
              <span className="text-white/40 mx-2">·</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-white font-semibold">{dest.rating?.toFixed(1)}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
              <h2 className="text-white font-bold text-xl mb-3">About {dest.name}</h2>
              <p className="text-muted-foreground leading-relaxed">{dest.description}</p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <Clock className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <div className="text-xs text-muted-foreground">Best Time</div>
                  <div className="text-white text-sm font-medium mt-0.5">{dest.bestTime}</div>
                </div>
                <div className="text-center">
                  <DollarSign className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                  <div className="text-xs text-muted-foreground">Budget/Day</div>
                  <div className="text-white text-sm font-medium mt-0.5">₹{dest.avgBudgetPerDay?.toLocaleString("en-IN")}</div>
                </div>
                <div className="text-center">
                  <Star className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <div className="text-xs text-muted-foreground">Vibe</div>
                  <div className="text-white text-sm font-medium mt-0.5 capitalize">{dest.mood || "All moods"}</div>
                </div>
              </div>
              {dest.tags && dest.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {dest.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-white/70 text-sm">{tag}</span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Weather */}
            {weather && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
                <h2 className="text-white font-bold text-xl mb-4">Current Weather</h2>
                <div className="flex items-center gap-6 mb-6">
                  <div className="text-5xl font-black text-white">{weather.temperature}°C</div>
                  <div>
                    <div className="text-white font-semibold">{weather.condition}</div>
                    <div className="flex gap-4 mt-2">
                      <span className="flex items-center gap-1 text-muted-foreground text-sm"><Droplets className="w-3.5 h-3.5 text-cyan-400" />{weather.humidity}%</span>
                      <span className="flex items-center gap-1 text-muted-foreground text-sm"><Wind className="w-3.5 h-3.5 text-blue-400" />{weather.windSpeed} km/h</span>
                      <span className="flex items-center gap-1 text-muted-foreground text-sm"><Thermometer className="w-3.5 h-3.5 text-orange-400" />Feels {weather.feelsLike}°C</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {weather.forecast?.map(day => (
                    <div key={day.date} className="flex-shrink-0 bg-white/5 rounded-xl p-3 text-center min-w-16">
                      <div className="text-muted-foreground text-xs">{new Date(day.date).toLocaleDateString("en-IN", { weekday: "short" })}</div>
                      <Cloud className="w-4 h-4 text-cyan-400 mx-auto my-1" />
                      <div className="text-white text-sm font-semibold">{day.high}°</div>
                      <div className="text-muted-foreground text-xs">{day.low}°</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">Plan Your Trip</h3>
              <div className="space-y-3">
                <Link href={`/ai-planner?destination=${encodeURIComponent(dest.name)}`}>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold border-0 rounded-xl h-12" data-testid="btn-plan-trip">
                    <Brain className="w-4 h-4 mr-2" /> Generate AI Itinerary
                  </Button>
                </Link>
                <Link href="/trips">
                  <Button variant="outline" className="w-full border-white/20 text-white rounded-xl h-12">
                    <Plane className="w-4 h-4 mr-2" /> Save as Trip
                  </Button>
                </Link>
                <Link href="/packing">
                  <Button variant="ghost" className="w-full text-white/70 hover:text-white rounded-xl h-12">
                    Pack for {dest.name}
                  </Button>
                </Link>
              </div>
            </motion.div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-white font-bold mb-3">Quick Facts</h3>
              <div className="space-y-3">
                {[
                  { label: "State", value: dest.state },
                  { label: "Category", value: dest.category },
                  { label: "Best Time", value: dest.bestTime },
                  { label: "Budget/Day", value: `₹${dest.avgBudgetPerDay?.toLocaleString("en-IN")}` },
                  { label: "Rating", value: `${dest.rating?.toFixed(1)} / 5.0` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <span className="text-muted-foreground text-sm">{label}</span>
                    <span className="text-white text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
