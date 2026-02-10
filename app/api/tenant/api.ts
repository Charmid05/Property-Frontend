

import {
  Tenant,
  TenantListItem,
  TenantListResponse,
  TenantCreateRequest,
  TenantUpdateRequest,
  TenantUserUpdateRequest,
  TenantPasswordResetRequest,
  TenantDashboard,
  ExpiringLeasesResponse,
  TenantsByPropertyResponse,
  TenantStatusUpdate,
  TenantStatus,
  ApiError,
  ValidationError,
} from "@/types/tenant";
import { AxiosError } from "axios";
import api from "../auth/api";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/tenants/`;

// Helper function to handle API errors
const handleApiError = (error: unknown, defaultMessage: string): never => {
  if (error instanceof AxiosError) {
    // Handle validation errors
    if (error.response?.status === 400 && error.response.data) {
      const validationError: ValidationError = error.response.data;
      const errorMessages = Object.entries(validationError)
        .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
        .join("; ");
      throw new Error(errorMessages || defaultMessage);
    }

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.detail ||
        defaultMessage
    );
  }
  throw new Error(defaultMessage);
};

// Get all tenants
export const getTenants = async (params?: {
  status?: TenantStatus;
  search?: string;
}): Promise<TenantListResponse | undefined> => {
  try {
    const response = await api.get(API_URL, { params });

    // Handle both array response and paginated response
    if (Array.isArray(response.data)) {
      return {
        results: response.data,
        count: response.data.length,
      };
    }

    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch tenants.");
  }
  return undefined; // Explicitly return undefined if an error occurs
};

// Get tenant by ID
export const getTenantById = async (
  id: number
): Promise<Tenant | undefined> => {
  try {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch tenant.");
  }
};

// Create new tenant (with automatic user creation)
export const createTenant = async (
  tenantData: TenantCreateRequest
): Promise<Tenant | undefined> => {
  try {
    const response = await api.post(API_URL, tenantData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to create tenant.");
  }
  return undefined; // Explicitly return undefined if an error occurs
};

// Update tenant (only tenant fields, no user fields)
export const updateTenant = async (
  id: number,
  tenantData: TenantUpdateRequest
): Promise<Tenant | undefined> => {
  try {
    const response = await api.put(`${API_URL}${id}/`, tenantData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to update tenant.");
  }
  return undefined; // Explicitly return undefined if an error occurs
};

// Update tenant (partial update)
export const patchTenant = async (
  id: number,
  tenantData: Partial<TenantUpdateRequest>
): Promise<Tenant | undefined> => {
  try {
    const response = await api.patch(`${API_URL}${id}/`, tenantData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to update tenant.");
  }
  return undefined; // Explicitly return undefined if an error occurs
};

// // Update tenant's user information separately
export const updateTenantUser = async (
  id: number,
  userData: TenantUserUpdateRequest
): Promise<Tenant | undefined> => {
  try {
    const response = await api.patch(
      `${API_URL}${id}/update_user_info/`,
      userData
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to update tenant user information.");
    return undefined;
  }
};

// Reset tenant user password
export const resetTenantPassword = async (
  id: number,
  passwordData: TenantPasswordResetRequest
): Promise<{ message: string }> => {
  try {
    const response = await api.post(
      `${API_URL}${id}/reset_password/`,
      passwordData
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to reset tenant password.");
    throw new Error("Unreachable");
  }
};

// Delete tenant
export const deleteTenant = async (id: number): Promise<void> => {
  try {
    await api.delete(`${API_URL}${id}/`);
  } catch (error) {
    handleApiError(error, "Failed to delete tenant.");
  }
};

// Get dashboard data
export const getTenantDashboard = async (): Promise<
  TenantDashboard | undefined
> => {
  try {
    const response = await api.get(`${API_URL}dashboard/`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch dashboard data.");
    return undefined;
  }
};

// Get expiring leases
export const getExpiringLeases = async (
  days?: number
): Promise<ExpiringLeasesResponse | undefined> => {
  try {
    const params = days ? { days } : {};
    const response = await api.get(`${API_URL}expiring_leases/`, { params });
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch expiring leases.");
    return undefined;
  }
};

// Get tenants by property
export const getTenantsByProperty = async (
  propertyId: number,
  status?: TenantStatus
): Promise<TenantsByPropertyResponse | undefined> => {
  try {
    const params: any = { property_id: propertyId };
    if (status) params.status = status;

    const response = await api.get(`${API_URL}by_property/`, { params });
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch tenants by property.");
    return undefined;
  }
};

// Update tenant status
export const updateTenantStatus = async (
  id: number,
  status: TenantStatus
): Promise<Tenant | undefined> => {
  try {
    const response = await api.patch(`${API_URL}${id}/update_status/`, {
      status,
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to update tenant status.");
    return undefined;
  }
};
// Validation helper for tenant creation form
export const validateTenantCreateData = (
  data: Partial<TenantCreateRequest>
): ValidationError => {
  const errors: ValidationError = {};

  // Required user fields
  if (!data.username?.trim()) {
    errors.username = ["Username is required"];
  }
  if (!data.email?.trim()) {
    errors.email = ["Email is required"];
  }
  if (!data.password?.trim()) {
    errors.password = ["Password is required"];
  }
  if (!data.password2?.trim()) {
    errors.password2 = ["Password confirmation is required"];
  }
  if (data.password !== data.password2) {
    errors.password2 = ["Passwords must match"];
  }
  if (!data.first_name?.trim()) {
    errors.first_name = ["First name is required"];
  }
  if (!data.last_name?.trim()) {
    errors.last_name = ["Last name is required"];
  }

  // Required tenant fields
  if (!data.unit) {
    errors.unit = ["Unit is required"];
  }
  if (!data.status) {
    errors.status = ["Status is required"];
  }
  if (!data.lease_start_date) {
    errors.lease_start_date = ["Lease start date is required"];
  }

  // Date validations
  if (data.lease_start_date && data.lease_end_date) {
    const startDate = new Date(data.lease_start_date);
    const endDate = new Date(data.lease_end_date);
    if (endDate <= startDate) {
      errors.lease_end_date = ["Lease end date must be after start date"];
    }
  }

  return errors;
};

// Check if validation errors exist
export const hasValidationErrors = (errors: ValidationError): boolean => {
  return Object.keys(errors).length > 0;
};
