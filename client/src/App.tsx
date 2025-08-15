import {Route, Routes, Navigate} from "react-router-dom";
import Layout from "@/components/common/Layout";
import "./App.css";
import {useAuth} from "@clerk/clerk-react";
import BookingAppointments from "./pages/BookingAppointments";
import MyAppointments from "./pages/MyAppointments";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import ServiceDetails from "./pages/ServiceDetails";
import BookingFlow from "./pages/NewAppointment/BookingFlow";
import CalendarView from "./pages/NewAppointment/CalendarView";
import NewAppointmentDocumentUpload from "./pages/NewAppointment/NewAppointmentDocumentUpload";
import CompleteAppointment from "./pages/NewAppointment/CompleteAppointment";
import AppointmentConfirmation from "./pages/AppointmentConfirmation";
// Admin components
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import DepartmentManagement from "./pages/admin/DepartmentManagement";
import ReportsDashboard from "./pages/admin/ReportsDashboard";
import SystemSettings from "./pages/admin/SystemSettings";
// Service Admin components
import ServiceAdminDashboard from "./pages/service-admin/ServiceAdminDashboard";
import ServiceManagement from "./pages/service-admin/ServiceManagement";
import DocumentManagement from "./pages/service-admin/DocumentManagement";
import AppointmentManagement from "./pages/service-admin/AppointmentManagement";
import ServiceSettings from "./pages/service-admin/ServiceSettings";
// Other pages
import AllGovernmentServices from "./pages/AllGovernmentServices";
// Custom hooks
import {useIsAdmin, useIsServiceAdmin} from "./hooks/useAuth";

function App() {
	const {isSignedIn, isLoaded} = useAuth();
	const isAdmin = useIsAdmin();
	const isServiceAdmin = useIsServiceAdmin();
	
	// Show loading state while Clerk is initializing
	if (!isLoaded) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				Loading...
			</div>
		);
	}

	return (
		<Routes>
			{/* Landing page - accessible to everyone */}
			<Route path="/landing" element={<LandingPage />} />

			{/* Admin Routes - only for system admins */}
			{/* Admin Dashboard */}
			<Route 
				path="/admin" 
				element={
					isSignedIn ? (
						isAdmin ? <AdminDashboard /> : <Navigate to="/" replace />
					) : (
						<Navigate to="/sign-in" replace />
					)
				} 
			/>
			{/* User Management */}
			<Route 
				path="/admin/users" 
				element={
					isSignedIn ? (
						isAdmin ? <UserManagement /> : <Navigate to="/" replace />
					) : (
						<Navigate to="/sign-in" replace />
					)
				} 
			/>
			{/* Department Management */}
			<Route 
				path="/admin/departments" 
				element={
					isSignedIn ? (
						isAdmin ? <DepartmentManagement /> : <Navigate to="/" replace />
					) : (
						<Navigate to="/sign-in" replace />
					)
				} 
			/>
			{/* Reports Dashboard */}
			<Route 
				path="/admin/reports" 
				element={
					isSignedIn ? (
						isAdmin ? <ReportsDashboard /> : <Navigate to="/" replace />
					) : (
						<Navigate to="/sign-in" replace />
					)
				} 
			/>
			{/* System Settings */}
			<Route 
				path="/admin/settings" 
				element={
					isSignedIn ? (
						isAdmin ? <SystemSettings /> : <Navigate to="/" replace />
					) : (
						<Navigate to="/sign-in" replace />
					)
				} 
			/>

			{/* Service Admin Routes - only for service admins */}
			{/* Service Admin Dashboard */}
			<Route 
				path="/service-admin" 
				element={
					isSignedIn ? (
						isServiceAdmin ? <ServiceAdminDashboard /> : <Navigate to="/" replace />
					) : (
						<Navigate to="/sign-in" replace />
					)
				} 
			/>
			{/* Service Management */}
			<Route 
				path="/service-admin/services" 
				element={
					isSignedIn ? (
						isServiceAdmin ? <ServiceManagement /> : <Navigate to="/" replace />
					) : (
						<Navigate to="/sign-in" replace />
					)
				} 
			/>
			{/* Document Management */}
			<Route 
				path="/service-admin/documents" 
				element={
					isSignedIn ? (
						isServiceAdmin ? <DocumentManagement /> : <Navigate to="/" replace />
					) : (
						<Navigate to="/sign-in" replace />
					)
				} 
			/>
			{/* Appointment Management */}
			<Route 
				path="/service-admin/appointments" 
				element={
					isSignedIn ? (
						isServiceAdmin ? <AppointmentManagement /> : <Navigate to="/" replace />
					) : (
						<Navigate to="/sign-in" replace />
					)
				} 
			/>
			{/* Service Settings */}
			<Route 
				path="/service-admin/settings" 
				element={
					isSignedIn ? (
						isServiceAdmin ? <ServiceSettings /> : <Navigate to="/" replace />
					) : (
						<Navigate to="/sign-in" replace />
					)
				} 
			/>

			{/* Protected routes - require authentication */}
			<Route path="/" element={<Layout />}>
				<Route index element={<Home />} />
				<Route path="/booking-appointments" element={<BookingAppointments />} />
				<Route path="/my-appointments" element={<MyAppointments />} />
				<Route
					path="/service-details/:serviceName"
					element={<ServiceDetails serviceName={"Transport"} />}
				/>
				<Route path="/book-appointment/new" element={<BookingFlow />} />
				<Route path="/calendar/:serviceId" element={<CalendarView />} />
				<Route
					path="/book-appointment/documents"
					element={<NewAppointmentDocumentUpload />}
				/>
				<Route path="/complete-appointment" element={<CompleteAppointment />} />
				<Route
					path="/appointment-confirmation"
					element={<AppointmentConfirmation />}
				/>
				{/* All Government Services */}
				<Route path="/services/all" element={<AllGovernmentServices />} />
			</Route>

			{/* Auth routes */}
			<Route
				path="/sign-in"
				element={isSignedIn ? <Navigate to="/" replace /> : <SignInPage />}
			/>
			<Route
				path="/sign-up"
				element={isSignedIn ? <Navigate to="/" replace /> : <SignUpPage />}
			/>

			{/* Default redirect - if user is signed in, go to home, admin dashboard, or service admin dashboard based on role, otherwise to landing */}
			<Route
				path="*"
				element={
					isSignedIn ? (
						isAdmin ? (
							<Navigate to="/admin" replace />
						) : isServiceAdmin ? (
							<Navigate to="/service-admin" replace />
						) : (
							<Navigate to="/" replace />
						)
					) : (
						<Navigate to="/landing" replace />
					)
				}
			/>
		</Routes>
	);
}

export default App;
