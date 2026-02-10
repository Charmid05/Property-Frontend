import { TimeStamped } from "./common";

export interface UtilityCharge extends TimeStamped {
  id: number;
  tenant: number;
  utility_type: 'Electricity' | 'Water' | 'Gas' | 'Internet' | 'Garbage Collection' | 
                 'Sewer' | 'Security' | 'Cleaning' | 'Parking' | 'Other' | 'Deposit';
  billing_period: number;
  amount: string;
  description: string;
  reference_number: string;
  recorded_by: number | null;
  is_billed: boolean;
}

export interface UtilityChargeCreateRequest {
  tenant: number;
  utility_type: string;
  billing_period: number;
  amount: string;
  description?: string;
  reference_number?: string;
}

export interface BulkUtilityChargeRequest {
  billing_period_id: number;
  charges: {
    tenant: number;
    utility_type: string;
    amount: string;
    description?: string;
    reference_number?: string;
  }[];
}

export interface BulkUtilityChargeResponse {
  status: string;
  charges_created: number;
  errors: any[];
  charges: UtilityCharge[];
}

export interface AddToInvoiceRequest {
  invoice_id: number;
}

export interface BulkBillRequest {
  billing_period_id: number;
  utility_charge_ids?: number[];
}