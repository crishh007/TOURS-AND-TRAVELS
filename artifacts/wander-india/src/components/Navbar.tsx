import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  MapPin, Menu, X, Compass, Brain, Sun, Plane, DollarSign,
  User, MessageSquare, Package, Gem, LogOut, LayoutDashboard,
  Zap, Phone, Sparkles, Video, Building2, Utensils
} from "lucide-react";

const NAV_LINKS = [
  { href: "/destinations", label: "Explore", icon: Compass },
  { href: "/ai-planner", label: "AI Planner", icon: Brain },
  { href: "/mood-planner", label: "Mood Travel", icon: Sun },
  { href: "/reels", label: "Reels", icon: Video },
  { href: "/hotels", label: "Hotels", icon: Building2 },
  { href: "/restaurants", label: "Restaurants", icon: Utensils },
  { href: "/hidden-gems", label: "Hidden Gems", icon: Gem },
];

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
  const { user, logout } = useAuth();
  const [location] = useLocation();

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-4 mt-4">
          <div className="glass-card rounded-2xl px-6 py-3 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center glow-amber group-hover:scale-110 transition-transform">
                <MapPin className="w-4 h-4 text-black" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                <span className="text-gradient-amber">Wander</span>
                <span className="text-white">India</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}>
                  <button
                    data-testid={`nav-${label.toLowerCase().replace(" ", "-")}`}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
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
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-2">
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
            className="fixed inset-x-4 top-24 z-40 glass-card rounded-2xl p-4 md:hidden"
          >
            <div className="space-y-1">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}>
                  <button
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Icon className="w-4 h-4 text-amber-400" />
                    {label}
                  </button>
                </Link>
              ))}
              {user && (
                <>
                  <div className="border-t border-white/10 my-2" />
                  {AUTH_NAV.map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href}>
                      <button
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <Icon className="w-4 h-4 text-cyan-400" />
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
                  <div className="flex gap-2">
                    <Link href="/login" className="flex-1">
                      <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>Login</Button>
                    </Link>
                    <Link href="/register" className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold border-0" onClick={() => setOpen(false)}>Sign Up</Button>
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
