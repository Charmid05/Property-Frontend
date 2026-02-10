import {
  UtilityCharge,
  UtilityChargeCreateRequest,
  BulkUtilityChargeRequest,
  BulkUtilityChargeResponse,
  AddToInvoiceRequest,
  BulkBillRequest,
  ApiError,
} from "@/types/finance";
import { AxiosError } from "axios";
import api from "@/app/api/auth/api";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/api/finance/utility-charges/`;

// Get all utility charges
export const getUtilityCharges = async (params?: {
  utility_type?: string;
  tenant?: number;
  billing_period?: number;
  is_billed?: boolean;
}): Promise<UtilityCharge[]> => {
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
        error.response?.data?.message || "Failed to fetch utility charges."
      );
    }
    throw new Error("Failed to fetch utility charges.");
  }
};

// Get utility charge by ID
export const getUtilityChargeById = async (
  id: number
): Promise<UtilityCharge> => {
  try {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch utility charge."
      );
    }
    throw new Error("Failed to fetch utility charge.");
  }
};

// Create utility charge
export const createUtilityCharge = async (
  data: UtilityChargeCreateRequest
): Promise<UtilityCharge> => {
  try {
    const response = await api.post(API_URL, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to create utility charge."
      );
    }
    throw new Error("Failed to create utility charge.");
  }
};

// Update utility charge
export const updateUtilityCharge = async (
  id: number,
  data: Partial<UtilityChargeCreateRequest>
): Promise<UtilityCharge> => {
  try {
    const response = await api.patch(`${API_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update utility charge."
      );
    }
    throw new Error("Failed to update utility charge.");
  }
};

// Delete utility charge
export const deleteUtilityCharge = async (id: number): Promise<void> => {
  try {
    await api.delete(`${API_URL}${id}/`);
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to delete utility charge."
      );
    }
    throw new Error("Failed to delete utility charge.");
  }
};

// Bulk add to period
export const bulkAddToPeriod = async (data: {
  billing_period_id: number;
  charges: Array<{
    tenant: number;
    utility_type: string;
    amount: string;
    description?: string;
    reference_number?: string;
  }>;
}): Promise<{ status: string; charges_created: number; errors: any[] }> => {
  try {
    const response = await api.post(`${API_URL}bulk_add_to_period/`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to bulk add utility charges."
      );
    }
    throw new Error("Failed to bulk add utility charges.");
  }
};

// Bulk bill utility charges
export const bulkBillUtilityCharges = async (
  data: BulkBillRequest
): Promise<{ status: string; charges_billed: number; errors: any[] }> => {
  try {
    const response = await api.post(`${API_URL}bulk_bill/`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to bulk bill utility charges."
      );
    }
    throw new Error("Failed to bulk bill utility charges.");
  }
};

// Add to invoice
export const addUtilityChargeToInvoice = async (
  id: number,
  data: AddToInvoiceRequest
): Promise<{ status: string; invoice_item_id: number }> => {
  try {
    const response = await api.post(`${API_URL}${id}/add_to_invoice/`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error ||
          "Failed to add utility charge to invoice."
      );
    }
    throw new Error("Failed to add utility charge to invoice.");
  }
};
