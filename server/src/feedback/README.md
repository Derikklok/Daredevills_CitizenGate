# Feedback Service Documentation

This service provides an API for users to submit and retrieve feedback for government services.

## Overview

The Feedback Service allows users to:
- Submit ratings and comments for government services
- Retrieve all feedback entries
- Filter feedback by specific government service

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/feedback` | Submit new feedback for a government service |
| GET | `/feedback` | Retrieve all feedback entries |
| GET | `/feedback/service/:serviceId` | Retrieve all feedback for a specific government service |

## Data Model

### Feedback Entity

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier for feedback entry |
| serviceId | UUID | Reference to government service being rated |
| rating | Integer | Rating from 1-5 |
| description | Text | Optional feedback comment |
| createdAt | Timestamp | When the feedback was submitted |

## Sample Requests

### Submit New Feedback

```http
POST /feedback
Content-Type: application/json

{
  "serviceId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "rating": 5,
  "description": "Very efficient service, completed my passport renewal quickly."
}
```

#### Response
```json
{
  "id": "9b8f7e6d-5c4b-3a2d-1e0f-9d8c7b6a5f4e",
  "serviceId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "rating": 5,
  "description": "Very efficient service, completed my passport renewal quickly.",
  "createdAt": "2025-08-16T12:00:00.000Z",
  "service": {
    "service_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "Passport Renewal",
    "description": "Renew your passport at the nearest office.",
    "department_id": 1,
    "category": "Travel",
    "estimated_total_completion_time": "3-5 business days",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
}
```

### Get All Feedback

```http
GET /feedback
```

#### Response
```json
[
  {
    "id": "9b8f7e6d-5c4b-3a2d-1e0f-9d8c7b6a5f4e",
    "serviceId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "rating": 5,
    "description": "Very efficient service, completed my passport renewal quickly.",
    "createdAt": "2025-08-16T12:00:00.000Z",
    "service": {
      "service_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "Passport Renewal",
      "description": "Renew your passport at the nearest office.",
      "department_id": 1,
      "category": "Travel",
      "estimated_total_completion_time": "3-5 business days",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  },
  {
    "id": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    "serviceId": "7ea85f64-5717-4562-b3fc-2c963f66abe8",
    "rating": 4,
    "description": "Good service but there was a slight delay in processing.",
    "createdAt": "2025-08-15T10:30:00.000Z",
    "service": {
      "service_id": "7ea85f64-5717-4562-b3fc-2c963f66abe8",
      "name": "Driver's License Renewal",
      "description": "Renew your driver's license at the DMV.",
      "department_id": 2,
      "category": "Transportation",
      "estimated_total_completion_time": "1-2 business days",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  }
]
```

### Get Feedback for Specific Service

```http
GET /feedback/service/3fa85f64-5717-4562-b3fc-2c963f66afa6
```

#### Response
```json
[
  {
    "id": "9b8f7e6d-5c4b-3a2d-1e0f-9d8c7b6a5f4e",
    "serviceId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "rating": 5,
    "description": "Very efficient service, completed my passport renewal quickly.",
    "createdAt": "2025-08-16T12:00:00.000Z",
    "service": {
      "service_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "Passport Renewal",
      "description": "Renew your passport at the nearest office.",
      "department_id": 1,
      "category": "Travel",
      "estimated_total_completion_time": "3-5 business days",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  },
  {
    "id": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
    "serviceId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "rating": 3,
    "description": "The service was okay, but the waiting time was longer than expected.",
    "createdAt": "2025-08-14T14:45:00.000Z",
    "service": {
      "service_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "Passport Renewal",
      "description": "Renew your passport at the nearest office.",
      "department_id": 1,
      "category": "Travel",
      "estimated_total_completion_time": "3-5 business days",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  }
]
```

## Error Responses

### Service Not Found
```json
{
  "statusCode": 404,
  "message": "Service not found",
  "error": "Not Found"
}
```

### Validation Error
```json
{
  "statusCode": 400,
  "message": [
    "rating must not be less than 1",
    "rating must not be greater than 5",
    "rating must be an integer number",
    "serviceId must be a UUID"
  ],
  "error": "Bad Request"
}
```

## Client Integration Example

### JavaScript/TypeScript
```typescript
// Example using fetch API
const submitFeedback = async (serviceId, rating, description) => {
  try {
    const response = await fetch('http://your-server/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serviceId,
        rating,
        description
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit feedback');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

// Get all feedback for a specific service
const getFeedbackForService = async (serviceId) => {
  try {
    const response = await fetch(`http://your-server/feedback/service/${serviceId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch feedback');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw error;
  }
};
```

## Requirements

- The feedback service requires a valid government service ID
- Rating must be an integer between 1 and 5
- Description is optional but must be a string if provided

## Integration with Other Modules

This service integrates with:
- Government Services module for validating service IDs
- Authentication module for user context (coming soon)
