import { AxiosError } from "axios";
import api from "../auth/api";
import {
  Office,
  OfficeCreateRequest,
  OfficeUpdateRequest,
} from "@/types/office";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/management/offices/`;

export const getOffices = async (): Promise<Office[]> => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch offices."
      );
    }
    throw new Error("Failed to fetch offices.");
  }
};
export const getOffice = async (id: number): Promise<Office> => {
  try {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error("Office not found.");
      }
      throw new Error(
        error.response?.data?.message || "Failed to fetch office."
      );
    }
    throw new Error("Failed to fetch office.");
  }
};

// Create a new office
export const createOffice = async (
  officeData: OfficeCreateRequest
): Promise<Office> => {
  try {
    const response = await api.post(API_URL, officeData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        const errorMessage =
          error.response.data?.message || "Invalid office data.";
        throw new Error(errorMessage);
      }
      throw new Error(
        error.response?.data?.message || "Failed to create office."
      );
    }
    throw new Error("Failed to create office.");
  }
};

// Update an existing office
export const updateOffice = async (
  id: number,
  officeData: OfficeUpdateRequest
): Promise<Office> => {
  try {
    const response = await api.patch(`${API_URL}${id}/`, officeData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error("Office not found.");
      }
      if (error.response?.status === 400) {
        const errorMessage =
          error.response.data?.message || "Invalid office data.";
        throw new Error(errorMessage);
      }
      throw new Error(
        error.response?.data?.message || "Failed to update office."
      );
    }
    throw new Error("Failed to update office.");
  }
};

// Delete an office
export const deleteOffice = async (id: number): Promise<void> => {
  try {
    await api.delete(`${API_URL}${id}/`);
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error("Office not found.");
      }
      if (error.response?.status === 403) {
        throw new Error("You don't have permission to delete this office.");
      }
      if (error.response?.status === 400) {
        throw new Error(
          "Cannot delete office. It may be associated with existing properties."
        );
      }
      throw new Error(
        error.response?.data?.message || "Failed to delete office."
      );
    }
    throw new Error("Failed to delete office.");
  }
};

// Get offices with search functionality
export const searchOffices = async (query: string): Promise<Office[]> => {
  try {
    const response = await api.get(API_URL, {
      params: { search: query },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to search offices."
      );
    }
    throw new Error("Failed to search offices.");
  }
};
