import {
  Invoice,
  InvoiceDetail,
  InvoiceListItem,
  InvoiceCreateRequest,
  AddChargeRequest,
  RemoveChargeRequest,
  ProcessPaymentRequest,
  ApiError,
  UtilityCharge,
} from "@/types/finance";
import { AxiosError } from "axios";
import api from "@/app/api/auth/api";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/api/finance/invoices/`;

// Get all invoices
export const getInvoices = async (params?: {
  status?: string;
  tenant?: number;
  overdue?: boolean;
  date_from?: string;
  date_to?: string;
}): Promise<InvoiceListItem[]> => {
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
        error.response?.data?.message || "Failed to fetch invoices.",
      );
    }
    throw new Error("Failed to fetch invoices.");
  }
};

// Get overdue invoices
export const getOverdueInvoices = async (): Promise<InvoiceListItem[]> => {
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
        error.response?.data?.message || "Failed to fetch overdue invoices.",
      );
    }
    throw new Error("Failed to fetch overdue invoices.");
  }
};

// Get invoice by ID
export const getInvoiceById = async (id: number): Promise<InvoiceDetail> => {
  try {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch invoice.",
      );
    }
    throw new Error("Failed to fetch invoice.");
  }
};

// NEW: Get tenant's unbilled utility charges for an invoice
export const getInvoiceTenantUtilityCharges = async (
  invoiceId: number,
): Promise<{ utility_charges: UtilityCharge[]; count: number }> => {
  try {
    const response = await api.get(
      `${API_URL}${invoiceId}/tenant_utility_charges/`,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch utility charges.",
      );
    }
    throw new Error("Failed to fetch utility charges.");
  }
};

// NEW: Add utility charges to invoice
export const addUtilityChargesToInvoice = async (
  invoiceId: number,
  data: { utility_charge_ids: number[] },
): Promise<{
  status: string;
  added_count: number;
  errors: any[];
  invoice: Invoice;
}> => {
  try {
    const response = await api.post(
      `${API_URL}${invoiceId}/add_utility_charges/`,
      data,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error ||
          "Failed to add utility charges to invoice.",
      );
    }
    throw new Error("Failed to add utility charges to invoice.");
  }
};

// Create invoice
export const createInvoice = async (
  data: InvoiceCreateRequest,
): Promise<Invoice> => {
  try {
    const response = await api.post(API_URL, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to create invoice.",
      );
    }
    throw new Error("Failed to create invoice.");
  }
};

// Update invoice
export const updateInvoice = async (
  id: number,
  data: Partial<InvoiceCreateRequest>,
): Promise<Invoice> => {
  try {
    const response = await api.patch(`${API_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to update invoice.",
      );
    }
    throw new Error("Failed to update invoice.");
  }
};

// Send invoice
export const sendInvoice = async (id: number): Promise<{ status: string }> => {
  try {
    const response = await api.post(`${API_URL}${id}/send/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || "Failed to send invoice.");
    }
    throw new Error("Failed to send invoice.");
  }
};

// Cancel invoice
export const cancelInvoice = async (
  id: number,
): Promise<{ status: string }> => {
  try {
    const response = await api.post(`${API_URL}${id}/cancel/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to cancel invoice.",
      );
    }
    throw new Error("Failed to cancel invoice.");
  }
};

// Add charge to invoice
export const addChargeToInvoice = async (
  id: number,
  data: AddChargeRequest,
): Promise<{ status: string; item: any; invoice: Invoice }> => {
  try {
    const response = await api.post(`${API_URL}${id}/add_charge/`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to add charge to invoice.",
      );
    }
    throw new Error("Failed to add charge to invoice.");
  }
};

// Remove charge from invoice
export const removeChargeFromInvoice = async (
  id: number,
  data: RemoveChargeRequest,
): Promise<{ status: string; invoice: Invoice }> => {
  try {
    const response = await api.delete(`${API_URL}${id}/remove_charge/`, {
      data,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to remove charge from invoice.",
      );
    }
    throw new Error("Failed to remove charge from invoice.");
  }
};

// Apply payment to invoice
export const applyPaymentToInvoice = async (
  id: number,
  data: ProcessPaymentRequest,
): Promise<any> => {
  try {
    const response = await api.post(`${API_URL}${id}/apply_payment/`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || "Failed to apply payment to invoice.",
      );
    }
    throw new Error("Failed to apply payment to invoice.");
  }
};

// Get invoice payment history
export const getInvoicePaymentHistory = async (id: number): Promise<any> => {
  try {
    const response = await api.get(`${API_URL}${id}/payment_history/`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to fetch invoice payment history.",
      );
    }
    throw new Error("Failed to fetch invoice payment history.");
  }
};

// Delete invoice
export const deleteInvoice = async (id: number): Promise<void> => {
  try {
    await api.delete(`${API_URL}${id}/`);
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || "Failed to delete invoice.",
      );
    }
    throw new Error("Failed to delete invoice.");
  }
};
