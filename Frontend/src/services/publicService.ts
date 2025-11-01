import { apiClient } from "@/lib/api";

export interface PublicNGO {
  _id: string;
  name: string;
  registrationNumber: string;
  description: string;
  category: string;
  state: string;
  verified: boolean;
  documents: Array<{ url: string; name: string }>;
}

export const publicService = {
  async getAllNGOs(): Promise<PublicNGO[]> {
    const response = await apiClient.get<PublicNGO[]>("/public/ngos");
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to fetch NGOs");
  },

  async getNGODetails(id: string): Promise<PublicNGO> {
    const response = await apiClient.get<PublicNGO>(`/public/ngos/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || "Failed to fetch NGO details");
  },
};
