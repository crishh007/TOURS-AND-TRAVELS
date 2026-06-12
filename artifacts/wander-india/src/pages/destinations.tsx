import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { motion } from "framer-motion";
import { useListDestinations, getListDestinationsQueryKey } from "@workspace/api-client-react";
import Navbar from "@/components/Navbar";
import DestinationCard from "@/components/DestinationCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, MapPin } from "lucide-react";

const CATEGORIES = ["All", "Beach", "Heritage", "Nature", "Adventure", "Spiritual", "Mountains", "Island", "Culture"];

export default function DestinationsPage() {
  const searchString = useSearch();
  const initialSearch = new URLSearchParams(searchString).get("search") ?? "";

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState("All");
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  useEffect(() => {
    const querySearch = new URLSearchParams(searchString).get("search") ?? "";
    setSearch(querySearch);
    setDebouncedSearch(querySearch);
  }, [searchString]);

  const { data: destinations = [], isLoading } = useListDestinations(
    { search: debouncedSearch || undefined, category: category !== "All" ? category : undefined },
    { query: { queryKey: getListDestinationsQueryKey({ search: debouncedSearch || undefined, category: category !== "All" ? category : undefined }) } }
  );

  const handleSearch = (val: string) => {
    setSearch(val);
    clearTimeout((window as any)._searchTimer);
    (window as any)._searchTimer = setTimeout(() => setDebouncedSearch(val), 400);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-sm text-amber-400 font-semibold uppercase tracking-wider">Discover India</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mt-2 mb-4">Explore Destinations</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">From the snow-capped Himalayas to the tropical beaches — find your perfect Indian adventure.</p>
        </motion.div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search destinations or states..."
              className="pl-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground rounded-xl"
              data-testid="input-search"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 flex-wrap mb-10">
          {CATEGORIES.map(cat => (
            <Button
              key={cat}
              variant="ghost"
              size="sm"
              onClick={() => setCategory(cat)}
              data-testid={`filter-${cat.toLowerCase()}`}
              className={`rounded-xl h-9 px-4 text-sm transition-all ${
                category === cat
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-20">
            <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-white text-xl font-bold mb-2">No destinations found</h3>
            <p className="text-muted-foreground">Try a different search or category.</p>
            <Button
              onClick={() => { setSearch(""); setDebouncedSearch(""); setCategory("All"); }}
              variant="outline"
              className="mt-4 border-white/20 text-white"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-sm mb-6">{destinations.length} destination{destinations.length !== 1 ? "s" : ""} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {destinations.map((dest, i) => (
                <DestinationCard key={dest.id} destination={dest} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
