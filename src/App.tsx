
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Education from "./pages/Education";
import Healthcare from "./pages/Healthcare";
import Agriculture from "./pages/Agriculture";
import Sports from "./pages/Sports";
import Profiles from "./pages/Profiles";
import ProfileDetail from "./pages/ProfileDetail";
import AddProfile from "./pages/AddProfile";
import EditProfile from "./pages/EditProfile";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import EmailConfirm from "./pages/EmailConfirm";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import CollaborationDetail from "./pages/CollaborationDetail";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import ProtectedRoute from "@/components/ProtectedRoute";

// Create a client
const queryClient = new QueryClient();

// Define Peoplebook.ai color theme
import "./index.css";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/confirm" element={<EmailConfirm />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/education" element={<Education />} />
            <Route path="/healthcare" element={<Healthcare />} />
            <Route path="/agriculture" element={<Agriculture />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/profiles" element={<ProtectedRoute><Profiles /></ProtectedRoute>} />
            <Route path="/my-profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/add-profile" element={<ProtectedRoute><AddProfile /></ProtectedRoute>} />
            <Route path="/profiles/:id" element={<ProfileDetail />} />
            <Route path="/profiles/:id/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/collaboration/:id" element={<CollaborationDetail />} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
