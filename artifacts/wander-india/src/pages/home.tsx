import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Brain, Map, Sun, Plane, DollarSign, Package,
  MessageSquare, Gem, ArrowRight, Zap,
  Wind, Mountain, Heart, Music, Users, Smile, ChevronLeft, ChevronRight
} from "lucide-react";

const BG_SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1920&q=80",
    label: "Goa Beaches",
  },
  {
    url: "https://images.unsplash.com/photo-1477587458883-47145ed4e85c?auto=format&fit=crop&w=1920&q=80",
    label: "Rajasthan Palaces",
  },
  {
    url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=80",
    label: "Kerala Backwaters",
  },
  {
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=80",
    label: "Ladakh Himalayas",
  },
  {
    url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80",
    label: "Himachal Pradesh",
  },
];

const MOODS = [
  { id: "relaxed", label: "Relaxed", icon: Sun, color: "from-blue-400 to-cyan-400" },
  { id: "adventurous", label: "Adventure", icon: Mountain, color: "from-orange-400 to-red-400" },
  { id: "romantic", label: "Romantic", icon: Heart, color: "from-pink-400 to-rose-400" },
  { id: "energetic", label: "Energetic", icon: Zap, color: "from-yellow-400 to-orange-400" },
  { id: "stressed", label: "Stressed", icon: Wind, color: "from-indigo-400 to-purple-400" },
  { id: "party", label: "Party", icon: Music, color: "from-purple-400 to-pink-400" },
  { id: "family", label: "Family", icon: Users, color: "from-green-400 to-teal-400" },
  { id: "lonely", label: "Solo", icon: Smile, color: "from-cyan-400 to-blue-400" },
];

const QUICK_LINKS = [
  { href: "/destinations", icon: Map, label: "Explore Destinations", color: "from-cyan-500/20 to-cyan-500/5", border: "border-cyan-500/20", text: "text-cyan-400" },
  { href: "/ai-planner", icon: Brain, label: "AI Itinerary", color: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/20", text: "text-amber-400" },
  { href: "/hidden-gems", icon: Gem, label: "Hidden Gems", color: "from-purple-500/20 to-purple-500/5", border: "border-purple-500/20", text: "text-purple-400" },
  { href: "/chat", icon: MessageSquare, label: "AI Travel Chat", color: "from-pink-500/20 to-pink-500/5", border: "border-pink-500/20", text: "text-pink-400" },
  { href: "/packing", icon: Package, label: "Packing List", color: "from-green-500/20 to-green-500/5", border: "border-green-500/20", text: "text-green-400" },
  { href: "/budget", icon: DollarSign, label: "Budget Tracker", color: "from-orange-500/20 to-orange-500/5", border: "border-orange-500/20", text: "text-orange-400" },
];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide(prev => (prev + 1) % BG_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx: number) => {
    setDirection(idx > currentSlide ? 1 : -1);
    setCurrentSlide(idx);
  };

  const prev = () => {
    setDirection(-1);
    setCurrentSlide(prev => (prev - 1 + BG_SLIDES.length) % BG_SLIDES.length);
  };

  const next = () => {
    setDirection(1);
    setCurrentSlide(prev => (prev + 1) % BG_SLIDES.length);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(search.trim() ? `/destinations?search=${encodeURIComponent(search)}` : "/destinations");
  };

  const handleMoodSelect = (moodId: string) => {
    setLocation(`/mood-planner?mood=${moodId}`);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">

        {/* ── Sliding background images ── */}
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={{
                enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${BG_SLIDES[currentSlide].url})` }}
            />
          </AnimatePresence>

          {/* Dark overlay — keeps text readable */}
          <div className="absolute inset-0 bg-black/65" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(245,158,11,0.10) 0%, transparent 70%)" }} />
          <div className="absolute inset-0 bg-grid opacity-20" />
        </div>

        {/* Slide nav arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide dots */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {BG_SLIDES.map((slide, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${i === currentSlide ? "w-8 bg-amber-400" : "w-2 bg-white/30"}`}
              aria-label={slide.label}
            />
          ))}
        </div>

        {/* Current location label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 text-white/60 text-sm"
          >
            <Map className="w-3.5 h-3.5 text-amber-400" />
            {BG_SLIDES[currentSlide].label}
          </motion.div>
        </AnimatePresence>

        {/* ── Main content ── */}
        <div className="relative z-10 w-full max-w-5xl mx-auto pt-28 pb-20 flex flex-col items-center text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-sm font-medium mb-8 backdrop-blur-sm"
          >
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Travel Planning for India
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-tight mb-6 drop-shadow-2xl"
          >
            <span className="text-white">Discover</span>
            <br />
            <span className="text-gradient-amber">Incredible India</span>
            <br />
            <span className="text-white">with AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow"
          >
            Your emotionally intelligent travel companion. Plan your perfect Indian journey — from Ladakh peaks to Kerala backwaters.
          </motion.p>

          {/* Search */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            onSubmit={handleSearch}
            className="flex gap-3 w-full max-w-xl mx-auto mb-8"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search — Goa, Ladakh, Kerala..."
                className="pl-11 h-14 bg-black/40 border-white/20 text-white placeholder:text-white/40 rounded-2xl text-base backdrop-blur-sm"
                data-testid="input-search"
              />
            </div>
            <Button
              type="submit"
              className="h-14 px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-2xl border-0 hover:opacity-90 glow-amber"
              data-testid="btn-search"
            >
              Search
            </Button>
          </motion.form>

          {/* Primary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <Link href="/ai-planner">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold h-14 px-8 rounded-2xl border-0 hover:opacity-90 glow-amber text-base"
                data-testid="btn-plan-journey"
              >
                <Brain className="w-5 h-5 mr-2" />
                Plan My AI Journey
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/destinations">
              <Button
                size="lg"
                className="h-14 px-8 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/25 text-white hover:bg-black/60 text-base"
                data-testid="btn-explore"
              >
                <Map className="w-5 h-5 mr-2" />
                Explore Destinations
              </Button>
            </Link>
          </motion.div>

          {/* Quick Feature Links */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="w-full mb-10"
          >
            <p className="text-white/50 text-xs mb-4 uppercase tracking-widest font-semibold">Quick Access</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {QUICK_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.06, y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      className={`rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer border ${item.border} bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all`}
                    >
                      <Icon className={`w-6 h-6 ${item.text}`} />
                      <span className="text-white text-xs font-semibold text-center leading-tight">{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Mood Selector */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="w-full mb-10"
          >
            <p className="text-white/50 text-xs mb-4 uppercase tracking-widest font-semibold">How are you feeling today?</p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {MOODS.map((mood) => {
                const Icon = mood.icon;
                return (
                  <motion.button
                    key={mood.id}
                    whileHover={{ scale: 1.08, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMoodSelect(mood.id)}
                    data-testid={`mood-${mood.id}`}
                    className="rounded-2xl p-3 flex flex-col items-center gap-2 bg-black/40 backdrop-blur-sm border border-white/10 hover:border-white/25 transition-all cursor-pointer group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mood.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-medium text-xs">{mood.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex justify-center gap-10"
          >
            {[["500+", "Destinations"], ["50K+", "Happy Travelers"], ["98%", "Satisfaction Rate"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-black text-gradient-amber drop-shadow">{num}</div>
                <div className="text-xs text-white/50 mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
