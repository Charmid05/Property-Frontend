import {
  Property,
  PropertyListResponse,
  PropertyCreateRequest,
  PropertyUpdateRequest,
  PropertyListItem,
  ApiError,
  AssignManagerResponse,
  AssignManagerRequest,
} from "@/types/property";
import { AxiosError, AxiosInstance } from "axios";
import api from "../auth/api";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/properties/`;

export const getProperties = async (): Promise<PropertyListResponse> => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch properties.",
      );
    }
    throw new Error("Failed to fetch properties.");
  }
};

// Get a single property by ID
export const getProperty = async (id: number): Promise<Property> => {
  try {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error("Property not found.");
      }
      throw new Error(
        error.response?.data?.message || "Failed to fetch property.",
      );
    }
    throw new Error("Failed to fetch property.");
  }
};

// Create a new property
// Note: This function handles both JSON and multipart/form-data based on whether a picture file is included
export const createProperty = async (
  propertyData: PropertyCreateRequest,
): Promise<Property> => {
  try {
    // If there's a picture file, use FormData
    if (propertyData.picture) {
      const formData = new FormData();
      formData.append("name", propertyData.name);
      formData.append("address", propertyData.address);
      if (propertyData.description) {
        formData.append("description", propertyData.description);
      }
      formData.append("office", propertyData.office.toString());
      formData.append("manager", propertyData.manager.toString());
      formData.append("picture", propertyData.picture);
      formData.append("is_active", propertyData.is_active.toString());

      const response = await api.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } else {
      // No file, send as JSON
      const response = await api.post(API_URL, propertyData);
      return response.data;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        const errorMessage =
          error.response.data?.message || "Invalid property data.";
        throw new Error(errorMessage);
      }
      throw new Error(
        error.response?.data?.message || "Failed to create property.",
      );
    }
    throw new Error("Failed to create property.");
  }
};

// Update an existing property
export const updateProperty = async (
  id: number,
  propertyData: PropertyUpdateRequest,
): Promise<Property> => {
  try {
    // If there's a picture file, use FormData
    if (propertyData.picture) {
      const formData = new FormData();

      // Only append fields that are provided
      if (propertyData.name !== undefined) {
        formData.append("name", propertyData.name);
      }
      if (propertyData.address !== undefined) {
        formData.append("address", propertyData.address);
      }
      if (propertyData.description !== undefined) {
        formData.append("description", propertyData.description);
      }
      if (propertyData.office !== undefined) {
        formData.append("office", propertyData.office.toString());
      }
      if (propertyData.manager !== undefined) {
        formData.append("manager", propertyData.manager.toString());
      }
      if (propertyData.is_active !== undefined) {
        formData.append("is_active", propertyData.is_active.toString());
      }
      formData.append("picture", propertyData.picture);

      const response = await api.patch(`${API_URL}${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } else {
      // No file, send as JSON
      const response = await api.patch(`${API_URL}${id}/`, propertyData);
      return response.data;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error("Property not found.");
      }
      if (error.response?.status === 400) {
        const errorMessage =
          error.response.data?.message || "Invalid property data.";
        throw new Error(errorMessage);
      }
      throw new Error(
        error.response?.data?.message || "Failed to update property.",
      );
    }
    throw new Error("Failed to update property.");
  }
};

// Delete a property
export const deleteProperty = async (id: number): Promise<void> => {
  try {
    await api.delete(`${API_URL}${id}/`);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error("Property not found.");
      }
      if (error.response?.status === 403) {
        throw new Error("You don't have permission to delete this property.");
      }
      throw new Error(
        error.response?.data?.message || "Failed to delete property.",
      );
    }
    throw new Error("Failed to delete property.");
  }
};

// Get properties with pagination and filters
export const getPropertiesWithFilters = async (params?: {
  page?: number;
  search?: string;
  is_active?: boolean;
  office?: number;
  manager?: number;
}): Promise<PropertyListResponse> => {
  try {
    const response = await api.get(API_URL, { params });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch properties.",
      );
    }
    throw new Error("Failed to fetch properties.");
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
export const assignPropertyManager = async (
  data: AssignManagerRequest,
): Promise<AssignManagerResponse> => {
  try {
    const response = await api.post(`${API_URL}assign-manager/`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to assign property manager.",
      );
    }
    throw new Error("Failed to assign property manager.");
  }
};
