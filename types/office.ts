export interface OfficeManager {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

export interface Office {
  id: number;
  name: string;
  manager: OfficeManager;
  description: string;
  address: string;
  contact_number: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface OfficeCreateRequest {
  name: string;
  manager: number;
  description: string;
  address: string;
  contact_number: string;
  email: string;
}

export interface OfficeUpdateRequest {
  name?: string;
  manager?: number;
  description?: string;
  address?: string;
  contact_number?: string;
  email?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: Record<string, any>;
}
