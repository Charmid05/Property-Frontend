import {
  Payment,
  PaymentCreateRequest,
  ProcessPaymentRequest,
  QuickPaymentRequest,
  QuickPaymentResponse,
  ApiError,
} from "@/types/finance";
import { AxiosError } from "axios";
import api from "@/app/api/auth/api";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/api/finance/payments/`;

// Get all payments
export const getPayments = async (params?: {
  status?: string;
  tenant?: number;
  invoice?: number;
  payment_method?: string;
}): Promise<Payment[]> => {
  try {
    const response = await api.get(API_URL, { params });

    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      return response.data.results || [];
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch payments."
      );
    }
    throw new Error("Failed to fetch payments.");
  }
};

// Get payment by ID
export const getPaymentById = async (id: number): Promise<Payment> => {
  try {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch payment."
      );
    }
    throw new Error("Failed to fetch payment.");
  }
};

// Create payment
export const createPayment = async (
  data: PaymentCreateRequest
): Promise<Payment> => {
  try {
    const response = await api.post(API_URL, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to create payment."
      );
    }
    throw new Error("Failed to create payment.");
  }
};

// Process payment
export const processPayment = async (
  id: number
): Promise<{ status: string; receipt: any }> => {
  try {
    const response = await api.post(`${API_URL}${id}/process/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to process payment."
      );
    }
    throw new Error("Failed to process payment.");
  }
};

// Quick payment (create and process in one step)
export const quickPayment = async (
  data: QuickPaymentRequest
): Promise<QuickPaymentResponse> => {
  try {
    const response = await api.post(`${API_URL}quick_payment/`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to process quick payment."
      );
    }
    throw new Error("Failed to process quick payment.");
  }
};
