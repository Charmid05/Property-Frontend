export interface MaintenanceRequest {
  id: number;
  tenant: number;
  tenant_name?: string;
  unit: number;
  unit_number?: string;
  property: number;
  property_name?: string;
  title: string;
  description: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'pest_control' | 'cleaning' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  reported_date: string;
  scheduled_date?: string;
  completed_date?: string;
  assigned_to?: number;
  assigned_to_name?: string;
  estimated_cost?: string;
  actual_cost?: string;
  notes?: string;
  tenant_notes?: string;
  images?: string[];
  created_at: string;
  updated_at: string;
}

export interface MaintenanceRequestCreateRequest {
  unit?: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  tenant_notes?: string;
  images?: string[];
}

export interface MaintenanceRequestUpdateRequest {
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
  status?: string;
  scheduled_date?: string;
  assigned_to?: number;
  estimated_cost?: string;
  actual_cost?: string;
  notes?: string;
  tenant_notes?: string;
}

export interface MaintenanceStats {
  total_requests: number;
  pending: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  average_completion_time?: number;
}

