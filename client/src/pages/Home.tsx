import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button";

export default function Home() {
	return (
		<div className="constrained-width container mx-auto bg-white min-h-screen flex flex-col items-center">
			<main className="py-6">
				<div className="mb-8">
					<h1 className="text-2xl font-bold mb-4">Welcome to CitizenGate</h1>
					<p className="text-gray-600">
						Book and manage your government appointments with ease
					</p>
				</div>

				<div className="flex flex-col md:flex-row gap-4 mb-6 mx-auto w-full">
					<Button asChild className="bg-primary hover:bg-primary/90">
						<Link to="/booking-appointments">Book New Appointment</Link>
					</Button>
					<Button asChild variant="outline">
						<Link to="/my-appointments">View My Appointments</Link>
					</Button>
				</div>
			</main>
		</div>
	);
}
