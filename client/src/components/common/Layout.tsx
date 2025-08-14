import Header from "./Header";
import {Outlet, Navigate} from "react-router-dom";
import {useAuth} from "@clerk/clerk-react";

export default function Layout() {
	const {isSignedIn, isLoaded} = useAuth();

	// Show loading state while Clerk is initializing
	if (!isLoaded) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				Loading...
			</div>
		);
	}

	// Redirect to landing page if not signed in
	if (!isSignedIn) {
		return <Navigate to="/landing" replace />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
			<Header />
			<main className="container mx-auto px-4 py-8">
				<Outlet />
			</main>
		</div>
	);
}
