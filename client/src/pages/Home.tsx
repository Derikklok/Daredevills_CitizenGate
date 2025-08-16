import React, {useEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import citizenGateLogo from "../components/images/CitizenGate.png";
import CategoryCard from "../components/CategoryCard";
import {
	AcademicCapIcon,
	HeartIcon,
	TruckIcon,
	HomeIcon,
	CurrencyDollarIcon,
	MagnifyingGlassIcon,
	XMarkIcon,
	Bars3Icon,
} from "@heroicons/react/24/outline";

import {
	TruckIcon as TruckSolidIcon,
	IdentificationIcon,
} from "@heroicons/react/24/solid";

// Clerk auth
import {useClerk, useUser} from "@clerk/clerk-react";
import SideMenu from "./client-pages/SideMenu";
import {Button} from "@/components/ui/button";
import {useIsAdmin, useIsServiceAdmin, useIsAnyAdmin} from "@/hooks/useAuth";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function Home() {
	const [categories, setCategories] = useState<string[]>([]);
	const [showAll, setShowAll] = useState(false);
	const [search, setSearch] = useState("");
	const [menuOpen, setMenuOpen] = useState(false);

	const navigate = useNavigate();
	const {openSignIn} = useClerk();
	const {isSignedIn, user} = useUser();
	const {isAdmin, isLoading: adminLoading} = useIsAdmin();
	const {isServiceAdmin, isLoading: serviceAdminLoading} = useIsServiceAdmin();
	const {isAnyAdmin, isLoading: anyAdminLoading} = useIsAnyAdmin();

	const categoryIcons: Record<string, React.ReactElement> = {
		Healthcare: <HeartIcon className="h-6 w-6 text-pink-600" />,
		Education: <AcademicCapIcon className="h-6 w-6 text-pink-600" />,
		Transport: <TruckIcon className="h-6 w-6 text-pink-600" />,
		Housing: <HomeIcon className="h-6 w-6 text-pink-600" />,
		Finance: <CurrencyDollarIcon className="h-6 w-6 text-pink-600" />,
	};

	const handleClear = () => {
		setSearch("");
	};

	useEffect(() => {
		const mockCategories = [
			"Healthcare",
			"Education",
			"Transport",
			"Housing",
			"Finance",
		];
		setCategories(mockCategories);
	}, []);

	const displayedCategories = showAll ? categories : categories.slice(0, 4);

	// Show loading state while checking admin roles
	if (adminLoading || serviceAdminLoading || anyAdminLoading) {
		return (
			<div className="p-4 sm:p-6 lg:p-12 max-w-7xl mx-auto space-y-6">
				<div className="text-center">Loading...</div>
			</div>
		);
	}

	return (
		<div className="p-4 sm:p-6 lg:p-12 max-w-7xl mx-auto space-y-6">
			{/* Welcome Message */}
			{isSignedIn && (
				<div className="mb-6">
					<h1 className="text-2xl sm:text-3xl font-bold text-[#600D29]">
						Welcome to CitizenGate{user?.firstName ? `, ${user.firstName}` : ""}
					</h1>
					<p className="text-gray-600 mt-2">
						Book and manage your government appointments with ease
					</p>
				</div>
			)}

			{/* Admin Section */}
			{isAnyAdmin && (
				<div className="mb-8">
					<h2 className="text-xl sm:text-2xl font-bold text-[#600D29] mb-4">
						Administration
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{isAdmin && (
							<Card>
								<CardHeader>
									<CardTitle>System Administration</CardTitle>
									<CardDescription>
										Manage departments and system-wide settings
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-gray-500">
										As a System Administrator, you can manage all departments,
										users, and system settings.
									</p>
								</CardContent>
								<CardFooter>
									<Button
										asChild
										className="w-full bg-[#600D29] hover:bg-[#600D29]/90">
										<Link to="/admin">Go to Admin Dashboard</Link>
									</Button>
								</CardFooter>
							</Card>
						)}

						{isServiceAdmin && (
							<Card>
								<CardHeader>
									<CardTitle>Service Administration</CardTitle>
									<CardDescription>
										Manage your department's services and appointments
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-gray-500">
										As a Service Administrator, you can manage services,
										document requirements, and appointments for your department.
									</p>
								</CardContent>
								<CardFooter>
									<Button
										asChild
										className="w-full bg-[#600D29] hover:bg-[#600D29]/90">
										<Link to="/service-admin">Go to Service Dashboard</Link>
									</Button>
								</CardFooter>
							</Card>
						)}
					</div>
				</div>
			)}

			{/* Quick Actions */}
			{isSignedIn && (
				<div className="mb-8">
					<h2 className="text-xl sm:text-2xl font-bold text-[#600D29] mb-4">
						Quick Actions
					</h2>
					<div className="flex flex-col sm:flex-row gap-4">
						<Button asChild className="bg-[#600D29] hover:bg-[#600D29]/90">
							<Link to="/booking-appointments">Book New Appointment</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							className="border-[#600D29] text-[#600D29] hover:bg-[#600D29] hover:text-white">
							<Link to="/my-appointments">View My Appointments</Link>
						</Button>
						<Button asChild variant="secondary">
							<Link to="/services/all">View All Government Services</Link>
						</Button>
					</div>
				</div>
			)}

			{/* Search */}
			<div className="relative w-full">
				<input
					type="text"
					placeholder="Discover services"
					className="w-full pl-10 pr-10 p-2 sm:p-3 border rounded"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
				{search && (
					<XMarkIcon
						className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
						onClick={handleClear}
					/>
				)}
			</div>

			{/* Categories */}
			<div className="flex justify-between items-center">
				<h2 className="text-xl sm:text-2xl font-bold mt-4 text-[#600D29] font-sans">
					Categories
				</h2>
				<button
					onClick={() => setShowAll((prev) => !prev)}
					className="text-sm sm:text-base text-[#600D29]">
					{showAll ? "Show Less" : "See All"}
				</button>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
				{displayedCategories.map((category) => (
					<CategoryCard
						key={category}
						name={category}
						icon={categoryIcons[category]}
						onClick={() => console.log("Clicked:", category)}
					/>
				))}
			</div>

			{/* Featured Services */}
			<h2 className="text-xl sm:text-2xl font-bold mt-4 text-[#600D29] font-sans">
				Most Viewed Services
			</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
				{/* Vehicle License Renewal */}
				<div className="p-[2px] rounded-lg bg-gradient-to-r from-[#600D29] via-[#A8174E] to-[#600D29]">
					<button
						onClick={() => navigate("/vehicle-license-renewal")}
						className="flex items-center gap-4 bg-white px-4 py-3 rounded-lg w-full text-left">
						<span className="bg-[#600D29] text-white p-3 rounded-full">
							<TruckSolidIcon className="h-6 w-6" />
						</span>
						<div>
							<div className="font-bold text-[#600D29]">
								Vehicle License Renewal
							</div>
							<div className="text-sm sm:text-base text-gray-500">
								Keep your vehicle license up to date with our easy online
								renewal service.
							</div>
						</div>
					</button>
				</div>

				{/* Create NIC */}
				<div className="p-[2px] rounded-lg bg-gradient-to-r from-[#600D29] via-[#A8174E] to-[#600D29]">
					<button
						onClick={() => navigate("/create-nic")}
						className="flex items-center gap-4 bg-white px-4 py-3 rounded-lg w-full text-left">
						<span className="bg-[#600D29] text-white p-3 rounded-full">
							<IdentificationIcon className="h-6 w-6" />
						</span>
						<div>
							<div className="font-bold text-[#600D29]">Create NIC</div>
							<div className="text-sm sm:text-base text-gray-500">
								Apply for your National Identity Card easily with our online
								service.
							</div>
						</div>
					</button>
				</div>
			</div>

			{/* Side Menu Drawer */}
			{menuOpen && <SideMenu user={user} onClose={() => setMenuOpen(false)} />}
		</div>
	);
}
