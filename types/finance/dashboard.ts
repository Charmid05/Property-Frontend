import { InvoiceListItem } from "./invoices";
import { Payment } from "./payments";
import { Receipt } from "./receipts";
import { TransactionListItem } from "./transactions";

export interface DashboardOverview {
  total_invoices: number;
  draft_invoices: number;
  sent_invoices: number;
  overdue_invoices: number;
  paid_invoices: number;
  pending_payments: number;
  partial_payments: number;
  total_outstanding: number;
  monthly_revenue: number;
  monthly_charges: number;
  total_debt: number;
  accounts_in_debt: number;
  collection_rate: number;
  current_period: string | null;
  days_until_due: number | null;
}

export interface RecentActivity {
  transactions: TransactionListItem[];
  payments: Payment[];
  receipts: Receipt[];
  invoices: InvoiceListItem[];
}

export interface FinancialSummary {
  period: 'month' | 'quarter' | 'year';
  start_date: string;
  end_date: string;
  total_payment: number;
  total_charge: number;
  total_refund: number;
  total_credit: number;
  total_penalty: number;
  total_adjustment: number;
  total_income: number;
  total_expenses: number;
  net_flow: number;
  transaction_count: number;
}
