# CitizenGate Client

<p align="center">
  <img src="https://vitejs.dev/logo.svg" width="60" alt="Vite Logo" />
  <img src="https://reactjs.org/logo-og.png" width="120" alt="React Logo" />
</p>

## 🌟 Overview

CitizenGate Client is a modern **React + TypeScript** frontend application built with **Vite** for lightning-fast development. It provides a comprehensive digital platform for citizens to access government services, book appointments, and manage their interactions with various government departments.

### Key Features

- 🔐 **Secure Authentication** - Clerk-powered authentication with role-based access
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- 📅 **Appointment Booking** - Complete 3-step appointment scheduling system
- 📄 **Document Upload** - Secure document management with drag-and-drop interface
- ⭐ **Service Feedback** - Rate and review government services
- 🏢 **Multi-Role Dashboard** - Citizen, Service Admin, and Super Admin interfaces
- 📊 **Analytics Dashboard** - Real-time reporting and insights
- 🎨 **Modern UI/UX** - Shadcn/ui components with consistent design system

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v20 or higher)
- **pnpm** package manager
- **Active CitizenGate server** running on port 3000

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment template
cp ../example.env .env.local

# Configure your environment variables
# See Environment Variables section below
```

### Development

```bash
# Start development server with hot reload
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Run linting
pnpm run lint
```

### Access the Application

- **Development**: `http://localhost:5173`
- **API Documentation**: `http://localhost:3000/api-docs` (server)

## 🔧 Environment Variables

Create a `.env.local` file in the client directory:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxx

# API Configuration
VITE_API_URL=http://localhost:3000

# Optional: Custom App Settings
VITE_APP_NAME=CitizenGate
VITE_APP_VERSION=1.0.0
```

## 🏗️ Application Architecture

### Tech Stack

- **⚡ Vite** - Ultra-fast build tool and development server
- **⚛️ React 19** - Latest React with concurrent features
- **📘 TypeScript** - Type-safe development
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🔐 Clerk** - Authentication and user management
- **🧭 React Router** - Client-side routing
- **🎯 Radix UI** - Accessible component primitives
- **📊 Recharts** - Data visualization
- **📅 React Day Picker** - Date selection
- **📄 React QR Code** - QR code generation

### Project Structure

```
client/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Shadcn/ui base components
│   │   ├── common/          # Layout and shared components
│   │   ├── analytics/       # Chart and analytics components
│   │   ├── appointments/    # Appointment-related components
│   │   ├── booking/         # Service booking components
│   │   └── feedback/        # Feedback system components
│   ├── pages/               # Application pages
│   │   ├── admin/           # Super admin dashboard
│   │   ├── service-admin/   # Department admin dashboard
│   │   ├── client-pages/    # Citizen user pages
│   │   └── NewAppointment/  # Appointment booking flow
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and API functions
│   │   ├── api.ts          # API client functions
│   │   ├── types.ts        # TypeScript type definitions
│   │   └── utils.ts        # Helper utilities
│   ├── data/               # Static data and configurations
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── Dockerfile             # Container configuration
└── package.json           # Dependencies and scripts
```

## 👥 User Roles & Access

### 🏛️ Super Admin

**Access**: System-wide management

**Features:**

- **Dashboard**: System overview and key metrics
- **Department Management**: Create, edit, and manage departments
- **User Management**: User roles and permissions
- **System Reports**: Cross-department analytics
- **System Settings**: Global configuration

**Routes**: `/admin/*`

### 🏢 Service Admin (Department Admin)

**Access**: Department-specific management

**Features:**

- **Service Management**: Create and configure department services
- **Availability Management**: Set service hours and appointment slots
- **Document Management**: Define required documents for services
- **Appointment Management**: View and manage department appointments
- **Department Analytics**: Department-specific reporting

**Routes**: `/service-admin/*`

### 👤 Citizen User

**Access**: Public services and personal management

**Features:**

- **Service Discovery**: Browse and search government services
- **Appointment Booking**: 3-step booking process with document upload
- **My Appointments**: View, reschedule, and cancel appointments
- **Service Feedback**: Rate and review completed services
- **Profile Management**: Personal information and preferences

**Routes**: `/`, `/services/*`, `/my-appointments`

## 📱 Application Features

### 🔐 Authentication & Onboarding

- **Landing Page**: Welcome page with service overview
- **Sign Up/Sign In**: Clerk-powered authentication
- **Role Detection**: Automatic role assignment and dashboard routing
- **Profile Setup**: Complete user profile during onboarding

### 📅 Appointment Booking Flow

**Step 1: Service Selection**

- Browse services by category or department
- View service details, requirements, and estimated time
- Read user reviews and ratings

**Step 2: Date & Time Selection**

- Calendar view with available time slots
- Real-time availability checking
- Time zone support

**Step 3: Document Upload & Personal Details**

- Upload required documents with validation
- Complete personal information form
- Review and confirm appointment

**Confirmation**

- Appointment confirmation page
- QR code for easy check-in
- Email notifications (if configured)

### ⭐ Feedback System

**User Reviews**

- 5-star rating system
- Written reviews and comments
- Service-specific feedback

**Display & Analytics**

- Average ratings display
- Recent reviews showcase
- Feedback analytics for administrators

## 🎨 Design System

### Color Palette

- **Primary**: `#600D29` (Burgundy red)
- **Secondary**: `#A8174E` (Rose red)
- **Success**: Green variants
- **Warning**: Yellow/Orange variants
- **Error**: Red variants
- **Neutral**: Gray scale

### Components

- **Shadcn/ui**: Base component library
- **Custom Components**: Application-specific components
- **Icons**: Heroicons for consistent iconography

## 🔧 API Integration

### API Client (`lib/api.ts`)

- **Centralized API functions** for all backend interactions
- **TypeScript interfaces** for request/response types
- **Error handling** with user-friendly messages
- **Authentication** with Clerk token management

### Key API Modules

- **Authentication**: User management and role verification
- **Services**: Government service CRUD operations
- **Appointments**: Complete appointment lifecycle
- **Documents**: File upload and management
- **Feedback**: User review system
- **Analytics**: Reporting and metrics

## 📱 Responsive Design

### Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile-First Approach

- Touch-friendly interface design
- Optimized form layouts for mobile keyboards
- Responsive navigation with mobile menu
- Progressive enhancement for larger screens

### Accessibility

- **WCAG 2.1 AA compliance** target
- **Keyboard navigation** support
- **Screen reader** compatibility
- **High contrast** mode support
- **Focus management** for modal dialogs

## 🚀 Deployment

### Production Build

```bash
# Create optimized production build
pnpm run build

# Preview production build locally
pnpm run preview

# Deploy 'dist' folder to your hosting service
```

### Environment Setup

1. **API Connection**: Ensure backend server is accessible
2. **Clerk Configuration**: Set up authentication provider
3. **Environment Variables**: Configure all required variables
4. **SSL/HTTPS**: Use secure connections in production

### Hosting Recommendations

- **Vercel**: Optimized for Vite applications
- **Netlify**: Easy deployment with Git integration
- **AWS S3 + CloudFront**: Scalable static hosting
- **Docker**: Containerized deployment

## 🤝 Contributing

### Getting Started

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Install dependencies**: `pnpm install`
4. **Start development server**: `pnpm run dev`

### Development Guidelines

- **Component Structure**: Use functional components with TypeScript
- **State Management**: React hooks for local state, Context for global state
- **Styling**: Tailwind CSS with component-based classes
- **API Integration**: Use centralized API functions from `lib/api.ts`

### Code Standards

```bash
# Before committing
pnpm run lint        # Check code quality
pnpm run build       # Verify TypeScript compilation
```

## 📚 Resources

### Documentation

- **React**: [React Documentation](https://react.dev/)
- **Vite**: [Vite Guide](https://vitejs.dev/guide/)
- **Tailwind CSS**: [Tailwind Documentation](https://tailwindcss.com/docs)
- **Clerk**: [Clerk React Documentation](https://clerk.com/docs/quickstarts/react)

### Component Libraries

- **Shadcn/ui**: [Component Documentation](https://ui.shadcn.com/)
- **Radix UI**: [Primitives Documentation](https://www.radix-ui.com/)
- **Heroicons**: [Icon Library](https://heroicons.com/)

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

**Built with** ❤️ **using** [React](https://react.dev/) • [Vite](https://vitejs.dev/) • [TypeScript](https://www.typescriptlang.org/) • [Tailwind CSS](https://tailwindcss.com/)
