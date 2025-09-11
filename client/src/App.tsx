import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import Calculator from "@/pages/calculator";
import Profile from "@/pages/profile";
import Community from "@/pages/community";
import Meetups from "@/pages/meetups";
import Forums from "@/pages/forums";
import Health from "@/pages/health";
import Premium from "@/pages/premium";
import Leaderboard from "@/pages/leaderboard";
import Checkout from "@/pages/checkout";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/calculator" component={Calculator} />
          <Route path="/profile" component={Profile} />
          <Route path="/community" component={Community} />
          <Route path="/meetups" component={Meetups} />
          <Route path="/forums" component={Forums} />
          <Route path="/health" component={Health} />
          <Route path="/premium" component={Premium} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/checkout" component={Checkout} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
