# Service Availability Module

This module manages the availability schedules for government services, allowing the definition of service operating hours and appointment slots.

## Database Schema

The service availability is stored in the `service_availability` table with the following structure:

| Field | Type | Description |
|-------|------|-------------|
| `availability_id` | uuid | Primary key for the availability entry |
| `service_id` | uuid | Foreign key reference to the government service |
| `day_of_week` | text | Day of the week (Monday, Tuesday, etc.) |
| `start_time` | time | Starting time for the service availability |
| `end_time` | time | Ending time for the service availability |
| `duration_minutes` | int | Duration of each appointment slot in minutes |
| `created_at` | timestamp | Timestamp when the record was created |
| `updated_at` | timestamp | Timestamp when the record was last updated |

## API Endpoints

### 1. Create Service Availability (Single Day)

Creates a single service availability entry for a specific day.

- **URL**: `/api/service-availability`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "service_id": "fbcbd177-d6e9-4caa-9cd6-e73394d09dd4",
    "day_of_week": "Monday",
    "start_time": "09:00",
    "end_time": "13:00",
    "duration_minutes": 30
  }
  ```
- **Response**: The created service availability object
  ```json
  {
    "service_id": "fbcbd177-d6e9-4caa-9cd6-e73394d09dd4",
    "day_of_week": "Monday",
    "start_time": "09:00",
    "end_time": "13:00",
    "duration_minutes": 30,
    "availability_id": "045a7dcb-2221-4b97-bb3b-fbd9d06a4795",
    "created_at": "2025-08-13T07:21:46.619Z",
    "updated_at": "2025-08-13T07:21:46.619Z"
  }
  ```

### 2. Create Service Availability (Multiple Days)

Creates multiple service availability entries for different days with the same time settings.

- **URL**: `/api/service-availability`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "service_id": "fbcbd177-d6e9-4caa-9cd6-e73394d09dd4",
    "days_of_week": ["Monday", "Tuesday", "Wednesday"],
    "start_time": "09:00",
    "end_time": "13:00",
    "duration_minutes": 30
  }
  ```
- **Response**: An array of created service availability objects
  ```json
  [
    {
      "service_id": "fbcbd177-d6e9-4caa-9cd6-e73394d09dd4",
      "day_of_week": "Monday",
      "start_time": "09:00",
      "end_time": "13:00",
      "duration_minutes": 30,
      "availability_id": "045a7dcb-2221-4b97-bb3b-fbd9d06a4795",
      "created_at": "2025-08-13T07:21:46.619Z",
      "updated_at": "2025-08-13T07:21:46.619Z"
    },
    {
      "service_id": "fbcbd177-d6e9-4caa-9cd6-e73394d09dd4",
      "day_of_week": "Tuesday",
      "start_time": "09:00",
      "end_time": "13:00",
      "duration_minutes": 30,
      "availability_id": "145b8dcb-3321-5b97-cb3b-gcd9d06a5895",
      "created_at": "2025-08-13T07:21:46.619Z",
      "updated_at": "2025-08-13T07:21:46.619Z"
    },
    {
      "service_id": "fbcbd177-d6e9-4caa-9cd6-e73394d09dd4",
      "day_of_week": "Wednesday",
      "start_time": "09:00",
      "end_time": "13:00",
      "duration_minutes": 30,
      "availability_id": "245c9dcb-4421-6b97-db3b-hcd9d06a6995",
      "created_at": "2025-08-13T07:21:46.619Z",
      "updated_at": "2025-08-13T07:21:46.619Z"
    }
  ]
  ```

### 3. Create Multiple Service Availabilities in Batch

Creates multiple service availability entries with different settings.

- **URL**: `/api/service-availability/batch`
- **Method**: `POST`
- **Request Body**:
  ```json
  [
    {
      "service_id": "fbcbd177-d6e9-4caa-9cd6-e73394d09dd4",
      "day_of_week": "Monday",
      "start_time": "09:00",
      "end_time": "13:00",
      "duration_minutes": 30
    },
    {
      "service_id": "fbcbd177-d6e9-4caa-9cd6-e73394d09dd4",
      "day_of_week": "Tuesday",
      "start_time": "10:00",
      "end_time": "14:00",
      "duration_minutes": 45
    }
  ]
  ```
- **Response**: An array of created service availability objects
  ```json
  [
    {
      "service_id": "fbcbd177-d6e9-4caa-9cd6-e73394d09dd4",
      "day_of_week": "Monday",
      "start_time": "09:00",
      "end_time": "13:00",
      "duration_minutes": 30,
      "availability_id": "045a7dcb-2221-4b97-bb3b-fbd9d06a4795",
      "created_at": "2025-08-13T07:21:46.619Z",
      "updated_at": "2025-08-13T07:21:46.619Z"
    },
    {
      "service_id": "fbcbd177-d6e9-4caa-9cd6-e73394d09dd4",
      "day_of_week": "Tuesday",
      "start_time": "10:00",
      "end_time": "14:00",
      "duration_minutes": 45,
      "availability_id": "145b8dcb-3321-5b97-cb3b-gcd9d06a5895",
      "created_at": "2025-08-13T07:21:46.619Z",
      "updated_at": "2025-08-13T07:21:46.619Z"
    }
  ]
  ```

### 4. Get All Service Availabilities

Retrieves all service availability entries.

- **URL**: `/api/service-availability`
- **Method**: `GET`
- **Response**: An array of service availability objects with their associated services and departments
  ```json
  [
    {
      "availability_id": "045a7dcb-2221-4b97-bb3b-fbd9d06a4795",
      "service_id": "fbcbd177-d6e9-4caa-9cd6-e73394d09dd4",
      "day_of_week": "Monday",
      "start_time": "09:00",
      "end_time": "13:00",
      "duration_minutes": 30,
      "created_at": "2025-08-13T07:21:46.619Z",
      "updated_at": "2025-08-13T07:21:46.619Z",
      "service": {
        "service_id": "fbcbd177-d6e9-4caa-9cd6-e73394d09dd4",
        "name": "Driver's License Renewal",
        "description": "Renewal of driver's license",
        "department_id": 1,
        "category": "Licensing",
        "estimated_total_completion_time": "30 minutes",
        "created_at": "2025-08-13T00:30:59.632Z",
        "updated_at": "2025-08-13T00:30:59.632Z",
        "department": {
          "department_id": 1,
          "name": "Department of Motor Vehicles",
          "address": "123 Government St",
          "contact_email": "dmv@example.gov",
          "contact_phone": "555-123-4567"
        }
      }
    }
    // ... other availability entries
  ]
  ```

### 5. Get Service Availability by ID

Retrieves a specific service availability entry by ID.

- **URL**: `/api/service-availability/:id`
- **Method**: `GET`
- **URL Parameters**: `id` - The ID of the service availability
- **Response**: The service availability object with service and department details
  ```json
  {
    "availability_id": "045a7dcb-2221-4b97-bb3b-fbd9d06a4795",
    "service_id": "fbcbd177-d6e9-4caa-9cd6-e73394d09dd4",
    "day_of_week": "Monday",
    "start_time": "09:00",
    "end_time": "13:00",
    "duration_minutes": 30,
    "created_at": "2025-08-13T07:21:46.619Z",
    "updated_at": "2025-08-13T07:21:46.619Z",
    "service": {
      "service_id": "fbcbd177-d6e9-4caa-9cd6-e73394d09dd4",
      "name": "Driver's License Renewal",
      "description": "Renewal of driver's license",
      "department_id": 1,
      "category": "Licensing",
      "estimated_total_completion_time": "30 minutes",
      "created_at": "2025-08-13T00:30:59.632Z",
      "updated_at": "2025-08-13T00:30:59.632Z",
      "department": {
        "department_id": 1,
        "name": "Department of Motor Vehicles",
        "address": "123 Government St",
        "contact_email": "dmv@example.gov",
        "contact_phone": "555-123-4567"
      }
    }
  }
  ```

### 6. Get Service Availabilities by Service ID

Retrieves all availability entries for a specific government service.

- **URL**: `/api/service-availability/service/:serviceId`
- **Method**: `GET`
- **URL Parameters**: `serviceId` - The ID of the government service
- **Response**: An array of service availability objects for the specified service, including service and department details
  ```json
  [
    {
      "availability_id": "045a7dcb-2221-4b97-bb3b-fbd9d06a4795",
      "service_id": "fbcbd177-d6e9-4caa-9cd6-e73394d09dd4",
      "day_of_week": "Monday",
      "start_time": "09:00",
      "end_time": "13:00",
      "duration_minutes": 30,
      "created_at": "2025-08-13T07:21:46.619Z",
      "updated_at": "2025-08-13T07:21:46.619Z",
      "service": {
        "service_id": "fbcbd177-d6e9-4caa-9cd6-e73394d09dd4",
        "name": "Driver's License Renewal",
        "description": "Renewal of driver's license",
        "department_id": 1,
        "category": "Licensing",
        "estimated_total_completion_time": "30 minutes",
        "created_at": "2025-08-13T00:30:59.632Z",
        "updated_at": "2025-08-13T00:30:59.632Z",
        "department": {
          "department_id": 1,
          "name": "Department of Motor Vehicles",
          "address": "123 Government St",
          "contact_email": "dmv@example.gov",
          "contact_phone": "555-123-4567"
        }
      }
    },
    {
      "availability_id": "145b8dcb-3321-5b97-cb3b-gcd9d06a5895",
      "service_id": "fbcbd177-d6e9-4caa-9cd6-e73394d09dd4",
      "day_of_week": "Tuesday",
      "start_time": "09:00",
      "end_time": "13:00",
      "duration_minutes": 30,
      "created_at": "2025-08-13T07:21:46.619Z",
      "updated_at": "2025-08-13T07:21:46.619Z",
      "service": {
        "service_id": "fbcbd177-d6e9-4caa-9cd6-e73394d09dd4",
        "name": "Driver's License Renewal",
        "description": "Renewal of driver's license",
        "department_id": 1,
        "category": "Licensing",
        "estimated_total_completion_time": "30 minutes",
        "created_at": "2025-08-13T00:30:59.632Z",
        "updated_at": "2025-08-13T00:30:59.632Z",
        "department": {
          "department_id": 1,
          "name": "Department of Motor Vehicles",
          "address": "123 Government St",
          "contact_email": "dmv@example.gov",
          "contact_phone": "555-123-4567"
        }
      }
    }
    // ... other availability entries for this service
  ]
  ```

### 7. Update Service Availability

Updates a specific service availability entry.

- **URL**: `/api/service-availability/:id`
- **Method**: `PUT`
- **URL Parameters**: `id` - The ID of the service availability
- **Request Body**:
  ```json
  {
    "start_time": "10:00",
    "end_time": "15:00",
    "duration_minutes": 45
  }
  ```
- **Response**: The updated service availability object
  ```json
  {
    "availability_id": "045a7dcb-2221-4b97-bb3b-fbd9d06a4795",
    "service_id": "fbcbd177-d6e9-4caa-9cd6-e73394d09dd4",
    "day_of_week": "Monday",
    "start_time": "10:00",
    "end_time": "15:00",
    "duration_minutes": 45,
    "created_at": "2025-08-13T07:21:46.619Z",
    "updated_at": "2025-08-13T08:30:22.451Z"
  }
  ```

### 8. Delete Service Availability

Deletes a specific service availability entry.

- **URL**: `/api/service-availability/:id`
- **Method**: `DELETE`
- **URL Parameters**: `id` - The ID of the service availability
- **Response**: The deleted service availability object
  ```json
  {
    "availability_id": "045a7dcb-2221-4b97-bb3b-fbd9d06a4795",
    "service_id": "fbcbd177-d6e9-4caa-9cd6-e73394d09dd4",
    "day_of_week": "Monday",
    "start_time": "10:00",
    "end_time": "15:00",
    "duration_minutes": 45,
    "created_at": "2025-08-13T07:21:46.619Z",
    "updated_at": "2025-08-13T08:30:22.451Z"
  }
  ```

## Tips for Frontend Integration

1. **Service Filtering**: When displaying services to users, use the `/api/service-availability/service/:serviceId` endpoint to fetch availability for a specific service.

2. **Multiple Days Creation**: When creating service availability for multiple days with the same time settings, use the single endpoint with the `days_of_week` array format to reduce the number of API calls.

3. **Batch Updates**: For different time settings across days, use the `/api/service-availability/batch` endpoint.

4. **Sorted Results**: The service availability results for a specific service are sorted by day of the week and start time, making it easy to display them in a weekly calendar view.

5. **Appointment Calculation**: Use the `start_time`, `end_time`, and `duration_minutes` fields to calculate the specific appointment slots available for booking.

## Valid Day of Week Values

The `day_of_week` field accepts the following values:
- Monday
- Tuesday
- Wednesday
- Thursday
- Friday
- Saturday
- Sunday

## Time Format

All time values should be provided in 24-hour format (HH:MM), such as "09:00" or "13:30".
