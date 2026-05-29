import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Star, MapPin, Search, Clock, Phone, X, SlidersHorizontal,
  ChevronDown, ChevronUp, Check, Utensils, Flame, Leaf,
  BadgePercent, Sparkles, Users, Calendar, ExternalLink,
  Coffee, Fish, Beef, Soup
} from "lucide-react";

interface Restaurant {
  id: number;
  name: string;
  destination: string;
  state: string;
  cuisine: string[];
  category: "Fine Dining" | "Casual" | "Street Food" | "Cafe" | "Rooftop" | "Dhaba";
  image: string;
  rating: number;
  reviews: number;
  priceForTwo: number;
  openNow: boolean;
  hours: string;
  phone: string;
  description: string;
  tags: string[];
  badge?: string;
  mustTry: string[];
  distance: string;
  vegetarian: boolean;
}

const RESTAURANTS: Restaurant[] = [
  {
    id: 1,
    name: "Spice Route",
    destination: "Delhi",
    state: "Delhi",
    cuisine: ["Pan-Asian", "Indian"],
    category: "Fine Dining",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    rating: 4.8,
    reviews: 3241,
    priceForTwo: 6000,
    openNow: true,
    hours: "12:00 PM – 11:30 PM",
    phone: "+91 11 2302 6162",
    description: "A legendary restaurant inside The Imperial Hotel, recreating the flavours of the ancient Spice Route from Kerala to Thailand. Breathtaking hand-painted murals, rare spices, and recipes passed down through centuries.",
    tags: ["Award Winning", "Heritage", "Exotic"],
    badge: "Legendary",
    mustTry: ["Kerala Prawn Curry", "Burmese Khow Suey", "Spice Route Thali"],
    distance: "2.3 km",
    vegetarian: false,
  },
  {
    id: 2,
    name: "Karavalli",
    destination: "Bengaluru",
    state: "Karnataka",
    cuisine: ["Coastal", "Karnataka", "Seafood"],
    category: "Fine Dining",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
    rating: 4.7,
    reviews: 2187,
    priceForTwo: 3500,
    openNow: true,
    hours: "12:30 PM – 3:00 PM, 7:00 PM – 11:00 PM",
    phone: "+91 80 6660 5050",
    description: "Set in a heritage bungalow with a coconut grove garden, Karavalli serves the finest coastal cuisine from Karnataka, Kerala, and Goa. Every dish tells the story of India's sun-soaked coastline.",
    tags: ["Seafood Paradise", "Heritage Setting", "Garden Dining"],
    badge: "Must Visit",
    mustTry: ["Crab Gassi", "Kori Rotti", "Neer Dosa"],
    distance: "1.8 km",
    vegetarian: false,
  },
  {
    id: 3,
    name: "Bukhara",
    destination: "Delhi",
    state: "Delhi",
    cuisine: ["North Indian", "Mughlai", "Kebabs"],
    category: "Fine Dining",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=400&fit=crop",
    rating: 4.9,
    reviews: 4532,
    priceForTwo: 8000,
    openNow: true,
    hours: "12:30 PM – 2:45 PM, 7:00 PM – 11:45 PM",
    phone: "+91 11 2611 0101",
    description: "India's most iconic restaurant, beloved by heads of state and presidents. The Dal Bukhara has been simmering on the same tandoor for over 40 years. No cutlery — just hands, flavour, and tradition.",
    tags: ["Presidential Favourite", "No Cutlery", "40 Years Old"],
    badge: "Icon",
    mustTry: ["Dal Bukhara", "Sikandari Raan", "Tandoori Lobster"],
    distance: "4.1 km",
    vegetarian: false,
  },
  {
    id: 4,
    name: "Cafe Mondegar",
    destination: "Mumbai",
    state: "Maharashtra",
    cuisine: ["Continental", "Indian", "Snacks"],
    category: "Cafe",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop",
    rating: 4.4,
    reviews: 6891,
    priceForTwo: 1200,
    openNow: true,
    hours: "8:00 AM – 11:30 PM",
    phone: "+91 22 2202 0591",
    description: "Since 1932, Mondegar has been the heartbeat of Colaba. Mario Miranda's iconic murals line the walls while cold Kingfisher flows freely. The most beloved cafe in Mumbai — forever timeless.",
    tags: ["Mumbai Icon", "Since 1932", "Mario Miranda Murals"],
    badge: "Heritage Cafe",
    mustTry: ["Chicken Frankie", "Cold Coffee", "Schnitzel"],
    distance: "0.8 km",
    vegetarian: false,
  },
  {
    id: 5,
    name: "Saravanaa Bhavan",
    destination: "Chennai",
    state: "Tamil Nadu",
    cuisine: ["South Indian", "Tamil"],
    category: "Casual",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop",
    rating: 4.6,
    reviews: 9124,
    priceForTwo: 600,
    openNow: true,
    hours: "7:00 AM – 11:00 PM",
    phone: "+91 44 4211 4040",
    description: "The world's most famous South Indian vegetarian restaurant chain — started as a single outlet in Chennai and now spans the globe. No trip to South India is complete without a banana leaf meal here.",
    tags: ["Global Chain", "Pure Veg", "Authentic"],
    mustTry: ["Masala Dosa", "Filter Coffee", "Meals (Banana Leaf)"],
    distance: "1.2 km",
    vegetarian: true,
  },
  {
    id: 6,
    name: "Rooftop Sunset Bar & Grill",
    destination: "Udaipur",
    state: "Rajasthan",
    cuisine: ["Indian", "Continental", "Grills"],
    category: "Rooftop",
    image: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&h=400&fit=crop",
    rating: 4.5,
    reviews: 2341,
    priceForTwo: 2200,
    openNow: true,
    hours: "11:00 AM – 11:00 PM",
    phone: "+91 294 243 1085",
    description: "Perched above the old city with sweeping views of Lake Pichola and the City Palace, this rooftop restaurant turns every meal into a spectacle. Best at sunset when the lake turns to liquid gold.",
    tags: ["Lake View", "Sunset Dining", "City Palace View"],
    badge: "Best View",
    mustTry: ["Laal Maas", "Lake View Thali", "Mango Lassi"],
    distance: "0.5 km",
    vegetarian: false,
  },
  {
    id: 7,
    name: "Nazeer's Biryani",
    destination: "Hyderabad",
    state: "Telangana",
    cuisine: ["Hyderabadi", "Mughlai", "Biryani"],
    category: "Casual",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop",
    rating: 4.7,
    reviews: 11203,
    priceForTwo: 800,
    openNow: false,
    hours: "12:00 PM – 4:00 PM, 7:00 PM – 12:00 AM",
    phone: "+91 40 6666 7777",
    description: "Hyderabadi dum biryani cooked in sealed pots over slow fire — the way it was made for the Nizams. Three generations of the same family, the same recipe, the same wood-fire tradition.",
    tags: ["Nizam's Recipe", "Dum Biryani", "3 Generations"],
    badge: "Biryani Legend",
    mustTry: ["Dum Biryani (Mutton)", "Mirchi Ka Salan", "Double Ka Meetha"],
    distance: "3.2 km",
    vegetarian: false,
  },
  {
    id: 8,
    name: "Cafe Coffee Day — Brigade Road",
    destination: "Bengaluru",
    state: "Karnataka",
    cuisine: ["Coffee", "Snacks", "Desserts"],
    category: "Cafe",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop",
    rating: 4.2,
    reviews: 4567,
    priceForTwo: 500,
    openNow: true,
    hours: "8:00 AM – 11:00 PM",
    phone: "+91 80 4163 4141",
    description: "India's coffee revolution started in Bengaluru, and this flagship Brigade Road outlet is where it all happened. Great brews, cozy corners, and the classic Choco Lava Cake that started a dessert movement.",
    tags: ["Coffee Capital", "Flagship Store", "Youth Hangout"],
    mustTry: ["Cold Coffee", "Choco Lava Cake", "Veg Puff"],
    distance: "2.1 km",
    vegetarian: true,
  },
  {
    id: 9,
    name: "Malabar Junction",
    destination: "Kochi",
    state: "Kerala",
    cuisine: ["Kerala", "Seafood", "Malabar"],
    category: "Fine Dining",
    image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&h=400&fit=crop",
    rating: 4.6,
    reviews: 1893,
    priceForTwo: 2800,
    openNow: true,
    hours: "12:00 PM – 3:00 PM, 7:00 PM – 10:30 PM",
    phone: "+91 484 221 6666",
    description: "Hidden in a Fort Kochi heritage villa, Malabar Junction serves authentic Malabar cuisine with European flair. Fresh catch from the Chinese fishing nets arrives daily — you can watch them haul it in from the dining room.",
    tags: ["Heritage Villa", "Daily Fresh Catch", "Fort Kochi"],
    badge: "Chef's Pick",
    mustTry: ["Tiger Prawn Moilee", "Karimeen Pollichathu", "Payasam"],
    distance: "1.4 km",
    vegetarian: false,
  },
  {
    id: 10,
    name: "Kashi Art Cafe",
    destination: "Kochi",
    state: "Kerala",
    cuisine: ["Continental", "Breakfast", "Cafe"],
    category: "Cafe",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop",
    rating: 4.5,
    reviews: 2104,
    priceForTwo: 900,
    openNow: true,
    hours: "8:30 AM – 7:30 PM",
    phone: "+91 484 221 5769",
    description: "Fort Kochi's most beloved art cafe — a 100-year-old Dutch warehouse turned creative haven. Rotating art exhibitions, live music evenings, the finest filter coffee in Kerala, and a full continental breakfast menu.",
    tags: ["Art Gallery", "Historic Building", "Live Music"],
    mustTry: ["Full English Breakfast", "Filter Coffee", "Banana Pancakes"],
    distance: "0.3 km",
    vegetarian: true,
  },
  {
    id: 11,
    name: "Kailash Parbat",
    destination: "Mumbai",
    state: "Maharashtra",
    cuisine: ["Sindhi", "Indian Chaat", "Vegetarian"],
    category: "Casual",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&h=400&fit=crop",
    rating: 4.6,
    reviews: 7823,
    priceForTwo: 700,
    openNow: true,
    hours: "9:00 AM – 11:00 PM",
    phone: "+91 22 2288 3354",
    description: "The original home of Sindhi cuisine in Mumbai since 1952. The Dal Pakwan and Papri Chaat are benchmarks against which all others are measured. A Colaba institution loved across generations.",
    tags: ["Since 1952", "Sindhi Legend", "Chaat Heaven"],
    badge: "Street Food Icon",
    mustTry: ["Dal Pakwan", "Papri Chaat", "Seviyan Kheer"],
    distance: "1.0 km",
    vegetarian: true,
  },
  {
    id: 12,
    name: "Laxmi Vilas Dhaba",
    destination: "Amritsar",
    state: "Punjab",
    cuisine: ["Punjabi", "Dhaba", "North Indian"],
    category: "Dhaba",
    image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3b42?w=600&h=400&fit=crop",
    rating: 4.5,
    reviews: 5621,
    priceForTwo: 500,
    openNow: true,
    hours: "6:00 AM – 11:00 PM",
    phone: "+91 183 222 3344",
    description: "A no-nonsense Amritsari dhaba where buttery parathas are cooked on a tawa that never goes cold. The lassi is thick enough to stand a spoon in. Real Punjabi warmth, zero pretension.",
    tags: ["Butter Heaven", "Thick Lassi", "Sunrise Breakfast"],
    badge: "Dhaba Royale",
    mustTry: ["Amritsari Kulcha", "Makki di Roti & Sarson da Saag", "Lassi"],
    distance: "0.9 km",
    vegetarian: true,
  },
];

const CATEGORIES = ["All", "Fine Dining", "Casual", "Street Food", "Cafe", "Rooftop", "Dhaba"] as const;
type Category = typeof CATEGORIES[number];

const CUISINES = ["All Cuisines", "North Indian", "South Indian", "Seafood", "Continental", "Mughlai", "Street Food"];

const CATEGORY_COLORS: Record<string, string> = {
  "Fine Dining": "from-purple-500 to-indigo-500",
  "Casual": "from-blue-500 to-cyan-500",
  "Street Food": "from-orange-500 to-amber-500",
  "Cafe": "from-amber-600 to-yellow-500",
  "Rooftop": "from-pink-500 to-rose-500",
  "Dhaba": "from-green-500 to-emerald-500",
};

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  "Fine Dining": Utensils,
  "Casual": Soup,
  "Street Food": Flame,
  "Cafe": Coffee,
  "Rooftop": Sparkles,
  "Dhaba": Beef,
};

interface ReservationState {
  restaurant: Restaurant;
  date: string;
  time: string;
  guests: number;
  name: string;
  phone: string;
  step: "details" | "confirm";
}

function today() {
  return new Date().toISOString().split("T")[0];
}

const TIME_SLOTS = ["12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM"];

export default function RestaurantsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [openOnly, setOpenOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minRating, setMinRating] = useState(0);
  const [selectedCuisine, setSelectedCuisine] = useState("All Cuisines");
  const [reservation, setReservation] = useState<ReservationState | null>(null);
  const [confirmed, setConfirmed] = useState<Restaurant | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return RESTAURANTS.filter(r => {
      if (search && !r.name.toLowerCase().includes(search.toLowerCase()) &&
          !r.destination.toLowerCase().includes(search.toLowerCase()) &&
          !r.cuisine.some(c => c.toLowerCase().includes(search.toLowerCase()))) return false;
      if (category !== "All" && r.category !== category) return false;
      if (vegOnly && !r.vegetarian) return false;
      if (openOnly && !r.openNow) return false;
      if (r.priceForTwo > maxPrice) return false;
      if (r.rating < minRating) return false;
      if (selectedCuisine !== "All Cuisines" && !r.cuisine.some(c => c.includes(selectedCuisine.split(" ")[0]))) return false;
      return true;
    });
  }, [search, category, vegOnly, openOnly, maxPrice, minRating, selectedCuisine]);

  const openReservation = (r: Restaurant) => {
    setReservation({
      restaurant: r,
      date: today(),
      time: "7:00 PM",
      guests: 2,
      name: "",
      phone: "",
      step: "details",
    });
  };

  const confirmRes = () => {
    if (!reservation) return;
    setConfirmed(reservation.restaurant);
    setReservation(null);
  };

  const canSubmit = reservation?.name.trim() && reservation?.phone.trim() && reservation?.date && reservation?.time;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-28 pb-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">Restaurants & Dining</h1>
          </div>
          <p className="text-muted-foreground">Curated dining experiences across India — from legendary dhabas to fine dining palaces</p>
        </motion.div>

        {/* Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-4 gap-3 mb-8"
        >
          {[
            { label: "Restaurants", value: "12+", icon: Utensils, color: "text-orange-400" },
            { label: "Cuisines", value: "15+", icon: Flame, color: "text-red-400" },
            { label: "Cities", value: "8", icon: MapPin, color: "text-amber-400" },
            { label: "Avg Rating", value: "4.6★", icon: Star, color: "text-yellow-400" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass-card rounded-2xl p-4 text-center">
              <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
              <div className={`font-black text-xl ${color}`}>{value}</div>
              <div className="text-muted-foreground text-xs">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search restaurants, cuisine, or city..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setVegOnly(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${vegOnly ? "border-green-500/50 bg-green-500/15 text-green-400" : "border-white/10 bg-white/5 text-white/60 hover:text-white"}`}
            >
              <Leaf className="w-3.5 h-3.5" /> Veg Only
            </button>
            <button
              onClick={() => setOpenOnly(o => !o)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${openOnly ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400" : "border-white/10 bg-white/5 text-white/60 hover:text-white"}`}
            >
              <Clock className="w-3.5 h-3.5" /> Open Now
            </button>
            <button
              onClick={() => setShowFilters(f => !f)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${showFilters ? "border-orange-500/50 bg-orange-500/10 text-orange-400" : "border-white/10 bg-white/5 text-white/70 hover:text-white"}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-5"
            >
              <div className="glass-card rounded-2xl p-5 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-2">Max Budget for Two: ₹{maxPrice.toLocaleString("en-IN")}</p>
                    <input type="range" min={300} max={10000} step={100} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full accent-orange-500" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>₹300</span><span>₹10,000</span></div>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-2">Min Rating: {minRating > 0 ? `${minRating}+` : "Any"}</p>
                    <input type="range" min={0} max={5} step={0.5} value={minRating} onChange={e => setMinRating(Number(e.target.value))} className="w-full accent-orange-500" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>Any</span><span>5.0</span></div>
                  </div>
                </div>
                <div>
                  <p className="text-white/60 text-sm font-medium mb-2">Cuisine</p>
                  <div className="flex flex-wrap gap-2">
                    {CUISINES.map(c => (
                      <button key={c} onClick={() => setSelectedCuisine(c)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCuisine === c ? "bg-orange-500 text-black" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>{c}</button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none">
          {CATEGORIES.map(cat => {
            const Icon = cat === "All" ? Utensils : (CATEGORY_ICONS[cat] ?? Utensils);
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat ? "bg-orange-500 text-black" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
              >
                <Icon className="w-3.5 h-3.5" />{cat}
              </button>
            );
          })}
        </div>

        <p className="text-muted-foreground text-sm mb-6">
          Showing <span className="text-white font-semibold">{filtered.length}</span> {filtered.length === 1 ? "restaurant" : "restaurants"}
          {vegOnly && <span className="text-green-400"> · Veg only</span>}
          {openOnly && <span className="text-emerald-400"> · Open now</span>}
        </p>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((r, idx) => {
            const isExpanded = expanded === r.id;
            const Icon = CATEGORY_ICONS[r.category] ?? Utensils;
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="glass-card rounded-2xl overflow-hidden group hover:border-white/20 transition-all hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  {/* Top badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {r.badge && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500 text-black flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />{r.badge}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 flex gap-1.5">
                    {r.vegetarian && (
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/90 text-white flex items-center gap-1">
                        <Leaf className="w-3 h-3" /> Veg
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${CATEGORY_COLORS[r.category]} text-white`}>
                      {r.category}
                    </span>
                  </div>

                  {/* Bottom status */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${r.openNow ? "bg-green-400" : "bg-red-400"}`} />
                      <span className={`text-xs font-medium ${r.openNow ? "text-green-400" : "text-red-400"}`}>
                        {r.openNow ? "Open Now" : "Closed"}
                      </span>
                    </div>
                    <span className="text-white/70 text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{r.distance}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-lg leading-tight">{r.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                        <span className="text-muted-foreground text-sm">{r.destination}, {r.state}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-white font-semibold text-sm">{r.rating}</span>
                      </div>
                      <span className="text-muted-foreground text-xs">{r.reviews.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Cuisine Tags */}
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {r.cuisine.map(c => (
                      <span key={c} className="px-2 py-0.5 rounded-full bg-white/5 text-white/60 text-xs">{c}</span>
                    ))}
                  </div>

                  <p className={`text-muted-foreground text-sm leading-relaxed mb-3 ${isExpanded ? "" : "line-clamp-2"}`}>{r.description}</p>

                  {/* Must Try (expandable) */}
                  {isExpanded && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-3">
                      <p className="text-white/60 text-xs font-semibold mb-2 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-400" /> Must Try
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {r.mustTry.map(dish => (
                          <span key={dish} className="px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs">{dish}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-3 text-sm">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">{r.hours}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                        <a href={`tel:${r.phone}`} className="text-cyan-400 hover:text-cyan-300">{r.phone}</a>
                      </div>
                    </motion.div>
                  )}

                  <button
                    onClick={() => setExpanded(isExpanded ? null : r.id)}
                    className="text-xs text-white/40 hover:text-white/70 mb-4 flex items-center gap-1 transition-all"
                  >
                    {isExpanded ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> See menu & hours</>}
                  </button>

                  {/* Price + Reserve */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div>
                      <div className="text-muted-foreground text-xs">Avg. for two</div>
                      <div className="text-white font-black text-lg">₹{r.priceForTwo.toLocaleString("en-IN")}</div>
                    </div>
                    <Button
                      onClick={() => openReservation(r)}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold border-0 rounded-xl hover:opacity-90"
                    >
                      Reserve Table
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-white font-bold text-xl mb-2">No restaurants found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      {/* Reservation Modal */}
      <AnimatePresence>
        {reservation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setReservation(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass-card rounded-3xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="relative h-28 overflow-hidden">
                <img src={reservation.restaurant.image} alt={reservation.restaurant.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/20" />
                <div className="absolute bottom-3 left-5">
                  <h2 className="text-white font-black text-xl">{reservation.restaurant.name}</h2>
                  <p className="text-white/70 text-sm">{reservation.restaurant.destination}, {reservation.restaurant.state}</p>
                </div>
                <button onClick={() => setReservation(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white/80 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5">
                {/* Step Indicators */}
                <div className="flex items-center gap-2 mb-5">
                  {["details", "confirm"].map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${reservation.step === step ? "bg-orange-500 text-black" : (reservation.step === "confirm" && i === 0) ? "bg-green-500 text-white" : "bg-white/10 text-white/40"}`}>
                        {reservation.step === "confirm" && i === 0 ? <Check className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      <span className={`text-xs font-medium ${reservation.step === step ? "text-white" : "text-white/40"}`}>
                        {step === "details" ? "Your Details" : "Confirm"}
                      </span>
                      {i === 0 && <div className="w-8 h-px bg-white/10" />}
                    </div>
                  ))}
                </div>

                {reservation.step === "details" && (
                  <div className="space-y-4">
                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-white/60 text-xs font-medium block mb-1.5">
                          <Calendar className="w-3 h-3 inline mr-1" />Date
                        </label>
                        <input
                          type="date"
                          value={reservation.date}
                          min={today()}
                          onChange={e => setReservation(r => r ? { ...r, date: e.target.value } : null)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50"
                        />
                      </div>
                      <div>
                        <label className="text-white/60 text-xs font-medium block mb-1.5">
                          <Clock className="w-3 h-3 inline mr-1" />Time
                        </label>
                        <select
                          value={reservation.time}
                          onChange={e => setReservation(r => r ? { ...r, time: e.target.value } : null)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50"
                        >
                          {TIME_SLOTS.map(t => <option key={t} value={t} className="bg-gray-900">{t}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Guests */}
                    <div>
                      <label className="text-white/60 text-xs font-medium block mb-2">
                        <Users className="w-3 h-3 inline mr-1" />Guests
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5, 6].map(n => (
                          <button
                            key={n}
                            onClick={() => setReservation(r => r ? { ...r, guests: n } : null)}
                            className={`w-9 h-9 rounded-xl border text-sm font-semibold transition-all ${reservation.guests === n ? "border-orange-500 bg-orange-500/20 text-orange-400" : "border-white/10 text-white/60 hover:border-white/20"}`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name & Phone */}
                    <div>
                      <label className="text-white/60 text-xs font-medium block mb-1.5">Your Name</label>
                      <input
                        type="text"
                        placeholder="Arjun Sharma"
                        value={reservation.name}
                        onChange={e => setReservation(r => r ? { ...r, name: e.target.value } : null)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-white/60 text-xs font-medium block mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={reservation.phone}
                        onChange={e => setReservation(r => r ? { ...r, phone: e.target.value } : null)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/50"
                      />
                    </div>

                    <Button
                      onClick={() => setReservation(r => r ? { ...r, step: "confirm" } : null)}
                      disabled={!canSubmit}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold border-0 rounded-xl h-11 disabled:opacity-40"
                    >
                      Review Reservation →
                    </Button>
                  </div>
                )}

                {reservation.step === "confirm" && (
                  <div className="space-y-4">
                    <div className="bg-white/3 rounded-xl p-4 space-y-2.5">
                      {[
                        ["Restaurant", reservation.restaurant.name],
                        ["Date", reservation.date],
                        ["Time", reservation.time],
                        ["Guests", `${reservation.guests} guest${reservation.guests > 1 ? "s" : ""}`],
                        ["Name", reservation.name],
                        ["Phone", reservation.phone],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="text-white font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-muted-foreground text-xs text-center">The restaurant will confirm via WhatsApp/call within 30 mins.</p>
                    <div className="flex gap-3">
                      <Button onClick={() => setReservation(r => r ? { ...r, step: "details" } : null)} variant="outline" className="flex-1 border-white/20 text-white rounded-xl h-11">Edit</Button>
                      <Button onClick={confirmRes} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold border-0 rounded-xl h-11">
                        <Check className="w-4 h-4 mr-1" /> Confirm
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmed */}
      <AnimatePresence>
        {confirmed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="glass-card rounded-3xl p-8 w-full max-w-sm text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-5"
              >
                <Check className="w-10 h-10 text-green-400" />
              </motion.div>
              <h2 className="text-white font-black text-2xl mb-2">Table Reserved!</h2>
              <p className="text-muted-foreground mb-1">Your table at</p>
              <p className="text-orange-400 font-bold text-lg mb-4">{confirmed.name}</p>
              <p className="text-muted-foreground text-sm mb-6">The restaurant will contact you shortly to confirm your reservation. Check your phone for their call or WhatsApp message.</p>
              <Button onClick={() => setConfirmed(null)} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold border-0 rounded-xl h-11">
                Done
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
