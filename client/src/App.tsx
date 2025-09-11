import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Consultation from "@/pages/consultation";
import Admin from "@/pages/admin";
import AdminLogin from "@/pages/admin-login";
import ClientPortal from "@/pages/client-portal";
import ErrorBoundary from "@/components/error-boundary";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/consultation" component={Consultation} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/client-portal/:token?" component={ClientPortal} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ErrorBoundary>
          <Router />
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;