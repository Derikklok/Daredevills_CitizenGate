// API service for fetching data from backend
const API_BASE_URL = 'http://localhost:3000/api';

export interface ServiceAvailability {
  availability_id: string;
  service_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  created_at: string;
  updated_at: string;
  service: {
    service_id: string;
    name: string;
    description: string;
    department_id: number;
    category: string;
    estimated_total_completion_time: string;
    created_at: string;
    updated_at: string;
    department: {
      department_id: number;
      name: string;
      description: string | null;
      address: string;
      contact_email: string;
      contact_phone: string;
      clerk_org_id: string;
      created_at: string;
      updated_at: string;
    };
  };
}

export interface Service {
  service_id: string;
  name: string;
  description: string;
  department_id: number;
  category: string;
  estimated_total_completion_time: string;
  created_at: string;
  updated_at: string;
  department?: {
    department_id: number;
    name: string;
    description: string | null;
    address: string;
    contact_email: string;
    contact_phone: string;
  };
}

export interface Department {
  department_id: number;
  name: string;
  description: string | null;
  address: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  clerk_org_id: string | null;
  created_at: string;
  updated_at: string;
  services: Service[];
}

export const ApiService = {
  // Get all government services
  getServices: async (): Promise<Service[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/government-services`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },
  
  // Get all departments with their services
  getDepartments: async (): Promise<Department[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/departments`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch departments: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },
  
  // Get service availability by service ID
  getServiceAvailability: async (serviceId: string): Promise<ServiceAvailability[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/service-availability/service/${serviceId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch availability: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching service availability:', error);
      throw error;
    }
  }
};

export default ApiService;
