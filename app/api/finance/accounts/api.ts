import {
  UserAccount,
  AccountSummary,
  ApiError,
  PaginatedResponse,
} from "@/types/finance";
import { AxiosError } from "axios";
import api from "@/app/api/auth/api";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/api/finance/accounts/`;

// Get all accounts
export const getAccounts = async (): Promise<UserAccount[]> => {
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
        error.response?.data?.message || "Failed to fetch accounts."
      );
    }
    throw new Error("Failed to fetch accounts.");
  }
};

// Get account by ID
export const getAccountById = async (id: number): Promise<UserAccount> => {
  try {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch account."
      );
    }
    throw new Error("Failed to fetch account.");
  }
};

// Get account summary
export const getAccountSummary = async (id: number): Promise<AccountSummary> => {
  try {
    const response = await api.get(`${API_URL}${id}/summary/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch account summary."
      );
    }
    throw new Error("Failed to fetch account summary.");
  }
};

// Update account
export const updateAccount = async (
  id: number,
  data: Partial<UserAccount>
): Promise<UserAccount> => {
  try {
    const response = await api.patch(`${API_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update account."
      );
    }
    throw new Error("Failed to update account.");
  }
};