import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MapPin, Eye, EyeOff, AlertCircle, Plane, Check } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

const PERKS = ["AI itinerary generation", "Mood-based travel planning", "Budget tracker", "AI packing lists", "24/7 AI travel assistant"];

export default function RegisterPage() {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    setLoading(true);
    try {
      await register(data);
    } catch (err: any) {
      setError(err?.data?.error || err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80"
          alt="Kerala backwaters"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 h-full">
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-black" />
              </div>
              <span className="font-bold text-xl text-white">WanderIndia</span>
            </div>
          </Link>
          <div>
            <h2 className="text-4xl font-black text-white mb-6">Start your Indian adventure today.</h2>
            <div className="space-y-3">
              {PERKS.map(perk => (
                <div key={perk} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-amber-400" />
                  </div>
                  <span className="text-white/80 text-sm">{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-lg">
              <span className="text-gradient-amber">Wander</span><span className="text-white">India</span>
            </span>
          </Link>

          <h1 className="text-3xl font-black text-white mb-2">Create your account</h1>
          <p className="text-muted-foreground mb-8">Join 50,000+ travelers exploring Incredible India</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </motion.div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Arjun Sharma" className="h-12 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground rounded-xl" data-testid="input-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="your@email.com" className="h-12 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground rounded-xl" data-testid="input-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Min. 6 characters"
                          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground rounded-xl pr-12"
                          data-testid="input-password"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-xl border-0 hover:opacity-90 glow-amber text-base"
                data-testid="btn-submit"
              >
                {loading ? (
                  <span className="flex items-center gap-2"><Plane className="w-4 h-4 animate-bounce" /> Creating account...</span>
                ) : "Create Free Account"}
              </Button>
            </form>
          </Form>

          <p className="text-center text-muted-foreground text-sm mt-8">
            Already have an account?{" "}
            <Link href="/login">
              <span className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer">Sign in</span>
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
