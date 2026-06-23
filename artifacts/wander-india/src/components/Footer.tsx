import { Link } from "wouter";
import { MapPin, Mail, Phone, ShieldAlert, Heart, Facebook, Twitter, Instagram, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed successfully! Welcome to the family.");
    setEmail("");
  };

  return (
    <footer className="w-full bg-[#030712] border-t border-white/10 text-white pt-16 pb-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* About column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center glow-amber">
              <MapPin className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="text-gradient-amber">Wander</span>
              <span className="text-white">India</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            WanderIndia is an AI-powered smart travel companion designed to help you plan, book, and explore the best destinations across India. Custom itineraries tailored to your budget and mood.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-amber-400 transition-all">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-amber-400 transition-all">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-amber-400 transition-all">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-300">Quick Links</h3>
          <ul className="space-y-2.5">
            {[
              { href: "/home", label: "Home" },
              { href: "/destinations", label: "Explore Places" },
              { href: "/ai-planner", label: "AI Planner" },
              { href: "/reels", label: "Travel Reels" },
              { href: "/hotels", label: "Book Hotels" },
            ].map(link => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-slate-400 hover:text-amber-400 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support & Contact Column */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-300">About & Support</h3>
          <ul className="space-y-2.5">
            {[
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact Us" },
              { href: "/faq", label: "FAQ / Help" },
              { href: "/emergency", label: "Emergency Support" },
            ].map(link => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-slate-400 hover:text-amber-400 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-300">Stay Updated</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Subscribe to our newsletter to receive the latest travel guides, trending destinations, and seasonal deals.
          </p>
          <form onSubmit={handleSubscribe} className="relative flex items-center mt-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all pr-12"
              required
            />
            <button
              type="submit"
              className="absolute right-1.5 p-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} WanderIndia. All rights reserved. Explore Incredible India.
        </p>
        <p className="text-xs text-slate-500 flex items-center gap-1.5">
          Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Indian Travelers.
        </p>
      </div>
    </footer>
  );
}
