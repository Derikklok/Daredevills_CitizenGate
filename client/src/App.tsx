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
import NewAppointmentDocumentUpload from "./pages/NewAppointment/NewAppointmentDocumentUpload";

function App() {
	const {isSignedIn, isLoaded} = useAuth();

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

			{/* Protected routes - require authentication */}
			<Route path="/" element={<Layout />}>
				<Route index element={<Home />} />
				<Route path="/booking-appointments" element={<BookingAppointments />} />
				<Route path="/my-appointments" element={<MyAppointments />} />
				<Route
					path="/service-details/:serviceName"
					element={<ServiceDetails serviceName={"Transport"} />}
				/>
				<Route
					path="/book-appointment/new"
					element={<NewAppointmentDocumentUpload />}
				/>
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

			{/* Default redirect - if user is signed in, go to home, otherwise to landing */}
			<Route
				path="*"
				element={
					isSignedIn ? (
						<Navigate to="/" replace />
					) : (
						<Navigate to="/landing" replace />
					)
				}
			/>
		</Routes>
	);
}

export default App;
