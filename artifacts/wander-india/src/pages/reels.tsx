import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import {
  Heart, Bookmark, Share2, MapPin, Play, Volume2, VolumeX,
  ChevronUp, ChevronDown, Hash, Eye, TrendingUp, X
} from "lucide-react";

interface Reel {
  id: number;
  destination: string;
  state: string;
  image: string;
  description: string;
  hashtags: string[];
  views: string;
  likes: number;
  creator: string;
  duration: string;
  vibe: string;
  vibeColor: string;
}

const REELS: Reel[] = [
  {
    id: 1,
    destination: "Goa",
    state: "Goa",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=900&fit=crop",
    description: "Golden hour at Palolem Beach — where the Arabian Sea meets paradise. Watch the sun dissolve into amber and violet hues over India's most iconic coastline.",
    hashtags: ["GoaBeach", "SunsetVibes", "BeachLife", "IncredibleIndia"],
    views: "2.4M",
    likes: 148200,
    creator: "wanderlust_india",
    duration: "0:45",
    vibe: "Energetic",
    vibeColor: "from-orange-500 to-amber-400",
  },
  {
    id: 2,
    destination: "Ladakh",
    state: "Ladakh",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=900&fit=crop",
    description: "Pangong Lake glimmering at 14,000 feet above sea level. The crystal blue water changes colors with the sky — a surreal experience unlike anywhere on Earth.",
    hashtags: ["Ladakh", "PangongLake", "HimalayanVibes", "RoofOfWorld"],
    views: "5.1M",
    likes: 312500,
    creator: "himalaya_diaries",
    duration: "1:02",
    vibe: "Serene",
    vibeColor: "from-cyan-500 to-blue-500",
  },
  {
    id: 3,
    destination: "Rajasthan",
    state: "Rajasthan",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&h=900&fit=crop",
    description: "The golden city of Jaisalmer rises from the Thar Desert like a sand castle for kings. Every narrow lane whispers stories of Rajput glory and desert romance.",
    hashtags: ["Rajasthan", "Jaisalmer", "DesertVibes", "GoldenCity"],
    views: "3.8M",
    likes: 224100,
    creator: "royal_rajasthan",
    duration: "0:58",
    vibe: "Royal",
    vibeColor: "from-amber-500 to-yellow-400",
  },
  {
    id: 4,
    destination: "Kerala",
    state: "Kerala",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=900&fit=crop",
    description: "A lazy afternoon drifting through the Alleppey backwaters on a houseboat. Kerala's 900km of serene waterways weave through coconut groves and emerald paddy fields.",
    hashtags: ["Kerala", "Backwaters", "GodsOwnCountry", "HouseboatLife"],
    views: "4.2M",
    likes: 267800,
    creator: "kerala_explorer",
    duration: "1:15",
    vibe: "Calm",
    vibeColor: "from-green-500 to-teal-400",
  },
  {
    id: 5,
    destination: "Varanasi",
    state: "Uttar Pradesh",
    image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=600&h=900&fit=crop",
    description: "The Ganga Aarti at Dashashwamedh Ghat — a thousand flames dancing in the sacred dark. Varanasi doesn't just show you India; it shows you eternity.",
    hashtags: ["Varanasi", "GangaAarti", "SpiritualIndia", "Banaras"],
    views: "6.7M",
    likes: 445000,
    creator: "spiritual_wanderer",
    duration: "0:52",
    vibe: "Spiritual",
    vibeColor: "from-purple-500 to-indigo-500",
  },
  {
    id: 6,
    destination: "Manali",
    state: "Himachal Pradesh",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=900&fit=crop",
    description: "Fresh snowfall blankets the Solang Valley — Manali transforms into a winter wonderland. Wake up to peaks so close you could almost reach out and touch them.",
    hashtags: ["Manali", "SnowVibes", "Himalaya", "WinterTravel"],
    views: "3.3M",
    likes: 198400,
    creator: "snowcap_adventures",
    duration: "0:38",
    vibe: "Adventure",
    vibeColor: "from-blue-400 to-cyan-300",
  },
  {
    id: 7,
    destination: "Rishikesh",
    state: "Uttarakhand",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=900&fit=crop",
    description: "White water rafting on the Ganga through Rishikesh — the yoga capital of the world meets the adventure capital. Sacred vibes meet adrenaline rushes.",
    hashtags: ["Rishikesh", "Rafting", "YogaCapital", "AdventureIndia"],
    views: "2.9M",
    likes: 173600,
    creator: "thrill_seeker_india",
    duration: "1:08",
    vibe: "Adventure",
    vibeColor: "from-emerald-500 to-green-400",
  },
  {
    id: 8,
    destination: "Andaman",
    state: "Andaman & Nicobar",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=900&fit=crop",
    description: "Radhanagar Beach at sunset — rated Asia's best beach. The turquoise waters meet white sand in a spectacle so perfect it feels computer-generated.",
    hashtags: ["Andaman", "TropicalIndia", "IslandLife", "BeachParadise"],
    views: "4.8M",
    likes: 301200,
    creator: "island_chronicles",
    duration: "0:49",
    vibe: "Tropical",
    vibeColor: "from-teal-500 to-cyan-400",
  },
];

function formatLikes(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

export default function ReelsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Set<number>>(() => {
    const saved = localStorage.getItem("wander_liked_reels");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [saved, setSaved] = useState<Set<number>>(() => {
    const s = localStorage.getItem("wander_saved_reels");
    return s ? new Set(JSON.parse(s)) : new Set();
  });
  const [muted, setMuted] = useState(true);
  const [showShare, setShowShare] = useState<number | null>(null);
  const [likeBurst, setLikeBurst] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const reel = REELS[currentIndex];

  const startProgress = useCallback(() => {
    setProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
    const duration = 8000;
    const step = 100 / (duration / 50);
    progressRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setCurrentIndex(i => (i + 1) % REELS.length);
          return 0;
        }
        return p + step;
      });
    }, 50);
  }, []);

  useEffect(() => {
    startProgress();
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [currentIndex, startProgress]);

  const goTo = (idx: number) => {
    setCurrentIndex(idx);
    setProgress(0);
  };

  const handleLike = (id: number) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem("wander_liked_reels", JSON.stringify([...next]));
      return next;
    });
    setLikeBurst(id);
    setTimeout(() => setLikeBurst(null), 700);
  };

  const handleSave = (id: number) => {
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem("wander_saved_reels", JSON.stringify([...next]));
      return next;
    });
  };

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 40) goTo(Math.min(currentIndex + 1, REELS.length - 1));
    else if (e.deltaY < -40) goTo(Math.max(currentIndex - 1, 0));
  }, [currentIndex]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const totalSaved = saved.size;

  return (
    <div className="bg-black min-h-screen overflow-hidden">
      <Navbar />

      <div ref={containerRef} className="flex h-screen pt-20">
        {/* Reels Feed */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.4 }}
              className="relative w-full max-w-sm mx-auto"
              style={{ height: "calc(100vh - 80px)" }}
            >
              {/* Background Image */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <img
                  src={reel.image}
                  alt={reel.destination}
                  className="w-full h-full object-cover"
                  onDoubleClick={() => handleLike(reel.id)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />
              </div>

              {/* Top Bar */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${reel.vibeColor} text-black`}>
                    {reel.vibe}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs text-white/80 bg-white/10 backdrop-blur-sm flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {reel.views}
                  </span>
                </div>
                <button
                  onClick={() => setMuted(m => !m)}
                  className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white"
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Progress Bar */}
              <div className="absolute top-16 left-4 right-4 z-10">
                <div className="flex gap-1">
                  {REELS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
                    >
                      <div
                        className="h-full bg-white transition-none"
                        style={{ width: i < currentIndex ? "100%" : i === currentIndex ? `${progress}%` : "0%" }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Play icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
                >
                  <Play className="w-7 h-7 text-white fill-white ml-1" />
                </motion.div>
              </div>

              {/* Like Burst */}
              <AnimatePresence>
                {likeBurst === reel.id && (
                  <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                  >
                    <Heart className="w-20 h-20 text-red-500 fill-red-500" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Content */}
              <div className="absolute bottom-4 left-4 right-16 z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-black">
                    {reel.creator[0].toUpperCase()}
                  </div>
                  <span className="text-white text-sm font-semibold">@{reel.creator}</span>
                  <span className="text-white/40">·</span>
                  <span className="text-white/60 text-xs">{reel.duration}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-amber-400 font-semibold text-sm">{reel.destination}</span>
                  <span className="text-white/50 text-xs">{reel.state}</span>
                </div>
                <p className="text-white/85 text-sm leading-relaxed line-clamp-3 mb-3">
                  {reel.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {reel.hashtags.map(tag => (
                    <span key={tag} className="flex items-center gap-0.5 text-cyan-400 text-xs font-medium">
                      <Hash className="w-3 h-3" />{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="absolute right-3 bottom-20 z-10 flex flex-col items-center gap-5">
                <button
                  onClick={() => handleLike(reel.id)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <motion.div
                    whileTap={{ scale: 1.4 }}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${liked.has(reel.id) ? "bg-red-500/20" : "bg-black/40 backdrop-blur-sm"}`}
                  >
                    <Heart className={`w-5 h-5 ${liked.has(reel.id) ? "text-red-500 fill-red-500" : "text-white"}`} />
                  </motion.div>
                  <span className="text-white text-xs">{formatLikes(reel.likes + (liked.has(reel.id) ? 1 : 0))}</span>
                </button>

                <button
                  onClick={() => handleSave(reel.id)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <motion.div
                    whileTap={{ scale: 1.4 }}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${saved.has(reel.id) ? "bg-amber-500/20" : "bg-black/40 backdrop-blur-sm"}`}
                  >
                    <Bookmark className={`w-5 h-5 ${saved.has(reel.id) ? "text-amber-400 fill-amber-400" : "text-white"}`} />
                  </motion.div>
                  <span className="text-white text-xs">Save</span>
                </button>

                <button
                  onClick={() => setShowShare(reel.id)}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition-all">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white text-xs">Share</span>
                </button>

                <Link href={`/destinations`}>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center hover:opacity-90 transition-all">
                      <MapPin className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-white text-xs">Explore</span>
                  </div>
                </Link>
              </div>

              {/* Nav Arrows */}
              <button
                onClick={() => goTo(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="absolute left-1/2 -translate-x-1/2 top-20 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-white disabled:opacity-20 transition-all"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <button
                onClick={() => goTo(Math.min(REELS.length - 1, currentIndex + 1))}
                disabled={currentIndex === REELS.length - 1}
                className="absolute left-1/2 -translate-x-1/2 bottom-3 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-white disabled:opacity-20 transition-all"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:flex flex-col w-72 p-6 gap-4 overflow-y-auto">
          {/* Saved Count */}
          {totalSaved > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-4 border border-amber-500/20"
            >
              <div className="flex items-center gap-2 mb-1">
                <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-amber-400 font-semibold text-sm">Saved Reels</span>
              </div>
              <p className="text-white text-2xl font-black">{totalSaved}</p>
              <p className="text-white/50 text-xs mt-0.5">destination{totalSaved > 1 ? "s" : ""} saved to wishlist</p>
            </motion.div>
          )}

          {/* Trending */}
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-semibold text-sm">Trending Now</span>
            </div>
            <div className="space-y-1">
              {REELS.map((r, i) => (
                <button
                  key={r.id}
                  onClick={() => goTo(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${i === currentIndex ? "bg-amber-500/15 border border-amber-500/30" : "hover:bg-white/5"}`}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                    <img src={r.image} alt={r.destination} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{r.destination}</div>
                    <div className="text-white/50 text-xs flex items-center gap-1">
                      <Eye className="w-2.5 h-2.5" />{r.views}
                    </div>
                  </div>
                  {i === currentIndex && (
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Trending hashtags */}
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Hash className="w-4 h-4 text-purple-400" />
              <span className="text-white font-semibold text-sm">Trending Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {["IncredibleIndia","GoaBeach","Ladakh","Himalaya","KeralaBackwaters","RajasthanDiaries","GangaAarti","IslandLife","AdventureIndia","SpiritualTravel"].map(tag => (
                <span key={tag} className="px-2 py-1 rounded-full bg-white/5 text-cyan-400 text-xs font-medium hover:bg-white/10 cursor-pointer transition-all">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShare !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setShowShare(null)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="glass-card rounded-t-3xl p-6 w-full max-w-sm mb-0"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-bold text-lg">Share this Reel</span>
                <button onClick={() => setShowShare(null)}>
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: "WhatsApp", color: "bg-green-500/20 text-green-400" },
                  { label: "Instagram", color: "bg-pink-500/20 text-pink-400" },
                  { label: "Twitter/X", color: "bg-blue-500/20 text-blue-400" },
                  { label: "Copy Link", color: "bg-white/10 text-white/70" },
                ].map(({ label, color }) => (
                  <button
                    key={label}
                    onClick={() => setShowShare(null)}
                    className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl ${color} transition-all hover:scale-105`}
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-white/5 rounded-xl">
                <span className="text-white/50 text-sm flex-1 truncate">wanderindia.app/reels/{showShare}</span>
                <button
                  onClick={() => setShowShare(null)}
                  className="text-amber-400 text-sm font-semibold shrink-0"
                >
                  Copy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
