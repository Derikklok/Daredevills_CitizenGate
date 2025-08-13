# Required Documents API Documentation

This module handles required documents for government services. Each government service can have multiple required documents that citizens need to prepare before availing the service.

## Entity Structure

```typescript
{
  document_id: string;      // UUID primary key
  service_id: string;       // Reference to the government service
  name: string;             // Name of the required document
  description: string;      // Optional description
  is_mandatory: boolean;    // Whether this document is mandatory or optional
  created_at: Date;         // Creation timestamp
  updated_at: Date;         // Last update timestamp
}
```

## API Endpoints

### Create a Required Document

- **URL**: `/required-documents`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "service_id": "uuid-of-government-service",
    "name": "Passport",
    "description": "Valid passport with at least 6 months validity",
    "is_mandatory": true
  }
  ```
- **Response**: The created document object

### Create Multiple Required Documents

- **URL**: `/required-documents/batch`
- **Method**: `POST`
- **Request Body**:
  ```json
  [
    {
      "service_id": "uuid-of-government-service",
      "name": "Passport",
      "description": "Valid passport with at least 6 months validity",
      "is_mandatory": true
    },
    {
      "service_id": "uuid-of-government-service",
      "name": "ID Card",
      "description": "National ID card",
      "is_mandatory": true
    }
  ]
  ```
- **Response**: Array of created document objects

### Get All Required Documents

- **URL**: `/required-documents`
- **Method**: `GET`
- **Response**: Array of all document objects with their related service information

### Get Required Documents by Service

- **URL**: `/required-documents?service_id=uuid-of-government-service`
- **Method**: `GET`
- **Response**: Array of document objects for the specified service

### Alternative Endpoint for Service Documents

- **URL**: `/required-documents/service/:serviceId`
- **Method**: `GET`
- **Response**: Array of document objects for the specified service

### Get a Specific Document

- **URL**: `/required-documents/:id`
- **Method**: `GET`
- **Response**: The document object with the specified ID

### Update a Document

- **URL**: `/required-documents/:id`
- **Method**: `PUT`
- **Request Body**:
  ```json
  {
    "name": "Updated Document Name",
    "description": "Updated description",
    "is_mandatory": false
  }
  ```
- **Response**: The updated document object

### Delete a Document

- **URL**: `/required-documents/:id`
- **Method**: `DELETE`
- **Response**: No content

## Example Usage

### Adding Required Documents to a Service

```typescript
// Example: Adding multiple required documents for a passport application service
const requiredDocs = [
  {
    service_id: "passport-service-uuid",
    name: "Birth Certificate",
    description: "Original birth certificate",
    is_mandatory: true
  },
  {
    service_id: "passport-service-uuid",
    name: "Proof of Address",
    description: "Utility bill or bank statement from last 3 months",
    is_mandatory: true
  },
  {
    service_id: "passport-service-uuid",
    name: "Previous Passport",
    description: "If this is a renewal application",
    is_mandatory: false
  }
];

// Send POST request to /required-documents/batch
```

### Fetching Documents for a Service

```typescript
// Get all documents required for a passport application
const serviceId = "passport-service-uuid";
// Send GET request to /required-documents?service_id=passport-service-uuid
```

## Integration with Client

The client application should fetch required documents when displaying service details to inform users about what documents they need to prepare before booking an appointment for a service.
