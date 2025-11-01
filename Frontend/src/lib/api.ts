// API Client Configuration
const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

class ApiClient {
  private baseURL: string;
  private userData: {
    id: string;
    _id: string;
    name: string;
    email: string;
    role: "donor" | "ngo" | "admin";
  } | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("userData");
      if (saved) {
        try {
          this.userData = JSON.parse(saved);
        } catch (e) {}
      }
    }
  }

  setUserData(
    data: {
      id: string;
      _id: string;
      name: string;
      email: string;
      role: "donor" | "ngo" | "admin";
    } | null
  ) {
    this.userData = data;
    if (data && typeof window !== "undefined") {
      localStorage.setItem("userData", JSON.stringify(data));
    } else if (typeof window !== "undefined") {
      localStorage.removeItem("userData");
    }
  }
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add user headers if we have user data
    if (this.userData) {
      headers["x-user-id"] = this.userData.id;
      headers["x-user-email"] = this.userData.email;
      headers["x-user-role"] = this.userData.role;
    }
    try {
      const response = await fetch(url, { ...options, headers });
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error(
          `Network error: ${response.status} ${response.statusText}`
        );
      }

      // Handle 401 Unauthorized - clear tokens but let auth context handle redirect
      if (
        response.status === 401 &&
        endpoint !== "/auth/login" &&
        endpoint !== "/auth/signup"
      ) {
        this.setUserData(null);
        // Notify auth context that session expired
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("storage"));
        }
        throw new Error("Please login to continue");
      }

      if (!response.ok) {
        const errorMessage =
          data.message ||
          data.error ||
          `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error: any) {
      if (error.message) throw error;
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Cannot connect to server. Make sure the backend is running on http://localhost:5000"
        );
      }
      throw new Error(error.message || "An unknown error occurred");
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  async postFormData<T>(
    endpoint: string,
    formData: FormData
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {};
    // Add user data to websocket if available
    if (this.userData) {
      headers["x-user-id"] = this.userData.id;
      headers["x-user-email"] = this.userData.email;
      headers["x-user-role"] = this.userData.role;
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Request failed");
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
