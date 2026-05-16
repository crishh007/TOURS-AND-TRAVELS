import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch, Link } from "wouter";
import { useGetMoodRecommendations } from "@workspace/api-client-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import DestinationCard from "@/components/DestinationCard";
import { Button } from "@/components/ui/button";
import { Brain, Wind, Mountain, Heart, Zap, Music, Users, Smile, Sun, Loader2, ChevronRight } from "lucide-react";

const MOODS = [
  { id: "stressed", label: "Stressed", icon: Wind, color: "from-indigo-400 to-purple-400", desc: "Need peace and quiet" },
  { id: "relaxed", label: "Relaxed", icon: Sun, color: "from-blue-400 to-cyan-400", desc: "Going at my own pace" },
  { id: "romantic", label: "Romantic", icon: Heart, color: "from-pink-400 to-rose-400", desc: "Special moments for two" },
  { id: "energetic", label: "Energetic", icon: Zap, color: "from-yellow-400 to-orange-400", desc: "Ready for anything" },
  { id: "adventurous", label: "Adventurous", icon: Mountain, color: "from-orange-400 to-red-400", desc: "Off the beaten path" },
  { id: "lonely", label: "Solo", icon: Smile, color: "from-cyan-400 to-blue-400", desc: "Just me and the journey" },
  { id: "party", label: "Party", icon: Music, color: "from-purple-400 to-pink-400", desc: "Lights, music, action!" },
  { id: "family", label: "Family", icon: Users, color: "from-green-400 to-teal-400", desc: "Memories with loved ones" },
];

export default function MoodPlannerPage() {
  return <ProtectedRoute><MoodContent /></ProtectedRoute>;
}

function MoodContent() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const preselectedMood = params.get("mood");

  const [selectedMood, setSelectedMood] = useState<string | null>(preselectedMood);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const getMoodRecs = useGetMoodRecommendations();

  useEffect(() => {
    if (preselectedMood) {
      handleMoodSelect(preselectedMood);
    }
  }, []);

  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood);
    setLoading(true);
    setResult(null);
    try {
      const res = await getMoodRecs.mutateAsync({ data: { mood } });
      setResult(res);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const activeMood = MOODS.find(m => m.id === selectedMood);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mx-auto mb-4 glow-cyan">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Mood Travel Engine</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Our AI reads your emotional state and recommends the perfect Indian destination — because travel should match how you feel.</p>
        </motion.div>

        {/* Mood Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {MOODS.map((mood, i) => {
            const Icon = mood.icon;
            const isSelected = selectedMood === mood.id;
            return (
              <motion.button
                key={mood.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleMoodSelect(mood.id)}
                data-testid={`mood-${mood.id}`}
                className={`glass-card rounded-2xl p-5 flex flex-col items-center gap-3 transition-all cursor-pointer ${
                  isSelected ? "border-white/30 bg-white/10" : "hover:border-white/15"
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mood.color} flex items-center justify-center ${isSelected ? "scale-110" : ""} transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className={`font-bold text-sm ${isSelected ? "text-white" : "text-white/80"}`}>{mood.label}</div>
                  <div className="text-muted-foreground text-xs mt-0.5 text-center">{mood.desc}</div>
                </div>
                {isSelected && <div className="w-2 h-2 rounded-full bg-amber-400" />}
              </motion.button>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <Loader2 className="w-12 h-12 text-amber-400 animate-spin mx-auto mb-4" />
            <p className="text-white font-semibold text-lg">Reading your mood...</p>
            <p className="text-muted-foreground mt-1">Our AI is finding the perfect destinations for you</p>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10">
              {/* Mood Header */}
              {activeMood && (
                <div className="glass-card rounded-2xl p-6 flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${activeMood.color} flex items-center justify-center flex-shrink-0`}>
                    <activeMood.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">You're feeling <span className="text-gradient-amber capitalize">{result.mood}</span></h2>
                    <p className="text-muted-foreground mt-1">{result.travelStyle}</p>
                    {result.bestSeason && <p className="text-amber-400/80 text-sm mt-2">Best season to travel: {result.bestSeason}</p>}
                  </div>
                </div>
              )}

              {/* Destinations */}
              {result.destinations?.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-5">Perfect Destinations for You</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {result.destinations.map((d: any, i: number) => (
                      <DestinationCard key={d.id} destination={d} index={i} />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Activities */}
                {result.activities?.length > 0 && (
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-4">Recommended Activities</h3>
                    <ul className="space-y-3">
                      {result.activities.map((a: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{i + 1}</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Packing Tips */}
                {result.packingTips?.length > 0 && (
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-4">Packing Tips for Your Mood</h3>
                    <ul className="space-y-3">
                      {result.packingTips.map((tip: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
                          <span className="text-cyan-400 flex-shrink-0">✓</span>{tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Plan trip CTA */}
              <div className="text-center">
                {result.destinations?.[0] && (
                  <Link href={`/ai-planner?destination=${encodeURIComponent(result.destinations[0].name)}`}>
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold h-12 px-8 rounded-xl border-0 glow-amber" data-testid="btn-plan-mood-trip">
                      Plan My {result.mood} Trip <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
