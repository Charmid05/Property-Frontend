export interface Office {
  id: number;
  name: string;
  address: string;
  email: string;
}

export interface Manager {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  full_name: string;
}
export interface Property {
  id: number;
  name: string;
  address: string;
  description?: string;
  office: Office;
  manager: Manager;
  picture?: string;
  picture_url?: string;
  is_active: boolean;
  total_units: number;
  occupied_units_count: number;
  vacancy_rate: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyListItem {
  id: number;
  name: string;
  address: string;
  is_active: boolean;

  total_units: number;
  occupied_units_count: number;
  vacancy_rate: string;

  manager_name?: string | null;

  created_at: string;
  updated_at: string;
}

export interface PropertyCreateRequest {
  name: string;
  address: string;
  description?: string;
  office: number;
  manager: number;
  picture?: File;
  is_active: boolean;
}

export interface PropertyUpdateRequest {
  name?: string;
  address?: string;
  description?: string;
  office?: number;
  manager?: number;
  picture?: File;
  is_active?: boolean;
}

export interface PropertyListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PropertyListItem[];
  page: number;
}

// types/property.ts (or wherever you keep types)
export interface AssignManagerRequest {
  property_ids: number[];
  manager: number; // property manager user ID
}

export interface AssignManagerResponse {
  message: string;
  manager_id: number;
  properties_updated: number;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: Record<string, any>;
}
