import type { CreateDraftAppointmentRequest, DraftAppointmentResponse, CompleteAppointmentRequest, UploadDocumentRequest, Department, Service, ServiceAvailability, RequiredDocument } from "./types";

/**
 * Create a draft appointment (Step 1 of booking process)
 */
export async function createDraftAppointment(
    request: CreateDraftAppointmentRequest,
    token: string
): Promise<DraftAppointmentResponse> {
    if (!token) {
        throw new Error('Authentication token is required');
    }

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/appointments/draft`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(request)
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create draft appointment: ${response.status} ${errorText}`);
    }

    return response.json();
}

/**
 * Update a draft appointment with service and availability (Step 1.5 of booking process)
 */
export async function updateDraftWithService(
    appointmentId: string,
    serviceId: string,
    availabilityId: string,
    appointmentTime: string,
    token: string
): Promise<any> {
    if (!token) {
        throw new Error('Authentication token is required');
    }

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/appointments/${appointmentId}/update-service`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                service_id: serviceId,
                availability_id: availabilityId,
                appointment_time: appointmentTime
            })
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update draft appointment: ${response.status} ${errorText}`);
    }

    return response.json();
}

/**
 * Complete a draft appointment (Step 3 of booking process)
 */
export async function completeAppointment(
    appointmentId: string,
    request: CompleteAppointmentRequest,
    token: string
): Promise<any> {
    if (!token) {
        throw new Error('Authentication token is required');
    }

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/appointments/${appointmentId}/complete`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(request)
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to complete appointment: ${response.status} ${errorText}`);
    }

    return response.json();
}

/**
 * Upload a document (Step 2 of booking process)
 */
export async function uploadDocument(
    request: UploadDocumentRequest,
    token: string
): Promise<any> {
    if (!token) {
        throw new Error('Authentication token is required');
    }

    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('serviceId', request.serviceId);
    formData.append('requiredDocumentId', request.requiredDocumentId);
    formData.append('appointmentId', request.appointmentId);

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/uploaded-service-documents/upload`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload document: ${response.status} ${errorText}`);
    }

    return response.json();
}

/**
 * Get appointment details
 */
export async function getAppointment(
    appointmentId: string,
    token: string
): Promise<any> {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments/${appointmentId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch appointment: ${response.status} ${errorText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching appointment:', error);
        throw error;
    }
}

/**
 * Get documents for an appointment
 */
export async function getAppointmentDocuments(
    appointmentId: string,
    token: string
): Promise<any[]> {
    if (!token) {
        throw new Error('Authentication token is required');
    }

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/uploaded-service-documents/appointment/${appointmentId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get documents: ${response.status} ${errorText}`);
    }

    return response.json();
}

/**
 * Get all departments with their services
 */
export async function getDepartments(): Promise<Department[]> {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/departments`);

        if (!response.ok) {
            throw new Error(`Failed to fetch departments: ${response.status}`);
        }

        const departments: Department[] = await response.json();
        return departments;
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error;
    }
}

/**
 * Get a specific department by ID
 */
export async function getDepartment(id: number): Promise<Department> {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/departments/${id}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch department: ${response.status}`);
        }

        const department: Department = await response.json();
        return department;
    } catch (error) {
        console.error('Error fetching department:', error);
        throw error;
    }
}

/**
 * Get all services
 */
export async function getServices(): Promise<Service[]> {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/government-services`);

        if (!response.ok) {
            throw new Error(`Failed to fetch services: ${response.status}`);
        }

        const services: Service[] = await response.json();
        return services;
    } catch (error) {
        console.error('Error fetching services:', error);
        throw error;
    }
}

/**
 * Get service availability for a specific service
 */
export async function getServiceAvailability(serviceId: string): Promise<ServiceAvailability[]> {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/service-availability/service/${serviceId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch service availability: ${response.status}`);
        }

        const availability: ServiceAvailability[] = await response.json();
        return availability;
    } catch (error) {
        console.error('Error fetching service availability:', error);
        throw error;
    }
}

/**
 * Get required documents for a specific service
 */
export async function getRequiredDocuments(serviceId: string): Promise<RequiredDocument[]> {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/required-documents/service/${serviceId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch required documents: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching required documents:', error);
        throw error;
    }
}