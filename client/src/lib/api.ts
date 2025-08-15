import type { CreateDraftAppointmentRequest, DraftAppointmentResponse, CompleteAppointmentRequest, UploadDocumentRequest } from "./types";

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
                availability_id: availabilityId
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
