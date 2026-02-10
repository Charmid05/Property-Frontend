import { TimeStamped } from "./common";

export interface Receipt extends TimeStamped {
  id: number;
  receipt_number: string;
  transaction: number;
  invoice: number | null;
  tenant: number;
  amount: string;
  payment_date: string;
  issue_date?: string; // Optional field for issue date
  payment_method: string;
  amount_allocated_to_invoice: string;
  amount_to_account: string;
  notes: string;
  issued_by: number | null;
}