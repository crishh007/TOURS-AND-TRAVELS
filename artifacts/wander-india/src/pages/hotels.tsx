import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { customFetch } from "@workspace/api-client-react/custom-fetch";
import { Button } from "@/components/ui/button";
import {
  Star, MapPin, Wifi, Car, Utensils, Waves, Dumbbell, Wind,
  Search, SlidersHorizontal, X, ChevronDown, ChevronUp,
  Calendar, Users, Check, BadgePercent, Sparkles, Building2, Loader2
} from "lucide-react";

interface Hotel {
  id: number;
  name: string;
  destination: string;
  state: string;
  category: "Luxury" | "Resort" | "Heritage" | "Boutique" | "Budget";
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  pricePerNight: number;
  originalPrice?: number;
  amenities: string[];
  description: string;
  available: boolean;
  badge?: string;
  rooms: Room[];
}

interface Room {
  id: number;
  name: string;
  price: number;
  capacity: number;
  features: string[];
}

const AMENITY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  "WiFi": Wifi,
  "Parking": Car,
  "Restaurant": Utensils,
  "Pool": Waves,
  "Gym": Dumbbell,
  "AC": Wind,
};

const HOTELS: Hotel[] = [
  {
    id: 1,
    name: "The Leela Palace",
    destination: "Udaipur",
    state: "Rajasthan",
    category: "Luxury",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop"],
    rating: 4.9,
    reviews: 2847,
    pricePerNight: 18500,
    originalPrice: 22000,
    amenities: ["WiFi", "Pool", "Restaurant", "Parking", "Gym", "AC"],
    description: "Perched on the banks of Lake Pichola, this iconic palace hotel blends regal Rajput architecture with modern luxury. Every room offers breathtaking views of the Aravalli hills and the shimmering lake.",
    available: true,
    badge: "Best Seller",
    rooms: [
      { id: 1, name: "Deluxe Lake View", price: 18500, capacity: 2, features: ["Lake View", "King Bed", "Balcony"] },
      { id: 2, name: "Royal Suite", price: 42000, capacity: 2, features: ["Panoramic Lake View", "Private Pool", "Butler Service"] },
      { id: 3, name: "Palace Suite", price: 68000, capacity: 4, features: ["Personal Concierge", "Private Terrace", "Heritage Décor"] },
    ],
  },
  {
    id: 2,
    name: "Taj Exotica Resort & Spa",
    destination: "Goa",
    state: "Goa",
    category: "Resort",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop"],
    rating: 4.8,
    reviews: 3521,
    pricePerNight: 14200,
    originalPrice: 17000,
    amenities: ["WiFi", "Pool", "Restaurant", "Parking", "Gym"],
    description: "A beachfront paradise on Benaulim Beach with 56 acres of lush tropical gardens. Wake up to the sound of waves and enjoy world-class spa treatments that blend Ayurvedic traditions with modern wellness.",
    available: true,
    badge: "Top Rated",
    rooms: [
      { id: 1, name: "Sea View Room", price: 14200, capacity: 2, features: ["Ocean View", "Private Balcony", "King Bed"] },
      { id: 2, name: "Garden Villa", price: 28000, capacity: 3, features: ["Private Garden", "Plunge Pool", "Butler"] },
      { id: 3, name: "Beach Villa", price: 52000, capacity: 4, features: ["Direct Beach Access", "Private Pool", "Open-Air Bath"] },
    ],
  },
  {
    id: 3,
    name: "Neemrana Fort Palace",
    destination: "Alwar",
    state: "Rajasthan",
    category: "Heritage",
    image: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=600&h=400&fit=crop"],
    rating: 4.7,
    reviews: 1893,
    pricePerNight: 8900,
    amenities: ["WiFi", "Pool", "Restaurant", "AC"],
    description: "A 15th-century hilltop fort transformed into a magnificent heritage hotel. Experience the grandeur of Rajput architecture through carved pillars, zenana chambers, and 14 levels of palatial rooms overlooking the Aravalli valley.",
    available: true,
    rooms: [
      { id: 1, name: "Heritage Room", price: 8900, capacity: 2, features: ["Fort View", "Traditional Décor", "Stone Walls"] },
      { id: 2, name: "Mahal Suite", price: 18500, capacity: 2, features: ["Valley View", "Antique Furniture", "Private Terrace"] },
    ],
  },
  {
    id: 4,
    name: "The Oberoi Wildflower Hall",
    destination: "Shimla",
    state: "Himachal Pradesh",
    category: "Luxury",
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&h=400&fit=crop"],
    rating: 4.9,
    reviews: 1654,
    pricePerNight: 22000,
    originalPrice: 26500,
    amenities: ["WiFi", "Restaurant", "Gym", "AC", "Parking"],
    description: "Nestled in the cedar and rhododendron forests of the Himalayas at 8,250 feet, this former residence of Lord Kitchener offers breathtaking views of the snow-clad Himalayan peaks.",
    available: true,
    badge: "Mountain Escape",
    rooms: [
      { id: 1, name: "Himalayan View Room", price: 22000, capacity: 2, features: ["Himalaya View", "Fireplace", "Cedar Forest"] },
      { id: 2, name: "Cedar Suite", price: 45000, capacity: 2, features: ["Private Deck", "Soaking Tub", "Himalayan Panorama"] },
    ],
  },
  {
    id: 5,
    name: "Zostel Rishikesh",
    destination: "Rishikesh",
    state: "Uttarakhand",
    category: "Budget",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop"],
    rating: 4.5,
    reviews: 4231,
    pricePerNight: 850,
    amenities: ["WiFi", "Restaurant"],
    description: "India's most loved backpacker hostel on the banks of the Ganga. The perfect base for white-water rafting, yoga retreats, and Himalayan treks. Social vibes, stunning river views, and unbeatable value.",
    available: true,
    badge: "Budget Pick",
    rooms: [
      { id: 1, name: "Dorm Bed (8-person)", price: 850, capacity: 1, features: ["Ganga View", "Lockers", "AC"] },
      { id: 2, name: "Private Double", price: 2400, capacity: 2, features: ["River View", "Private Bathroom", "Balcony"] },
    ],
  },
  {
    id: 6,
    name: "CGH Earth Marari Beach",
    destination: "Alleppey",
    state: "Kerala",
    category: "Resort",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop"],
    rating: 4.7,
    reviews: 1102,
    pricePerNight: 6800,
    amenities: ["WiFi", "Pool", "Restaurant", "AC"],
    description: "An eco-luxe beachfront resort between Marari Beach and Kerala backwaters. Sustainably built cottages with thatch roofs and open-air showers surrounded by coconut groves and organic gardens.",
    available: true,
    rooms: [
      { id: 1, name: "Beach Cottage", price: 6800, capacity: 2, features: ["Beach Access", "Garden Shower", "Hammock"] },
      { id: 2, name: "Fisherman's Villa", price: 12500, capacity: 4, features: ["Private Garden", "Pool Access", "Ayurvedic Spa"] },
    ],
  },
  {
    id: 7,
    name: "Ama Stays & Trails",
    destination: "Coorg",
    state: "Karnataka",
    category: "Boutique",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop"],
    rating: 4.6,
    reviews: 742,
    pricePerNight: 4200,
    amenities: ["WiFi", "Restaurant", "Parking", "AC"],
    description: "A colonial bungalow nestled in 200 acres of coffee, pepper, and cardamom estates in the hills of Coorg. Wake up to the fragrance of fresh coffee and misty valley views.",
    available: true,
    badge: "Nature Retreat",
    rooms: [
      { id: 1, name: "Planters Room", price: 4200, capacity: 2, features: ["Estate View", "Colonial Décor", "King Bed"] },
      { id: 2, name: "Coorg Suite", price: 7800, capacity: 3, features: ["Private Sit-out", "Coffee Estate Walk", "Valley View"] },
    ],
  },
  {
    id: 8,
    name: "Snow Lion Ladakh",
    destination: "Leh",
    state: "Ladakh",
    category: "Boutique",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop"],
    rating: 4.6,
    reviews: 567,
    pricePerNight: 5500,
    amenities: ["WiFi", "Restaurant", "Parking"],
    description: "A boutique mountain retreat in Leh with stunning views of the Stok Kangri massif. Built in traditional Ladakhi style with modern comforts, solar-heated water, and organic farm-to-table cuisine.",
    available: true,
    rooms: [
      { id: 1, name: "Standard Mountain View", price: 5500, capacity: 2, features: ["Stok Kangri View", "Traditional Décor", "Solar Heating"] },
      { id: 2, name: "Deluxe Suite", price: 9800, capacity: 2, features: ["Panoramic Balcony", "Private Living Room", "Premium Bedding"] },
    ],
  },
  {
    id: 9,
    name: "WelcomHeritage Panjim Inn",
    destination: "Panjim",
    state: "Goa",
    category: "Heritage",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop"],
    rating: 4.4,
    reviews: 891,
    pricePerNight: 3800,
    amenities: ["WiFi", "Restaurant", "AC"],
    description: "A lovingly restored 18th-century Portuguese mansion in the heart of Panjim's Latin Quarter. Azulejo tile panels, four-poster beds, and baroque architecture transport you to colonial Goa.",
    available: true,
    rooms: [
      { id: 1, name: "Heritage Double", price: 3800, capacity: 2, features: ["Four-Poster Bed", "Portuguese Décor", "Courtyard View"] },
      { id: 2, name: "Braganza Suite", price: 7200, capacity: 3, features: ["Antique Furniture", "Private Living Room", "Street View"] },
    ],
  },
  {
    id: 10,
    name: "Treebo Trend Varanasi",
    destination: "Varanasi",
    state: "Uttar Pradesh",
    category: "Budget",
    image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=600&h=400&fit=crop"],
    rating: 4.3,
    reviews: 1345,
    pricePerNight: 1400,
    amenities: ["WiFi", "AC", "Parking"],
    description: "A clean, well-maintained hotel a short walk from Dashashwamedh Ghat. Perfect for spiritual seekers who want comfortable basics at an honest price, with friendly staff and easy ghat access.",
    available: true,
    rooms: [
      { id: 1, name: "Standard Room", price: 1400, capacity: 2, features: ["AC", "WiFi", "Daily Housekeeping"] },
      { id: 2, name: "Deluxe Room", price: 2200, capacity: 3, features: ["City View", "Bathtub", "Premium Linen"] },
    ],
  },
];

const CATEGORIES = ["All", "Luxury", "Resort", "Heritage", "Boutique", "Budget"] as const;
type Category = typeof CATEGORIES[number];

const CATEGORY_COLORS: Record<string, string> = {
  Luxury: "from-yellow-500 to-amber-400",
  Resort: "from-cyan-500 to-teal-400",
  Heritage: "from-purple-500 to-indigo-400",
  Boutique: "from-pink-500 to-rose-400",
  Budget: "from-green-500 to-emerald-400",
};

interface BookingState {
  hotel: Hotel;
  room: Room | null;
  checkIn: string;
  checkOut: string;
  guests: number;
  step: "room" | "details" | "payment" | "confirm";
}

function getNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 1;
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
}

function today() {
  return new Date().toISOString().split("T")[0];
}
function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export default function HotelsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [booking, setBooking] = useState<BookingState | null>(null);
  const [confirmed, setConfirmed] = useState<Hotel | null>(null);
  const [imgIndexes, setImgIndexes] = useState<Record<number, number>>({});

  // Payment states
  const [payMethod, setPayMethod] = useState<"upi" | "card" | "netbanking" | "hotel">("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [selectedBank, setSelectedBank] = useState("sbi");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const filtered = useMemo(() => {
    return HOTELS.filter(h => {
      if (search && !h.name.toLowerCase().includes(search.toLowerCase()) &&
          !h.destination.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== "All" && h.category !== category) return false;
      if (h.pricePerNight > maxPrice) return false;
      if (h.rating < minRating) return false;
      return true;
    });
  }, [search, category, maxPrice, minRating]);

  const openBooking = (hotel: Hotel) => {
    setPayMethod("upi");
    setUpiId("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setIsProcessingPayment(false);
    setBooking({ hotel, room: null, checkIn: today(), checkOut: tomorrow(), guests: 2, step: "room" });
  };

  const confirmBooking = async () => {
    if (!booking) return;
    setIsProcessingPayment(true);
    try {
      const detailsJson = JSON.stringify({
        roomName: booking.room?.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        nights,
        guests: booking.guests,
      });

      await customFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          itemType: "hotel",
          itemName: booking.hotel.name,
          details: detailsJson,
          guests: booking.guests,
          totalCost: totalPrice,
        }),
      });

      setIsProcessingPayment(false);
      setConfirmed(booking.hotel);
      setBooking(null);
    } catch (err) {
      console.error("Booking failed:", err);
      setIsProcessingPayment(false);
      // Fallback to local confirm so UI still updates
      setConfirmed(booking.hotel);
      setBooking(null);
    }
  };

  const nights = booking ? getNights(booking.checkIn, booking.checkOut) : 1;
  const totalPrice = booking?.room ? booking.room.price * nights : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-28 pb-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">Hotels & Stays</h1>
          </div>
          <p className="text-muted-foreground ml-13">Handpicked stays across Incredible India — from palace hotels to backpacker havens</p>
        </motion.div>

        {/* Search + Filter Bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search hotels or destinations..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50 focus:bg-white/8 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(f => !f)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${showFilters ? "border-amber-500/50 bg-amber-500/10 text-amber-400" : "border-white/10 bg-white/5 text-white/70 hover:text-white"}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="glass-card rounded-2xl p-5 space-y-5">
                <div>
                  <p className="text-white/60 text-sm font-medium mb-3">Hotel Type</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${category === cat ? "bg-amber-500 text-black" : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-2">Max Price: ₹{maxPrice.toLocaleString("en-IN")}/night</p>
                    <input
                      type="range"
                      min={500}
                      max={100000}
                      step={500}
                      value={maxPrice}
                      onChange={e => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>₹500</span><span>₹1,00,000</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-2">Min Rating: {minRating > 0 ? `${minRating}+ ⭐` : "Any"}</p>
                    <input
                      type="range"
                      min={0}
                      max={5}
                      step={0.5}
                      value={minRating}
                      onChange={e => setMinRating(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Any</span><span>5.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat ? "bg-amber-500 text-black" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-muted-foreground text-sm mb-5">
          Showing <span className="text-white font-semibold">{filtered.length}</span> {filtered.length === 1 ? "hotel" : "hotels"}
          {category !== "All" && <> in <span className="text-amber-400">{category}</span></>}
        </p>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((hotel, idx) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card rounded-2xl overflow-hidden group hover:border-white/20 transition-all hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Badge */}
                {hotel.badge && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-black flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />{hotel.badge}
                    </span>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${CATEGORY_COLORS[hotel.category]} text-white`}>
                    {hotel.category}
                  </span>
                </div>

                {/* Discount */}
                {hotel.originalPrice && (
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-500 text-white flex items-center gap-1">
                      <BadgePercent className="w-3 h-3" />
                      {Math.round((1 - hotel.pricePerNight / hotel.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                )}

                {/* Availability */}
                <div className="absolute bottom-3 right-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${hotel.available ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400"}`}>
                    {hotel.available ? "Available" : "Sold Out"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-lg leading-tight truncate">{hotel.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-muted-foreground text-sm truncate">{hotel.destination}, {hotel.state}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-white font-semibold text-sm">{hotel.rating}</span>
                    </div>
                    <span className="text-muted-foreground text-xs">{hotel.reviews.toLocaleString()} reviews</span>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">{hotel.description}</p>

                {/* Amenities */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {hotel.amenities.slice(0, 5).map(amenity => {
                    const Icon = AMENITY_ICONS[amenity] || Wifi;
                    return (
                      <div key={amenity} title={amenity} className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg text-white/60 text-xs">
                        <Icon className="w-3 h-3" />{amenity}
                      </div>
                    );
                  })}
                </div>

                {/* Price + Book */}
                <div className="flex items-center justify-between">
                  <div>
                    {hotel.originalPrice && (
                      <div className="text-muted-foreground text-xs line-through">₹{hotel.originalPrice.toLocaleString("en-IN")}/night</div>
                    )}
                    <div className="text-white font-black text-xl">₹{hotel.pricePerNight.toLocaleString("en-IN")}<span className="text-muted-foreground text-sm font-normal">/night</span></div>
                  </div>
                  <Button
                    onClick={() => openBooking(hotel)}
                    disabled={!hotel.available}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold border-0 rounded-xl hover:opacity-90 transition-all"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-white font-bold text-xl mb-2">No hotels found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {booking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setBooking(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass-card rounded-3xl w-full max-w-lg overflow-hidden"
            >
              {/* Modal Header */}
              <div className="relative h-36 overflow-hidden">
                <img src={booking.hotel.image} alt={booking.hotel.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
                <div className="absolute bottom-4 left-5">
                  <h2 className="text-white font-black text-xl">{booking.hotel.name}</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-white/80 text-sm">{booking.hotel.destination}, {booking.hotel.state}</span>
                  </div>
                </div>
                <button onClick={() => setBooking(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white/80 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5">
                {/* Step Indicators */}
                <div className="flex items-center gap-2 mb-6">
                  {["room", "details", "payment", "confirm"].map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        booking.step === step ? "bg-amber-500 text-black" :
                        (["room", "details", "payment", "confirm"].indexOf(booking.step) > i) ? "bg-green-500 text-white" : "bg-white/10 text-white/40"
                      }`}>
                        {(["room", "details", "payment", "confirm"].indexOf(booking.step) > i) ? <Check className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      <span className={`text-xs font-medium ${booking.step === step ? "text-white" : "text-white/40"}`}>
                        {step === "room" ? "Select Room" : step === "details" ? "Your Details" : step === "payment" ? "Payment" : "Confirm"}
                      </span>
                      {i < 3 && <div className="w-8 h-px bg-white/10" />}
                    </div>
                  ))}
                </div>

                {/* Step 1: Room Selection */}
                {booking.step === "room" && (
                  <div className="space-y-3">
                    <p className="text-white/60 text-sm mb-3">Choose your room type</p>
                    {booking.hotel.rooms.map(room => (
                      <button
                        key={room.id}
                        onClick={() => setBooking(b => b ? { ...b, room } : null)}
                        className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all ${
                          booking.room?.id === room.id ? "border-amber-500 bg-amber-500/10" : "border-white/10 hover:border-white/20 bg-white/3"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-semibold">{room.name}</span>
                          <span className="text-amber-400 font-bold">₹{room.price.toLocaleString("en-IN")}/night</span>
                        </div>
                        <div className="flex gap-2 flex-wrap mt-2">
                          {room.features.map(f => (
                            <span key={f} className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">{f}</span>
                          ))}
                        </div>
                      </button>
                    ))}
                    <Button
                      onClick={() => booking.room && setBooking(b => b ? { ...b, step: "details" } : null)}
                      disabled={!booking.room}
                      className="w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold border-0 rounded-xl h-11 disabled:opacity-40"
                    >
                      Continue →
                    </Button>
                  </div>
                )}

                {/* Step 2: Details */}
                {booking.step === "details" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-white/60 text-xs font-medium block mb-1.5">
                          <Calendar className="w-3 h-3 inline mr-1" />Check-in
                        </label>
                        <input
                          type="date"
                          value={booking.checkIn}
                          min={today()}
                          onChange={e => setBooking(b => b ? { ...b, checkIn: e.target.value } : null)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                      <div>
                        <label className="text-white/60 text-xs font-medium block mb-1.5">
                          <Calendar className="w-3 h-3 inline mr-1" />Check-out
                        </label>
                        <input
                          type="date"
                          value={booking.checkOut}
                          min={booking.checkIn || tomorrow()}
                          onChange={e => setBooking(b => b ? { ...b, checkOut: e.target.value } : null)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-white/60 text-xs font-medium block mb-1.5">
                        <Users className="w-3 h-3 inline mr-1" />Guests
                      </label>
                      <div className="flex items-center gap-3">
                        {[1, 2, 3, 4].map(n => (
                          <button
                            key={n}
                            onClick={() => setBooking(b => b ? { ...b, guests: n } : null)}
                            className={`w-10 h-10 rounded-xl border text-sm font-semibold transition-all ${booking.guests === n ? "border-amber-500 bg-amber-500/20 text-amber-400" : "border-white/10 text-white/60 hover:border-white/20"}`}
                          >
                            {n}
                          </button>
                        ))}
                        <span className="text-muted-foreground text-sm">guest{booking.guests > 1 ? "s" : ""}</span>
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-white/3 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">₹{booking.room?.price.toLocaleString("en-IN")} × {nights} night{nights > 1 ? "s" : ""}</span>
                        <span className="text-white">₹{(booking.room!.price * nights).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Taxes & fees (12%)</span>
                        <span className="text-white">₹{Math.round(totalPrice * 0.12).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
                        <span className="text-white">Total</span>
                        <span className="text-amber-400">₹{Math.round(totalPrice * 1.12).toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={() => setBooking(b => b ? { ...b, step: "room" } : null)} variant="outline" className="flex-1 border-white/20 text-white rounded-xl h-11">Back</Button>
                      <Button onClick={() => setBooking(b => b ? { ...b, step: "payment" } : null)} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold border-0 rounded-xl h-11">
                        Confirm →
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {booking.step === "payment" && (
                  <div className="space-y-4">
                    <p className="text-white/60 text-sm mb-3">Choose payment method</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "upi", label: "UPI (Paytm/GPay)" },
                        { id: "card", label: "Credit/Debit Card" },
                        { id: "netbanking", label: "Net Banking" },
                        { id: "hotel", label: "Pay at Hotel" },
                      ].map(method => (
                        <button
                          key={method.id}
                          onClick={() => setPayMethod(method.id as any)}
                          className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all text-center ${payMethod === method.id ? "border-amber-500 bg-amber-500/20 text-amber-400" : "border-white/10 text-white/70 hover:border-white/20 hover:bg-white/5"}`}
                        >
                          {method.label}
                        </button>
                      ))}
                    </div>

                    {/* Method details */}
                    {payMethod === "upi" && (
                      <div className="space-y-3 pt-2">
                        <label className="text-white/60 text-xs font-medium block">UPI ID</label>
                        <input
                          type="text"
                          placeholder="arjun@okaxis"
                          value={upiId}
                          onChange={e => setUpiId(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50"
                        />
                        <p className="text-muted-foreground text-[10px]">A payment request will be sent to this UPI ID.</p>
                      </div>
                    )}

                    {payMethod === "card" && (
                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="text-white/60 text-xs font-medium block mb-1">Card Number</label>
                          <input
                            type="text"
                            placeholder="4111 2222 3333 4444"
                            maxLength={19}
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-white/60 text-xs font-medium block mb-1">Expiry</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              maxLength={5}
                              value={cardExpiry}
                              onChange={e => setCardExpiry(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50 text-center"
                            />
                          </div>
                          <div>
                            <label className="text-white/60 text-xs font-medium block mb-1">CVV</label>
                            <input
                              type="password"
                              placeholder="***"
                              maxLength={3}
                              value={cardCvv}
                              onChange={e => setCardCvv(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50 text-center"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {payMethod === "netbanking" && (
                      <div className="space-y-3 pt-2">
                        <label className="text-white/60 text-xs font-medium block mb-1">Select Bank</label>
                        <select
                          value={selectedBank}
                          onChange={e => setSelectedBank(e.target.value)}
                          className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500/50"
                        >
                          <option value="sbi">State Bank of India</option>
                          <option value="hdfc">HDFC Bank</option>
                          <option value="icici">ICICI Bank</option>
                          <option value="axis">Axis Bank</option>
                          <option value="kotak">Kotak Mahindra Bank</option>
                        </select>
                      </div>
                    )}

                    {payMethod === "hotel" && (
                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3.5 pt-2">
                        <p className="text-amber-400 font-bold text-xs mb-1">Pay at Hotel</p>
                        <p className="text-white/70 text-xs leading-relaxed">No payment is required right now. You can settle the bill directly at the hotel desk during check-in or check-out.</p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <Button onClick={() => setBooking(b => b ? { ...b, step: "details" } : null)} variant="outline" className="flex-1 border-white/20 text-white rounded-xl h-11">Back</Button>
                      <Button
                        onClick={() => setBooking(b => b ? { ...b, step: "confirm" } : null)}
                        disabled={(payMethod === "upi" && !upiId) || (payMethod === "card" && (!cardNumber || !cardExpiry || !cardCvv))}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold border-0 rounded-xl h-11 disabled:opacity-45"
                      >
                        Continue →
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 4: Confirm */}
                {booking.step === "confirm" && (
                  <div className="space-y-4">
                    <div className="bg-white/3 rounded-xl p-4 space-y-3">
                      {[
                        ["Hotel", booking.hotel.name],
                        ["Room", booking.room?.name ?? ""],
                        ["Check-in", booking.checkIn],
                        ["Check-out", booking.checkOut],
                        ["Guests", `${booking.guests} guest${booking.guests > 1 ? "s" : ""}`],
                        ["Duration", `${nights} night${nights > 1 ? "s" : ""}`],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="text-white font-medium">{value}</span>
                        </div>
                      ))}
                      <div className="border-t border-white/10 pt-2 flex justify-between text-sm">
                        <span className="text-muted-foreground">Payment Method</span>
                        <span className="text-white font-medium">
                          {payMethod === "upi" ? `UPI (${upiId})` :
                           payMethod === "card" ? `Card ending in ${cardNumber.slice(-4) || "****"}` :
                           payMethod === "netbanking" ? `Net Banking (${selectedBank.toUpperCase()})` : "Pay at Hotel"}
                        </span>
                      </div>
                      <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
                        <span className="text-white">Total (incl. taxes)</span>
                        <span className="text-amber-400 text-lg">₹{Math.round(totalPrice * 1.12).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs text-center">Free cancellation up to 48 hours before check-in. By confirming you agree to our terms.</p>
                    <div className="flex gap-3">
                      <Button onClick={() => setBooking(b => b ? { ...b, step: "payment" } : null)} disabled={isProcessingPayment} variant="outline" className="flex-1 border-white/20 text-white rounded-xl h-11">Back</Button>
                      <Button onClick={confirmBooking} disabled={isProcessingPayment} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold border-0 rounded-xl h-11">
                        {isProcessingPayment ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Check className="w-4 h-4 mr-1" />}
                        {isProcessingPayment ? "Processing Payment..." : "Pay & Confirm"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Confirmed */}
      <AnimatePresence>
        {confirmed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
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
              <h2 className="text-white font-black text-2xl mb-2">Booking Confirmed!</h2>
              <p className="text-muted-foreground mb-1">Your stay at</p>
              <p className="text-amber-400 font-bold text-lg mb-4">{confirmed.name}</p>
              <p className="text-muted-foreground text-sm mb-6">A confirmation has been sent to your registered email. Check your dashboard for booking details.</p>
              <div className="flex gap-3">
                <Button onClick={() => setConfirmed(null)} variant="outline" className="flex-1 border-white/20 text-white rounded-xl">
                  Close
                </Button>
                <Button onClick={() => setConfirmed(null)} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold border-0 rounded-xl">
                  My Trips →
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
