import {
  BillingPeriod,
  BillingPeriodDetail,
  BillingPeriodCreateRequest,
  CloseBillingPeriodRequest,
  GenerateInvoicesRequest,
  MonthlyBillingSummary,
  ApiError,
} from "@/types/finance";
import { AxiosError } from "axios";
import api from "@/app/api/auth/api";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/api/finance/billing-periods/`;

// Get all billing periods
export const getBillingPeriods = async (): Promise<BillingPeriod[]> => {
  try {
    const response = await api.get(API_URL);

    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      return response.data.results || [];
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch billing periods."
      );
    }
    throw new Error("Failed to fetch billing periods.");
  }
};

// Get current billing period
export const getCurrentBillingPeriod = async (): Promise<BillingPeriod> => {
  try {
    const response = await api.get(`${API_URL}/current/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.detail || "No current billing period found."
      );
    }
    throw new Error("Failed to fetch current billing period.");
  }
};

// Get billing period by ID
export const getBillingPeriodById = async (
  id: number
): Promise<BillingPeriodDetail> => {
  try {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch billing period."
      );
    }
    throw new Error("Failed to fetch billing period.");
  }
};

// Create billing period
export const createBillingPeriod = async (
  data: BillingPeriodCreateRequest
): Promise<BillingPeriod> => {
  try {
    const response = await api.post(API_URL, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to create billing period."
      );
    }
    throw new Error("Failed to create billing period.");
  }
};

// Update billing period
export const updateBillingPeriod = async (
  id: number,
  data: Partial<BillingPeriodCreateRequest>
): Promise<BillingPeriod> => {
  try {
    const response = await api.patch(`${API_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update billing period."
      );
    }
    throw new Error("Failed to update billing period.");
  }
};

// Close billing period
export const closeBillingPeriod = async (
  id: number,
  data: CloseBillingPeriodRequest
): Promise<{ status: string; period: BillingPeriod }> => {
  try {
    const response = await api.post(`${API_URL}${id}/close/`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to close billing period."
      );
    }
    throw new Error("Failed to close billing period.");
  }
};

// Generate invoices for billing period
export const generateInvoices = async (
  id: number,
  data: Omit<GenerateInvoicesRequest, "billing_period_id">
): Promise<{ status: string; invoices_created: number; errors: any[] }> => {
  try {
    const response = await api.post(`${API_URL}${id}/generate_invoices/`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to generate invoices."
      );
    }
    throw new Error("Failed to generate invoices.");
  }
};

// Get billing period summary
export const getBillingPeriodSummary = async (
  id: number
): Promise<MonthlyBillingSummary> => {
  try {
    const response = await api.get(`${API_URL}${id}summary/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch billing period summary."
      );
    }
    throw new Error("Failed to fetch billing period summary.");
  }
};
