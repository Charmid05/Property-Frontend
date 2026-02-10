import { TimeStamped } from "./common";
import { Receipt } from "./receipts";

export interface RentPayment extends TimeStamped {
  id: number;
  tenant: number;
  billing_period: number;
  invoice: number | null;
  amount: string;
  payment_date: string;
  due_date: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  reference_number: string;
  is_partial: boolean;
  outstanding_amount: string;
  processed_by: number | null;
  transaction: number | null;
  notes: string;
  days_late: number;
  is_overdue: boolean;
  total_amount_due: string;
}

export interface RentPaymentListItem {
  id: number;
  tenant_name: string;
  period_name: string;
  amount: string;
  payment_date: string;
  due_date: string;
  status: string;
  is_overdue: boolean;
}

export interface RentPaymentCreateRequest {
  tenant: number;
  billing_period: number;
  invoice?: number;
  amount: string;
  due_date: string;
  payment_date?: string;
  payment_method?: string;
}

export interface ProcessRentPaymentRequest {
  amount?: string;
  payment_method: string;
  reference_number?: string;
  notes?: string;
}

export interface RentPaymentProcessResponse {
  status: string;
  is_partial: boolean;
  outstanding_amount: string;
  rent_payment: RentPayment;
  receipt: Receipt | null;
}