import { apiClient } from "@/lib/api";

export interface NGODashboard {
  ngo: NGODetails;
  stats: {
    totalReceived: number;
    totalSpent: number;
    available: number;
    donationCount: number;
    spendingCount: number;
  };
  recentDonations: Array<{
    _id: string;
    amount: number;
    date: string;
    donorId: { _id: string; name: string; email: string };
  }>;
}

export interface NGODetails {
  _id: string;
  userId: string;
  name: string;
  registrationNumber: string;
  description?: string;
  category?: string;
  state?: string;
  verified: boolean;
  documents?: Array<{ url: string; name: string }>;
}

export interface Spending {
  _id: string;
  ngoId: string;
  category: string;
  amount: number;
  description?: string;
  date: string;
}

export const ngoService = {
  async getDashboard(): Promise<NGODashboard> {
    const response = await apiClient.get<NGODashboard>("/ngo/dashboard");
    if (response.success && response.data) return response.data;
    throw new Error(response.message || "Failed to fetch dashboard");
  },

  async getDonations(): Promise<any[]> {
    const response = await apiClient.get<any[]>("/ngo/donations");
    if (response.success && response.data) return response.data;
    throw new Error(response.message || "Failed to fetch donations");
  },

  async getSpending(): Promise<Spending[]> {
    const response = await apiClient.get<Spending[]>("/ngo/spending");
    if (response.success && response.data) return response.data;
    throw new Error(response.message || "Failed to fetch spending");
  },

  async addSpending(
    data: Omit<Spending, "_id" | "ngoId" | "date">
  ): Promise<Spending> {
    const response = await apiClient.post<Spending>("/ngo/spending", data);
    if (response.success && response.data) return response.data;
    throw new Error(response.message || "Failed to add spending");
  },

  async updateSpending(id: string, data: Partial<Spending>): Promise<Spending> {
    const response = await apiClient.put<Spending>(`/ngo/spending/${id}`, data);
    if (response.success && response.data) return response.data;
    throw new Error(response.message || "Failed to update spending");
  },

  async getProfile(): Promise<NGODetails> {
    const response = await apiClient.get<NGODetails>("/ngo/profile");
    if (response.success && response.data) return response.data;
    throw new Error(response.message || "Failed to fetch profile");
  },

  async updateProfile(data: Partial<NGODetails>): Promise<NGODetails> {
    const response = await apiClient.put<NGODetails>("/ngo/profile", data);
    if (response.success && response.data) return response.data;
    throw new Error(response.message || "Failed to update profile");
  },
};
