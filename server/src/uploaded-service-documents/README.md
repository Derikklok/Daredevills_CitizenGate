# Uploaded Service Documents Module

This module handles file upload functionality for service documents in the CitizenGate application. It provides endpoints for uploading files to Supabase S3 storage, managing document metadata in the database, and retrieving files by user and appointment.

## Features

- **File Upload**: Upload documents via multipart/form-data
- **Supabase S3 Storage**: Files are stored in Supabase S3 bucket
- **Security**: Users can only access their own documents
- **File Management**: Download, delete, and get file URLs
- **Organized Storage**: Files are organized by userId/appointmentId/documents structure
- **File Validation**: 10MB size limit and type validation (jpg, jpeg, png, gif, pdf, doc, docx, txt, zip, rar)

## Environment Variables Required

Add these to your `.env` file:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
SUPABASE_BUCKET_NAME=your_storage_bucket_name
```

## API Endpoints

### Upload Document

- **POST** `/api/uploaded-service-documents/upload`
- **Content-Type**: `multipart/form-data`
- **Form Fields**:
  - `file`: The file to upload (binary)
  - `serviceId`: ID of the government service (UUID)
  - `requiredDocumentId`: ID of the required document type (UUID)
  - `appointmentId`: ID of the appointment (UUID)

### Upload Multiple Documents

- **POST** `/api/uploaded-service-documents/upload-multiple`
- **Content-Type**: `multipart/form-data`
- **Form Fields**:
  - `files`: Multiple files to upload (up to 10 files)
  - `serviceId`: ID of the government service (UUID)
  - `requiredDocumentIds`: Comma-separated list of required document IDs
  - `appointmentId`: ID of the appointment (UUID)

### Get User Documents

- **GET** `/api/uploaded-service-documents`
- Returns all documents for the authenticated user

### Get Appointment Documents

- **GET** `/api/uploaded-service-documents/appointment/:appointmentId`
- Returns all documents for a specific appointment

### Get Service Documents

- **GET** `/api/uploaded-service-documents/service/:serviceId`
- Returns all documents for a specific service (filtered by user)

### Get Document Details

- **GET** `/api/uploaded-service-documents/:id`
- Returns document metadata

### Get Document URL

- **GET** `/api/uploaded-service-documents/:id/url`
- Returns public URL for the document

### Download Document

- **GET** `/api/uploaded-service-documents/:id/download`
- Downloads the document file

### Delete Document

- **DELETE** `/api/uploaded-service-documents/:id`
- Deletes a document from both storage and database

### Delete Appointment Documents

- **DELETE** `/api/uploaded-service-documents/appointment/:appointmentId`
- Deletes all documents for an appointment

## Usage Examples

### Single File Upload

```typescript
// Frontend example using FormData
const formData = new FormData();
formData.append("file", selectedFile); // File object from input
formData.append("serviceId", "f5e2a7c6-9e13-4fcb-8b89-8f1c6f9d2e30");
formData.append("requiredDocumentId", "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6");
formData.append("appointmentId", "b2c3d4e5-6f7g-8h9i-0j1k-l2m3n4o5p6q7");

const response = await fetch("/api/uploaded-service-documents/upload", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${clerkToken}`,
  },
  body: formData,
});

const result = await response.json();
console.log("Uploaded document:", result);
```

### Multiple Files Upload

```typescript
// Frontend example for multiple files
const formData = new FormData();

// Add multiple files
files.forEach((file) => {
  formData.append("files", file);
});

formData.append("serviceId", "f5e2a7c6-9e13-4fcb-8b89-8f1c6f9d2e30");
formData.append("requiredDocumentIds", "doc1-uuid,doc2-uuid,doc3-uuid");
formData.append("appointmentId", "b2c3d4e5-6f7g-8h9i-0j1k-l2m3n4o5p6q7");

const response = await fetch(
  "/api/uploaded-service-documents/upload-multiple",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clerkToken}`,
    },
    body: formData,
  }
);

const result = await response.json();
console.log(`Uploaded ${result.uploadedCount} documents`);
```

### HTML Form Example

```html
<form
  action="/api/uploaded-service-documents/upload"
  method="post"
  enctype="multipart/form-data"
>
  <input
    type="file"
    name="file"
    required
    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
  />
  <input type="hidden" name="serviceId" value="your-service-id" />
  <input type="hidden" name="requiredDocumentId" value="your-required-doc-id" />
  <input type="hidden" name="appointmentId" value="your-appointment-id" />
  <button type="submit">Upload Document</button>
</form>
```

## File Storage Structure

Files are stored in Supabase S3 with the following structure:

```
bucket/
├── userId1/
│   ├── appointmentId1/
│   │   └── documents/
│   │       ├── uuid1.pdf
│   │       └── uuid2.jpg
│   └── appointmentId2/
│       └── documents/
│           └── uuid3.docx
└── userId2/
    └── appointmentId3/
        └── documents/
            └── uuid4.png
```

## Security

- All endpoints require authentication (ClerkAuthGuard)
- Users can only access their own documents
- File type and size validation
- Secure S3 storage with Supabase

## Database Schema

The `UploadedServiceDocuments` entity includes:

- `id`: Unique identifier
- `s3Key`: Storage key in S3
- `fileName`: Original file name
- `fileType`: MIME type
- `serviceId`: Related government service
- `requiredDocumentId`: Related required document type
- `userId`: Owner of the document
- `appointmentId`: Related appointment
- `createdAt`: Upload timestamp
- `updatedAt`: Last update timestamp
