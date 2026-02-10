// types/units.ts

export interface Unit {
  id: number;
  property: number;
  property_name: string;
  name: string;
  abbreviated_name: string;
  unit_number: string;
  unit_type: string;
  unit_type_display: string;
  description: string;
  monthly_rent: string;
  deposit_amount: string;
  occupied_status: "Occupied" | "Vacant" | "Maintenance" | "Closed";
  created_at: string;
  updated_at: string;
}

export interface UnitListItem {
  id: number;
  name: string;
  abbreviated_name: string;
  property_name: string;
  unit_type: string;
  unit_type_display: string;
  monthly_rent: string;
  occupied_status: "Occupied" | "Vacant" | "Maintenance" | "Closed";
  created_at: string;

}

export interface UnitCreateRequest {
  property: number;
  name: string;
  abbreviated_name: string;
  unit_number: string;
  unit_type: string;
  description: string;
  monthly_rent: string;
  deposit_amount: string;
  occupied_status: "Occupied" | "Vacant" | "Maintenance" | "Closed";
}

export interface UnitUpdateRequest {
  property?: number;
  name?: string;
  abbreviated_name?: string;
  unit_number?: string;
  unit_type?: string;
  description?: string;
  monthly_rent?: string;
  deposit_amount?: string;
  occupied_status: "Occupied" | "Vacant" | "Maintenance" | "Closed";
}

export interface UnitCreateResponse {
  property: number;
  name: string;
  abbreviated_name: string;
  unit_number: string;
  unit_type: string;
  description: string;
  monthly_rent: string;
  deposit_amount: string;
  occupied_status: "Occupied" | "Available" | "Maintenance";
}

export interface UnitListResponse {
  results: UnitListItem[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface AvailableUnitsResponse {
  total_available: number;
  available_units: UnitListItem[];
}

// Unit type choices from backend
export const UNIT_TYPES = [
  { value: "1B", label: "1 Bedroom" },
  { value: "2B", label: "2 Bedroom" },
  { value: "3B", label: "3 Bedroom" },
  { value: "ST", label: "Studio" },
  { value: "BS", label: "Bedsitter" },
  { value: "SH", label: "Single Room" },
  { value: "OT", label: "Other" },
] as const;

// Status choices from backend
export const OCCUPIED_STATUS = [
  { value: "Occupied", label: "Occupied" },
  { value: "Vacant", label: "Vacant" },
  { value: "Maintenance", label: "Maintenance" },
  { value: "Closed", label: "Closed" },
  { value: "Available", label: "Available" },
] as const;

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}
