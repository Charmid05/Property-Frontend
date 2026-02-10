import { TimeStamped } from "./common";
import { Payment } from "./payments";
import { Receipt } from "./receipts";
import { Transaction } from "./transactions";

export interface Invoice extends TimeStamped {
  id: number;
  invoice_number: string;
  tenant: number;
  billing_period: number;
  issue_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  subtotal: string;
  tax_amount: string;
  total_amount: string;
  amount_paid: string;
  balance_due: string;
  is_overdue: boolean;
  days_overdue: number;
  notes: string;
  created_by: number | null;
}

export interface InvoiceListItem {
  id: number;
  invoice_number: string;
  tenant_name: string;
  issue_date: string;
  due_date: string;
  status: string;
  total_amount: string;
  amount_paid: string;
  balance_due: string;
  is_overdue: boolean;
}

export interface InvoiceItem extends TimeStamped {
  id: number;
  invoice: number;
  charge_type: number;
  description: string;
  quantity: string;
  unit_price: string;
  line_total: string;
}

export interface InvoiceDetail extends Invoice {
  items: InvoiceItem[];
  charges?: any[]; // Alternative format from API
  billing_period_details?: { name: string; start_date: string; end_date: string };
  discount_amount?: string;
  payments: Payment[];
  receipts: Receipt[];
  transactions: Transaction[];
}

export interface InvoiceCreateRequest {
  tenant: number;
  billing_period: number;
  due_date: string;
  issue_date?: string;
  status?: string;
  tax_amount?: string;
  notes?: string;
  items?: InvoiceItemCreateRequest[];
}

export interface InvoiceItemCreateRequest {
  charge_type: number;
  description: string;
  quantity: string;
  unit_price: string;
}

export interface AddChargeRequest {
  charge_type: number;
  description: string;
  quantity: string;
  unit_price: string;
}

export interface RemoveChargeRequest {
  item_id: number;
}