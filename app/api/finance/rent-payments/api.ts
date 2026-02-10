import {
  RentPayment,
  RentPaymentListItem,
  RentPaymentCreateRequest,
  ProcessRentPaymentRequest,
  RentPaymentProcessResponse,
  ApiError,
} from "@/types/finance";
import { AxiosError } from "axios";
import api from "@/app/api/auth/api";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/api/finance/rent-payments/`;

// Get all rent payments
export const getRentPayments = async (params?: {
  status?: string;
  tenant?: number;
  billing_period?: number;
  overdue?: boolean;
}): Promise<RentPaymentListItem[]> => {
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
        error.response?.data?.message || "Failed to fetch rent payments."
      );
    }
    throw new Error("Failed to fetch rent payments.");
  }
};

// Get overdue rent payments
export const getOverdueRentPayments = async (): Promise<RentPaymentListItem[]> => {
  try {
    const response = await api.get(`${API_URL}overdue/`);

    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      return response.data.results || [];
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch overdue rent payments."
      );
    }
    throw new Error("Failed to fetch overdue rent payments.");
  }
};

// Get pending rent payments
export const getPendingRentPayments = async (): Promise<RentPaymentListItem[]> => {
  try {
    const response = await api.get(`${API_URL}pending/`);

    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      return response.data.results || [];
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch pending rent payments."
      );
    }
    throw new Error("Failed to fetch pending rent payments.");
  }
};

// Get rent payment by ID
export const getRentPaymentById = async (id: number): Promise<RentPayment> => {
  try {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch rent payment."
      );
    }
    throw new Error("Failed to fetch rent payment.");
  }
};

// Create rent payment
export const createRentPayment = async (
  data: RentPaymentCreateRequest
): Promise<RentPayment> => {
  try {
    const response = await api.post(API_URL, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to create rent payment."
      );
    }
    throw new Error("Failed to create rent payment.");
  }
};

// Process rent payment
export const processRentPayment = async (
  id: number,
  data: ProcessRentPaymentRequest
): Promise<RentPaymentProcessResponse> => {
  try {
    const response = await api.post(`${API_URL}${id}/process/`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to process rent payment."
      );
    }
    throw new Error("Failed to process rent payment.");
  }
};

// Pay remaining balance
export const payRemainingBalance = async (
  id: number,
  data: ProcessRentPaymentRequest
): Promise<RentPaymentProcessResponse> => {
  try {
    const response = await api.post(`${API_URL}${id}/pay_remaining/`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to pay remaining balance."
      );
    }
    throw new Error("Failed to pay remaining balance.");
  }
};