# CitizenGate Server API

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
</p>

## 🏛️ Overview

CitizenGate Server is a robust **NestJS-based backend API** for managing government services, appointments, and citizen interactions. Built with TypeScript, PostgreSQL, and modern web standards, it provides a comprehensive suite of APIs for digital government service delivery.

### Key Features

- 🔐 **Clerk Authentication** - Secure JWT-based authentication with role-based access control
- 🏢 **Multi-Department Management** - Support for multiple government departments
- 📅 **Appointment Scheduling** - Complete appointment lifecycle management
- 📄 **Document Management** - Secure document upload and verification via Supabase
- ⭐ **Feedback System** - User ratings and reviews for services
- 📊 **Analytics Dashboard** - Comprehensive reporting and analytics
- 📧 **Email Notifications** - Automated reminders and confirmations
- 🌐 **RESTful API** - Well-documented APIs with Swagger integration

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v20 or higher)
- **pnpm** package manager
- **PostgreSQL** database
- **Supabase** account (for file storage)
- **Clerk** account (for authentication)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment template
cp ../example.env .env

# Configure your environment variables
# See Environment Variables section below
```

### Development

```bash
# Start in development mode with hot reload
pnpm run start:dev

# Start in production mode
pnpm run start:prod

# Run tests
pnpm run test

# Run e2e tests
pnpm run test:e2e

# Generate test coverage
pnpm run test:cov
```

### API Documentation

Once the server is running, visit:

- **Swagger UI**: `http://localhost:3000/api-docs`
- **Health Check**: `http://localhost:3000/api`

## 🔧 Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/citizengate

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxx

# Supabase Configuration (for file storage)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Email Configuration (Optional - choose one)
SENDGRID_API_KEY=SG.xxxxxxxx  # For SendGrid
PLUNK_API_KEY=plunk_xxxxxxxx  # For Plunk

# Application Settings
NODE_ENV=development
PORT=3000
```

## 📚 API Modules

### 🏢 Departments (`/api/departments`)

Manage government departments and organizational structure.

- `POST /departments` - Create new department
- `GET /departments` - List all departments
- `GET /departments/:id` - Get department details
- `PUT /departments/:id` - Update department
- `DELETE /departments/:id` - Delete department

### 🛠️ Government Services (`/api/government-services`)

Manage available government services offered by departments.

- `POST /government-services` - Create new service
- `GET /government-services` - List all services
- `GET /government-services/:id` - Get service details
- `PUT /government-services/:id` - Update service
- `DELETE /government-services/:id` - Delete service

### ⏰ Service Availability (`/api/service-availability`)

Configure when services are available for appointments.

- `POST /service-availability` - Set availability for single/multiple days
- `GET /service-availability` - List all availability schedules
- `GET /service-availability/service/:serviceId` - Get service-specific availability
- `PUT /service-availability/:id` - Update availability
- `DELETE /service-availability/:id` - Remove availability

### 📋 Required Documents (`/api/required-documents`)

Define mandatory documents for each service.

- `POST /required-documents` - Add document requirement
- `GET /required-documents` - List all document requirements
- `GET /required-documents/service/:serviceId` - Get service document requirements
- `PUT /required-documents/:id` - Update document requirement
- `DELETE /required-documents/:id` - Remove document requirement

### 📅 Appointments (`/api/appointments`)

Complete appointment lifecycle management.

**Booking Flow:**

- `POST /appointments/draft` - Create draft appointment
- `PUT /appointments/:id/update-service` - Add service and time slot
- `PUT /appointments/:id/complete` - Finalize with personal details

**Management:**

- `GET /appointments/my` - User's own appointments
- `GET /appointments/admin` - Admin view (filtered by organization)
- `PUT /appointments/:id/status` - Update appointment status
- `DELETE /appointments/:id` - Cancel appointment

**Documents:**

- `POST /appointments/:id/documents` - Upload documents
- `DELETE /appointments/:id/documents/:documentId` - Remove document

### 📄 Document Storage (`/api/uploaded-service-documents`)

Secure document upload and management via Supabase.

- `POST /uploaded-service-documents/upload` - Upload single document
- `POST /uploaded-service-documents/upload-multiple` - Upload multiple documents
- `GET /uploaded-service-documents/appointment/:appointmentId` - Get appointment documents
- `GET /uploaded-service-documents/:id/download` - Download document
- `DELETE /uploaded-service-documents/:id` - Delete document

### ⭐ Feedback (`/api/feedback`)

User ratings and reviews for government services.

- `POST /feedback` - Submit feedback (1-5 stars + comments)
- `GET /feedback` - Get all feedback
- `GET /feedback/service/:serviceId` - Get service-specific feedback

### 📊 Analytics (`/api/analytics`)

Comprehensive reporting and analytics for administrators.

- `GET /analytics/overview` - Key metrics overview
- `GET /analytics/peak-hours` - Usage patterns by time
- `GET /analytics/departmental-workload` - Department-wise statistics
- `GET /analytics/no-show-analysis` - No-show patterns and demographics
- `GET /analytics/processing-times` - Service processing time analysis
- `GET /analytics/appointment-trends` - Appointment volume trends

## 🔐 Authentication & Authorization

### Authentication Methods

- **JWT Tokens** via Clerk authentication
- **Role-based Access Control** (Admin, Service Admin, User)
- **Organization-based Isolation** for multi-tenant support

### Protected Routes

Most endpoints require authentication. Include the JWT token in the Authorization header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### User Roles

- **Admin**: Full system access, can manage all departments
- **Service Admin**: Department-specific access, can manage own department's services
- **User**: Can book appointments and manage own appointments

## 🗄️ Database Schema

The application uses **PostgreSQL** with **TypeORM** for database management.

### Core Entities

- `Department` - Government departments
- `GovernmentService` - Available services
- `ServiceAvailability` - Service scheduling
- `RequiredDocument` - Document requirements
- `Appointment` - Appointment bookings
- `UploadedServiceDocument` - File storage references
- `Feedback` - User feedback and ratings

### Database Features

- **Auto-generated UUIDs** for primary keys
- **Soft deletes** for data preservation
- **Audit trails** with created/updated timestamps
- **Foreign key constraints** for data integrity
- **Database migrations** for version control

## 📧 Email Integration

Support for automated email notifications:

### Supported Providers

- **SendGrid** - Production-ready email service
- **Plunk** - Developer-friendly email API

### Email Templates

- **Appointment Confirmations** - Sent when appointments are confirmed
- **Appointment Reminders** - Sent before appointment time
- **Status Updates** - Sent when appointment status changes

### Email Configuration

Configure in your `.env` file:

```env
# SendGrid
SENDGRID_API_KEY=SG.xxxxxxxx

# OR Plunk
PLUNK_API_KEY=plunk_xxxxxxxx
```

## 🗂️ File Storage

**Supabase Storage** integration for secure document management:

### Features

- **Secure uploads** with authentication
- **File type validation** (PDF, images)
- **Storage quotas** and size limits
- **Direct download URLs** with expiration
- **Automatic cleanup** of orphaned files

### Supported File Types

- PDF documents
- Images (JPEG, PNG, WebP)
- Maximum file size: 10MB per file

## 🧪 Testing

### Test Types

```bash
# Unit tests
pnpm run test

# End-to-end tests
pnpm run test:e2e

# Test coverage report
pnpm run test:cov

# Watch mode for development
pnpm run test:watch
```

### Test Structure

- **Unit Tests**: Individual service and controller testing
- **Integration Tests**: Database and API endpoint testing
- **E2E Tests**: Complete workflow testing
- **Mocking**: External services (Clerk, Supabase, Email)

## 🚀 Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker compose up --build

# Production deployment
docker compose -f docker-compose.prod.yml up -d
```

### Environment Setup

1. **Database Migration**: Ensure PostgreSQL is accessible
2. **Environment Variables**: Configure all required variables
3. **External Services**: Set up Clerk, Supabase, and email providers
4. **Health Checks**: Verify all services are operational

### Production Considerations

- **Database Backups**: Regular automated backups
- **Log Management**: Centralized logging and monitoring
- **SSL/TLS**: Secure connections in production
- **Rate Limiting**: API rate limiting for protection
- **Caching**: Redis for session and data caching

## 📁 Project Structure

```
server/
├── src/
│   ├── analytics/          # Analytics and reporting
│   ├── appointments/        # Appointment management
│   │   ├── dto/            # Data transfer objects
│   │   ├── messaging/      # Email notifications
│   │   └── README.md       # Appointment API docs
│   ├── auth/               # Authentication & authorization
│   ├── config/             # Configuration management
│   ├── departments/        # Department management
│   ├── feedback/           # User feedback system
│   ├── government-services/ # Service management
│   ├── required-documents/ # Document requirements
│   ├── service-availability/ # Service scheduling
│   ├── uploaded-service-documents/ # File storage
│   ├── app.module.ts       # Main application module
│   └── main.ts            # Application entry point
├── test/                   # Test files
├── Dockerfile             # Container configuration
└── package.json           # Dependencies and scripts
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Standards

- **TypeScript** for type safety
- **ESLint + Prettier** for code formatting
- **Jest** for testing
- **Conventional Commits** for commit messages

## 📞 Support

For questions and support:

- **API Documentation**: `/api-docs` endpoint
- **Issues**: GitHub Issues
- **Email**: Contact the development team

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

Built with ❤️ using [NestJS](https://nestjs.com/) • [TypeORM](https://typeorm.io/) • [PostgreSQL](https://postgresql.org/)
