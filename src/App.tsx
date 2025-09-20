import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import AtlasVoiceInterface from "@/components/atlas/AtlasVoiceInterface";
import { useAtlasSettings } from "@/hooks/useAtlasSettings";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Registration from "./pages/Registration";
import Experiences from "./pages/Experiences";
import Tours from "./pages/Tours";
import Languages from "./pages/Languages";
import Destinations from "./pages/Destinations";
import CityGuide from "./pages/CityGuide";

const queryClient = new QueryClient();

const App = () => {
  const { isAtlasEnabled, toggleAtlas } = useAtlasSettings();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/registration" 
                element={
                  <ProtectedRoute>
                    <Registration />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/experiences" element={<Experiences />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/languages" element={<Languages />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/destinations/:cityId" element={<CityGuide />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* Atlas Voice Interface - Available on all pages */}
            <AtlasVoiceInterface 
              isEnabled={isAtlasEnabled}
              onToggle={toggleAtlas}
            />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
