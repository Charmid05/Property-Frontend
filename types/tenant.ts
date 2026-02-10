// Tenant status enum matching Django choices
export type TenantStatus =
  | "active"
  | "inactive"
  | "pending"
  | "suspended"
  | "moved_out";

// User role enum
export type UserRole = "admin" | "property_manager" | "landlord" | "tenant";

// Gender enum
export type Gender = "M" | "F" | "";

// Base tenant interface for list views
export interface TenantListItem {
  id: number;
  user_name: string;
  unit_number: string;
  property_name: string;
  status: TenantStatus;
  monthly_rent?: number; // Made optional since it's missing in some responses
  lease_start_date: string;
  lease_end_date: string | null;
  days_until_lease_expires: number | null;
}

// Unit details interface for nested data
export interface UnitDetails {
  unit_number: string;
  property_name: string;
  unit_type: string;
}

// User details interface for nested data
export interface UserDetails {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: UserRole;
}

// Full tenant interface for detail views
export interface Tenant {
  id: number;
  user: number;
  user_details: UserDetails; // Updated to use UserDetails interface
  unit: number;
  unit_details: UnitDetails;
  status: TenantStatus;
  monthly_rent_override: string | null;
  deposit_amount_override: string | null;
  extra_fees: number[];
  lease_start_date: string;
  lease_end_date: string | null;
  move_in_date: string | null;
  move_out_date: string | null;
  notes: string;
  monthly_rent: number;
  deposit_amount: number;
  total_monthly_charges: number;
  days_until_lease_expires: number | null;
  is_lease_expired: boolean;
  created_at: string;
  updated_at: string;
}

// Request interface for creating tenant with new user
export interface TenantCreateRequest {
  // User creation fields (required for new tenant creation)
  username: string;
  email: string;
  password: string;
  password2: string;
  role?: UserRole;
  first_name: string;
  last_name: string;
  phone_number?: string;
  gender?: Gender;
  send_welcome_email?: boolean;

  // Tenant fields
  unit: number;
  status: TenantStatus;
  monthly_rent_override?: string | null;
  deposit_amount_override?: string | null;
  extra_fees?: number[];
  lease_start_date: string;
  lease_end_date?: string | null;
  move_in_date?: string | null;
  move_out_date?: string | null;
  notes?: string;
}

// Request interface for updating existing tenant (no user fields)
export interface TenantUpdateRequest {
  unit?: number;
  status?: TenantStatus;
  monthly_rent_override?: string | null;
  deposit_amount_override?: string | null;
  extra_fees?: number[];
  lease_start_date?: string;
  lease_end_date?: string | null;
  move_in_date?: string | null;
  move_out_date?: string | null;
  notes?: string;
}

// Interface for updating user information separately
export interface TenantUserUpdateRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
}

// Interface for password reset
export interface TenantPasswordResetRequest {
  new_password: string;
  send_notification?: boolean;
}

// Dashboard interfaces
export interface TenantDashboardStats {
  total_tenants: number;
  active_tenants: number;
  pending_tenants: number;
  expiring_leases: number;
  recent_tenants: number;
}

export interface TenantDashboard {
  stats: TenantDashboardStats;
  expiring_leases: TenantListItem[];
  recent_tenants: TenantListItem[];
}

// Response interfaces
export interface TenantListResponse {
  results: TenantListItem[];
  count?: number;
}

export interface ExpiringLeasesResponse {
  count: number;
  results: TenantListItem[];
}

export interface TenantsByPropertyResponse {
  property_id: string;
  count: number;
  results: TenantListItem[];
}

// Status update interface
export interface TenantStatusUpdate {
  status: TenantStatus;
}

// API Error interface
export interface ApiError {
  message: string;
  details?: Record<string, string[]>;
}

// Validation error interface for form handling
export interface ValidationError {
  [key: string]: string[];
}
