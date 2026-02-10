import { TimeStamped } from "./common";

export interface Transaction extends TimeStamped {
  id: number;
  transaction_id: string;
  account: number;
  transaction_type: 'payment' | 'charge' | 'refund' | 'adjustment' | 'penalty' | 'credit';
  amount: string;
  payment_method: string;
  invoice: number | null;
  reference_number: string;
  description: string;
  processed_by: number | null;
  reversed_transaction: number | null;
  is_reversed: boolean;
}

export interface TransactionListItem {
  id: number;
  transaction_id: string;
  transaction_type: string;
  amount: string;
  payment_method: string;
  created_at: string;
  description: string;
}

export interface ReverseTransactionRequest {
  reason: string;
}