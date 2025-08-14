import {
	SignedIn,
	SignedOut,
	UserButton,
	OrganizationSwitcher,
} from "@clerk/clerk-react";
import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button";

export default function Home() {
	return (
		<>
			<Button className="bg-primary-500">Click me</Button>

			{/* Navigation Links */}
			<nav>
				<Link to="/booking-appointments">Booking Appointments</Link> |{" "}
				<Link to="/my-appointments">My Appointments</Link>
			</nav>
		</>
	);
}
