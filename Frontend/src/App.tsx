import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DonorDashboard from "./pages/donor/DonorDashboard";
import MyDonations from "./pages/donor/MyDonations";
import ImpactReport from "./pages/donor/ImpactReport";
import NGODashboard from "./pages/ngo/NGODashboard";
import NGODonations from "./pages/ngo/NGODonations";
import SpendingTracker from "./pages/ngo/SpendingTracker";
import NGOProfile from "./pages/ngo/NGOProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VerifyNGOs from "./pages/admin/VerifyNGOs";
import AllNGOs from "./pages/admin/AllNGOs";
import PlatformAnalytics from "./pages/admin/PlatformAnalytics";
import NGOListing from "./pages/NGOListing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Donor Routes */}
            <Route path="/donor/dashboard" element={<DonorDashboard />} />
            <Route path="/donor/donations" element={<MyDonations />} />
            <Route path="/donor/reports" element={<ImpactReport />} />
            
            {/* NGO Routes */}
            <Route path="/ngo/dashboard" element={<NGODashboard />} />
            <Route path="/ngo/donations" element={<NGODonations />} />
            <Route path="/ngo/spending" element={<SpendingTracker />} />
            <Route path="/ngo/profile" element={<NGOProfile />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/verify" element={<VerifyNGOs />} />
            <Route path="/admin/ngos" element={<AllNGOs />} />
            <Route path="/admin/analytics" element={<PlatformAnalytics />} />
            
            {/* Public Routes */}
            <Route path="/ngos" element={<NGOListing />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
