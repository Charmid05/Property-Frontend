import { TimeStamped } from "./common";

export interface UserAccount extends TimeStamped {
  id: number;
  user: number;
  balance: string;
  credit_limit: string;
  debt_amount: string;
  available_credit: string;
  is_in_debt: boolean;
}

export interface AccountSummary {
  balance: string;
  debt_amount: string;
  available_credit: string;
  total_invoices: number;
  overdue_invoices: number;
  pending_payments: number;
  last_payment_date: string | null;
}