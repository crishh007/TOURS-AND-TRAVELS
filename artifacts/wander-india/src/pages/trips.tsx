import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useListTrips, getListTripsQueryKey, useDeleteTrip } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plane, MapPin, Calendar, DollarSign, Plus, Trash2, ChevronRight, Clock } from "lucide-react";

export default function TripsPage() {
  return <ProtectedRoute><TripsContent /></ProtectedRoute>;
}

function TripsContent() {
  const { data: trips = [], isLoading } = useListTrips({ query: { queryKey: getListTripsQueryKey() } });
  const deleteMutation = useDeleteTrip();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete trip to ${name}?`)) return;
    try {
      await deleteMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListTripsQueryKey() });
      toast({ title: "Trip deleted" });
    } catch {
      toast({ title: "Failed to delete trip", variant: "destructive" });
    }
  };

  const upcoming = trips.filter(t => t.status === "upcoming");
  const past = trips.filter(t => t.status !== "upcoming");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-white">My Trips</h1>
            <p className="text-muted-foreground mt-1">{trips.length} trip{trips.length !== 1 ? "s" : ""} saved</p>
          </div>
          <Link href="/ai-planner">
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold border-0 rounded-xl gap-2" data-testid="btn-new-trip">
              <Plus className="w-4 h-4" /> Plan New Trip
            </Button>
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        ) : trips.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 text-center">
            <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-float" />
            <h3 className="text-white text-2xl font-black mb-2">No trips yet</h3>
            <p className="text-muted-foreground mb-8">Use our AI planner to create your first unforgettable Indian adventure.</p>
            <Link href="/ai-planner">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold border-0 rounded-xl h-12 px-8" data-testid="btn-plan-first">
                <Plus className="w-4 h-4 mr-2" /> Plan First Trip
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {upcoming.length > 0 && (
              <div>
                <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" /> Upcoming
                </h2>
                <div className="space-y-3">
                  {upcoming.map((trip, i) => <TripCard key={trip.id} trip={trip} index={i} onDelete={() => handleDelete(trip.id, trip.destinationName)} />)}
                </div>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Plane className="w-4 h-4 text-muted-foreground" /> Past Trips
                </h2>
                <div className="space-y-3">
                  {past.map((trip, i) => <TripCard key={trip.id} trip={trip} index={i} onDelete={() => handleDelete(trip.id, trip.destinationName)} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TripCard({ trip, index, onDelete }: { trip: any; index: number; onDelete: () => void }) {
  const spent = trip.spentAmount || 0;
  const budget = trip.totalBudget || 0;
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="glass-card rounded-2xl overflow-hidden"
      data-testid={`trip-card-${trip.id}`}
    >
      <div className="flex items-center gap-4 p-5">
        {trip.destinationImage ? (
          <img src={trip.destinationImage} alt={trip.destinationName} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
        ) : (
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-8 h-8 text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-white font-bold text-lg truncate">{trip.destinationName}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
              trip.status === "upcoming" ? "bg-cyan-500/20 text-cyan-400" : "bg-green-500/20 text-green-400"
            }`}>{trip.status}</span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{trip.startDate} → {trip.endDate}</span>
          </div>
          {/* Budget bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />₹{spent.toLocaleString("en-IN")} spent</span>
              <span>of ₹{budget.toLocaleString("en-IN")}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${pct > 90 ? "bg-red-500" : pct > 70 ? "bg-amber-500" : "bg-cyan-500"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href={`/trips/${trip.id}`}>
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white rounded-xl" data-testid={`btn-view-trip-${trip.id}`}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-xl"
            data-testid={`btn-delete-trip-${trip.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
