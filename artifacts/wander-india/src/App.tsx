import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { initApiClient } from "@/lib/api-client";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import DashboardPage from "@/pages/dashboard";
import DestinationsPage from "@/pages/destinations";
import DestinationDetailPage from "@/pages/destination-detail";
import AIPlannerPage from "@/pages/ai-planner";
import MoodPlannerPage from "@/pages/mood-planner";
import TripsPage from "@/pages/trips";
import TripDetailPage from "@/pages/trip-detail";
import BudgetPage from "@/pages/budget";
import ProfilePage from "@/pages/profile";
import HiddenGemsPage from "@/pages/hidden-gems";
import PackingPage from "@/pages/packing";
import ChatPage from "@/pages/chat";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import EmergencyPage from "@/pages/emergency";
import FeaturesPage from "@/pages/features";
import ReelsPage from "@/pages/reels";
import HotelsPage from "@/pages/hotels";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function AppInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initApiClient();
    // Force dark mode
    document.documentElement.classList.remove("light");
  }, []);
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/destinations" component={DestinationsPage} />
      <Route path="/destinations/:id" component={DestinationDetailPage} />
      <Route path="/ai-planner" component={AIPlannerPage} />
      <Route path="/mood-planner" component={MoodPlannerPage} />
      <Route path="/trips" component={TripsPage} />
      <Route path="/trips/:id" component={TripDetailPage} />
      <Route path="/budget" component={BudgetPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/hidden-gems" component={HiddenGemsPage} />
      <Route path="/packing" component={PackingPage} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/emergency" component={EmergencyPage} />
      <Route path="/features" component={FeaturesPage} />
      <Route path="/reels" component={ReelsPage} />
      <Route path="/hotels" component={HotelsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppInitializer>
            <AuthProvider>
              <Router />
            </AuthProvider>
          </AppInitializer>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
