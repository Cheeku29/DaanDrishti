import { apiClient } from "@/lib/api";

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface VerifyPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  ngoId: string;
  amount: number;
}

export interface Donation {
  _id: string;
  donorId: string;
  ngoId: string;
  amount: number;
  date: string;
  paymentId: string;
  orderId: string;
  status: string;
}

export const paymentService = {
  async createOrder(ngoId: string, amount: number): Promise<CreateOrderResponse> {
    const response = await apiClient.post<CreateOrderResponse>("/payments/create-order", { ngoId, amount });
    if (response.success && response.data) return response.data;
    throw new Error(response.message || "Failed to create order");
  },

  async verifyPayment(data: VerifyPaymentData): Promise<{ donation: Donation; message: string }> {
    const response = await apiClient.post<{ donation: Donation; message: string }>("/payments/verify", data);
    if (response.success && response.data) return response.data;
    throw new Error(response.message || "Payment verification failed");
  },
};
