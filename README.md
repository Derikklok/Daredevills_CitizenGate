# CitizenGate

A comprehensive government services booking platform built with React/Vite frontend and NestJS backend, featuring secure authentication, document management, and appointment scheduling.

## 🚀 Quick Start with Docker

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)
- **Supabase Account** (for database and file storage)
- **Clerk Account** (for authentication)
- **Plunk Account** (for email notifications - optional)

## 🔧 External Services Setup

### 1. Supabase Setup (Database + Storage)

**Create Supabase Project:**

1. Go to [supabase.com](https://supabase.com/) and create an account
2. Create a new project
3. Wait for project initialization (2-3 minutes)

**Get Database Connection:**

1. In your Supabase dashboard, go to **Settings** → **Database**
2. Copy the **Connection URL** (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-REF].supabase.co:5432/postgres`)
3. Note down your database password

**Configure Storage:**

1. In Supabase dashboard, go to **Storage**
2. Create a new bucket called `documents`
3. Set bucket to **Public** for file access
4. Go to **Settings** → **API** to get your keys

**Get API Keys:**

- **Project URL**: `https://[YOUR-REF].supabase.co`
- **Anon Key**: Found in Settings → API → Project API keys
- **Service Role Key**: Found in Settings → API → Project API keys (keep this secret!)

### 2. Clerk Setup (Authentication)

**Create Clerk Application:**

1. Go to [clerk.com](https://clerk.com/) and create an account
2. Create a new application
3. Choose **React** as your framework
4. Select authentication methods (Email, Google, etc.)

**Configure Application:**

1. In Clerk dashboard, go to **Configure** → **Settings**
2. Set your application name and logo
3. Configure sign-in/sign-up settings

**Set Up Organizations (for multi-tenant support):**

1. Go to **Configure** → **Organizations**
2. Enable organizations feature
3. Set up organization roles:
   - **Admin**: System administrators
   - **Member**: Department staff

**Get API Keys:**

- **Publishable Key**: Found in API Keys (starts with `pk_test_` or `pk_live_`)
- **Secret Key**: Found in API Keys (starts with `sk_test_` or `sk_live_`)

### 3. Plunk Setup (Email Notifications - Optional)

**Create Plunk Account:**

1. Go to [useplunk.com](https://useplunk.com/) and create an account
2. Verify your email domain
3. Create email templates for:
   - Appointment confirmations
   - Appointment reminders
   - Status updates

**Get API Key:**

1. In Plunk dashboard, go to **Settings** → **API Keys**
2. Copy your API key (starts with `plunk_`)

## 📋 Environment Configuration

### 1. Copy Environment Template

```bash
# Clone the repository
git clone <repository-url>
cd CitizenGate

# Copy the example environment file
cp example.env .env
```

### 2. Configure Environment Variables

Edit the `.env` file with your actual values:

```env
# ==============================================
# SUPABASE CONFIGURATION (Database + Storage)
# ==============================================
# Get these from your Supabase project dashboard
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-service-role-key

# Database URL (from Supabase Settings → Database)
DATABASE_URL=postgresql://postgres:your-password@db.your-ref.supabase.co:5432/postgres

# ==============================================
# CLERK AUTHENTICATION
# ==============================================
# Get these from your Clerk application dashboard
CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key
CLERK_SECRET_KEY=sk_test_your-secret-key

# For client-side (auto-prefixed with VITE_)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key

# ==============================================
# PLUNK EMAIL SERVICE (Optional)
# ==============================================
# Get this from your Plunk dashboard
PLUNK_API_KEY=plunk_your-api-key

# Alternative: SendGrid (if you prefer SendGrid over Plunk)
# SENDGRID_API_KEY=SG.your-sendgrid-api-key

# ==============================================
# APPLICATION CONFIGURATION
# ==============================================
# Development/Production mode
NODE_ENV=development

# API URLs
VITE_API_URL=http://localhost:3000
APP_URL=http://localhost:5173

# Port Configuration (change if ports are in use)
CLIENT_PORT=5173
SERVER_PORT=3000

# ==============================================
# OPTIONAL: CUSTOM SETTINGS
# ==============================================
VITE_APP_NAME=CitizenGate
VITE_APP_VERSION=1.0.0
```

## 🚀 Running the Application

### Start All Services

```bash
# Build and start all services
docker compose up --build

# Or run in background (detached mode)
docker compose up --build -d
```

### Access the Application

- **Frontend (Client)**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/api

### First-Time Setup

1. **Create Admin User:**

   - Go to http://localhost:5173
   - Click "Sign Up" and create your first account
   - This user will have admin privileges

2. **Set Up Departments:**

   - Log in as admin
   - Navigate to Admin Dashboard → Department Management
   - Create your first government department

3. **Configure Services:**
   - Go to Service Admin Dashboard
   - Create government services
   - Set availability schedules
   - Define required documents

## 🐳 Docker Commands

### Development Commands

```bash
# Start all services
docker compose up

# Start with fresh build
docker compose up --build

# Start specific service
docker compose up client
docker compose up server

# View logs
docker compose logs -f
docker compose logs -f client
docker compose logs -f server

# Stop all services
docker compose down

# Stop and remove volumes (⚠️ This will delete all local data)
docker compose down -v
```

### Production Commands

```bash
# Set production environment
echo "NODE_ENV=production" >> .env

# Build and start in production mode
docker compose up --build -d

# View production logs
docker compose logs -f
```

### Maintenance Commands

```bash
# Rebuild containers
docker compose build

# Rebuild specific service
docker compose build client
docker compose build server

# Execute commands in running containers
docker compose exec server npm run lint
docker compose exec client npm run build

# View container status
docker compose ps

# Remove unused containers and images
docker system prune -a
```

## 📁 Project Structure

```
CitizenGate/
├── client/                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── lib/           # API clients and utilities
│   │   └── hooks/         # Custom React hooks
│   ├── Dockerfile         # Client container config
│   └── package.json       # Frontend dependencies
├── server/                 # NestJS Backend
│   ├── src/
│   │   ├── appointments/   # Appointment management
│   │   ├── auth/          # Authentication & authorization
│   │   ├── feedback/      # User feedback system
│   │   ├── departments/   # Department management
│   │   └── analytics/     # Reporting and analytics
│   ├── Dockerfile         # Server container config
│   └── package.json       # Backend dependencies
├── docker-compose.yml     # Multi-container orchestration
├── example.env           # Environment template
└── README.md             # This file
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Conflicts

```bash
# Change ports in .env file
CLIENT_PORT=3001
SERVER_PORT=3001
```

#### 2. Database Connection Issues

```bash
# Verify Supabase URL and credentials
docker compose logs server

# Check if DATABASE_URL is correct
echo $DATABASE_URL
```

#### 3. Authentication Issues

```bash
# Verify Clerk keys are correct
# Check that CLERK_PUBLISHABLE_KEY and VITE_CLERK_PUBLISHABLE_KEY match
grep CLERK .env
```

#### 4. File Upload Issues

```bash
# Verify Supabase storage bucket exists and is public
# Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
docker compose logs server | grep -i supabase
```

#### 5. Email Service Issues

```bash
# Verify Plunk API key
# Check email service logs
docker compose logs server | grep -i email
```

### Reset Everything

```bash
# Stop all containers and remove volumes
docker compose down -v

# Remove all unused containers, networks, and images
docker system prune -a

# Rebuild and start fresh
docker compose up --build
```

### Debug Mode

```bash
# View detailed logs
docker compose logs -f

# Access container shell
docker compose exec server sh
docker compose exec client sh

# Check environment variables inside container
docker compose exec server env | grep -E "(CLERK|SUPABASE|PLUNK)"
```

## 🌐 Production Deployment

### Environment Configuration

```bash
# Update .env for production
NODE_ENV=production
VITE_API_URL=https://your-api-domain.com
APP_URL=https://your-app-domain.com

# Use production Clerk keys
CLERK_PUBLISHABLE_KEY=pk_live_your-live-key
CLERK_SECRET_KEY=sk_live_your-live-key
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your-live-key
```

### Deploy with Docker

```bash
# Production deployment
docker compose -f docker-compose.yml up -d --build

# Monitor deployment
docker compose logs -f
```

### Health Checks

```bash
# Check if all services are healthy
docker compose ps

# Test API endpoints
curl http://localhost:3000/api
curl http://localhost:3000/api-docs
```

## 🎯 Key Features

- **🔐 Secure Authentication**: Multi-role access with Clerk
- **📅 Appointment Booking**: 3-step booking process with real-time availability
- **📄 Document Management**: Secure file upload with Supabase Storage
- **⭐ Feedback System**: User ratings and reviews for services
- **📊 Analytics Dashboard**: Comprehensive reporting for administrators
- **📧 Email Notifications**: Automated confirmations and reminders
- **🏢 Multi-Department**: Support for multiple government departments
- **📱 Responsive Design**: Mobile-first UI with modern design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Set up your development environment with Docker: `docker compose up --build`
4. Make changes and test thoroughly
5. Commit changes: `git commit -am 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Submit a pull request

## 📚 Additional Documentation

- **Client Documentation**: [client/README.md](client/README.md)
- **Server Documentation**: [server/README.md](server/README.md)
- **API Documentation**: http://localhost:3000/api-docs (when running)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with** ❤️ **using** [React](https://react.dev/) • [NestJS](https://nestjs.com/) • [Supabase](https://supabase.com/) • [Clerk](https://clerk.com/)
