import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateProfile, useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User, MapPin, Plane, Calendar, Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().optional(),
  location: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  return <ProtectedRoute><ProfileContent /></ProtectedRoute>;
}

function ProfileContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const updateMutation = useUpdateProfile();

  const { data: freshUser } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const currentUser = freshUser || user;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: currentUser?.name || "",
      bio: currentUser?.bio || "",
      location: currentUser?.location || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateMutation.mutateAsync({ data });
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      toast({ title: "Profile updated!" });
    } catch {
      toast({ title: "Failed to update profile", variant: "destructive" });
    }
  };

  const initials = currentUser?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "WI";
  const joinDate = currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-32 pb-20">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black text-white mb-10">My Profile</motion.h1>

        {/* Avatar & Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8 mb-8 flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl font-black text-black flex-shrink-0 glow-amber">
            {initials}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-black text-white">{currentUser?.name}</h2>
            <p className="text-muted-foreground">{currentUser?.email}</p>
            {currentUser?.location && (
              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {currentUser.location}
              </div>
            )}
            <div className="flex items-center gap-6 mt-4">
              <div className="text-center">
                <div className="text-xl font-black text-amber-400">{currentUser?.tripsCount || 0}</div>
                <div className="text-muted-foreground text-xs">Trips</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-cyan-400">India</div>
                <div className="text-muted-foreground text-xs">Exploring</div>
              </div>
              {joinDate && (
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {joinDate}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8">
          <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" /> Edit Profile
          </h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-12 bg-white/5 border-white/10 text-white rounded-xl" data-testid="input-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input {...field} value={field.value || ""} placeholder="Mumbai, India" className="pl-10 h-12 bg-white/5 border-white/10 text-white rounded-xl placeholder:text-muted-foreground" data-testid="input-location" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="bio" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80">Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      placeholder="Tell us about your travel style..."
                      className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-muted-foreground resize-none"
                      rows={3}
                      data-testid="input-bio"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-xl border-0 hover:opacity-90"
                data-testid="btn-save-profile"
              >
                {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
