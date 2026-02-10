import { Receipt, ApiError } from "@/types/finance";
import { AxiosError } from "axios";
import api from "@/app/api/auth/api";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/api/finance/receipts/`;

// Get all receipts
export const getReceipts = async (params?: {
  tenant?: number;
  invoice?: number;
  payment_method?: string;
}): Promise<Receipt[]> => {
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
        error.response?.data?.message || "Failed to fetch receipts."
      );
    }
    throw new Error("Failed to fetch receipts.");
  }
};

// Get receipt by ID
export const getReceiptById = async (id: number): Promise<Receipt> => {
  try {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch receipt."
      );
    }
    throw new Error("Failed to fetch receipt.");
  }
};

// Download receipt PDF
export const downloadReceipt = async (
  id: number
): Promise<{ message: string; receipt: Receipt }> => {
  try {
    const response = await api.get(`${API_URL}${id}/download/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to download receipt."
      );
    }
    throw new Error("Failed to download receipt.");
  }
};
