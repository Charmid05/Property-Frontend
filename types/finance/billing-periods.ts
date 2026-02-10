import { TimeStamped } from "./common";

export interface BillingPeriod extends TimeStamped {
  id: number;
  name: string;
  period_type: 'monthly' | 'quarterly' | 'semi_annual' | 'annual' | 'custom';
  start_date: string;
  end_date: string;
  due_date: string;
  is_active: boolean;
  is_closed: boolean;
  closed_at: string | null;
  closed_by: number | null;
  is_current: boolean;
  days_until_due: number;
}

export interface BillingPeriodDetail extends BillingPeriod {
  invoices_count: number;
  total_billed: string;
  total_collected: string;
  outstanding_amount: string;
}

export interface BillingPeriodCreateRequest {
  name: string;
  period_type: 'monthly' | 'quarterly' | 'semi_annual' | 'annual' | 'custom';
  start_date: string;
  end_date: string;
  due_date: string;
  is_active?: boolean;
}

export interface CloseBillingPeriodRequest {
  force?: boolean;
  notes?: string;
}

export interface GenerateInvoicesRequest {
  tenant_ids?: number[];
  billing_period_id: number;
  include_utilities?: boolean;
  auto_send?: boolean;
}
export interface MonthlyBillingSummary {
  period_name: string;
  total_charges: string;
  total_payments: string;
  outstanding_balance: string;
  utility_charges_count: number;
  invoices_count: number;
}