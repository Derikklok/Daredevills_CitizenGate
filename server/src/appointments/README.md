# Appointments API Documentation

This module handles appointments for government services. Users can book appointments for specific services during available time slots and ### Document Handling

### Structure of documents_submitted

Each appointment can have multiple documents uploaded. The `documents_submitted` field stores these as an array with the following structure:

```typescript
{
  document_id: string;        // Reference to the required document definition
  name: string;               // Name of the document
  file_url: string;           // URL to access the uploaded file
  uploaded_at: string;        // When the document was uploaded
  verification_status: string; // Status of document verification
}
```

### Uploading Documents

Documents can be uploaded in two ways:

1. **During appointment creation**: Include the `documents_submitted` array in the appointment creation request:
   ```json
   {
     // appointment details...
     "documents_submitted": [
       {
         "document_id": "uuid-of-required-document",
         "name": "Passport",
         "file_url": "https://storage.example.com/documents/passport.pdf"
       }
     ]
   }
   ```

2. **After appointment creation**: Use the document endpoints to add documents to an existing appointment:
   ```
   POST /appointments/:id/documents
   POST /appointments/:id/documents/batch
   ``` documents.

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
  username: string;             // Username of the logged-in user who created the appointment (optional)
  appointment_time: Date;       // Specific time of the appointment
  appointment_status: string;   // Status: pending, confirmed, completed, cancelled
  notes: string;                // Additional notes (optional)
  documents_submitted: {        // Array of uploaded document information
    document_id: string;        // ID of the required document
    name: string;               // Name of the document
    file_url: string;           // URL to the uploaded file
    uploaded_at: Date;          // When the document was uploaded
    verification_status?: string; // pending, verified, rejected
  }[];
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
    "username": "john_doe",
    "appointment_time": "2025-08-20T10:30:00Z",
    "notes": "First-time application",
    "documents_submitted": [
      {
        "document_id": "uuid-of-required-document",
        "name": "Passport",
        "file_url": "https://storage.example.com/documents/passport.pdf"
      },
      {
        "document_id": "uuid-of-another-document",
        "name": "Birth Certificate",
        "file_url": "https://storage.example.com/documents/birth-cert.jpg"
      }
    ]
  }
  ```
- **Response**: The created appointment object with document verification status automatically set to "pending"
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
  - `username` - Filter by username (creator of the appointment)
  - `status` - Filter by appointment status
  - `date` - Filter by appointment date (YYYY-MM-DD)
- **Response**: Array of appointment objects with their related service and department information

### Get Appointments by NIC

- **URL**: `/appointments/by-nic/:nic`
- **Method**: `GET`
- **Response**: Array of appointment objects for the specified NIC, ordered by appointment time (descending)

### Get Appointments by Username

- **URL**: `/appointments/by-username/:username`
- **Method**: `GET`
- **Response**: Array of appointment objects for the specified username, ordered by appointment time (descending)

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

### Upload Document

- **URL**: `/appointments/:id/documents`
- **Method**: `POST`
- **Request Body**: Multipart form data with file upload
  ```
  file: [binary file data]
  document_id: "uuid-of-required-document"
  name: "Passport"
  ```
- **Response**: The updated appointment object with the new document in documents_submitted array

### Get Documents for an Appointment

- **URL**: `/appointments/:id/documents`
- **Method**: `GET`
- **Response**: Array of document information for the specified appointment

### Update Document Verification Status

- **URL**: `/appointments/:id/documents/:documentId/verify`
- **Method**: `PUT`
- **Request Body**:
  ```json
  {
    "verification_status": "verified"
  }
  ```
- **Response**: The updated appointment object
- **Valid Status Values**: `pending`, `verified`, `rejected`

## Integration with Client

The client application should:

1. Allow users to select a department and service
2. Display available time slots for the selected service
3. Let users fill in their personal details
4. Provide a document upload interface for required documents
5. Submit the appointment booking with uploaded documents
6. Automatically include the current user's username in the appointment data
7. Provide a way to check appointment status and document verification status using NIC or username
8. Allow users to view their appointment history based on their username

## Business Rules

1. Appointments can only be booked within available time slots
2. A service availability must belong to the selected service
3. Initial appointment status is set to "pending" by default
4. Users can track their appointments using their NIC or username
5. Users must upload all required documents for their service
6. Document verification status starts as "pending" and can be updated by administrators
7. Appointments can be filtered by various criteria for administrative purposes
8. Document formats must match the accepted formats specified in the required document
9. The username field stores the identity of the logged-in user who created the appointment

## Document Handling

### Structure of documents_submitted

Each appointment can have multiple documents uploaded. The `documents_submitted` field stores these as an array with the following structure:

```typescript
{
  document_id: string;        // Reference to the required document definition
  name: string;               // Name of the document
  file_url: string;           // URL to access the uploaded file
  uploaded_at: string;        // When the document was uploaded
  verification_status: string; // Status of document verification
}
```

### Document Verification Flow

1. User uploads documents during appointment creation
2. Initial verification_status is set to "pending"
3. Administrator reviews documents and updates status to "verified" or "rejected"
4. If rejected, user may need to upload new documents
5. Appointment can only progress to "confirmed" status when all required documents are verified

### Document Storage

Documents are stored in a secure file storage system, and only URLs to these files are stored in the database. This ensures:

1. Security: Documents are not stored directly in the database
2. Scalability: Large files do not impact database performance
3. Access Control: Documents can only be accessed by authorized users

### File Format Validation

The system validates that uploaded files match the acceptable formats specified in the required document:

1. File extension check (e.g., .pdf, .jpg, .png)
2. MIME type validation
3. Size limits to prevent excessively large uploads
