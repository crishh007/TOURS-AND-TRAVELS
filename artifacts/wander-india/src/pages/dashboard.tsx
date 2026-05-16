import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGetDashboardSummary, getGetDashboardSummaryQueryKey, useGetRecentActivity, getGetRecentActivityQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plane, DollarSign, MapPin, Clock, Brain, Sun, Package,
  MessageSquare, Gem, ChevronRight, TrendingUp, Calendar, Star
} from "lucide-react";

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-3xl font-black text-white">{value}</div>
      <div className="text-muted-foreground text-sm mt-1">{label}</div>
    </motion.div>
  );
}

const QUICK_ACTIONS = [
  { href: "/ai-planner", icon: Brain, label: "Generate Itinerary", color: "from-amber-500 to-orange-500", desc: "AI-powered day plans" },
  { href: "/mood-planner", icon: Sun, label: "Mood Travel", color: "from-cyan-500 to-blue-500", desc: "Match your vibe" },
  { href: "/destinations", icon: MapPin, label: "Explore India", color: "from-purple-500 to-pink-500", desc: "500+ destinations" },
  { href: "/packing", icon: Package, label: "Packing AI", color: "from-green-500 to-teal-500", desc: "Smart checklists" },
  { href: "/chat", icon: MessageSquare, label: "AI Assistant", color: "from-rose-500 to-pink-500", desc: "24/7 travel guide" },
  { href: "/hidden-gems", icon: Gem, label: "Hidden Gems", color: "from-violet-500 to-purple-500", desc: "Off-beat places" },
];

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary({ query: { queryKey: getGetDashboardSummaryQueryKey() } });
  const { data: activity = [], isLoading: activityLoading } = useGetRecentActivity({ query: { queryKey: getGetRecentActivityQueryKey() } });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-amber-400 font-medium mb-1">{greeting()},</p>
          <h1 className="text-4xl font-black text-white">{user?.name?.split(" ")[0] || "Traveler"}</h1>
          <p className="text-muted-foreground mt-2">Ready to explore Incredible India today?</p>
        </motion.div>

        {/* Stats */}
        {summaryLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StatCard icon={Plane} label="Total Trips" value={summary?.totalTrips ?? 0} color="from-amber-500 to-orange-500" />
            <StatCard icon={Calendar} label="Upcoming" value={summary?.upcomingTrips ?? 0} color="from-cyan-500 to-blue-500" />
            <StatCard icon={DollarSign} label="Total Spent" value={`₹${((summary?.totalSpent ?? 0) / 1000).toFixed(1)}K`} color="from-green-500 to-teal-500" />
            <StatCard icon={Clock} label="Days Traveled" value={summary?.totalDaysTraveled ?? 0} color="from-purple-500 to-pink-500" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {QUICK_ACTIONS.map((action, i) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ y: -4 }}
                  >
                    <Link href={action.href}>
                      <div className="glass-card rounded-2xl p-5 cursor-pointer hover:border-white/20 transition-all group">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-white font-semibold text-sm">{action.label}</div>
                        <div className="text-muted-foreground text-xs mt-0.5">{action.desc}</div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent Trips */}
            {!summaryLoading && summary?.recentTrips && summary.recentTrips.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Recent Trips</h2>
                  <Link href="/trips">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white gap-1">
                      View all <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {summary.recentTrips.map(trip => (
                    <Link key={trip.id} href={`/trips/${trip.id}`}>
                      <div className="glass-card rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-white/20 transition-all">
                        {trip.destinationImage ? (
                          <img src={trip.destinationImage} alt={trip.destinationName} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-semibold truncate">{trip.destinationName}</div>
                          <div className="text-muted-foreground text-xs mt-0.5">{trip.startDate} → {trip.endDate}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-amber-400 font-semibold text-sm">₹{trip.totalBudget.toLocaleString("en-IN")}</div>
                          <div className={`text-xs mt-0.5 capitalize px-2 py-0.5 rounded-full ${trip.status === "upcoming" ? "bg-cyan-500/20 text-cyan-400" : "bg-green-500/20 text-green-400"}`}>
                            {trip.status}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            {activityLoading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
              </div>
            ) : activity.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 text-center">
                <TrendingUp className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No activity yet. Start planning your first trip!</p>
                <Link href="/ai-planner">
                  <Button size="sm" className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold border-0" data-testid="btn-plan-first-trip">
                    Plan First Trip
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activity.map(item => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <Plane className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{item.title}</div>
                        <div className="text-muted-foreground text-xs mt-0.5">{item.description}</div>
                        <div className="text-muted-foreground text-xs mt-1">
                          {new Date(item.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Favorite destination */}
            {!summaryLoading && summary?.favoriteDestination && (
              <div className="mt-6 glass-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-white font-semibold text-sm">Favorite Destination</span>
                </div>
                <div className="text-2xl font-black text-gradient-amber">{summary.favoriteDestination}</div>
                <p className="text-muted-foreground text-xs mt-1">Your most visited place</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
