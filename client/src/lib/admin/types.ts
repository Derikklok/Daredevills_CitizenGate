export interface Service {
  service_id: string;
  name: string;
  description: string;
  department_id: number;
  category: string;
  estimated_total_completion_time: string;
  created_at: string;
  updated_at: string;
}

export interface Department {
  department_id: number;
  name: string;
  description: string | null;
  address: string;
  contact_email: string;
  contact_phone: string;
  clerk_org_id: string;
  created_at: string;
  updated_at: string;
  services: Service[];
}

export interface CreateDepartmentDto {
  name: string;
  description?: string | null;
  address: string;
  contact_email: string;
  contact_phone: string;
  // clerk_org_id is generated automatically on the server side
}

export interface UpdateDepartmentDto {
  name?: string;
  description?: string | null;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  clerk_org_id: string; // Required for updates as shown in the API example
}
