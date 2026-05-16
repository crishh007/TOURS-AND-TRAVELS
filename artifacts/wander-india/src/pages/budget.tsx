import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListTrips, getListTripsQueryKey } from "@workspace/api-client-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, TrendingUp, TrendingDown, Plane, Plus, ChevronRight } from "lucide-react";

export default function BudgetPage() {
  return <ProtectedRoute><BudgetContent /></ProtectedRoute>;
}

function BudgetContent() {
  const { data: trips = [], isLoading } = useListTrips({ query: { queryKey: getListTripsQueryKey() } });

  const totalBudget = trips.reduce((acc, t) => acc + (t.totalBudget || 0), 0);
  const totalSpent = trips.reduce((acc, t) => acc + (t.spentAmount || 0), 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPct = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-white">Budget Tracker</h1>
            <p className="text-muted-foreground mt-1">Track spending across all your trips</p>
          </div>
          <Link href="/ai-planner">
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold border-0 rounded-xl gap-2" data-testid="btn-new-trip">
              <Plus className="w-4 h-4" /> Plan New Trip
            </Button>
          </Link>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {[
            { label: "Total Budget", value: `₹${totalBudget.toLocaleString("en-IN")}`, icon: DollarSign, color: "from-amber-500 to-orange-500" },
            { label: "Total Spent", value: `₹${totalSpent.toLocaleString("en-IN")}`, icon: TrendingUp, color: "from-red-500 to-rose-500" },
            { label: "Total Remaining", value: `₹${totalRemaining.toLocaleString("en-IN")}`, icon: TrendingDown, color: "from-green-500 to-teal-500" },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-black text-white">{card.value}</div>
                <div className="text-muted-foreground text-sm mt-1">{card.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Overall Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex justify-between mb-3">
            <span className="text-white font-semibold">Overall Spending</span>
            <span className="text-muted-foreground text-sm">{overallPct.toFixed(1)}% of total budget</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallPct}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${overallPct > 90 ? "bg-red-500" : overallPct > 70 ? "bg-amber-500" : "bg-cyan-500"}`}
            />
          </div>
        </motion.div>

        {/* Per-trip breakdown */}
        <h2 className="text-white font-bold text-xl mb-5">Trip Breakdown</h2>
        {isLoading ? (
          <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
        ) : trips.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-float" />
            <p className="text-muted-foreground">No trips yet. Plan a trip to start tracking your budget.</p>
            <Link href="/ai-planner">
              <Button className="mt-6 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold border-0 rounded-xl" data-testid="btn-start">
                Plan First Trip
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map((trip, i) => {
              const spent = trip.spentAmount || 0;
              const budget = trip.totalBudget || 0;
              const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
              return (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="glass-card rounded-2xl p-5"
                  data-testid={`budget-trip-${trip.id}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-white font-bold">{trip.destinationName}</h3>
                      <p className="text-muted-foreground text-xs">{trip.startDate} → {trip.endDate}</p>
                    </div>
                    <Link href={`/trips/${trip.id}`}>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white rounded-xl">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-amber-400 font-medium">₹{spent.toLocaleString("en-IN")} spent</span>
                    <span className="text-muted-foreground">of ₹{budget.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${pct > 90 ? "bg-red-500" : pct > 70 ? "bg-amber-500" : "bg-cyan-500"}`} style={{ width: `${pct}%` }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
