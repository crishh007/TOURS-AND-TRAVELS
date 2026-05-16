import { motion } from "framer-motion";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Brain, Map, Sun, DollarSign, Package, MessageSquare,
  Gem, CloudSun, Shield, ArrowRight, CheckCircle2,
  Zap, Star, TrendingUp, Heart, Users, Navigation,
  Calendar, Camera, Bell, Wallet, List, Wind, Mountain, Music, Smile
} from "lucide-react";

const FEATURES = [
  {
    id: "ai-itinerary",
    icon: Brain,
    title: "AI Itinerary Generator",
    tagline: "Your personal travel architect",
    color: "from-amber-400 to-orange-500",
    glow: "glow-amber",
    accent: "text-amber-400",
    border: "border-amber-500/20",
    bg: "from-amber-500/10 to-amber-500/5",
    href: "/ai-planner",
    what: "Enter your destination, travel dates, number of days, and budget — our AI builds a complete day-by-day itinerary instantly. Each day includes morning, afternoon, and evening activities, restaurant suggestions, accommodation type, local tips, and estimated costs.",
    why: [
      "Saves hours of research — get a full plan in seconds, not days",
      "Personalised to your budget so you never overspend",
      "Covers every detail: food, sightseeing, rest, and hidden spots",
      "Adapts to your travel style — adventure, relaxation, culture, or romance",
    ],
    example: "3-day Goa trip → Day 1: Anjuna flea market + beach sunset + shack dinner, Day 2: Old Goa churches + Dudhsagar waterfalls…",
  },
  {
    id: "mood-planner",
    icon: Heart,
    title: "Mood Travel Engine",
    tagline: "Travel the way you feel",
    color: "from-pink-400 to-rose-500",
    glow: "glow-purple",
    accent: "text-pink-400",
    border: "border-pink-500/20",
    bg: "from-pink-500/10 to-pink-500/5",
    href: "/mood-planner",
    what: "Select one of 8 emotional states — Relaxed, Adventurous, Romantic, Energetic, Stressed, Party, Family, or Solo. Our AI maps your mood to the best-matched Indian destinations, activities, accommodation styles, and travel pace that resonate with how you feel right now.",
    why: [
      "No more decision fatigue — let your feelings guide the destination",
      "Matches your energy level so the trip actually recharges you",
      "Discovers places you'd never have thought to search for",
      "Turns 'I need a break' into a real, actionable plan instantly",
    ],
    example: "Feeling Stressed → Kerala Ayurvedic retreat + backwater houseboat + no nightlife, gentle yoga mornings",
  },
  {
    id: "destinations",
    icon: Map,
    title: "Destinations Explorer",
    tagline: "All of India, searchable in seconds",
    color: "from-cyan-400 to-blue-500",
    glow: "glow-cyan",
    accent: "text-cyan-400",
    border: "border-cyan-500/20",
    bg: "from-cyan-500/10 to-cyan-500/5",
    href: "/destinations",
    what: "Browse 500+ Indian destinations filtered by category — Beach, Heritage, Adventure, Nature, Spiritual, Mountains, Island, and Culture. Each destination card shows ratings, best travel time, average daily budget, mood tags, and a direct link to generate an AI itinerary for it.",
    why: [
      "Compare destinations side-by-side with real ratings and budget data",
      "Find the right category for your trip in one click",
      "Live search across state names, destination names, and categories",
      "Goes straight from discovery to itinerary planning in one flow",
    ],
    example: "Filter by 'Beach' → Compare Goa (₹2,500/day) vs Andaman (₹4,500/day) vs Pondicherry (₹1,800/day)",
  },
  {
    id: "hidden-gems",
    icon: Gem,
    title: "Hidden Gems",
    tagline: "India beyond the postcard",
    color: "from-purple-400 to-violet-500",
    glow: "glow-purple",
    accent: "text-purple-400",
    border: "border-purple-500/20",
    bg: "from-purple-500/10 to-purple-500/5",
    href: "/hidden-gems",
    what: "A curated collection of India's lesser-known destinations — places that don't appear on typical tourist itineraries. Spiti Valley, Majuli River Island, Hampi ruins, Ziro Valley, Rann of Kutch — each with detailed descriptions, travel tips, and best time to visit.",
    why: [
      "Escape overcrowded tourist spots and experience authentic India",
      "Lower costs — fewer tourists means better prices",
      "Richer cultural immersion without the commercial tourism layer",
      "Stories worth telling — destinations your friends haven't been to",
    ],
    example: "Majuli, Assam — world's largest river island with Vaishnavite monasteries, mask-making villages, and no crowds",
  },
  {
    id: "budget",
    icon: DollarSign,
    title: "Smart Budget Tracker",
    tagline: "Never run out of rupees mid-trip",
    color: "from-green-400 to-emerald-500",
    glow: "glow-cyan",
    accent: "text-green-400",
    border: "border-green-500/20",
    bg: "from-green-500/10 to-green-500/5",
    href: "/budget",
    what: "Set a total budget for each trip, then log every expense by category — Food, Transport, Accommodation, Activities, Shopping, and Miscellaneous. Visual progress bars show spending vs. budget in real time. See breakdowns per category and across all trips.",
    why: [
      "Prevents the shock of overspending until your card declines",
      "Category breakdowns reveal where your money actually goes",
      "Helps you make smarter trade-offs (skip that resort, gain 3 extra days)",
      "Historical data lets you budget future trips more accurately",
    ],
    example: "₹20,000 Himachal budget: ₹6,000 accommodation (30%), ₹4,500 food (22%), ₹5,000 transport (25%)…",
  },
  {
    id: "chat",
    icon: MessageSquare,
    title: "AI Travel Assistant",
    tagline: "A travel expert in your pocket, 24/7",
    color: "from-pink-400 to-fuchsia-500",
    glow: "glow-purple",
    accent: "text-pink-400",
    border: "border-pink-500/20",
    bg: "from-fuchsia-500/10 to-fuchsia-500/5",
    href: "/chat",
    what: "A conversational AI chatbot with deep knowledge of India travel — visa rules, train booking tips, local customs, food recommendations, scam awareness, packing advice, health precautions, and more. Ask anything, get detailed answers instantly. Quick-reply suggestions help when you're not sure what to ask.",
    why: [
      "Answers the questions you'd normally Google across 10 different sites",
      "Available at 3am when you realize you don't know the train schedule",
      "Context-aware — remembers what destination you're discussing",
      "Covers etiquette, safety, language, food — the full picture, not just attractions",
    ],
    example: "Ask: 'Is it safe to travel solo to Rajasthan as a woman?' → Detailed, honest, actionable answer with specific tips",
  },
  {
    id: "packing",
    icon: Package,
    title: "AI Packing Lists",
    tagline: "Pack right the first time, every time",
    color: "from-orange-400 to-red-500",
    glow: "glow-amber",
    accent: "text-orange-400",
    border: "border-orange-500/20",
    bg: "from-orange-500/10 to-orange-500/5",
    href: "/packing",
    what: "Enter your destination, activities (trekking, beach, temple visits, city), and season. AI generates a customised packing checklist with items grouped by category — Clothing, Toiletries, Documents, Electronics, Health, and Miscellaneous. Tick off items as you pack them.",
    why: [
      "No more arriving in Ladakh without altitude sickness tablets",
      "Activity-aware — beach trip list vs. Himalayan trek list are completely different",
      "Season-aware — monsoon Goa needs a rain jacket, not sunscreen",
      "Interactive checkboxes so packing becomes a satisfying to-do list",
    ],
    example: "Spiti Valley Trek, October → Thermal layers, crampons, altitude medicine, satellite map, warm sleeping bag, UV sunscreen…",
  },
  {
    id: "weather",
    icon: CloudSun,
    title: "Live Weather Integration",
    tagline: "Know before you go",
    color: "from-sky-400 to-cyan-500",
    glow: "glow-cyan",
    accent: "text-sky-400",
    border: "border-sky-500/20",
    bg: "from-sky-500/10 to-sky-500/5",
    href: "/destinations",
    what: "Each destination page shows current weather conditions — temperature, humidity, wind speed, UV index, and a condition description (Sunny, Cloudy, Rainy, etc.). Also shows the historical best and worst months to visit so you can plan your travel window intelligently.",
    why: [
      "Avoids the painful surprise of monsoon floods in your beach destination",
      "Helps pack the right clothes before you leave home",
      "Informs your activity choices — don't book a trek in a storm week",
      "Combines with itinerary planner for weather-optimised daily plans",
    ],
    example: "Manali, June → 18°C, 72% humidity, overcast — AI flags: 'Rohtang Pass may be closed, plan for indoor Kullu Valley activities'",
  },
  {
    id: "trips",
    icon: Calendar,
    title: "My Trips Manager",
    tagline: "All your adventures, organised",
    color: "from-teal-400 to-green-500",
    glow: "glow-cyan",
    accent: "text-teal-400",
    border: "border-teal-500/20",
    bg: "from-teal-500/10 to-teal-500/5",
    href: "/trips",
    what: "Create and manage all your planned, active, and completed trips in one place. Each trip card shows destination, dates, budget, current spending, status (Planned / Active / Completed), and a budget progress bar. Add expenses directly from the trip page.",
    why: [
      "One dashboard for your entire travel history and future plans",
      "Budget progress bar catches overspending before it happens",
      "Status tracking keeps you focused on what's upcoming vs. done",
      "All your trips' expenses flow into the Budget Tracker automatically",
    ],
    example: "Trips list: Kerala Backwaters (Completed ✓), Leh-Ladakh (Planned — 32 days away), Rishikesh (Active 🟢 Day 2 of 5)",
  },
  {
    id: "emergency",
    icon: Shield,
    title: "Emergency Safety Guide",
    tagline: "Stay safe anywhere in India",
    color: "from-red-400 to-rose-500",
    glow: "glow-amber",
    accent: "text-red-400",
    border: "border-red-500/20",
    bg: "from-red-500/10 to-red-500/5",
    href: "/emergency",
    what: "A comprehensive emergency reference with all critical India helpline numbers — Police (100), Ambulance (108), Women's Helpline (1091), Tourist Helpline (1800-11-1363), Fire (101), Disaster Relief (108), and more. One-tap calling from mobile. Plus essential safety tips for Indian travel.",
    why: [
      "Emergencies don't wait for you to search Google — have the numbers ready",
      "Tap-to-call means you can reach help in seconds",
      "Covers medical, legal, and safety emergencies in one place",
      "Peace of mind for solo travelers, families, and first-time India visitors",
    ],
    example: "You're in Varanasi at 2am and feel unsafe — one tap opens the Women's Helpline (1091) without any searching",
  },
];

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className={`glass-card rounded-3xl overflow-hidden border ${feature.border}`}
    >
      {/* Header */}
      <div className={`bg-gradient-to-br ${feature.bg} px-8 pt-8 pb-6 border-b border-white/5`}>
        <div className="flex items-start gap-5">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className={`text-xs font-bold uppercase tracking-widest ${feature.accent} mb-1`}>{feature.tagline}</p>
            <h2 className="text-2xl font-black text-white leading-tight">{feature.title}</h2>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-8 py-6 space-y-6">
        {/* What it does */}
        <div>
          <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" /> What it does
          </h3>
          <p className="text-white/80 leading-relaxed text-sm">{feature.what}</p>
        </div>

        {/* Why it benefits you */}
        <div>
          <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
            <Star className="w-3.5 h-3.5 fill-current" /> Why it benefits you
          </h3>
          <ul className="space-y-2">
            {feature.why.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className={`w-4 h-4 ${feature.accent} flex-shrink-0 mt-0.5`} />
                <span className="text-white/70 text-sm leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Real example */}
        <div className={`bg-gradient-to-br ${feature.bg} rounded-2xl px-5 py-4 border ${feature.border}`}>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Navigation className="w-3 h-3" /> Real example
          </p>
          <p className={`text-sm ${feature.accent} font-medium leading-relaxed`}>{feature.example}</p>
        </div>

        {/* CTA */}
        <Link href={feature.href}>
          <Button className={`w-full h-11 rounded-xl bg-gradient-to-r ${feature.color} text-black font-bold border-0 hover:opacity-90 text-sm`}>
            Try {feature.title} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(245,158,11,0.12) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-32 pb-16 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-8">
              <TrendingUp className="w-3.5 h-3.5" />
              10 Powerful Features
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-white leading-tight mb-6"
          >
            Everything you need to{" "}
            <span className="text-gradient-amber">explore India</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10"
          >
            WanderIndia combines AI intelligence with deep local knowledge to give every traveler — beginner or expert — the tools to plan a perfect Indian journey.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/register">
              <Button className="h-13 px-8 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-2xl border-0 glow-amber text-base h-12">
                Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/ai-planner">
              <Button variant="outline" className="h-12 px-8 rounded-2xl border-white/20 text-white hover:bg-white/5 text-base">
                <Brain className="w-4 h-4 mr-2" /> Try AI Planner
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Feature cards grid */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.id} feature={feature} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-card rounded-3xl p-12 text-center mt-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-purple-500/10" />
          <div className="relative z-10">
            <div className="flex justify-center gap-3 mb-6">
              {[Brain, Heart, Gem, Shield].map((Icon, i) => (
                <div key={i} className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-amber-400" />
                </div>
              ))}
            </div>
            <h2 className="text-4xl font-black text-white mb-4">Ready to plan your next adventure?</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Join 50,000+ travelers who've discovered Incredible India with AI-powered planning. It's free to get started.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold h-14 px-10 rounded-2xl border-0 glow-amber hover:opacity-90">
                  Create Free Account <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/destinations">
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl border-white/20 text-white hover:bg-white/5">
                  <Map className="w-5 h-5 mr-2" /> Explore Destinations
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
