import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  MapPin, Menu, X, Compass, Brain, Sun, Plane, DollarSign,
  User, MessageSquare, Package, Gem, LogOut, LayoutDashboard,
  Video, Building2, Utensils, Zap, ChevronDown, Users,
  Clock, HelpCircle, Home
} from "lucide-react";

const PRIMARY_NAV = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/destinations", label: "Explore", icon: Compass },
  { href: "/ai-planner", label: "AI Planner", icon: Brain },
  { href: "/map-planner", label: "Map Planner", icon: MapPin },
  { href: "/mood-planner", label: "Mood Travel", icon: Sun },
  { href: "/reels", label: "Reels", icon: Video },
  { href: "/hotels", label: "Hotels", icon: Building2 },
];

const MORE_NAV = [
  { href: "/restaurants", label: "Restaurants", icon: Utensils },
  { href: "/hidden-gems", label: "Hidden Gems", icon: Gem },
  { href: "/features", label: "Features", icon: Zap },
  { href: "/group-planner", label: "Group Planner", icon: Users },
  { href: "/travel-history", label: "Travel History", icon: Clock },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
];

const ALL_NAV = [...PRIMARY_NAV, ...MORE_NAV];

const AUTH_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/trips", label: "My Trips", icon: Plane },
  { href: "/budget", label: "Budget", icon: DollarSign },
  { href: "/packing", label: "Packing", icon: Package },
  { href: "/chat", label: "AI Chat", icon: MessageSquare },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isMoreActive = MORE_NAV.some(l => l.href === location);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-4 mt-4">
          <div className="glass-card rounded-2xl px-5 py-3 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center glow-amber group-hover:scale-110 transition-transform">
                <MapPin className="w-4 h-4 text-black" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                <span className="text-gradient-amber">Wander</span>
                <span className="text-white">India</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-0.5">
              {PRIMARY_NAV.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}>
                  <button
                    data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      location === href
                        ? "bg-amber-500/20 text-amber-400"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                </Link>
              ))}

              {/* More dropdown */}
              <div ref={moreRef} className="relative">
                <button
                  onClick={() => setMoreOpen(o => !o)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isMoreActive || moreOpen
                      ? "bg-amber-500/20 text-amber-400"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  More
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-52 glass-card rounded-2xl p-2 shadow-2xl border border-white/10"
                    >
                      {MORE_NAV.map(({ href, label, icon: Icon }) => (
                        <Link key={href} href={href}>
                          <button
                            onClick={() => setMoreOpen(false)}
                            className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                              location === href
                                ? "bg-amber-500/15 text-amber-400"
                                : "text-white/70 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            {label}
                          </button>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              {user ? (
                <>
                  <Link href="/dashboard">
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-white/80 hover:text-white hover:bg-white/5 transition-all">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-black">
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                      {user.name}
                    </button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    data-testid="btn-logout"
                    className="text-white/60 hover:text-white hover:bg-white/5"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" data-testid="btn-login" className="text-white/80 hover:text-white">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" data-testid="btn-register" className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold hover:opacity-90 border-0">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white/80 hover:text-white"
              onClick={() => setOpen(!open)}
              data-testid="btn-mobile-menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-24 z-40 glass-card rounded-2xl p-4 md:hidden max-h-[80vh] overflow-y-auto"
          >
            <div className="space-y-0.5">
              <p className="text-white/30 text-xs font-semibold px-3 pt-1 pb-2 uppercase tracking-wider">Discover</p>
              {ALL_NAV.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}>
                  <button
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      location === href ? "bg-amber-500/15 text-amber-400" : "text-white/80 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                    {label}
                  </button>
                </Link>
              ))}
              {user && (
                <>
                  <div className="border-t border-white/10 my-2" />
                  <p className="text-white/30 text-xs font-semibold px-3 pt-1 pb-2 uppercase tracking-wider">My Account</p>
                  {AUTH_NAV.map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href}>
                      <button
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          location === href ? "bg-cyan-500/15 text-cyan-400" : "text-white/80 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                        {label}
                      </button>
                    </Link>
                  ))}
                  <button
                    onClick={() => { logout(); setOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              )}
              {!user && (
                <>
                  <div className="border-t border-white/10 my-2" />
                  <div className="flex gap-2 px-1">
                    <Link href="/login" className="flex-1">
                      <Button variant="outline" className="w-full border-white/20 text-white rounded-xl" onClick={() => setOpen(false)}>Login</Button>
                    </Link>
                    <Link href="/register" className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold border-0 rounded-xl" onClick={() => setOpen(false)}>Sign Up</Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
