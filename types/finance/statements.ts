import { InvoiceListItem } from "./invoices";
import { Receipt } from "./receipts";
import { TransactionListItem } from "./transactions";

export interface TenantStatement {
  tenant_id: number;
  tenant_name: string;
  period_start: string;
  period_end: string;
  opening_balance: string;
  closing_balance: string;
  total_charges: string;
  total_payments: string;
  transactions: TransactionListItem[];
  invoices: InvoiceListItem[];
  receipts: Receipt[];
}

export interface CurrentBalanceResponse {
  tenant_id: number;
  tenant_name: string;
  current_balance: string;
  debt_amount: string;
  is_in_debt: boolean;
  available_credit: string;
  credit_limit: string;
}
