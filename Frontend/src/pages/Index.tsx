import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp, Shield, ArrowRight } from "lucide-react";

const Index = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only redirect if fully authenticated (not during login process)
  if (isAuthenticated && user && user.role) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-6 border-b border-border/30">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold glow-text">DaanDrishti</span>
          </div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="outline" className="border-border/50">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-primary hover:opacity-90 shadow-glow">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-20 animate-fade-in">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-tight">
              Make Every Donation
              <span className="block mt-3 glow-text">
                Transparent & Trackable
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Connect with verified NGOs and see exactly how your donations
              create real impact. Complete transparency in charitable giving
              with real-time tracking.
            </p>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-gradient-accent hover:opacity-90 text-lg px-10 py-6 shadow-glow-accent"
              >
                Start Donating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/ngos">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-6 border-border/50"
              >
                Explore NGOs
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-24">
            <div className="group p-8 rounded-2xl bg-card/50 border border-border/50 shadow-lg card-hover backdrop-blur-sm">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified NGOs</h3>
              <p className="text-muted-foreground leading-relaxed">
                All NGOs are thoroughly verified to ensure your donations reach
                legitimate organizations
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-card/50 border border-border/50 shadow-lg card-hover backdrop-blur-sm">
              <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow-accent transition-all">
                <TrendingUp className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Impact</h3>
              <p className="text-muted-foreground leading-relaxed">
                See detailed breakdowns of how your donations are being used
                across different sectors
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-card/50 border border-border/50 shadow-lg card-hover backdrop-blur-sm">
              <div className="h-14 w-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all">
                <Heart className="h-7 w-7 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Complete Transparency
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Real-time updates and reports showing exactly where every dollar
                goes
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
