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
import { MapPin, Eye, EyeOff, AlertCircle, Plane } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    setLoading(true);
    try {
      await login(data);
    } catch (err: any) {
      setError(err?.data?.error || err?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — decorative image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background image via CSS (more reliable than <img>) */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1477587458883-47145ed4e85c?auto=format&fit=crop&w=1200&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/30" />

        <div className="relative z-10 flex flex-col justify-between p-12 h-full w-full">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-black" />
              </div>
              <span className="font-bold text-xl text-white">WanderIndia</span>
            </div>
          </Link>

          <div>
            <h2 className="text-4xl font-black text-white mb-4 leading-tight">
              Every journey begins<br />with a single step.
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Login to access your personalized AI travel planner and discover the magic of Incredible India.
            </p>
            <div className="mt-8 flex gap-8">
              {[["500+", "Destinations"], ["50K+", "Travelers"], ["98%", "Satisfaction"]].map(([num, label]) => (
                <div key={label}>
                  <div className="text-2xl font-black text-amber-400">{num}</div>
                  <div className="text-white/60 text-sm mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-lg">
              <span className="text-gradient-amber">Wander</span><span className="text-white">India</span>
            </span>
          </Link>

          <h1 className="text-3xl font-black text-white mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">Sign in to continue your adventure</p>

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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        autoComplete="email"
                        placeholder="your@email.com"
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground rounded-xl"
                        data-testid="input-email"
                      />
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
                          autoComplete="current-password"
                          placeholder="••••••••"
                          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground rounded-xl pr-12"
                          data-testid="input-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                        >
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
                  <span className="flex items-center gap-2">
                    <Plane className="w-4 h-4 animate-bounce" /> Signing in...
                  </span>
                ) : "Sign In"}
              </Button>
            </form>
          </Form>

          <p className="text-center text-muted-foreground text-sm mt-8">
            Don't have an account?{" "}
            <Link href="/register">
              <span className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer">Create one free</span>
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
