import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [retryAttempts, setRetryAttempts] = useState(0);

  // Check if we have a token
  const hasToken =
    typeof window !== "undefined" && localStorage.getItem("accessToken");

  useEffect(() => {
    // If we have a token but no user yet, give auth context time to load
    // with a few gentle retries before giving up
    if (hasToken && !user && !isLoading) {
      if (retryAttempts < 3) {
        const timer = setTimeout(() => {
          setRetryAttempts((prev) => prev + 1);
          // Force auth context to try loading user again
          window.dispatchEvent(new Event("storage"));
        }, 800);
        return () => clearTimeout(timer);
      } else {
        setCheckingAuth(false);
      }
    } else {
      setRetryAttempts(0);
      setCheckingAuth(false);
    }
  }, [hasToken, user, isLoading, retryAttempts]);

  // Show loading while checking auth or while context is loading
  if (isLoading || checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {isLoading
              ? "Loading..."
              : `Verifying authentication${
                  retryAttempts ? ` (attempt ${retryAttempts + 1}/3)` : ""
                }...`}
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    console.log("DashboardLayout: Not authenticated, redirecting to login", {
      isAuthenticated,
      user: !!user,
      hasToken,
      userRole: user?.role,
    });
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-0 overflow-auto">
        <div className="container mx-auto p-6 lg:p-8 mt-16 lg:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
};
