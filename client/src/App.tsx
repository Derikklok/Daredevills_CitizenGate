import {Route, Routes, Navigate} from "react-router-dom";
import "./App.css";
import {useAuth} from "@clerk/clerk-react";
import BookingAppointments from "./pages/BookingAppointments";
import MyAppointments from "./pages/MyAppointments";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import LandingPage from "./pages/LandingPage";

function Home() {
	return (
		<div className="constrained-width container mx-auto p-4 bg-white min-h-screen">
			<header className="py-4 flex justify-between items-center border-b border-gray-200">
				<div className="flex items-center gap-2">
					<span className="font-bold text-xl">
						<span className="text-primary">Citizen</span>
						<span className="text-pink-400">Gate</span>
					</span>
				</div>
				
				<div>
					<SignedOut>
						<div className="flex gap-4">
							<Link to="/sign-in" className="text-primary hover:underline">Sign In</Link>
							<Link to="/sign-up" className="text-primary hover:underline">Sign Up</Link>
						</div>
					</SignedOut>
					<SignedIn>
						<div className="flex items-center gap-4">
							<UserButton />
							<OrganizationSwitcher />
						</div>
					</SignedIn>
				</div>
			</header>

			<main className="py-6">
				<div className="mb-8">
					<h1 className="text-2xl font-bold mb-4">Welcome to CitizenGate</h1>
					<p className="text-gray-600">Book and manage your government appointments with ease</p>
				</div>

				<div className="flex gap-4 mb-6">
					<Button asChild className="bg-primary hover:bg-primary/90">
						<Link to="/booking-appointments">Book New Appointment</Link>
					</Button>
					<Button asChild variant="outline">
						<Link to="/my-appointments">View My Appointments</Link>
					</Button>
				</div>

				{/* Navigation Links */}
				<nav className="flex gap-4 text-sm text-gray-600">
					<Link to="/booking-appointments" className="hover:underline">Booking Appointments</Link>
					<Link to="/my-appointments" className="hover:underline">My Appointments</Link>
				</nav>
			</main>
		</div>
	);
}

function App() {
	const {isSignedIn, isLoaded} = useAuth();

	// Show loading state while Clerk is initializing
	if (!isLoaded) {
		return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
	}

	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<LandingPage />} />
				<Route path="/booking-appointments" element={<BookingAppointments />} />
				<Route path="/my-appointments" element={<MyAppointments />} />
			</Route>
			<Route
				path="/sign-in"
				element={isSignedIn ? <Navigate to="/" replace /> : <SignInPage />}
			/>
			<Route
				path="/sign-up"
				element={isSignedIn ? <Navigate to="/" replace /> : <SignUpPage />}
			/>
	);
}

export default App;
