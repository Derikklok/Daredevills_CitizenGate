import React, {useEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
import {
	AcademicCapIcon,
	HeartIcon,
	TruckIcon,
	HomeIcon,
	CurrencyDollarIcon,
	MagnifyingGlassIcon,
	XMarkIcon,
	BuildingOfficeIcon,
	ClipboardDocumentCheckIcon,
	BanknotesIcon,
	WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

import {
	TruckIcon as TruckSolidIcon,
	IdentificationIcon,
} from "@heroicons/react/24/solid";

// Clerk auth
import {useUser} from "@clerk/clerk-react";
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

// API imports
import {getServices} from "@/lib/api";
import type {Service} from "@/lib/types";

export default function Home() {
	const [categories, setCategories] = useState<string[]>([]);
	const [services, setServices] = useState<Service[]>([]);
	const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
	const [loading, setLoading] = useState(true);
	const [showAll, setShowAll] = useState(false);
	const [search, setSearch] = useState("");
	const [menuOpen, setMenuOpen] = useState(false);

	const navigate = useNavigate();
	const {isSignedIn, user} = useUser();
	const {isAdmin, isLoading: adminLoading} = useIsAdmin();
	const {isServiceAdmin, isLoading: serviceAdminLoading} = useIsServiceAdmin();
	const {isAnyAdmin, isLoading: anyAdminLoading} = useIsAnyAdmin();

	const categoryIcons: Record<string, React.ReactElement> = {
		Healthcare: <HeartIcon className="h-6 w-6 text-pink-600" />,
		Health: <HeartIcon className="h-6 w-6 text-pink-600" />,
		Education: <AcademicCapIcon className="h-6 w-6 text-pink-600" />,
		Transport: <TruckIcon className="h-6 w-6 text-pink-600" />,
		Transportation: <TruckIcon className="h-6 w-6 text-pink-600" />,
		Housing: <HomeIcon className="h-6 w-6 text-pink-600" />,
		Finance: <CurrencyDollarIcon className="h-6 w-6 text-pink-600" />,
		Financial: <CurrencyDollarIcon className="h-6 w-6 text-pink-600" />,
		Government: <BuildingOfficeIcon className="h-6 w-6 text-pink-600" />,
		Documentation: (
			<ClipboardDocumentCheckIcon className="h-6 w-6 text-pink-600" />
		),
		Documents: <ClipboardDocumentCheckIcon className="h-6 w-6 text-pink-600" />,
		Legal: <ClipboardDocumentCheckIcon className="h-6 w-6 text-pink-600" />,
		Business: <BanknotesIcon className="h-6 w-6 text-pink-600" />,
		Services: <WrenchScrewdriverIcon className="h-6 w-6 text-pink-600" />,
		Identity: <IdentificationIcon className="h-6 w-6 text-pink-600" />,
	};

	const handleClear = () => {
		setSearch("");
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				// Fetch services
				const servicesData = await getServices();

				setServices(servicesData);

				// Extract unique categories from services
				const uniqueCategories = Array.from(
					new Set(
						servicesData
							.map((service) => service.category)
							.filter((category) => category && category.trim() !== "")
					)
				);
				setCategories(uniqueCategories);

				// Set featured services (first 6 services or services with specific criteria)
				const featured = servicesData.slice(0, 6);
				setFeaturedServices(featured);
			} catch (error) {
				console.error("Error fetching data:", error);
				// Fallback to default categories if API fails
				setCategories([
					"Healthcare",
					"Education",
					"Transport",
					"Housing",
					"Finance",
				]);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// Filter categories and services based on search
	const filteredCategories = categories.filter((category) =>
		category.toLowerCase().includes(search.toLowerCase())
	);

	const filteredServices = services.filter(
		(service) =>
			service.name.toLowerCase().includes(search.toLowerCase()) ||
			service.description?.toLowerCase().includes(search.toLowerCase()) ||
			service.category?.toLowerCase().includes(search.toLowerCase())
	);

	const displayedCategories = showAll
		? filteredCategories
		: filteredCategories.slice(0, 4);

	// Update featured services based on search
	const displayedFeaturedServices = search
		? filteredServices.slice(0, 6)
		: featuredServices;

	// Show loading state while checking admin roles or fetching data
	if (adminLoading || serviceAdminLoading || anyAdminLoading || loading) {
		return (
			<div className="p-4 sm:p-6 lg:p-12 max-w-7xl mx-auto space-y-6">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#600D29] mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
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

			{displayedCategories.length > 0 ? (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
					{displayedCategories.map((category) => (
						<CategoryCard
							key={category}
							name={category}
							icon={
								categoryIcons[category] || (
									<WrenchScrewdriverIcon className="h-6 w-6 text-pink-600" />
								)
							}
							onClick={() =>
								navigate(`/services/category/${encodeURIComponent(category)}`)
							}
						/>
					))}
				</div>
			) : search ? (
				<div className="text-center py-8 text-gray-500">
					<p>No categories found matching "{search}"</p>
				</div>
			) : (
				<div className="text-center py-8 text-gray-500">
					<p>No categories available at the moment.</p>
				</div>
			)}

			{/* Featured Services */}
			{displayedFeaturedServices.length > 0 && (
				<>
					<h2 className="text-xl sm:text-2xl font-bold mt-4 text-[#600D29] font-sans">
						{search
							? `Search Results (${displayedFeaturedServices.length})`
							: "Featured Services"}
					</h2>

					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
						{displayedFeaturedServices.map((service) => {
							// Get an icon based on service category or name
							const getServiceIcon = (service: Service) => {
								const category = service.category?.toLowerCase() || "";
								const name = service.name.toLowerCase();

								if (
									name.includes("vehicle") ||
									name.includes("license") ||
									category.includes("transport")
								) {
									return <TruckSolidIcon className="h-6 w-6" />;
								}
								if (
									name.includes("nic") ||
									name.includes("identity") ||
									name.includes("passport")
								) {
									return <IdentificationIcon className="h-6 w-6" />;
								}
								if (category.includes("health")) {
									return <HeartIcon className="h-6 w-6" />;
								}
								if (category.includes("education")) {
									return <AcademicCapIcon className="h-6 w-6" />;
								}
								if (
									category.includes("finance") ||
									category.includes("business")
								) {
									return <CurrencyDollarIcon className="h-6 w-6" />;
								}
								// Default icon
								return <ClipboardDocumentCheckIcon className="h-6 w-6" />;
							};

							return (
								<div
									key={service.service_id}
									className="p-[2px] rounded-lg bg-gradient-to-r from-[#600D29] via-[#A8174E] to-[#600D29]">
									<button
										onClick={() => navigate(`/services/${service.service_id}`)}
										className="flex items-center gap-4 bg-white px-4 py-3 rounded-lg w-full text-left">
										<span className="bg-[#600D29] text-white p-3 rounded-full">
											{getServiceIcon(service)}
										</span>
										<div className="flex-1">
											<div className="font-bold text-[#600D29]">
												{service.name}
											</div>
											<div
												className="text-sm sm:text-base text-gray-500 overflow-hidden"
												style={{
													display: "-webkit-box",
													WebkitLineClamp: 2,
													WebkitBoxOrient: "vertical",
												}}>
												{service.description ||
													`Book your ${service.name} appointment easily through our online platform.`}
											</div>
											{service.estimated_total_completion_time && (
												<div className="text-xs text-gray-400 mt-1">
													Est. {service.estimated_total_completion_time}
												</div>
											)}
										</div>
									</button>
								</div>
							);
						})}
					</div>
				</>
			)}

			{/* No search results message */}
			{search &&
				displayedFeaturedServices.length === 0 &&
				displayedCategories.length === 0 && (
					<div className="text-center py-12">
						<div className="text-gray-400 mb-4">
							<MagnifyingGlassIcon className="h-16 w-16 mx-auto" />
						</div>
						<h3 className="text-lg font-semibold text-gray-600 mb-2">
							No results found
						</h3>
						<p className="text-gray-500">
							We couldn't find any services or categories matching "{search}".
						</p>
						<Button
							onClick={() => setSearch("")}
							variant="outline"
							className="mt-4 border-[#600D29] text-[#600D29] hover:bg-[#600D29] hover:text-white">
							Clear search
						</Button>
					</div>
				)}

			{/* Side Menu Drawer */}
			{menuOpen && <SideMenu user={user} onClose={() => setMenuOpen(false)} />}
		</div>
	);
}
