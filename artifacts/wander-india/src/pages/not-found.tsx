import { Link } from "wouter";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-8 glow-amber animate-float">
            <MapPin className="w-12 h-12 text-black" />
          </div>
          <h1 className="text-7xl font-black text-gradient-amber mb-4">404</h1>
          <h2 className="text-3xl font-black text-white mb-4">Lost in India?</h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto mb-10">
            Even the best explorers get lost sometimes. This page doesn't exist, but incredible destinations do.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold h-12 px-8 rounded-xl border-0 glow-amber">
                <Home className="w-4 h-4 mr-2" /> Back to Home
              </Button>
            </Link>
            <Link href="/destinations">
              <Button variant="outline" className="h-12 px-8 rounded-xl border-white/20 text-white">
                <Compass className="w-4 h-4 mr-2" /> Explore India
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
