import { useRoute, Link, useSearch } from "wouter";
import { motion } from "framer-motion";
import { useGetDestination, getGetDestinationQueryKey, useGetWeather, getGetWeatherQueryKey } from "@workspace/api-client-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MapPin, Clock, DollarSign, Cloud, Droplets, Wind, ArrowLeft, Brain, Plane, Thermometer, Calendar, Users, ShieldCheck } from "lucide-react";
import { REELS } from "./reels";
import { MOCK_DESTINATIONS } from "../data/destinations";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

export default function DestinationDetailPage() {
  const [, params] = useRoute("/destinations/:id");
  const id = Number(params?.id);

  const { data: apiDest, isLoading: apiLoading } = useGetDestination(id, {
    query: { enabled: !!id, queryKey: getGetDestinationQueryKey(id) },
  });

  const dest = apiDest || MOCK_DESTINATIONS.find(d => d.id === id);
  const isLoading = apiLoading && !dest;

  const { data: weather } = useGetWeather(dest?.name?.toLowerCase() || "", {
    query: { enabled: !!dest?.name, queryKey: getGetWeatherQueryKey(dest?.name?.toLowerCase() || "") },
  });

  const matchingReel = dest ? REELS.find(
    r =>
      r.location.toLowerCase() === dest.name.toLowerCase() ||
      dest.name.toLowerCase().includes(r.location.toLowerCase()) ||
      r.location.toLowerCase().includes(dest.name.toLowerCase())
  ) : undefined;

  // Booking states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const search = useSearch();
  const shouldOpenBooking = new URLSearchParams(search).get("book") === "true";

  useEffect(() => {
    if (shouldOpenBooking && dest) {
      setIsBookingOpen(true);
    }
  }, [shouldOpenBooking, dest]);
  const [startDate, setStartDate] = useState("2026-06-25");
  const [endDate, setEndDate] = useState("2026-06-30");
  const [guests, setGuests] = useState(2);
  const [packageType, setPackageType] = useState<"standard" | "luxury" | "adventure">("standard");
  const [travellerName, setTravellerName] = useState("");
  const [travellerEmail, setTravellerEmail] = useState("");
  const [travellerPhone, setTravellerPhone] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Price calculations
  const calculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const getPackagePrice = () => {
    if (!dest) return 0;
    const base = dest.avgBudgetPerDay || 2000;
    if (packageType === "luxury") return base * 2.5;
    if (packageType === "adventure") return base * 1.6;
    return base;
  };

  const getSubtotal = () => {
    return getPackagePrice() * guests * calculateDays();
  };

  const getTax = () => {
    return getSubtotal() * 0.18; // 18% GST
  };

  const getTotal = () => {
    return getSubtotal() + getTax();
  };

  const handleBooking = () => {
    if (!travellerName || !travellerEmail) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const randomCode = `WIND-${Math.floor(1000 + Math.random() * 9000)}-${dest?.name.slice(0, 3).toUpperCase()}`;
      setBookingCode(randomCode);
      setIsSubmitting(false);
      setIsBooked(true);

      // Save to localStorage
      const activeBookings = JSON.parse(localStorage.getItem("activeBookings") || "[]");
      activeBookings.push({
        code: randomCode,
        destinationName: dest?.name,
        state: dest?.state,
        startDate,
        endDate,
        guests,
        packageType,
        travellerName,
        totalPrice: getTotal(),
        imageUrl: dest?.imageUrl
      });
      localStorage.setItem("activeBookings", JSON.stringify(activeBookings));
    }, 1500);
  };

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
                <Button 
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold rounded-xl h-12 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  data-testid="btn-book-destination"
                >
                  💳 Book Destination Tour
                </Button>
                <Link href={`/ai-planner?destination=${encodeURIComponent(dest.name)}`}>
                  <Button variant="outline" className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-semibold rounded-xl h-12" data-testid="btn-plan-trip">
                    <Brain className="w-4 h-4 mr-2" /> Generate AI Itinerary
                  </Button>
                </Link>
                <Link href="/trips">
                  <Button variant="ghost" className="w-full text-white/70 hover:text-white rounded-xl h-12">
                    <Plane className="w-4 h-4 mr-2" /> Save as Trip
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

            {/* Travel Reel Sidebar Widget */}
            {matchingReel && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-6 overflow-hidden flex flex-col items-center"
              >
                <h3 className="text-white font-bold mb-3 flex items-center gap-2 self-start">
                  🎬 Experience {dest.name}
                </h3>
                <div className="relative aspect-[9/16] w-full max-w-[260px] rounded-xl overflow-hidden border border-white/10 bg-black shadow-inner">
                  <video
                    src={matchingReel.videoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-muted-foreground text-[10px] text-center mt-3 italic max-w-[260px]">
                  "{matchingReel.caption}"
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── Booking Dialog Modal ─────────────────────────────────────────── */}
      <Dialog open={isBookingOpen} onOpenChange={(open) => {
        setIsBookingOpen(open);
        if (!open) {
          setIsBooked(false);
          setTravellerName("");
          setTravellerEmail("");
          setTravellerPhone("");
        }
      }}>
        <DialogContent className="max-w-xl bg-[#080d1a] border-white/10 text-white p-6 rounded-2xl overflow-y-auto max-h-[90vh] scrollbar-none">
          {!isBooked ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-black text-cyan-400">Book Tour to {dest.name}</DialogTitle>
                <DialogDescription className="text-slate-400 text-xs">
                  Fill in your travel preferences and billing details to secure your booking.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-4">
                {/* Dates & Guests */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-slate-400 text-xs font-bold mb-1.5 block">Start Date</Label>
                    <Input 
                      type="date" 
                      value={startDate} 
                      onChange={e => setStartDate(e.target.value)} 
                      className="bg-white/5 border-white/10 text-white text-xs h-10 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-400 text-xs font-bold mb-1.5 block">End Date</Label>
                    <Input 
                      type="date" 
                      value={endDate} 
                      onChange={e => setEndDate(e.target.value)} 
                      className="bg-white/5 border-white/10 text-white text-xs h-10 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-400 text-xs font-bold mb-1.5 block">Guests</Label>
                    <Input 
                      type="number" 
                      min={1} 
                      max={10} 
                      value={guests} 
                      onChange={e => setGuests(Number(e.target.value))} 
                      className="bg-white/5 border-white/10 text-white text-xs h-10 rounded-xl"
                    />
                  </div>
                </div>

                {/* Package Types */}
                <div>
                  <Label className="text-slate-400 text-xs font-bold mb-2 block">Choose Package</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Standard Card */}
                    <div 
                      onClick={() => setPackageType("standard")}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        packageType === "standard" 
                          ? "bg-cyan-500/10 border-cyan-500 text-white" 
                          : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      <h4 className="font-extrabold text-xs">Standard</h4>
                      <p className="text-[10px] mt-1 line-clamp-2">Standard hotels, guided city tours & breakfasts.</p>
                      <p className="text-cyan-400 font-extrabold text-xs mt-2">₹{(dest.avgBudgetPerDay || 2000).toLocaleString()}/day</p>
                    </div>

                    {/* Adventure Card */}
                    <div 
                      onClick={() => setPackageType("adventure")}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        packageType === "adventure" 
                          ? "bg-emerald-500/10 border-emerald-500 text-white" 
                          : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      <h4 className="font-extrabold text-xs text-emerald-400">Adventure</h4>
                      <p className="text-[10px] mt-1 line-clamp-2">Adventure resorts, trekking, gear rental & guides.</p>
                      <p className="text-emerald-400 font-extrabold text-xs mt-2">₹{Math.round((dest.avgBudgetPerDay || 2000) * 1.6).toLocaleString()}/day</p>
                    </div>

                    {/* Luxury Card */}
                    <div 
                      onClick={() => setPackageType("luxury")}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        packageType === "luxury" 
                          ? "bg-amber-500/10 border-amber-500 text-white" 
                          : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      <h4 className="font-extrabold text-xs text-amber-400">Luxury</h4>
                      <p className="text-[10px] mt-1 line-clamp-2">5-star heritage resort stays, private luxury transport & fine dining.</p>
                      <p className="text-amber-400 font-extrabold text-xs mt-2">₹{Math.round((dest.avgBudgetPerDay || 2000) * 2.5).toLocaleString()}/day</p>
                    </div>
                  </div>
                </div>

                {/* Billing Info */}
                <div className="space-y-2.5 border-t border-white/5 pt-3">
                  <h4 className="text-white text-xs font-extrabold mb-1">Primary Traveler Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-slate-400 text-[10px] font-bold mb-1 block">Full Name</Label>
                      <Input 
                        placeholder="John Doe" 
                        value={travellerName} 
                        onChange={e => setTravellerName(e.target.value)} 
                        className="bg-white/5 border-white/10 text-white text-xs h-10 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-400 text-[10px] font-bold mb-1 block">Email</Label>
                      <Input 
                        type="email" 
                        placeholder="john@example.com" 
                        value={travellerEmail} 
                        onChange={e => setTravellerEmail(e.target.value)} 
                        className="bg-white/5 border-white/10 text-white text-xs h-10 rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-400 text-[10px] font-bold mb-1 block">Phone Number (Optional)</Label>
                    <Input 
                      placeholder="+91 98765 43210" 
                      value={travellerPhone} 
                      onChange={e => setTravellerPhone(e.target.value)} 
                      className="bg-white/5 border-white/10 text-white text-xs h-10 rounded-xl"
                    />
                  </div>
                </div>

                {/* Invoice Breakdown */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 space-y-2 mt-4">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Base package (₹{getPackagePrice().toLocaleString()} × {guests} guests × {calculateDays()} days)</span>
                    <span>₹{getSubtotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Taxes & GST (18%)</span>
                    <span>₹{Math.round(getTax()).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-white/5 pt-2 flex justify-between text-sm font-black text-cyan-400">
                    <span>Total Amount</span>
                    <span>₹{Math.round(getTotal()).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-4 flex gap-2">
                <Button 
                  onClick={() => setIsBookingOpen(false)} 
                  variant="outline" 
                  className="border-white/10 text-slate-400 hover:text-white rounded-xl flex-1 cursor-pointer h-11 text-xs"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleBooking}
                  disabled={!travellerName || !travellerEmail || isSubmitting}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold rounded-xl flex-1 cursor-pointer h-11 text-xs"
                >
                  {isSubmitting ? "Processing Payment..." : "Confirm & Pay"}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-2">
                <ShieldCheck className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-black text-white">Booking Confirmed!</h3>
              <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
                Pack your bags! Your tour reservation to <strong>{dest.name}</strong> has been secured. A confirmation email and tickets have been sent to <strong>{travellerEmail}</strong>.
              </p>

              {/* Boarding Pass ticket */}
              <div className="w-full max-w-xs border border-white/10 rounded-2xl overflow-hidden bg-[#0c1426] shadow-2xl p-4 text-left font-mono space-y-3 mt-4">
                <div className="flex justify-between border-b border-white/5 pb-2 text-[10px] text-slate-500">
                  <span>WANDER INDIA TRAVELS</span>
                  <span>CONFIRMATION PASS</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block uppercase">Destination</span>
                  <span className="text-sm font-bold text-white uppercase">{dest.name} ({dest.state})</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Traveler</span>
                    <span className="text-xs font-bold text-white truncate max-w-[120px] block">{travellerName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Ticket Code</span>
                    <span className="text-xs font-bold text-cyan-400">{bookingCode}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 border-t border-white/5 pt-2">
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Dates</span>
                    <span className="text-[10px] text-white font-bold">{startDate} to {endDate}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Guests</span>
                    <span className="text-xs text-white font-bold">{guests} Adults</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setIsBookingOpen(false)}
                className="w-full max-w-xs bg-white text-black hover:bg-cyan-400 hover:text-black font-extrabold rounded-xl h-11 mt-4 cursor-pointer text-xs"
              >
                Done
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
