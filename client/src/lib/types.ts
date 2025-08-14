export type Department = {
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

export type Service = {
    service_id: string;
    name: string;
    description: string;
    department_id: number;
    category: string;
    estimated_total_completion_time: string;
    created_at: string;
    updated_at: string;
    department: Department;
};

export type ServiceAvailability = {
    availability_id: string;
    service_id: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    duration_minutes: number;
    created_at: string;
    updated_at: string;
};

export type DocumentSubmitted = {
    name: string;
    file_url: string;
    document_id: string;
    uploaded_at: string;
    verification_status?: string;
};

export type ReminderSent = {
    reminder_id: string;
    reminder_time: string;
};

export type Appointment = {
    appointment_id: string;
    service_id: string;
    availability_id: string;
    full_name: string;
    nic: string;
    phone_number: string;
    address: string;
    birth_date: string;
    gender: string;
    email: string;
    appointment_time: string;
    appointment_status: string;
    notes: string;
    documents_submitted: DocumentSubmitted[];
    reminders_sent: ReminderSent[] | null;
    created_at: string;
    updated_at: string;
    service: Service;
    availability: ServiceAvailability;
};