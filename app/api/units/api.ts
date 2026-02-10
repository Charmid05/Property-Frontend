import {
  Unit,
  UnitListResponse,
  UnitCreateRequest,
  UnitUpdateRequest,
  UnitListItem,
  UnitCreateResponse,
  AvailableUnitsResponse,
  ApiError,
} from "@/types/units";
import { AxiosError, AxiosInstance } from "axios";
import api from "@/app/api/auth/api";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/units/`;

// Get all units
export const getUnits = async (): Promise<UnitListItem[]> => {
  try {
    const response = await api.get(API_URL);

    // Handle both array and paginated responses
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      return response.data.results || [];
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch units."
      );
    }
    throw new Error("Failed to fetch units.");
  }
};

// Get a single unit by ID
export const getUnit = async (id: number): Promise<Unit> => {
  try {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error("Unit not found.");
      }
      throw new Error(error.response?.data?.message || "Failed to fetch unit.");
    }
    throw new Error("Failed to fetch unit.");
  }
};

// Create a new unit
export const createUnit = async (
  unitData: UnitCreateRequest
): Promise<UnitCreateResponse> => {
  try {
    const response = await api.post(API_URL, unitData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        const errorMessage =
          error.response.data?.message || "Invalid unit data.";
        throw new Error(errorMessage);
      }
      throw new Error(
        error.response?.data?.message || "Failed to create unit."
      );
    }
    throw new Error("Failed to create unit.");
  }
};

// Update an existing unit
export const updateUnit = async (
  id: number,
  unitData: UnitUpdateRequest
): Promise<Unit> => {
  try {
    const response = await api.patch(`${API_URL}${id}/`, unitData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error("Unit not found.");
      }
      if (error.response?.status === 400) {
        const errorMessage =
          error.response.data?.message || "Invalid unit data.";
        throw new Error(errorMessage);
      }
      throw new Error(
        error.response?.data?.message || "Failed to update unit."
      );
    }
    throw new Error("Failed to update unit.");
  }
};

// Delete a unit
export const deleteUnit = async (id: number): Promise<void> => {
  try {
    await api.delete(`${API_URL}${id}/`);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error("Unit not found.");
      }
      if (error.response?.status === 403) {
        throw new Error("You don't have permission to delete this unit.");
      }
      throw new Error(
        error.response?.data?.message || "Failed to delete unit."
      );
    }
    throw new Error("Failed to delete unit.");
  }
};

// Get units with pagination and filters
export const getUnitsWithFilters = async (params?: {
  page?: number;
  search?: string;
  property?: number;
  occupied_status?: "Occupied" | "Vacant" | "Maintenance" | "Closed";
  unit_type?: string;
}): Promise<UnitListResponse> => {
  try {
    const response = await api.get(API_URL, { params });

    // Check if response is paginated (has results, count, etc.) or direct array
    if (Array.isArray(response.data)) {
      // Direct array response - convert to paginated format
      return {
        results: response.data,
        count: response.data.length,
        next: null,
        previous: null,
      };
    } else {
      // Paginated response
      return {
        results: response.data.results || [],
        count: response.data.count || 0,
        next: response.data.next || null,
        previous: response.data.previous || null,
      };
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch units."
      );
    }
    throw new Error("Failed to fetch units.");
  }
};

// Get available units
export const getAvailableUnits = async (): Promise<AvailableUnitsResponse> => {
  try {
    const response = await api.get(`${API_URL}available_units/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch available units."
      );
    }
    throw new Error("Failed to fetch available units.");
  }
};

// Get units by property ID
export const getUnitsByProperty = async (
  propertyId: number
): Promise<UnitListItem[]> => {
  try {
    const response = await api.get(`${API_URL}?property=${propertyId}`);

    // Handle both array and paginated responses
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      return response.data.results || [];
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch units for property."
      );
    }
    throw new Error("Failed to fetch units for property.");
  }
};

// Get units by status
export const getUnitsByStatus = async (
  status: "Occupied" | "Vacant" | "Maintenance" | "Closed"
): Promise<UnitListItem[]> => {
  try {
    const response = await api.get(`${API_URL}?occupied_status=${status}`);

    // Handle both array and paginated responses
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      return response.data.results || [];
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch ${status.toLowerCase()} units.`
      );
    }
    throw new Error(`Failed to fetch ${status.toLowerCase()} units.`);
  }
};

// Utility function to handle common API errors
const handleApiError = (error: unknown, defaultMessage: string): never => {
  if (error instanceof AxiosError) {
    const apiError: ApiError = {
      message: error.response?.data?.message || defaultMessage,
      status: error.response?.status,
      details: error.response?.data,
    };
    throw apiError;
  }
  throw new Error(defaultMessage);
};
