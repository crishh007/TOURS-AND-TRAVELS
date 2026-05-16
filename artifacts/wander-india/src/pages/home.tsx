import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useGetTrendingDestinations, useGetHiddenGems } from "@workspace/api-client-react";
import Navbar from "@/components/Navbar";
import DestinationCard from "@/components/DestinationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Brain, Map, Sun, Plane, DollarSign, Package,
  MessageSquare, Gem, Star, ArrowRight, Zap, ChevronRight,
  Wind, Mountain, Waves, Heart, Music, Users, Smile
} from "lucide-react";

const MOODS = [
  { id: "relaxed", label: "Relaxed", icon: Sun, color: "from-blue-400 to-cyan-400" },
  { id: "adventurous", label: "Adventurous", icon: Mountain, color: "from-orange-400 to-red-400" },
  { id: "romantic", label: "Romantic", icon: Heart, color: "from-pink-400 to-rose-400" },
  { id: "energetic", label: "Energetic", icon: Zap, color: "from-yellow-400 to-orange-400" },
  { id: "stressed", label: "Stressed", icon: Wind, color: "from-indigo-400 to-purple-400" },
  { id: "party", label: "Party", icon: Music, color: "from-purple-400 to-pink-400" },
  { id: "family", label: "Family", icon: Users, color: "from-green-400 to-teal-400" },
  { id: "lonely", label: "Solo", icon: Smile, color: "from-cyan-400 to-blue-400" },
];

const FEATURES = [
  { icon: Brain, title: "AI Itinerary Generation", desc: "Get personalized day-by-day travel plans crafted by AI in seconds", color: "text-amber-400" },
  { icon: Sun, title: "Mood-Based Planning", desc: "Tell us how you feel and we'll find the perfect Indian destination for you", color: "text-cyan-400" },
  { icon: Map, title: "Live Weather Integration", desc: "Real-time weather data for all destinations across India", color: "text-purple-400" },
  { icon: DollarSign, title: "Smart Budget Tracker", desc: "Track every rupee spent and stay on budget throughout your journey", color: "text-green-400" },
  { icon: MessageSquare, title: "AI Travel Assistant", desc: "24/7 AI chatbot with expert knowledge of every corner of India", color: "text-pink-400" },
  { icon: Package, title: "AI Packing Lists", desc: "Smart packing checklists tailored to your destination and activities", color: "text-orange-400" },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", location: "Mumbai", text: "WanderIndia's AI planned my Rajasthan trip in minutes. It felt like having a travel expert friend!", rating: 5, avatar: "PS" },
  { name: "Arjun Mehta", location: "Bengaluru", text: "The mood-based planner is genius. I said 'stressed' and it sent me to a silent Kerala retreat. Life-changing.", rating: 5, avatar: "AM" },
  { name: "Sneha Patel", location: "Ahmedabad", text: "Best travel app for India. The budget tracker saved me ₹15,000 on my Himachal trip!", rating: 5, avatar: "SP" },
];

// Floating particles
function Particle({ x, y, delay }: { x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-amber-400/30"
      style={{ left: x, top: y }}
      animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
      transition={{ duration: 4 + delay, repeat: Infinity, delay }}
    />
  );
}

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { data: trending = [], isLoading: trendingLoading } = useGetTrendingDestinations();
  const { data: hiddenGems = [], isLoading: gemsLoading } = useGetHiddenGems();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setLocation(`/destinations?search=${encodeURIComponent(search)}`);
    }
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setLocation(`/mood-planner?mood=${moodId}`);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-0 bg-gradient-radial from-amber-500/10 via-transparent to-transparent" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(245,158,11,0.12) 0%, transparent 70%)" }} />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

        {/* Particles */}
        {[...Array(20)].map((_, i) => (
          <Particle key={i} x={`${5 + i * 5}%`} y={`${10 + (i % 7) * 12}%`} delay={i * 0.3} />
        ))}

        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-32 pb-20 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-8"
          >
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Travel Planning for India
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-tight mb-6"
          >
            <span className="text-white">Discover</span>
            <br />
            <span className="text-gradient-amber font-black">Incredible India</span>
            <br />
            <span className="text-white">with AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Your emotionally intelligent travel companion. From the peaks of Ladakh to the backwaters of Kerala — plan your perfect Indian journey with the power of AI.
          </motion.p>

          {/* Search */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            onSubmit={handleSearch}
            className="flex gap-3 max-w-xl mx-auto mb-12"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search destinations — Goa, Ladakh, Kerala..."
                className="pl-11 h-14 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground rounded-2xl text-base"
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

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/ai-planner">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold h-14 px-8 rounded-2xl border-0 hover:opacity-90 glow-amber text-base"
                data-testid="btn-plan-journey"
              >
                <Brain className="w-5 h-5 mr-2" />
                Plan My AI Journey
              </Button>
            </Link>
            <Link href="/destinations">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 rounded-2xl border-white/20 text-white hover:bg-white/5 text-base"
                data-testid="btn-explore"
              >
                <Map className="w-5 h-5 mr-2" />
                Explore Destinations
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex justify-center gap-10 mt-16"
          >
            {[["500+", "Destinations"], ["50K+", "Happy Travelers"], ["98%", "Satisfaction Rate"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-black text-gradient-amber">{num}</div>
                <div className="text-xs text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2"
        >
          <div className="w-1 h-2 bg-amber-400 rounded-full" />
        </motion.div>
      </section>

      {/* Mood Selector */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm text-amber-400 font-semibold uppercase tracking-wider">Emotionally Intelligent</span>
            <h2 className="text-4xl font-black text-white mt-2 mb-4">How are you feeling today?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Our AI reads your mood and recommends the perfect Indian destination for exactly how you feel right now.</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {MOODS.map((mood, i) => {
              const Icon = mood.icon;
              return (
                <motion.button
                  key={mood.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleMoodSelect(mood.id)}
                  data-testid={`mood-${mood.id}`}
                  className="glass-card rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-white/20 transition-all cursor-pointer group"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mood.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-white font-semibold text-sm">{mood.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending Destinations */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-sm text-amber-400 font-semibold uppercase tracking-wider">Trending Now</span>
              <h2 className="text-3xl font-black text-white mt-1">Hot Destinations</h2>
            </div>
            <Link href="/destinations">
              <Button variant="ghost" className="text-white/70 hover:text-white gap-2">
                View All <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {trendingLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass-card rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trending.slice(0, 6).map((dest, i) => (
                <DestinationCard key={dest.id} destination={dest} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sm text-cyan-400 font-semibold uppercase tracking-wider">Everything You Need</span>
            <h2 className="text-4xl font-black text-white mt-2 mb-4">Next-Gen Travel Tools</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">AI-powered features that make planning your Indian adventure effortless, personal, and exciting.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <Icon className={`w-8 h-8 ${f.color} mb-4`} />
                  <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hidden Gems */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-sm text-purple-400 font-semibold uppercase tracking-wider">Off the Beaten Path</span>
              <h2 className="text-3xl font-black text-white mt-1">Hidden Gems of India</h2>
            </div>
            <Link href="/hidden-gems">
              <Button variant="ghost" className="text-white/70 hover:text-white gap-2">
                Discover More <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {gemsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (<div key={i} className="glass-card rounded-2xl h-72 animate-pulse" />))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hiddenGems.slice(0, 3).map((dest, i) => (
                <DestinationCard key={dest.id} destination={dest} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm text-amber-400 font-semibold uppercase tracking-wider">Loved by Travelers</span>
            <h2 className="text-3xl font-black text-white mt-2">Real Stories, Real Adventures</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-muted-foreground text-xs">{t.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-purple-500/10" />
            <div className="relative z-10">
              <Plane className="w-12 h-12 text-amber-400 mx-auto mb-6 animate-float" />
              <h2 className="text-4xl font-black text-white mb-4">Ready to Wander India?</h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">Join thousands of travelers who've discovered the magic of India with our AI-powered travel planner.</p>
              <div className="flex justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold h-14 px-10 rounded-2xl border-0 glow-amber hover:opacity-90" data-testid="btn-start-free">
                    Start Free Today <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl border-white/20 text-white hover:bg-white/5">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Talk to AI Guide
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Plane className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-lg">
              <span className="text-gradient-amber">Wander</span>
              <span className="text-white">India</span>
            </span>
          </div>
          <div className="flex gap-6">
            {[
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
              { href: "/emergency", label: "Emergency" },
            ].map(link => (
              <Link key={link.href} href={link.href}>
                <span className="text-muted-foreground hover:text-white text-sm transition-colors">{link.label}</span>
              </Link>
            ))}
          </div>
          <p className="text-muted-foreground text-sm">© 2025 WanderIndia. Explore Incredible India.</p>
        </div>
      </footer>
    </div>
  );
}
