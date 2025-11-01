import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "donor" as "donor" | "ngo",
    // NGO specific fields
    ngoName: "",
    registrationNumber: "",
    description: "",
    category: "",
    state: "",
  });

  // Generate a random 10-digit registration number for NGOs
  const generateRegistrationNumber = () => {
    // Ensure the first digit is not zero by generating between 1_000_000_000 and 9_999_999_999
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  };

  useEffect(() => {
    if (formData.role === "ngo" && !formData.registrationNumber) {
      setFormData((prev) => ({
        ...prev,
        registrationNumber: generateRegistrationNumber(),
      }));
    }

    // Clear registration number when switching back to donor
    if (formData.role === "donor" && formData.registrationNumber) {
      setFormData((prev) => ({ ...prev, registrationNumber: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const signupData: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === "ngo") {
        signupData.ngoName = formData.ngoName;
        signupData.registrationNumber = formData.registrationNumber;
        signupData.description = formData.description;
        signupData.category = formData.category;
        signupData.state = formData.state;
      }

      await signup(signupData);
      toast({
        title: "Account created successfully!",
        description: "Welcome to Fund Trust",
      });
      // Redirect will happen automatically via Index page based on user role
      navigate("/");
    } catch (error: any) {
      let errorMessage =
        error?.message || "Please try again with different credentials.";

      // Better error message for duplicate email
      if (
        errorMessage.toLowerCase().includes("email") ||
        errorMessage.toLowerCase().includes("already")
      ) {
        errorMessage =
          "This email is already registered. Please use a different email or login.";
      }

      setError(errorMessage);
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-border/50 animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Join Fund Trust to make a difference
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">I am a</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value as "donor" | "ngo" })
                }
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="donor">Donor</SelectItem>
                  <SelectItem value="ngo">NGO</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === "ngo" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="ngoName">NGO Name *</Label>
                  <Input
                    id="ngoName"
                    type="text"
                    placeholder="Organization Name"
                    value={formData.ngoName}
                    onChange={(e) =>
                      setFormData({ ...formData, ngoName: e.target.value })
                    }
                    required={formData.role === "ngo"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">
                    Registration Number (auto-generated)
                  </Label>
                  <Input
                    id="registrationNumber"
                    type="text"
                    placeholder="NGO Registration Number"
                    value={formData.registrationNumber}
                    readOnly
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    type="text"
                    placeholder="About your organization"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    type="text"
                    placeholder="e.g., Education, Healthcare"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder="e.g., Maharashtra"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Signup;
