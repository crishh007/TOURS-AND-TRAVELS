import { motion } from "framer-motion";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Brain, MapPin, Heart, Zap, Users, Star } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6 glow-amber">
            <MapPin className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-5xl font-black text-white mb-4">
            About <span className="text-gradient-amber">WanderIndia</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            We believe every Indian journey is a story waiting to be written. WanderIndia was built to be the travel companion you always wished you had — intelligent, personal, and always ready to inspire.
          </p>
        </motion.div>

        <div className="space-y-6">
          {[
            { icon: Brain, title: "AI-Powered Intelligence", color: "from-amber-400 to-orange-500", desc: "Our AI understands your mood, budget, interests, and style to create travel experiences that feel made just for you — because they are." },
            { icon: Heart, title: "Built with Love for India", color: "from-pink-400 to-rose-500", desc: "From the Himalayas to Kanyakumari, from Rajasthan to Meghalaya — we've explored every corner of this incredible nation to bring it to your fingertips." },
            { icon: Zap, title: "Real-Time, Always Fresh", color: "from-yellow-400 to-orange-500", desc: "Live weather data, current trends, seasonal recommendations — WanderIndia keeps you informed with real information, not outdated travel brochures." },
            { icon: Users, title: "For Every Kind of Traveler", color: "from-cyan-400 to-blue-500", desc: "Solo backpacker, romantic couple, adventurous family, spiritual seeker — our AI adapts to who you are and what you need." },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 flex items-start gap-4"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-3xl p-10 text-center mt-12"
        >
          <Star className="w-10 h-10 text-amber-400 mx-auto mb-4 fill-amber-400" />
          <h2 className="text-3xl font-black text-white mb-3">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            To make every Indian travel experience accessible, personal, and extraordinary. We want you to explore India not as a tourist, but as a traveler — with curiosity, respect, and wonder.
          </p>
          <Link href="/register">
            <Button className="mt-8 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold h-12 px-8 rounded-xl border-0 glow-amber">
              Start Your Journey
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
