import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, token } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !token) {
      setLocation("/login");
    }
  }, [isLoading, token, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center animate-pulse-glow">
            <Loader2 className="w-8 h-8 text-black animate-spin" />
          </div>
          <p className="text-muted-foreground text-sm">Loading WanderIndia...</p>
        </div>
      </div>
    );
  }

  if (!token) return null;
  return <>{children}</>;
}
