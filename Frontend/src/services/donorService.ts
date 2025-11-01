import { apiClient } from "@/lib/api";

export interface Donation {
  _id: string;
  donorId: string;
  ngoId: string | { _id: string; name: string; category?: string; state?: string };
  socialEventId?: string | { _id: string; title: string; location?: string };
  amount: number;
  date: string;
  paymentId?: string;
  orderId?: string;
  status: "pending" | "completed" | "failed";
}

export interface ImpactReport {
  _id: string;
  ngoId: string | { _id: string; name: string; category?: string };
  title: string;
  summary?: string;
  impactMetrics?: Record<string, string>;
  year?: number;
  attachments?: Array<{ url: string; name: string }>;
}

export const donorService = {
  async getMyDonations(): Promise<Donation[]> {
    const response = await apiClient.get<Donation[]>("/donations/my");
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to fetch donations");
  },

  async getImpactReports(): Promise<ImpactReport[]> {
    const response = await apiClient.get<ImpactReport[]>("/reports/impact");
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to fetch impact reports");
  },
};
