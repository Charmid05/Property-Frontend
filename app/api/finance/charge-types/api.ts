import { ChargeType, ApiError } from "@/types/finance";
import { AxiosError } from "axios";
import api from "@/app/api/auth/api";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/api/finance/charge-types/`;

// Get all charge types
export const getChargeTypes = async (params?: {
  frequency?: string;
  is_system_charge?: boolean;
  is_active?: boolean;
}): Promise<ChargeType[]> => {
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
        error.response?.data?.message || "Failed to fetch charge types."
      );
    }
    throw new Error("Failed to fetch charge types.");
  }
};

// Get charge type by ID
export const getChargeTypeById = async (id: number): Promise<ChargeType> => {
  try {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch charge type."
      );
    }
    throw new Error("Failed to fetch charge type.");
  }
};

// Create charge type
export const createChargeType = async (
  data: Omit<ChargeType, "id" | "created_at" | "updated_at">
): Promise<ChargeType> => {
  try {
    const response = await api.post(API_URL, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to create charge type."
      );
    }
    throw new Error("Failed to create charge type.");
  }
};

// Update charge type
export const updateChargeType = async (
  id: number,
  data: Partial<Omit<ChargeType, "id" | "created_at" | "updated_at">>
): Promise<ChargeType> => {
  try {
    const response = await api.patch(`${API_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update charge type."
      );
    }
    throw new Error("Failed to update charge type.");
  }
};

// Delete charge type
export const deleteChargeType = async (id: number): Promise<void> => {
  try {
    await api.delete(`${API_URL}${id}/`);
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to delete charge type."
      );
    }
    throw new Error("Failed to delete charge type.");
  }
};