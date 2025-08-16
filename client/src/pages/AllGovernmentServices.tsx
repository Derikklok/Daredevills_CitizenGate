import {useState, useEffect} from "react";
import {fetchGovernmentServices} from "@/lib/serviceApi";
import type {GovernmentService} from "@/lib/types";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "@clerk/clerk-react";
import {Navigate} from "react-router-dom";

const AllGovernmentServices = () => {
	const navigate = useNavigate();
	const {category} = useParams<{category?: string}>();
	const {isSignedIn, isLoaded} = useAuth();
	const [services, setServices] = useState<GovernmentService[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
		null
	);

	useEffect(() => {
		const loadServices = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await fetchGovernmentServices();
				setServices(data);
			} catch (err) {
				console.error("Failed to fetch government services:", err);
				setError("Failed to load government services. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		loadServices();
	}, []);

	// Set category from URL parameter
	useEffect(() => {
		if (category) {
			const decodedCategory = decodeURIComponent(category);
			setSelectedCategory(decodedCategory);
		}
	}, [category]);

	// Extract unique categories and departments
	const categories = Array.from(
		new Set(services.map((service) => service.category))
	);
	const departments = Array.from(
		new Set(
			services.map((service) =>
				JSON.stringify({
					id: service.department.department_id,
					name: service.department.name,
				})
			)
		)
	).map((str) => JSON.parse(str));

	// Filter services based on search term, category, and department
	const filteredServices = services.filter((service) => {
		const matchesSearch =
			service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			service.description.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesCategory = selectedCategory
			? service.category === selectedCategory
			: true;
		const matchesDepartment = selectedDepartment
			? service.department.department_id === selectedDepartment
			: true;

		return matchesSearch && matchesCategory && matchesDepartment;
	});

	const handleViewDetails = (serviceId: string) => {
		navigate(`/services/${serviceId}`);
	};

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
		<div className="min-h-screen bg-gray-50">
			{/* Main content */}
			<div className="container mx-auto p-6">
				<header className="mb-8">
					<h1 className="text-3xl font-bold text-gray-800">
						{selectedCategory
							? `${selectedCategory} Services`
							: "Government Services"}
					</h1>
					<p className="text-gray-600">
						{selectedCategory
							? `Browse all ${selectedCategory.toLowerCase()} services offered by the government`
							: "Browse all services offered by the government"}
					</p>
				</header>

				{/* Filters section */}
				<div className="mb-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label
								htmlFor="search"
								className="text-sm font-medium mb-1 block">
								Search
							</label>
							<Input
								id="search"
								placeholder="Search services..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>

						<div>
							<label
								htmlFor="category"
								className="text-sm font-medium mb-1 block">
								Category
							</label>
							<select
								id="category"
								className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
								value={selectedCategory || ""}
								onChange={(e) => setSelectedCategory(e.target.value || null)}>
								<option value="">All Categories</option>
								{categories.map((category) => (
									<option key={category} value={category}>
										{category}
									</option>
								))}
							</select>
						</div>

						<div>
							<label
								htmlFor="department"
								className="text-sm font-medium mb-1 block">
								Department
							</label>
							<select
								id="department"
								className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
								value={selectedDepartment?.toString() || ""}
								onChange={(e) =>
									setSelectedDepartment(
										e.target.value ? Number(e.target.value) : null
									)
								}>
								<option value="">All Departments</option>
								{departments.map((dept) => (
									<option key={dept.id} value={dept.id}>
										{dept.name}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>

				{/* Services display */}
				{loading ? (
					<div className="text-center py-10">
						<p className="text-lg">Loading services...</p>
					</div>
				) : error ? (
					<div className="text-center py-10">
						<p className="text-lg text-red-500">{error}</p>
						<Button className="mt-4" onClick={() => window.location.reload()}>
							Try Again
						</Button>
					</div>
				) : (
					<>
						{/* Services count and filter summary */}
						<div className="mb-4 text-gray-600">
							Showing {filteredServices.length} of {services.length} services
							{selectedCategory && (
								<span>
									{" "}
									in <strong>{selectedCategory}</strong> category
								</span>
							)}
							{selectedDepartment && (
								<span>
									{" "}
									from{" "}
									<strong>
										{departments.find((d) => d.id === selectedDepartment)?.name}
									</strong>
								</span>
							)}
						</div>

						{filteredServices.length === 0 ? (
							<div className="text-center py-10">
								<p className="text-lg">No services match your filters.</p>
								<Button
									className="mt-4"
									onClick={() => {
										setSearchTerm("");
										setSelectedCategory(null);
										setSelectedDepartment(null);
									}}>
									Clear Filters
								</Button>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filteredServices.map((service) => (
									<Card
										key={service.service_id}
										className="overflow-hidden h-full flex flex-col">
										<CardHeader className="bg-gray-50">
											<div className="flex justify-between items-center">
												<CardTitle className="text-lg">
													{service.name}
												</CardTitle>
												<Badge>{service.category}</Badge>
											</div>
											<CardDescription>
												Provided by {service.department.name}
											</CardDescription>
										</CardHeader>
										<CardContent className="pt-4 flex-1">
											<p className="text-gray-700 line-clamp-3">
												{service.description}
											</p>
											<div className="mt-3 text-sm text-gray-500">
												Estimated completion time:{" "}
												{service.estimated_total_completion_time}
											</div>
										</CardContent>
										<CardFooter className="bg-gray-50">
											<Button
												className="w-full"
												onClick={() => handleViewDetails(service.service_id)}>
												View Details
											</Button>
										</CardFooter>
									</Card>
								))}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default AllGovernmentServices;
