import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { getPlaceOffer, getBestHotelOfferForPlace } from "../data/offers";
import { Heart, Bookmark, Volume2, VolumeX, Sparkles, ArrowLeft, X, Play } from "lucide-react";
import { MOCK_DESTINATIONS } from "../data/destinations";

// ─── Types ──────────────────────────────────────────────────────────────────
export interface Reel {
  id: number;
  placeId: number;
  location: string;
  state: string;
  category: string;
  price: number;
  caption: string;
  tags: string[];
  videoUrl: string;
  likes: number;
  views: string;
}

// ─── Reel data — mapped to destinations, at least 4 reels per category filter ──
export const REELS: Reel[] = [
  // Beach (5 reels)
  {
    id: 1,
    placeId: 1,
    location: "Goa",
    state: "Goa",
    category: "Beach",
    price: 4500,
    caption: "Chasing golden hours & ocean waves 🌅 Goa beach life is unmatched.",
    tags: ["#Goa", "#BeachVibes", "#Sunset"],
    videoUrl: "/goa-sunset.mp4",
    likes: 5821,
    views: "42K",
  },
  {
    id: 2,
    placeId: 19,
    location: "Pondicherry",
    state: "Tamil Nadu",
    category: "Beach",
    price: 2500,
    caption: "French style cafes, yellow cobblestone streets, and serene promenade beaches.",
    tags: ["#Pondicherry", "#FrenchTown", "#Beach"],
    videoUrl: "/pondicherry.mp4",
    likes: 3980,
    views: "29K",
  },
  {
    id: 3,
    placeId: 22,
    location: "Varkala",
    state: "Kerala",
    category: "Beach",
    price: 3000,
    caption: "Red cliffs crashing into the Arabian Sea 🌊 Varkala cliff walk is unmissable.",
    tags: ["#Varkala", "#CliffBeach", "#Kerala"],
    videoUrl: "/varkala.mp4",
    likes: 5100,
    views: "38K",
  },
  {
    id: 4,
    placeId: 28,
    location: "Gokarna",
    state: "Karnataka",
    category: "Beach",
    price: 1500,
    caption: "Quiet, pristine beaches, surf culture, and holy temple vibes in Gokarna.",
    tags: ["#Gokarna", "#Surfing", "#BeachTrek"],
    videoUrl: "/g.mp4",
    likes: 4200,
    views: "31K",
  },
  {
    id: 5,
    placeId: 29,
    location: "Kovalam",
    state: "Kerala",
    category: "Beach",
    price: 2800,
    caption: "Palm-fringed crescent beaches and amazing lighthouses in Kovalam.",
    tags: ["#Kovalam", "#Lighthouse", "#KeralaBeaches"],
    videoUrl: "/kovalam.mp4",
    likes: 4670,
    views: "35K",
  },

  // Heritage (5 reels)
  {
    id: 6,
    placeId: 4,
    location: "Jaipur",
    state: "Rajasthan",
    category: "Heritage",
    price: 6500,
    caption: "Majestic forts, palaces, and royal Rajasthani culture in the Pink City.",
    tags: ["#Jaipur", "#Desert", "#Rajasthan"],
    videoUrl: "/rajasthan-desert.mp4",
    likes: 8203,
    views: "65K",
  },
  {
    id: 7,
    placeId: 5,
    location: "Udaipur",
    state: "Rajasthan",
    category: "Heritage",
    price: 2800,
    caption: "Fairy-tale palace views and romantic boat rides on Lake Pichola.",
    tags: ["#Udaipur", "#LakeCity", "#RoyalIndia"],
    videoUrl: "/udaipur.mp4",
    likes: 7900,
    views: "54K",
  },
  {
    id: 8,
    placeId: 30,
    location: "Jodhpur",
    state: "Rajasthan",
    category: "Heritage",
    price: 1900,
    caption: "The Blue City — Mehrangarh Fort rising high above blue-painted houses.",
    tags: ["#Jodhpur", "#BlueCity", "#Mehrangarh"],
    videoUrl: "/jod.mp4",
    likes: 6100,
    views: "44K",
  },
  {
    id: 9,
    placeId: 31,
    location: "Khajuraho",
    state: "Madhya Pradesh",
    category: "Heritage",
    price: 1600,
    caption: "UNESCO-listed ancient temples adorned with expressive stone carvings.",
    tags: ["#Khajuraho", "#History", "#StoneCarving"],
    videoUrl: "/kha.mp4",
    likes: 5400,
    views: "39K",
  },
  {
    id: 10,
    placeId: 38,
    location: "Agra",
    state: "Uttar Pradesh",
    category: "Heritage",
    price: 1800,
    caption: "The Taj Mahal — the world's most beautiful monument of love.",
    tags: ["#Agra", "#TajMahal", "#Wonders"],
    videoUrl: "/agra.mp4",
    likes: 9800,
    views: "95K",
  },

  // Nature (5 reels)
  {
    id: 11,
    placeId: 3,
    location: "Alleppey",
    state: "Kerala",
    category: "Nature",
    price: 5500,
    caption: "Floating through serene backwaters & coconut groves on a houseboat.",
    tags: ["#Alleppey", "#Backwaters", "#Kerala"],
    videoUrl: "/alleppey.mp4",
    likes: 7203,
    views: "58K",
  },
  {
    id: 12,
    placeId: 14,
    location: "Ziro Valley",
    state: "Arunachal Pradesh",
    category: "Nature",
    price: 1800,
    caption: "Lush bamboo forests, music festivals, and scenic rice paddies.",
    tags: ["#ZiroValley", "#ArunachalPradesh", "#NatureLovers"],
    videoUrl: "/zero.mp4",
    likes: 4300,
    views: "30K",
  },
  {
    id: 13,
    placeId: 20,
    location: "Wayanad",
    state: "Kerala",
    category: "Nature",
    price: 2500,
    caption: "Wild elephant trails, waterfalls, and spice plantations in Kerala.",
    tags: ["#Wayanad", "#Wilderness", "#NatureEscape"],
    videoUrl: "/wayanad.mp4",
    likes: 5600,
    views: "42K",
  },
  {
    id: 14,
    placeId: 33,
    location: "Cherrapunji",
    state: "Meghalaya",
    category: "Nature",
    price: 2200,
    caption: "Misty living root bridges and powerful cascading waterfalls.",
    tags: ["#Cherrapunji", "#RootBridge", "#Rainforest"],
    videoUrl: "/che.mp4",
    likes: 6700,
    views: "51K",
  },
  {
    id: 15,
    placeId: 34,
    location: "Chikmagalur",
    state: "Karnataka",
    category: "Nature",
    price: 2500,
    caption: "Waking up in the coffee land of Karnataka with misty hill views.",
    tags: ["#Chikmagalur", "#CoffeeEstate", "#Hills"],
    videoUrl: "chi.mp4",
    likes: 4900,
    views: "36K",
  },

  // Adventure (4 reels)
  {
    id: 16,
    placeId: 6,
    location: "Manali",
    state: "Himachal Pradesh",
    category: "Adventure",
    price: 2500,
    caption: "Paragliding, Rohtang Pass, Old Manali cafes, and snow-capped peaks.",
    tags: ["#Manali", "#Paragliding", "#SnowTrek"],
    videoUrl: "/ooty.mp4",
    likes: 6450,
    views: "48K",
  },
  {
    id: 17,
    placeId: 9,
    location: "Rishikesh",
    state: "Uttarakhand",
    category: "Adventure",
    price: 1800,
    caption: "White water river rafting on the holy Ganges and camping in the hills.",
    tags: ["#Rishikesh", "#Rafting", "#GangesAdventure"],
    videoUrl: "/ri.mp4",
    likes: 7100,
    views: "53K",
  },
  {
    id: 18,
    placeId: 11,
    location: "Spiti Valley",
    state: "Himachal Pradesh",
    category: "Adventure",
    price: 3500,
    caption: "Cold desert high-altitude roads, ancient monasteries, and starry skies.",
    tags: ["#SpitiValley", "#Monasteries", "#HighPasses"],
    videoUrl: "/s.mp4",
    likes: 5800,
    views: "41K",
  },
  {
    id: 19,
    placeId: 26,
    location: "Gulmarg",
    state: "Jammu & Kashmir",
    category: "Adventure",
    price: 4000,
    caption: "World-class skiing slopes and riding the highest cable car gondola.",
    tags: ["#Gulmarg", "#Skiing", "#SnowAdventure"],
    videoUrl: "/g.mp4",
    likes: 7900,
    views: "60K",
  },

  // Spiritual (4 reels)
  {
    id: 20,
    placeId: 7,
    location: "Varanasi",
    state: "Uttar Pradesh",
    category: "Spiritual",
    price: 1500,
    caption: "TIMELINES OF FAITH: ancient ghats on the Ganges & mesmerizing Ganga Aarti.",
    tags: ["#Varanasi", "#Ghats", "#GangaAarti"],
    videoUrl: "/v.mp4",
    likes: 8520,
    views: "62K",
  },
  {
    id: 21,
    placeId: 21,
    location: "Madurai",
    state: "Tamil Nadu",
    category: "Spiritual",
    price: 1800,
    caption: "Sacred temple towers of Meenakshi Amman Temple and holy chants.",
    tags: ["#Madurai", "#MeenakshiTemple", "#SpiritualVibes"],
    videoUrl: "/madurai.mp4",
    likes: 6900,
    views: "47K",
  },
  {
    id: 22,
    placeId: 23,
    location: "Rameswaram",
    state: "Tamil Nadu",
    category: "Spiritual",
    price: 1500,
    caption: "Pamban bridge and long temple corridors of Ramanathaswamy Temple.",
    tags: ["#Rameswaram", "#PambanBridge", "#Pilgrimage"],
    videoUrl: "/rameswaram.mp4",
    likes: 7100,
    views: "52K",
  },
  {
    id: 23,
    placeId: 35,
    location: "Amritsar",
    state: "Punjab",
    category: "Spiritual",
    price: 1200,
    caption: "The Golden Temple — serene waters, peace, and sacred langar kitchen.",
    tags: ["#Amritsar", "#GoldenTemple", "#Sikhism"],
    videoUrl: "/amr.mp4",
    likes: 9300,
    views: "79K",
  },

  // Mountains (5 reels)
  {
    id: 24,
    placeId: 2,
    location: "Ladakh",
    state: "Ladakh",
    category: "Mountains",
    price: 4500,
    caption: "Surreal mountain roads and cold desert views of Pangong Lake.",
    tags: ["#Ladakh", "#Pangong", "#HighPasses"],
    videoUrl: "/l.mp4",
    likes: 8100,
    views: "66K",
  },
  {
    id: 25,
    placeId: 16,
    location: "Ooty",
    state: "Tamil Nadu",
    category: "Mountains",
    price: 3500,
    caption: "Misty mornings & endless green tea estates in the Nilgiri Hills.",
    tags: ["#Ooty", "#MistyEstates", "#Nilgiri"],
    videoUrl: "/o.mp4",
    likes: 4900,
    views: "36K",
  },
  {
    id: 26,
    placeId: 17,
    location: "Coorg",
    state: "Karnataka",
    category: "Mountains",
    price: 3000,
    caption: "Winding misty mountain roads and fresh green coffee plantations.",
    tags: ["#Coorg", "#CoffeeEstate", "#MistyHills"],
    videoUrl: "/coorg.mp4",
    likes: 5400,
    views: "39K",
  },
  {
    id: 27,
    placeId: 24,
    location: "Kodaikanal",
    state: "Tamil Nadu",
    category: "Mountains",
    price: 2600,
    caption: "Star-shaped lake, deep pine forests, and cool misty valley trails.",
    tags: ["#Kodaikanal", "#PineForests", "#Mountains"],
    videoUrl: "/kodaikanal.mp4",
    likes: 4700,
    views: "33K",
  },
  {
    id: 28,
    placeId: 25,
    location: "Shimla",
    state: "Himachal Pradesh",
    category: "Mountains",
    price: 2400,
    caption: "Historical colonial mall roads and viewpoints of snowy Himalayan peaks.",
    tags: ["#Shimla", "#Himalayas", "#MallRoad"],
    videoUrl: "/shi",
    likes: 5800,
    views: "44K",
  },

  // Culture (5 reels)
  {
    id: 29,
    placeId: 12,
    location: "Hampi",
    state: "Karnataka",
    category: "Culture",
    price: 1500,
    caption: "UNESCO-listed ruins of Vijayanagara empire amidst boulder landscapes.",
    tags: ["#Hampi", "#Vijayanagara", "#HistoryTrek"],
    videoUrl: "/hampi.mp4",
    likes: 6710,
    views: "48K",
  },
  {
    id: 30,
    placeId: 13,
    location: "Majuli",
    state: "Assam",
    category: "Culture",
    price: 1200,
    caption: "The world's largest river island with ancient Vaishnavite mask monasteries.",
    tags: ["#Majuli", "#Vaishnavism", "#AssamCulture"],
    videoUrl: "/maj.mp4",
    likes: 5400,
    views: "37K",
  },
  {
    id: 31,
    placeId: 15,
    location: "Rann of Kutch",
    state: "Gujarat",
    category: "Culture",
    price: 2000,
    caption: "White salt desert salt flats under the moonlight & Kutchi embroidery.",
    tags: ["#RannOfKutch", "#WhiteDesert", "#RannUtsav"],
    videoUrl: "/rann.mp4",
    likes: 7200,
    views: "52K",
  },
  {
    id: 32,
    placeId: 32,
    location: "Mahabalipuram",
    state: "Tamil Nadu",
    category: "Culture",
    price: 1800,
    caption: "7th-century shore temples and giant rock-cut stone chariots.",
    tags: ["#Mahabalipuram", "#ShoreTemple", "#PallavaRuins"],
    videoUrl: "/maha.mp4",
    likes: 4800,
    views: "34K",
  },
  {
    id: 33,
    placeId: 18,
    location: "Munnar",
    state: "Kerala",
    category: "Culture",
    price: 4200,
    caption: "Local tea picking communities and age-old traditions of Western Ghats.",
    tags: ["#Munnar", "#TeaCulture", "#LocalTraditions"],
    videoUrl: "/munnar.mp4",
    likes: 8900,
    views: "70K",
  }
];

const FILTERS = ["All", "Beach", "Heritage", "Nature", "Adventure", "Spiritual", "Mountains", "Culture"];

// ─── Main Feed ────────────────────────────────────────────────────────────────
export default function ReelsFeed() {
  const [, setLocation] = useLocation();
  const destinations = MOCK_DESTINATIONS;
  const [likedReels, setLikedReels] = useState<number[]>(() =>
    JSON.parse(localStorage.getItem("likedReels") || "[]")
  );
  const [savedReels, setSavedReels] = useState<any[]>(() =>
    JSON.parse(localStorage.getItem("savedReels") || "[]")
  );
  const [activeFilter, setActiveFilter] = useState("All");
  const [mutedAll, setMutedAll] = useState(true);
  const [activeDrawer, setActiveDrawer] = useState<"liked" | "saved" | null>(null);

  const filtered = activeFilter === "All"
    ? REELS
    : REELS.filter(r => r.category === activeFilter);

  const toggleLike = (reel: Reel) => {
    const updated = likedReels.includes(reel.id)
      ? likedReels.filter(id => id !== reel.id)
      : [...likedReels, reel.id];
    setLikedReels(updated);
    localStorage.setItem("likedReels", JSON.stringify(updated));
  };

  const toggleSave = (reel: Reel) => {
    const alreadySaved = savedReels.find((s: any) => s.id === reel.id);
    const updated = alreadySaved
      ? savedReels.filter((s: any) => s.id !== reel.id)
      : [...savedReels, {
          id: reel.id,
          location: reel.location,
          price: reel.price,
          videoUrl: reel.videoUrl,
          placeId: reel.placeId,
        }];
    setSavedReels(updated);
    localStorage.setItem("savedReels", JSON.stringify(updated));
  };

  const scrollToReel = (reelId: number) => {
    setActiveDrawer(null);
    setTimeout(() => {
      const element = document.getElementById(`reel-card-${reelId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleExplore = (reel: Reel) => {
    const match = destinations.find(
      (d: any) =>
        d.name.toLowerCase() === reel.location.toLowerCase() ||
        d.name.toLowerCase().includes(reel.location.toLowerCase()) ||
        reel.location.toLowerCase().includes(d.name.toLowerCase())
    );
    if (match) {
      setLocation(`/destinations/${match.id}`);
    } else {
      setLocation("/destinations");
    }
  };

  const likedList = REELS.filter(r => likedReels.includes(r.id));
  const savedList = REELS.filter(r => savedReels.some((s: any) => s.id === r.id));

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col">
      {/* Injecting CSS Keyframes for drawer slide in */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes pingOnce {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        .animate-ping-once {
          animation: pingOnce 0.6s ease-out forwards;
        }
      `}} />

      {/* ── Sticky Header ──────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-[#020617]/95 backdrop-blur-xl border-b border-white/5 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLocation("/")}
              className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-slate-400 hover:text-white cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tighter text-cyan-400">Reels</h1>
              <p className="text-slate-500 text-[10px] hidden sm:block font-medium">Vertical scroll snapping travel videos</p>
            </div>
          </div>
          
          {/* Liked & Saved Prominent Buttons in top-right */}
          <div className="flex items-center gap-2">
            {/* Mute Global */}
            <button
              onClick={() => setMutedAll(m => !m)}
              className="flex items-center justify-center p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all cursor-pointer mr-1"
              title={mutedAll ? "Unmute All" : "Mute All"}
            >
              {mutedAll ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
            </button>

            {/* Liked Reels Toggle Button */}
            <button
              onClick={() => setActiveDrawer("liked")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full hover:bg-red-500/20 text-red-400 text-xs font-black transition-all cursor-pointer shadow-md"
            >
              <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
              <span className="hidden sm:inline">Liked</span>
              <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                {likedReels.length}
              </span>
            </button>

            {/* Saved Reels Toggle Button */}
            <button
              onClick={() => setActiveDrawer("saved")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full hover:bg-cyan-500/20 text-cyan-400 text-xs font-black transition-all cursor-pointer shadow-md"
            >
              <Bookmark className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              <span className="hidden sm:inline">Saved</span>
              <span className="bg-cyan-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">
                {savedReels.length}
              </span>
            </button>
          </div>
        </div>

        {/* Filter pills overlay */}
        <div className="max-w-6xl mx-auto mt-3 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 px-4 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
                activeFilter === f
                  ? "bg-cyan-500 text-black"
                  : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Immersive Snap Scroll Reels Area ──────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-[#020617]">
        {filtered.length > 0 ? (
          <div className="relative w-full max-w-[420px] h-[calc(100vh-160px)] md:h-[calc(100vh-180px)] max-h-[720px] min-h-[450px] bg-black sm:rounded-[2rem] sm:border border-white/15 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col">
            <div className="flex-1 overflow-y-scroll snap-y snap-mandatory scrollbar-none h-full w-full">
              {filtered.map(reel => (
                <ReelCard
                  key={reel.id}
                  reel={reel}
                  isLiked={likedReels.includes(reel.id)}
                  isSaved={!!savedReels.find((s: any) => s.id === reel.id)}
                  mutedAll={mutedAll}
                  onLike={() => toggleLike(reel)}
                  onSave={() => toggleSave(reel)}
                  toggleMutedAll={() => setMutedAll(m => !m)}
                  onNavigate={() => handleExplore(reel)}
                  onOffers={() => handleExplore(reel)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🎬</p>
            <p className="text-slate-500">No reels for this category yet.</p>
          </div>
        )}
      </div>

      {/* ── Slide Drawer for Saved/Liked items ────────────────────────────── */}
      {activeDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
          {/* Click outside to close */}
          <div className="absolute inset-0" onClick={() => setActiveDrawer(null)} />
          
          <div className="relative w-full max-w-sm h-full bg-[#080d1a] border-l border-white/10 shadow-2xl flex flex-col z-10 animate-slide-in p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                {activeDrawer === "liked" ? (
                  <>
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" /> Liked Reels ({likedList.length})
                  </>
                ) : (
                  <>
                    <Bookmark className="w-5 h-5 text-cyan-400 fill-cyan-400" /> Saved Reels ({savedList.length})
                  </>
                )}
              </h2>
              <button 
                onClick={() => setActiveDrawer(null)}
                className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {activeDrawer === "liked" ? (
                likedList.length === 0 ? (
                  <div className="text-center py-16 text-slate-500 text-xs leading-relaxed">
                    No liked reels yet. Tap the heart icon on a reel to save it here.
                  </div>
                ) : (
                  likedList.map(reel => (
                    <DrawerItem key={reel.id} reel={reel} onClick={() => scrollToReel(reel.id)} />
                  ))
                )
              ) : (
                savedList.length === 0 ? (
                  <div className="text-center py-16 text-slate-500 text-xs leading-relaxed">
                    No saved reels yet. Tap the bookmark icon on a reel to pin it here.
                  </div>
                ) : (
                  savedList.map(reel => (
                    <DrawerItem key={reel.id} reel={reel} onClick={() => scrollToReel(reel.id)} />
                  ))
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ReelCard ─────────────────────────────────────────────────────────────────
interface ReelCardProps {
  reel: Reel;
  isLiked: boolean;
  isSaved: boolean;
  mutedAll: boolean;
  onLike: () => void;
  onSave: () => void;
  toggleMutedAll: () => void;
  onNavigate: () => void;
  onOffers: () => void;
}

function ReelCard({
  reel,
  isLiked,
  isSaved,
  mutedAll,
  onLike,
  onSave,
  toggleMutedAll,
  onNavigate,
  onOffers
}: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef  = useRef<HTMLDivElement>(null);
  const [playing, setPlaying]       = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [likeCount, setLikeCount]   = useState(reel.likes);

  // Offers
  const placeOffer = getPlaceOffer(reel.placeId);
  const hotelOffer = getBestHotelOfferForPlace(reel.placeId);
  const hasOffer   = !!(placeOffer || hotelOffer);

  // Sync muted state with global toggle
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = mutedAll;
    }
  }, [mutedAll]);

  // ── IntersectionObserver — autoplay on scroll into view ──────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current || videoError) return;
        if (entry.isIntersecting) {
          videoRef.current.play()
            .then(() => setPlaying(true))
            .catch(() => {
              // Fail-safe: try playing muted if autoplays are blocked by user settings
              if (videoRef.current) {
                videoRef.current.muted = true;
                videoRef.current.play()
                  .then(() => setPlaying(true))
                  .catch(() => setPlaying(false));
              }
            });
        } else {
          videoRef.current.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.6 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [videoError]);

  const togglePlay = () => {
    if (!videoRef.current || videoError) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLikeCount(c => isLiked ? c - 1 : c + 1);
    onLike();
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave();
  };

  return (
    <div
      ref={cardRef}
      id={`reel-card-${reel.id}`}
      className="snap-start snap-always w-full h-full relative flex flex-col justify-end bg-black flex-shrink-0"
    >
      {/* ── Video Player ─────────────────── */}
      <div className="absolute inset-0 w-full h-full cursor-pointer bg-slate-955" onClick={togglePlay}>
        {!videoError ? (
          <video
            ref={videoRef}
            src={reel.videoUrl}
            muted={mutedAll}
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
          />
        ) : (
          <img
            alt={reel.location}
            className="w-full h-full object-cover opacity-90"
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-black/30 pointer-events-none"/>
      </div>

      {/* ── Overlay Action Icons (Right aligned, floating) — Nearby removed ── */}
      <div className="absolute right-4 bottom-24 flex flex-col gap-5 items-center z-10">
        {/* Like */}
        <button
          onClick={handleLike}
          className="flex flex-col items-center gap-1 focus:outline-none cursor-pointer"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${
            isLiked 
              ? "bg-red-500/25 border-red-500/50 text-red-500 scale-110" 
              : "bg-black/40 border-white/10 text-white hover:bg-black/60"
          }`}>
            <Heart className={`w-5.5 h-5.5 ${isLiked ? "fill-red-500" : ""}`} />
          </div>
          <span className="text-[10px] font-black text-white drop-shadow-md">
            {likeCount.toLocaleString()}
          </span>
        </button>

        {/* Save */}
        <button
          onClick={handleSave}
          className="flex flex-col items-center gap-1 focus:outline-none cursor-pointer"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${
            isSaved 
              ? "bg-cyan-500/25 border-cyan-500/50 text-cyan-400 scale-110" 
              : "bg-black/40 border-white/10 text-white hover:bg-black/60"
          }`}>
            <Bookmark className={`w-5.5 h-5.5 ${isSaved ? "fill-cyan-400" : ""}`} />
          </div>
          <span className="text-[10px] font-black text-white drop-shadow-md">
            {isSaved ? "Saved" : "Save"}
          </span>
        </button>

        {/* Offers Sparkles */}
        {hasOffer && (
          <button
            onClick={(e) => { e.stopPropagation(); onOffers(); }}
            className="flex flex-col items-center gap-1 focus:outline-none animate-pulse cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-rose-500/20 border border-rose-500/50 text-rose-400 backdrop-blur-md transition-all">
              <Sparkles className="w-5.5 h-5.5" />
            </div>
            <span className="text-[10px] font-black text-rose-400 drop-shadow-md">Deals</span>
          </button>
        )}

        {/* Mute Toggle */}
        {!videoError && (
          <button
            onClick={(e) => { e.stopPropagation(); toggleMutedAll(); }}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-black/40 border border-white/10 text-white hover:bg-black/60 backdrop-blur-md transition-all focus:outline-none cursor-pointer"
          >
            {mutedAll ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-cyan-400" />}
          </button>
        )}
      </div>

      {/* ── Bottom Content Overlay (Text labels) ─────────────────────────── */}
      <div className="p-4 z-10 flex flex-col gap-2 max-w-[80%]">
        <div className="flex items-center gap-2">
          <span className="bg-cyan-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
            {reel.category}
          </span>
          <span className="text-white/60 text-[10px] font-extrabold flex items-center gap-1">
            👁 {reel.views} views
          </span>
        </div>

        <div>
          <h3 className="text-lg font-black text-white leading-tight flex items-baseline gap-1">
            {reel.location}
            <span className="text-[10px] text-slate-400 font-bold">· {reel.state}</span>
          </h3>
          <p className="text-cyan-400 font-black text-sm">₹{reel.price.toLocaleString()} onwards</p>
        </div>

        <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">
          {reel.caption}
        </p>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1">
          {reel.tags.map(tag => (
            <span key={tag} className="text-[9px] text-cyan-400 font-bold bg-cyan-955/40 border border-cyan-900/30 px-1.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* Active Offer Banner */}
        {hasOffer && (
          <div className="bg-white/5 border border-rose-500/25 rounded-xl px-2.5 py-1.5 mt-1 flex items-center justify-between gap-2">
            <div className="min-w-0">
              {placeOffer && <p className="text-[9px] font-black text-emerald-400 truncate">{placeOffer.badge} · {placeOffer.name}</p>}
              {hotelOffer && <p className="text-[9px] font-black text-rose-400 truncate">🏨 {hotelOffer.hotel} — {hotelOffer.discount}% off</p>}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onOffers(); }}
              className="text-[9px] font-black text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-lg hover:bg-rose-500/25 whitespace-nowrap transition-all cursor-pointer"
            >
              See →
            </button>
          </div>
        )}

        {/* Explore Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(); }}
          className="w-full mt-2 py-2.5 bg-white text-[#020617] font-black rounded-xl hover:bg-cyan-400 hover:text-black transition-all text-xs flex items-center justify-center shadow-lg cursor-pointer"
        >
          Explore Destination →
        </button>
      </div>

      {/* Play Icon pop animation */}
      {!playing && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-16 h-16 bg-black/55 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 animate-ping-once">
            <svg className="w-6 h-6 text-white ml-1 fill-white" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DrawerItem ───────────────────────────────────────────────────────────────
interface DrawerItemProps {
  reel: Reel;
  onClick: () => void;
}

function DrawerItem({ reel, onClick }: DrawerItemProps) {
  return (
    <div 
      onClick={onClick}
      className="flex gap-3 bg-white/5 border border-white/5 p-3 rounded-2xl cursor-pointer hover:border-cyan-500/30 hover:bg-white/10 transition-all duration-300"
    >
      <div className="w-16 h-20 bg-black rounded-xl overflow-hidden flex-shrink-0 relative border border-white/5">
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h4 className="text-white text-xs font-black truncate">{reel.location}</h4>
        <p className="text-slate-500 text-[10px] truncate">📍 {reel.state}</p>
        <p className="text-cyan-400 text-xs font-bold mt-1">₹{reel.price.toLocaleString()}</p>
      </div>
    </div>
  );
}