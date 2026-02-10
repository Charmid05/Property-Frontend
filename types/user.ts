// types/api.ts
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  phone_number: string | null;
  gender: string;
  identity_number: string | null;
  emergency_contact_number: string | null;
  profile: string;
  user_status: string;
  email_verified: boolean;
  password_change_required: boolean;
  date_joined: string;
  created_by_info: any;
  is_active: boolean;
  tenant_info: any;
  tenant_count: number | null;
  created_by_name: string | null;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: "admin" | "landlord";
}

export interface RegisterResponse {
  access?: string;
  refresh?: string;
  user?: any;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export interface DecodedToken {
  exp: number;
  iat: number;
  [key: string]: any;
}
export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  message: string;
  user?: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    role: "admin" | "tenant" | "property_manager";
    phone_number: string | null;
    gender: string;
    identity_number: string | null;
    emergency_contact_number: string | null;
    profile: string;
    user_status: string;
    email_verified: boolean;
    password_change_required: boolean;
    date_joined: string;
    created_by_info: any;
    tenant_info: any;
  };
  tokens?: { access: string; refresh: string };
  isAuthenticated?: boolean;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface UserListResponse {
  results: User[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

export interface UserCreateRequest {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
  phone_number?: string;
  password: string;
}

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  phone_number?: string;
  is_active?: boolean;
  user_status?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
