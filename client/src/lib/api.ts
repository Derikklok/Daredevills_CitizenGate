import type {
    CreateDraftAppointmentRequest,
    DraftAppointmentResponse,
    CompleteAppointmentRequest,
    UploadDocumentRequest,
    Department,
    Service,
    RequiredDocument,
} from "./types";
import { getNormalizedApiUrl } from "./apiUtils";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const normalizedApiUrl = getNormalizedApiUrl(API_URL);

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
        `${normalizedApiUrl}/api/appointments/draft`,
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
        `${normalizedApiUrl}/api/appointments/${appointmentId}/update-service`,
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
        `${normalizedApiUrl}/api/appointments/${appointmentId}/complete`,
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
        `${normalizedApiUrl}/api/uploaded-service-documents/upload`,
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
        const response = await fetch(`${normalizedApiUrl}/api/appointments/${appointmentId}`, {
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
        `${normalizedApiUrl}/api/uploaded-service-documents/appointment/${appointmentId}`,
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
 * Get user's own appointments
 */
export async function getUserAppointments(
    token: string,
    filters?: { status?: string; date?: string }
): Promise<any[]> {
    if (!token) {
        throw new Error('Authentication token is required');
    }

    let url = `${normalizedApiUrl}/api/appointments/my`;

    // Add query parameters if filters are provided
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.date) params.append('date', filters.date);

    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch user appointments: ${response.status} ${errorText}`);
    }

    return response.json();
}

/**
 * Get organization appointments (Admin only)
 */
export async function getOrganizationAppointments(
    token: string,
    filters?: {
        department_id?: number;
        service_id?: string;
        nic?: string;
        status?: string;
        date?: string;
        username?: string;
    }
): Promise<any[]> {
    if (!token) {
        throw new Error('Authentication token is required');
    }

    let url = `${normalizedApiUrl}/api/appointments/admin`;

    // Add query parameters if filters are provided
    const params = new URLSearchParams();
    if (filters?.department_id) params.append('department_id', filters.department_id.toString());
    if (filters?.service_id) params.append('service_id', filters.service_id);
    if (filters?.nic) params.append('nic', filters.nic);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.date) params.append('date', filters.date);
    if (filters?.username) params.append('username', filters.username);

    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch organization appointments: ${response.status} ${errorText}`);
    }

    return response.json();
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(
    appointmentId: string,
    token: string
): Promise<any> {
    if (!token) {
        throw new Error('Authentication token is required');
    }

    const response = await fetch(`${normalizedApiUrl}/api/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to cancel appointment: ${response.status} ${errorText}`);
    }

    return response.json();
}

/**
 * Update appointment status
 */
export async function updateAppointmentStatus(
    appointmentId: string,
    status: string,
    token: string
): Promise<any> {
    if (!token) {
        throw new Error('Authentication token is required');
    }

    const response = await fetch(`${normalizedApiUrl}/api/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update appointment status: ${response.status} ${errorText}`);
    }

    return response.json();
}

/**
 * Get service availability for a specific service
 */
export async function getServiceAvailability(
    serviceId: string,
    token: string
): Promise<any[]> {
    if (!token) {
        throw new Error('Authentication token is required');
    }

    const response = await fetch(
        `${normalizedApiUrl}/api/service-availability/service/${serviceId}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch service availability: ${response.status} ${errorText}`);
    }

    return response.json();
}

/**
 * Get available time slots for rescheduling (calculated client-side)
 */
export async function getAvailableTimeSlots(
    serviceId: string,
    date: string,
    token: string
): Promise<any[]> {
    try {
        const availabilities = await getServiceAvailability(serviceId, token);
        const selectedDate = new Date(date);
        const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

        // Filter availabilities for the selected day
        const dayAvailabilities = availabilities.filter(
            (availability) => availability.day_of_week === dayOfWeek
        );

        // Generate time slots for each availability
        const timeSlots: any[] = [];

        dayAvailabilities.forEach((availability) => {
            const startTime = availability.start_time;
            const endTime = availability.end_time;
            const duration = availability.duration_minutes;

            // Convert time strings to minutes
            const startMinutes = timeToMinutes(startTime);
            const endMinutes = timeToMinutes(endTime);

            // Generate slots
            for (let minutes = startMinutes; minutes < endMinutes; minutes += duration) {
                const slotStartTime = minutesToTime(minutes);
                const slotEndTime = minutesToTime(minutes + duration);

                timeSlots.push({
                    id: `${availability.availability_id}_${slotStartTime}`,
                    availability_id: availability.availability_id,
                    start_time: slotStartTime,
                    end_time: slotEndTime,
                    available: true, // In a real app, this would check against existing bookings
                });
            }
        });

        return timeSlots;
    } catch (error) {
        console.error('Error generating time slots:', error);
        throw error;
    }
}

// Helper functions
function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Reschedule an appointment
 */
export async function rescheduleAppointment(
    appointmentId: string,
    newDateTime: string,
    availabilityId: string,
    token: string
): Promise<any> {
    if (!token) {
        throw new Error('Authentication token is required');
    }

    const response = await fetch(`${normalizedApiUrl}/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            appointment_time: newDateTime,
            availability_id: availabilityId
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to reschedule appointment: ${response.status} ${errorText}`);
    }

    return response.json();
}

/**
 * Get all departments with their services
 */
export async function getDepartments(): Promise<Department[]> {
    try {
        const response = await fetch(`${normalizedApiUrl}/api/departments`);

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
        const response = await fetch(`${normalizedApiUrl}/api/departments/${id}`);

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
        const response = await fetch(`${normalizedApiUrl}/api/government-services`);

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
 * Get required documents for a specific service
 */
export async function getRequiredDocuments(serviceId: string): Promise<RequiredDocument[]> {
    try {
        const response = await fetch(`${normalizedApiUrl}/api/required-documents/service/${serviceId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch required documents: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching required documents:', error);
        throw error;
    }
}