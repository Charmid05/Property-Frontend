import {
  DashboardOverview,
  RecentActivity,
  FinancialSummary,
  ApiError,
} from "@/types/finance";
import { AxiosError } from "axios";
import api from "@/app/api/auth/api";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/api/finance/dashboard/`;

// Get dashboard overview
export const getDashboardOverview = async (): Promise<DashboardOverview> => {
  try {
    const response = await api.get(`${API_URL}overview/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch dashboard overview."
      );
    }
    throw new Error("Failed to fetch dashboard overview.");
  }
};

// Get recent activity
export const getRecentActivity = async (
  limit?: number
): Promise<RecentActivity> => {
  try {
    const response = await api.get(`${API_URL}recent_activity/`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch recent activity."
      );
    }
    throw new Error("Failed to fetch recent activity.");
  }
};

// Get financial summary
export const getFinancialSummary = async (
  period: "month" | "quarter" | "year"
): Promise<FinancialSummary> => {
  try {
    const response = await api.get(`${API_URL}financial_summary/`, {
      params: { period },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch financial summary."
      );
    }
    throw new Error("Failed to fetch financial summary.");
  }
};
