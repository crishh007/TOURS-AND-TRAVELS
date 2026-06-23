import { motion } from "framer-motion";
import { useGetHiddenGems, getGetHiddenGemsQueryKey } from "@workspace/api-client-react";
import Navbar from "@/components/Navbar";
import DestinationCard from "@/components/DestinationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Gem } from "lucide-react";
import { MOCK_DESTINATIONS } from "../data/destinations";

export default function HiddenGemsPage() {
  const { data: apiGems, isLoading } = useGetHiddenGems({
    query: {
      queryKey: getGetHiddenGemsQueryKey(),
      retry: false
    }
  });

  const gems = Array.isArray(apiGems)
    ? apiGems
    : MOCK_DESTINATIONS.filter(d => d.isHiddenGem);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 glow-purple">
            <Gem className="w-8 h-8 text-white" />
          </div>
          <span className="text-sm text-purple-400 font-semibold uppercase tracking-wider">Off the Beaten Path</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mt-2 mb-4">Hidden Gems of India</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Beyond the postcards and travel guides — these lesser-known destinations will take your breath away and reward the curious traveler.</p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-72 rounded-2xl" />)}
          </div>
        ) : gems.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No hidden gems found yet. Check back soon!</div>
        ) : (
          <>
            <p className="text-muted-foreground text-sm mb-6">{gems.length} hidden gem{gems.length !== 1 ? "s" : ""} discovered</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gems.map((dest, i) => <DestinationCard key={dest.id} destination={dest} index={i} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
