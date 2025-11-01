import { apiClient } from "@/lib/api";

export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: "donor" | "ngo" | "admin";
}

export interface LoginResponse {
  user: User;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role?: "donor" | "ngo";
  ngoName?: string;
  registrationNumber?: string;
  description?: string;
  category?: string;
  state?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      console.log("authService.login - calling API with email:", email);
      const response = await apiClient.post<LoginResponse>("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });
      console.log("authService.login - API response:", response);

      if (response.success && response.data?.user) {
        console.log("authService.login - setting user data");
        apiClient.setUserData(response.data.user);
        console.log(
          "authService.login - login successful, user:",
          response.data.user
        );
        return response.data;
      }

      console.error("authService.login - login failed, response:", response);
      throw new Error(response.message || "Login failed");
    } catch (error: any) {
      console.error("authService.login - error:", error);
      throw error;
    }
  },

  async signup(data: SignupData): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/signup", data);
    if (response.success && response.data?.user) {
      apiClient.setUserData(response.data.user);
      return response.data;
    }
    throw new Error(response.message || "Signup failed");
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<User>("/auth/me");
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to fetch user");
  },

  logout() {
    apiClient.setUserData(null);
  },
};
