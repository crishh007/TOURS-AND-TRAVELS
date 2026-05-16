import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGeneratePackingList } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Package, CheckSquare, Square, Loader2, MapPin } from "lucide-react";

const schema = z.object({
  destination: z.string().min(2, "Enter destination"),
  days: z.coerce.number().min(1).max(60),
  season: z.string().min(1, "Select season"),
});
type FormData = z.infer<typeof schema>;

const ACTIVITY_OPTIONS = ["Beach", "Trekking", "City Tours", "Wildlife Safari", "Cultural", "Adventure Sports", "Yoga/Wellness", "Shopping"];

export default function PackingPage() {
  return <ProtectedRoute><PackingContent /></ProtectedRoute>;
}

function PackingContent() {
  const { toast } = useToast();
  const [result, setResult] = useState<any>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const generateList = useGeneratePackingList();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { destination: "", days: 7, season: "summer" },
  });

  const toggleActivity = (a: string) => {
    setSelectedActivities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const toggleItem = (key: string) => {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const onSubmit = async (data: FormData) => {
    setResult(null);
    setChecked({});
    try {
      const res = await generateList.mutateAsync({ data: { ...data, activities: selectedActivities } });
      setResult(res);
    } catch {
      toast({ title: "Failed to generate list", variant: "destructive" });
    }
  };

  const totalItems = result?.categories?.reduce((acc: number, c: any) => acc + c.items.length, 0) || 0;
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">AI Packing Assistant</h1>
          <p className="text-muted-foreground">Tell us where you're going and we'll create the perfect packing list for your Indian adventure.</p>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8 mb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="destination" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Destination</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                        <Input {...field} placeholder="Goa, Ladakh..." className="pl-10 h-12 bg-white/5 border-white/10 text-white rounded-xl placeholder:text-muted-foreground" data-testid="input-destination" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="days" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Days</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={1} placeholder="7" className="h-12 bg-white/5 border-white/10 text-white rounded-xl" data-testid="input-days" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="season" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/80">Season</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card border-white/10">
                        {["summer", "winter", "monsoon", "spring"].map(s => (
                          <SelectItem key={s} value={s} className="text-white capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Activities */}
              <div>
                <p className="text-white/80 text-sm font-medium mb-3">Activities (optional)</p>
                <div className="flex flex-wrap gap-2">
                  {ACTIVITY_OPTIONS.map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleActivity(a)}
                      className={`px-3 py-1.5 rounded-xl text-sm transition-all border ${
                        selectedActivities.includes(a)
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          : "bg-white/5 text-white/60 border-white/5 hover:text-white"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={generateList.isPending} className="w-full h-12 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-xl border-0 hover:opacity-90" data-testid="btn-generate">
                {generateList.isPending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating...</> : <><Package className="w-4 h-4 mr-2" /> Generate Packing List</>}
              </Button>
            </form>
          </Form>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
                <span className="text-white font-semibold">{checkedCount} / {totalItems} items packed</span>
                <div className="h-2 w-40 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: totalItems > 0 ? `${(checkedCount / totalItems) * 100}%` : "0%" }} />
                </div>
              </div>
              {result.categories?.map((cat: any, ci: number) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ci * 0.07 }}
                  className="glass-card rounded-2xl p-5"
                >
                  <h3 className="text-white font-bold mb-4 flex items-center justify-between">
                    {cat.name}
                    <span className="text-muted-foreground text-sm font-normal">{cat.items.length} items</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cat.items.map((item: string) => {
                      const key = `${cat.name}-${item}`;
                      return (
                        <button
                          key={key}
                          onClick={() => toggleItem(key)}
                          className={`flex items-center gap-3 text-left p-2 rounded-lg transition-all ${checked[key] ? "opacity-50" : "hover:bg-white/5"}`}
                          data-testid={`item-${key.toLowerCase().replace(/\s/g, "-")}`}
                        >
                          {checked[key]
                            ? <CheckSquare className="w-4 h-4 text-green-400 flex-shrink-0" />
                            : <Square className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                          <span className={`text-sm ${checked[key] ? "line-through text-muted-foreground" : "text-white/80"}`}>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
