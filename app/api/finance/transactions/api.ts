import {
  Transaction,
  TransactionListItem,
  ReverseTransactionRequest,
  ApiError,
} from "@/types/finance";
import { AxiosError } from "axios";
import api from "@/app/api/auth/api";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/api/finance/transactions/`;

// Get all transactions
export const getTransactions = async (params?: {
  transaction_type?: string;
  payment_method?: string;
  account?: number;
  invoice?: number;
  date_from?: string;
  date_to?: string;
}): Promise<TransactionListItem[]> => {
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
        error.response?.data?.message || "Failed to fetch transactions."
      );
    }
    throw new Error("Failed to fetch transactions.");
  }
};

// Get transaction by ID
export const getTransactionById = async (id: number): Promise<Transaction> => {
  try {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch transaction."
      );
    }
    throw new Error("Failed to fetch transaction.");
  }
};

// Reverse transaction
export const reverseTransaction = async (
  id: number,
  data: ReverseTransactionRequest
): Promise<Transaction> => {
  try {
    const response = await api.post(`${API_URL}${id}/reverse/`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to reverse transaction."
      );
    }
    throw new Error("Failed to reverse transaction.");
  }
};
