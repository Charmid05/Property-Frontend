import { TimeStamped } from "./common";
import { Receipt } from "./receipts";

export interface Payment extends TimeStamped {
  id: number;
  tenant: number;
  invoice: number | null;
  amount: string;
  payment_date: string;
  payment_method: 'cash' | 'bank_transfer' | 'card' | 'mobile_money' | 'check' | 'other';
  reference_number: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction: number | null;
  receipt: number | null;
  processed_by: number | null;
  notes: string;
}

export interface PaymentCreateRequest {
  tenant: number;
  invoice?: number;
  amount: string;
  payment_date?: string;
  payment_method: string;
  reference_number?: string;
  notes?: string;
}

export interface ProcessPaymentRequest {
  amount?: string;
  payment_method: string;
  reference_number?: string;
  notes?: string;
}

export interface QuickPaymentRequest {
  tenant_id: number;
  invoice_id?: number;
  amount?: string;
  payment_method: string;
  reference_number?: string;
  notes?: string;
}

export interface QuickPaymentResponse {
  status: string;
  payment: Payment;
  receipt: Receipt;
}
