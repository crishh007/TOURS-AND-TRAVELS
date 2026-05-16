import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, Check } from "lucide-react";

export default function ContactPage() {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <h1 className="text-5xl font-black text-white mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg">Have a question or feedback? We'd love to hear from you.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white mb-4">Get in Touch</h2>
              <p className="text-muted-foreground leading-relaxed">Whether you have a question about our AI planner, need help with your account, or just want to share your travel story — we're here.</p>
            </div>
            {[
              { icon: Mail, label: "Email", value: "hello@wanderindia.ai", color: "text-amber-400" },
              { icon: Phone, label: "Phone", value: "+91 98765 43210", color: "text-cyan-400" },
              { icon: MapPin, label: "Headquarters", value: "Bengaluru, Karnataka, India", color: "text-purple-400" },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-4 glass-card rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">{item.label}</div>
                    <div className="text-white font-semibold mt-0.5">{item.value}</div>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
                <Button onClick={() => setSent(false)} variant="outline" className="mt-6 border-white/20 text-white">Send Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/80 text-sm mb-1.5 block">Name</label>
                    <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="Your name" className="h-11 bg-white/5 border-white/10 text-white rounded-xl placeholder:text-muted-foreground" data-testid="input-name" />
                  </div>
                  <div>
                    <label className="text-white/80 text-sm mb-1.5 block">Email</label>
                    <Input value={form.email} onChange={e => setForm({...form, email: e.target.value})} required type="email" placeholder="your@email.com" className="h-11 bg-white/5 border-white/10 text-white rounded-xl placeholder:text-muted-foreground" data-testid="input-email" />
                  </div>
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-1.5 block">Subject</label>
                  <Input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required placeholder="How can we help?" className="h-11 bg-white/5 border-white/10 text-white rounded-xl placeholder:text-muted-foreground" data-testid="input-subject" />
                </div>
                <div>
                  <label className="text-white/80 text-sm mb-1.5 block">Message</label>
                  <Textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} required placeholder="Tell us more..." className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-muted-foreground resize-none" rows={5} data-testid="input-message" />
                </div>
                <Button type="submit" className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-xl border-0 gap-2 hover:opacity-90" data-testid="btn-send">
                  <Send className="w-4 h-4" /> Send Message
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
