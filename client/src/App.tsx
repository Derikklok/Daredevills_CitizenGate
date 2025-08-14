import {Route, Routes, Navigate} from "react-router-dom";
import "./App.css";
import {useAuth} from "@clerk/clerk-react";
import BookingAppointments from "./pages/BookingAppointments";
import MyAppointments from "./pages/MyAppointments";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import Home from "./pages/Home";
import Layout from "./components/common/Layout";

function App() {
	const {isSignedIn, isLoaded} = useAuth();

	// Show loading state while Clerk is initializing
	if (!isLoaded) {
		return <div>Loading...</div>;
	}

	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Home />} />
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
		</Routes>
	);
}

export default App;
