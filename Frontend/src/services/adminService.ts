import { apiClient } from "@/lib/api";

export interface AdminDashboard {
  stats: {
    totalNGOs: number;
    verifiedNGOs: number;
    pendingNGOs: number;
    totalDonors: number;
    totalDonations: number;
    totalAmount: number;
    totalSocialEvents: number;
  };
}

export interface NGO {
  _id: string;
  userId: string | { _id: string; name: string; email: string };
  name: string;
  registrationNumber: string;
  description?: string;
  category?: string;
  state?: string;
  verified: boolean;
  documents?: Array<{ url: string; name: string }>;
}

export interface AdminAnalytics {
  charts: {
    ngoVsSocialEvents: {
      ngo: number;
      socialEvents: number;
    };
    ngoVsDonors: {
      ngo: number;
      donors: number;
    };
  };
  topNGOs: Array<{
    _id: string;
    totalAmount: number;
    donationCount: number;
    ngo?: NGO;
  }>;
}

export interface Donor {
  _id: string;
  name: string;
  email: string;
  role: "donor";
}

export interface SocialEvent {
  _id: string;
  title: string;
  location: string;
  moneyRequired: number;
  moneyRaised: number;
  description?: string;
  createdBy: string | { _id: string; name: string; email: string };
  status: "active" | "completed" | "cancelled";
  donations?: Array<any>;
  fundedBy?: Array<any>;
}

export const adminService = {
  async getDashboard(): Promise<AdminDashboard> {
    const response = await apiClient.get<AdminDashboard>("/admin/dashboard");
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to fetch dashboard");
  },

  async getPendingNGOs(): Promise<NGO[]> {
    const response = await apiClient.get<NGO[]>("/admin/ngos/pending");
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to fetch pending NGOs");
  },

  async verifyNGO(id: string, verified: boolean): Promise<NGO> {
    const response = await apiClient.put<NGO>(`/admin/ngos/${id}/verify`, { verified });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to verify NGO");
  },

  async getAllNGOs(): Promise<NGO[]> {
    const response = await apiClient.get<NGO[]>("/admin/ngos");
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to fetch NGOs");
  },

  async getAnalytics(): Promise<AdminAnalytics> {
    const response = await apiClient.get<AdminAnalytics>("/admin/analytics");
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to fetch analytics");
  },

  async getAllDonors(): Promise<Donor[]> {
    const response = await apiClient.get<Donor[]>("/admin/donors");
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to fetch donors");
  },

  async getAllSocialEvents(): Promise<SocialEvent[]> {
    const response = await apiClient.get<SocialEvent[]>("/admin/social-events");
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to fetch social events");
  },

  async createSocialEvent(data: Omit<SocialEvent, "_id" | "createdBy" | "moneyRaised">): Promise<SocialEvent> {
    const response = await apiClient.post<SocialEvent>("/admin/social-events", data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to create social event");
  },

  async getSocialEventDetails(id: string): Promise<SocialEvent> {
    const response = await apiClient.get<SocialEvent>(`/admin/social-events/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to fetch social event details");
  },

  async updateSocialEvent(id: string, data: Partial<SocialEvent>): Promise<SocialEvent> {
    const response = await apiClient.put<SocialEvent>(`/admin/social-events/${id}`, data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to update social event");
  },
};
