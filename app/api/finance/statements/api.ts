import {
  TenantStatement,
  CurrentBalanceResponse,
  ApiError,
} from "@/types/finance";
import { AxiosError } from "axios";
import api from "@/app/api/auth/api";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/api/finance/statements/`;

// Generate tenant statement
export const generateTenantStatement = async (params: {
  tenant_id: number;
  period_start: string;
  period_end: string;
}): Promise<TenantStatement> => {
  try {
    const response = await api.get(`${API_URL}generate/`, { params });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to generate tenant statement."
      );
    }
    throw new Error("Failed to generate tenant statement.");
  }
};

// Get current balance
export const getCurrentBalance = async (
  tenant_id: number
): Promise<CurrentBalanceResponse> => {
  try {
    const response = await api.get(`${API_URL}current_balance/`, {
      params: { tenant_id },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch current balance."
      );
    }
    throw new Error("Failed to fetch current balance.");
  }
};
