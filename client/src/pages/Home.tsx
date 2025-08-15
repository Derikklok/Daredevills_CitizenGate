import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsAdmin, useIsServiceAdmin, useIsAnyAdmin } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/clerk-react";

export default function Home() {
	const { user } = useUser();
	const isAdmin = useIsAdmin();
	const isServiceAdmin = useIsServiceAdmin();
	const isAnyAdmin = useIsAnyAdmin();

	return (
		<div className="constrained-width container mx-auto bg-white min-h-screen flex flex-col items-center py-4 px-4">
			<main className="py-6 w-full">
				<div className="mb-8">
					<h1 className="text-2xl font-bold mb-4">Welcome to CitizenGate{user?.firstName ? `, ${user.firstName}` : ""}</h1>
					<p className="text-gray-600">
						Book and manage your government appointments with ease
					</p>
				</div>

				{isAnyAdmin && (
					<div className="mb-8">
						<h2 className="text-xl font-bold mb-4">Administration</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{isAdmin && (
								<Card>
									<CardHeader>
										<CardTitle>System Administration</CardTitle>
										<CardDescription>Manage departments and system-wide settings</CardDescription>
									</CardHeader>
									<CardContent>
										<p className="text-sm text-gray-500">
											As a System Administrator, you can manage all departments, users, and system settings.
										</p>
									</CardContent>
									<CardFooter>
										<Button asChild className="w-full">
											<Link to="/admin">Go to Admin Dashboard</Link>
										</Button>
									</CardFooter>
								</Card>
							)}
							
							{isServiceAdmin && (
								<Card>
									<CardHeader>
										<CardTitle>Service Administration</CardTitle>
										<CardDescription>Manage your department's services and appointments</CardDescription>
									</CardHeader>
									<CardContent>
										<p className="text-sm text-gray-500">
											As a Service Administrator, you can manage services, document requirements, and appointments for your department.
										</p>
									</CardContent>
									<CardFooter>
										<Button asChild className="w-full">
											<Link to="/service-admin">Go to Service Dashboard</Link>
										</Button>
									</CardFooter>
								</Card>
							)}
						</div>
					</div>
				)}

				<h2 className="text-xl font-bold mb-4">Quick Actions</h2>
				<div className="flex flex-col md:flex-row gap-4 mb-6 mx-auto w-full">
					<Button asChild className="bg-primary hover:bg-primary/90">
						<Link to="/booking-appointments">Book New Appointment</Link>
					</Button>
					<Button asChild variant="outline">
						<Link to="/my-appointments">View My Appointments</Link>
					</Button>
					<Button asChild variant="secondary">
						<Link to="/services/all">View All Government Services</Link>
					</Button>
				</div>
			</main>
		</div>
	);
}
