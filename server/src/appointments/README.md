# Appointments API Documentation

This module handles appointments for government services. Users can book appointments for specific services during available time slots.

## Entity Structure

```typescript
{
  appointment_id: string;       // UUID primary key
  service_id: string;           // Reference to the government service
  availability_id: string;      // Reference to the service availability
  full_name: string;            // Full name of the citizen
  nic: string;                  // National Identity Card number
  phone_number: string;         // Contact phone number
  address: string;              // Address (optional)
  birth_date: Date;             // Date of birth
  gender: string;               // Gender
  email: string;                // Email address (optional)
  appointment_time: Date;       // Specific time of the appointment
  appointment_status: string;   // Status: pending, confirmed, completed, cancelled
  notes: string;                // Additional notes (optional)
  documents_submitted: object;  // Tracking for required documents (optional)
  created_at: Date;             // Creation timestamp
  updated_at: Date;             // Last update timestamp
}
```

## API Endpoints

### Create an Appointment

- **URL**: `/appointments`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "service_id": "uuid-of-government-service",
    "availability_id": "uuid-of-service-availability",
    "full_name": "John Doe",
    "nic": "123456789V",
    "phone_number": "+94 77 123 4567",
    "address": "123 Main St, Colombo",
    "birth_date": "1990-01-01",
    "gender": "Male",
    "email": "john@example.com",
    "appointment_time": "2025-08-20T10:30:00Z",
    "notes": "First-time application"
  }
  ```
- **Response**: The created appointment object
- **Error Responses**:
  - `400 Bad Request` - If the appointment time is outside the available time slot
  - `400 Bad Request` - If the selected availability does not belong to the selected service
  - `404 Not Found` - If the service or availability does not exist

### Get All Appointments

- **URL**: `/appointments`
- **Method**: `GET`
- **Query Parameters**:
  - `department_id` - Filter by department ID
  - `service_id` - Filter by service ID
  - `nic` - Filter by citizen's National ID Card number
  - `status` - Filter by appointment status
  - `date` - Filter by appointment date (YYYY-MM-DD)
- **Response**: Array of appointment objects with their related service and department information

### Get Appointments by NIC

- **URL**: `/appointments/by-nic/:nic`
- **Method**: `GET`
- **Response**: Array of appointment objects for the specified NIC, ordered by appointment time (descending)

### Get a Specific Appointment

- **URL**: `/appointments/:id`
- **Method**: `GET`
- **Response**: The appointment object with the specified ID

### Update an Appointment

- **URL**: `/appointments/:id`
- **Method**: `PUT`
- **Request Body**: Same as create, but all fields are optional
- **Response**: The updated appointment object

### Update Appointment Status

- **URL**: `/appointments/:id/status`
- **Method**: `PUT`
- **Request Body**:
  ```json
  {
    "status": "confirmed"
  }
  ```
- **Response**: The updated appointment object
- **Valid Status Values**: `pending`, `confirmed`, `completed`, `cancelled`

### Delete an Appointment

- **URL**: `/appointments/:id`
- **Method**: `DELETE`
- **Response**: No content

## Integration with Client

The client application should:

1. Allow users to select a department and service
2. Display available time slots for the selected service
3. Let users fill in their personal details
4. Submit the appointment booking
5. Provide a way to check appointment status using NIC

## Business Rules

1. Appointments can only be booked within available time slots
2. A service availability must belong to the selected service
3. Initial appointment status is set to "pending" by default
4. Users can track their appointments using their NIC
5. Appointments can be filtered by various criteria for administrative purposes
