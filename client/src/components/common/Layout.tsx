import Header from "./Header";
import {Outlet} from "react-router-dom";

export default function Layout() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
			<Header />
			<main className="container mx-auto px-4 py-8">
				<Outlet />
			</main>
		</div>
	);
}
