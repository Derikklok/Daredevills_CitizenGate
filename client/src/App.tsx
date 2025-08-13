import {Link, Route, Routes, Navigate} from "react-router-dom";
import "./App.css";
import {
	SignedIn,
	SignedOut,
	UserButton,
	OrganizationSwitcher,
	useAuth,
} from "@clerk/clerk-react";
import BookingAppointments from "./pages/BookingAppointments";
import MyAppointments from "./pages/MyAppointments";
import {Button} from "./components/ui/button";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";

function Home() {
	return (
		<>
			<header>
				<SignedOut>
					<Link to="/sign-in">Sign In</Link> |{" "}
					<Link to="/sign-up">Sign Up</Link>
				</SignedOut>
				<SignedIn>
					<UserButton />
					<OrganizationSwitcher />
				</SignedIn>
			</header>

			<Button className="bg-primary-500">Click me</Button>

			{/* Navigation Links */}
			<nav>
				<Link to="/booking-appointments">Booking Appointments</Link> |{" "}
				<Link to="/my-appointments">My Appointments</Link>
			</nav>
		</>
	);
}

function App() {
	const {isSignedIn, isLoaded} = useAuth();

	// Show loading state while Clerk is initializing
	if (!isLoaded) {
		return <div>Loading...</div>;
	}

	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/booking-appointments" element={<BookingAppointments />} />
			<Route path="/my-appointments" element={<MyAppointments />} />
			<Route
				path="/sign-in"
				element={isSignedIn ? <Navigate to="/" replace /> : <SignInPage />}
			/>
			<Route
				path="/sign-up"
				element={isSignedIn ? <Navigate to="/" replace /> : <SignUpPage />}
			/>
		</Routes>
	);
}

export default App;
