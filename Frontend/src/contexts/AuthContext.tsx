import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  authService,
  User,
  SignupData,
  UserRole,
} from "@/services/authService";

// Re-export UserRole for convenience
export type { UserRole };

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check for stored user data
        const savedData = localStorage.getItem("userData");
        if (savedData) {
          try {
            const userData = JSON.parse(savedData);
            console.log("AuthContext: Loaded stored user data:", userData);
            setUser(userData);
          } catch (error) {
            console.error(
              "AuthContext: Failed to parse stored user data:",
              error
            );
            authService.logout();
          }
        }
      } catch (error) {
        console.error("AuthContext: Error loading user:", error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Listen for storage events (logout from other tabs)
    const handleStorage = () => {
      const savedData = localStorage.getItem("userData");
      if (!savedData) {
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("AuthContext.login - calling authService");
      const response = await authService.login(email, password);
      console.log("AuthContext.login - response received:", response);

      if (!response || !response.user) {
        throw new Error("Invalid login response");
      }

      console.log("AuthContext.login - setting user state");
      setUser(response.user);

      console.log("AuthContext.login - returning user:", response.user);
      return response.user; // Return user data for navigation
    } catch (error) {
      console.error("AuthContext.login - error:", error);
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    const response = await authService.signup(data);
    setUser(response.user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
