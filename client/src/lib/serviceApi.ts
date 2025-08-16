import type { GovernmentService, Department } from "./types";
import { getNormalizedApiUrl } from "./apiUtils";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const normalizedApiUrl = getNormalizedApiUrl(API_URL);

/**
 * Fetch all government services
 */
export async function fetchGovernmentServices(token?: string): Promise<GovernmentService[]> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${normalizedApiUrl}/api/government-services`, {
        method: 'GET',
        headers
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch government services: ${response.status} ${errorText}`);
    }

    return response.json();
}

/**
 * Fetch government services by department ID
 */
export async function fetchDepartmentServices(departmentId: number | string, token?: string): Promise<GovernmentService[]> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${normalizedApiUrl}/api/government-services?department_id=${departmentId}`, {
        method: 'GET',
        headers
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch department services: ${response.status} ${errorText}`);
    }

    return response.json();
}

/**
 * Fetch appointments for a specific department (Admin only)
 */
export async function fetchDepartmentAppointments(departmentId: number | string, token?: string): Promise<any[]> {
    if (!token) {
        throw new Error('Authentication token is required');
    }

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    const params = new URLSearchParams();
    params.append('department_id', departmentId.toString());

    const response = await fetch(`${normalizedApiUrl}/api/appointments/admin?${params.toString()}`, {
        method: 'GET',
        headers
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch department appointments: ${response.status} ${errorText}`);
    }

    return response.json();
}

/**
 * Fetch all appointments for the current organization (Admin only)
 */
export async function fetchOrganizationAppointments(
    token: string,
    filters?: {
        status?: string;
        date?: string;
        service_id?: string;
        department_id?: number;
    }
): Promise<any[]> {
    if (!token) {
        throw new Error('Authentication token is required');
    }

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    const params = new URLSearchParams();

    // Add filters to query parameters
    if (filters?.status) params.append('status', filters.status);
    if (filters?.date) params.append('date', filters.date);
    if (filters?.service_id) params.append('service_id', filters.service_id);
    if (filters?.department_id) params.append('department_id', filters.department_id.toString());

    const queryString = params.toString();
    const url = `${normalizedApiUrl}/api/appointments/organization${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
        method: 'GET',
        headers
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch organization appointments: ${response.status} ${errorText}`);
    }

    return response.json();
}

/**
 * Update a government service
 */
export async function updateGovernmentService(
    serviceId: string,
    serviceData: Partial<GovernmentService>,
    token: string
): Promise<GovernmentService> {
    if (!token) {
        throw new Error('Authentication token is required');
    }

    const response = await fetch(`${normalizedApiUrl}/api/government-services/${serviceId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(serviceData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update government service: ${response.status} ${errorText}`);
    }

    return response.json();
}

/**
 * Create a new government service
 */
export async function createGovernmentService(
    serviceData: Omit<GovernmentService, 'service_id' | 'created_at' | 'updated_at'>,
    token: string
): Promise<GovernmentService> {
    if (!token) {
        throw new Error('Authentication token is required');
    }

    const response = await fetch(`${normalizedApiUrl}/api/government-services`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(serviceData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create government service: ${response.status} ${errorText}`);
    }

    return response.json();
}

/**
 * Delete a government service
 */
export async function deleteGovernmentService(serviceId: string, token: string): Promise<void> {
    if (!token) {
        throw new Error('Authentication token is required');
    }

    const response = await fetch(`${normalizedApiUrl}/api/government-services/${serviceId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete government service: ${response.status} ${errorText}`);
    }
}

/**
 * Get department by Clerk organization ID
 */
export async function getDepartmentByOrgId(orgId: string, token?: string): Promise<Department> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        // Get all departments
        const response = await fetch(`${normalizedApiUrl}/api/departments`, {
            method: 'GET',
            headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch departments: ${response.status} ${errorText}`);
        }

        const departments: Department[] = await response.json();
        console.log(`Found ${departments.length} departments, searching for one with clerk_org_id: ${orgId}`);
        
        // Log department IDs and org IDs for debugging
        departments.forEach(dept => {
            console.log(`Department: ${dept.name}, ID: ${dept.department_id}, Clerk Org ID: ${dept.clerk_org_id}`);
        });
        
        // Find the department with the matching clerk_org_id
        const department = departments.find(dept => dept.clerk_org_id === orgId);
        
        if (!department) {
            throw new Error(`Department not found for organization ID: ${orgId}`);
        }
        
        return department;
    } catch (error) {
        console.error('Error fetching department by organization ID:', error);
        throw error;
    }
}
