
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
import CreatePost from "./pages/CreatePost";
import Messages from "./pages/Messages";
import Auth from "./pages/Auth";
import EmailConfirm from "./pages/EmailConfirm";
import ResetPassword from "./pages/ResetPassword";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
            {/* Public routes - accessible without authentication */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/confirm" element={<EmailConfirm />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/education" element={<Education />} />
            <Route path="/healthcare" element={<Healthcare />} />
            <Route path="/agriculture" element={<Agriculture />} />
            <Route path="/sports" element={<Sports />} />
            
            {/* Protected routes - require authentication */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profiles" element={
              <ProtectedRoute>
                <Profiles />
              </ProtectedRoute>
            } />
            <Route path="/profiles/add" element={
              <ProtectedRoute>
                <AddProfile />
              </ProtectedRoute>
            } />
            <Route path="/profiles/:id" element={
              <ProtectedRoute>
                <ProfileDetail />
              </ProtectedRoute>
            } />
            <Route path="/profiles/:id/edit" element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />
            <Route path="/create-post" element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route for 404 errors */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
