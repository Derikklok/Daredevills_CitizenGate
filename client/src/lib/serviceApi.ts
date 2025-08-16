import type { GovernmentService } from "./types";
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
