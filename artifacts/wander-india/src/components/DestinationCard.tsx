import { motion } from "framer-motion";
import { Link } from "wouter";
import { Star, MapPin, Clock, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Destination {
  id: number;
  name: string;
  state: string;
  description: string;
  imageUrl: string;
  category: string;
  rating: number;
  bestTime: string;
  tags?: string[];
  isTrending?: boolean;
  isHiddenGem?: boolean;
  avgBudgetPerDay?: number;
}

interface Props {
  destination: Destination;
  index?: number;
}

export default function DestinationCard({ destination, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link href={`/destinations/${destination.id}`}>
        <div className="glass-card rounded-2xl overflow-hidden cursor-pointer hover:border-amber-500/30 transition-all duration-300">
          {/* Image */}
          <div className="relative h-52 overflow-hidden">
            <img
              src={destination.imageUrl}
              alt={destination.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute top-3 left-3 flex gap-2">
              {destination.isTrending && (
                <Badge className="bg-amber-500/90 text-black text-xs font-semibold border-0">Trending</Badge>
              )}
              {destination.isHiddenGem && (
                <Badge className="bg-purple-500/90 text-white text-xs font-semibold border-0">Hidden Gem</Badge>
              )}
            </div>
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-white text-sm font-semibold">{destination.rating.toFixed(1)}</span>
            </div>
            <div className="absolute bottom-3 right-3">
              <span className="text-xs text-white/80 bg-black/40 px-2 py-1 rounded-full">{destination.category}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-bold text-white text-lg leading-tight">{destination.name}</h3>
            <div className="flex items-center gap-1 mt-1 mb-2">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span className="text-muted-foreground text-xs">{destination.state}</span>
            </div>
            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{destination.description}</p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{destination.bestTime}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-cyan-400 font-medium">
                <DollarSign className="w-3 h-3" />
                <span>₹{destination.avgBudgetPerDay?.toLocaleString("en-IN")}/day</span>
              </div>
            </div>
            {destination.tags && destination.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {destination.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 bg-white/5 rounded-full text-white/50">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
