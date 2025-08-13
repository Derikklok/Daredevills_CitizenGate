import { Link, Route, Routes} from "react-router-dom";
import "./App.css";
import {
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
	OrganizationSwitcher,
} from "@clerk/clerk-react";
import {AuthTest} from "./components/AuthTest";
import BookingAppointments from "./pages/BookingAppointments";
import MyAppointments from "./pages/MyAppointments";

function Home() {
	return (
		<>
			<header>
				<SignedOut>
					<SignInButton />
				</SignedOut>
				<SignedIn>
					<UserButton />
					<OrganizationSwitcher />
				</SignedIn>
			</header>

			    {/* Auth Test Component */}
				<SignedIn>
					<AuthTest />
				</SignedIn>

				{/* Navigation Links */}
				<nav>
					<Link to="/booking-appointments">Booking Appointments</Link> |{" "}
					<Link to="/my-appointments">My Appointments</Link>
				</nav>
		</>
	)
}


function App() {
	return (
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/booking-appointments" element={<BookingAppointments />} />
				<Route path="/my-appointments" element={<MyAppointments />} />
			</Routes>
	);
}

export default App;
