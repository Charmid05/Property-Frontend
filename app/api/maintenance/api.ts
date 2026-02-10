import {
  MaintenanceRequest,
  MaintenanceRequestCreateRequest,
  MaintenanceRequestUpdateRequest,
  MaintenanceStats,
} from "@/types/maintenance";
import { AxiosError } from "axios";
import api from "@/app/api/auth/api";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/maintenance/requests/`;

// Get all maintenance requests
export const getMaintenanceRequests = async (params?: {
  status?: string;
  priority?: string;
  category?: string;
  tenant?: number;
  unit?: number;
  property?: number;
}): Promise<MaintenanceRequest[]> => {
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
        error.response?.data?.message || "Failed to fetch maintenance requests."
      );
    }
    throw new Error("Failed to fetch maintenance requests.");
  }
};

// Get maintenance request by ID
export const getMaintenanceRequestById = async (
  id: number
): Promise<MaintenanceRequest> => {
  try {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch maintenance request."
      );
    }
    throw new Error("Failed to fetch maintenance request.");
  }
};

// Create maintenance request
export const createMaintenanceRequest = async (
  data: MaintenanceRequestCreateRequest
): Promise<MaintenanceRequest> => {
  try {
    const response = await api.post(API_URL, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || error.response?.data?.detail
        || "Failed to create maintenance request.";
      throw new Error(errorMessage);
    }
    throw new Error("Failed to create maintenance request.");
  }
};

// Update maintenance request
export const updateMaintenanceRequest = async (
  id: number,
  data: MaintenanceRequestUpdateRequest
): Promise<MaintenanceRequest> => {
  try {
    const response = await api.patch(`${API_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update maintenance request."
      );
    }
    throw new Error("Failed to update maintenance request.");
  }
};

// Delete maintenance request
export const deleteMaintenanceRequest = async (id: number): Promise<void> => {
  try {
    await api.delete(`${API_URL}${id}/`);
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to delete maintenance request."
      );
    }
    throw new Error("Failed to delete maintenance request.");
  }
};

// Get maintenance statistics
export const getMaintenanceStats = async (): Promise<MaintenanceStats> => {
  try {
    const response = await api.get(`${API_URL}stats/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch maintenance statistics."
      );
    }
    throw new Error("Failed to fetch maintenance statistics.");
  }
};

// Cancel maintenance request
export const cancelMaintenanceRequest = async (
  id: number,
  reason?: string
): Promise<MaintenanceRequest> => {
  try {
    const response = await api.post(`${API_URL}${id}/cancel/`, { reason });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to cancel maintenance request."
      );
    }
    throw new Error("Failed to cancel maintenance request.");
  }
};

