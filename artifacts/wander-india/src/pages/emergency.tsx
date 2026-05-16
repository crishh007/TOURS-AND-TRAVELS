import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Phone, AlertTriangle, Shield, Heart, MapPin, Ambulance } from "lucide-react";

const EMERGENCY_CONTACTS = [
  { label: "Police", number: "100", icon: Shield, color: "from-blue-500 to-indigo-500", desc: "Report theft, crime, or safety threats" },
  { label: "Ambulance", number: "108", icon: Ambulance, color: "from-red-500 to-rose-500", desc: "Medical emergency or accident" },
  { label: "Fire", number: "101", icon: AlertTriangle, color: "from-orange-500 to-red-500", desc: "Fire emergency" },
  { label: "Women Helpline", number: "1091", icon: Heart, color: "from-pink-500 to-rose-500", desc: "Women in distress" },
  { label: "Tourist Helpline", number: "1800-111-363", icon: MapPin, color: "from-amber-500 to-orange-500", desc: "India Tourism helpline (Toll-free)" },
  { label: "Disaster Mgmt", number: "1078", icon: AlertTriangle, color: "from-purple-500 to-violet-500", desc: "Natural disasters and calamities" },
];

const TIPS = [
  "Always carry a photocopy of your passport and visa separately from the originals.",
  "Save the local police station number and your country's embassy contact before traveling.",
  "Keep emergency cash in a separate location from your main wallet.",
  "Share your itinerary with a trusted person back home.",
  "Download offline maps before reaching remote destinations with poor connectivity.",
  "Keep all medications in their original containers with prescriptions.",
  "Register your travel plans with your country's embassy if visiting high-risk areas.",
  "The nearest hospital and your travel insurance details should be easily accessible.",
];

export default function EmergencyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Emergency Assistance</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Stay safe on your Indian adventure. Save these numbers before you travel — you never know when you'll need them.</p>
        </motion.div>

        {/* Emergency Contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {EMERGENCY_CONTACTS.map((contact, i) => {
            const Icon = contact.icon;
            return (
              <motion.a
                key={contact.label}
                href={`tel:${contact.number}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="glass-card rounded-2xl p-6 block cursor-pointer hover:border-white/20 transition-all"
                data-testid={`emergency-${contact.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${contact.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-white font-bold text-lg">{contact.label}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 font-bold text-xl">{contact.number}</span>
                </div>
                <p className="text-muted-foreground text-sm mt-2">{contact.desc}</p>
              </motion.a>
            );
          })}
        </div>

        {/* Safety Tips */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8">
          <h2 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" /> Safety Tips for India Travel
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TIPS.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                {tip}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Embassy note */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-6 mt-6 border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-amber-400 font-semibold mb-1">Important Note</div>
              <p className="text-white/70 text-sm leading-relaxed">
                In case of a serious emergency involving foreign nationals, also contact your country's embassy or consulate in India. Most embassies have 24/7 emergency helplines for citizens abroad. Save this contact before you travel.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
