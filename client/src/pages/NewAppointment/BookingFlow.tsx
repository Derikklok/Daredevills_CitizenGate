import {useState, useEffect} from "react";
import {Link, useSearchParams} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {
	Building2,
	ChevronRight,
	ClipboardList,
	MapPin,
	Phone,
	Mail,
	Clock,
} from "lucide-react";
import {getDepartments} from "@/lib/api";
import type {Department, Service} from "@/lib/types";

const BookingFlow = () => {
	const [searchParams] = useSearchParams();
	const appointmentId = searchParams.get("appointmentId");
	const [departments, setDepartments] = useState<Department[]>([]);
	const [selectedDepartment, setSelectedDepartment] =
		useState<Department | null>(null);
	const [selectedService, setSelectedService] = useState<Service | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch departments data
	useEffect(() => {
		const fetchDepartments = async () => {
			try {
				setIsLoading(true);
				const data = await getDepartments();
				setDepartments(data);
				setError(null);
			} catch (err) {
				console.error("Error fetching departments:", err);
				setError("Failed to load departments. Please try again later.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchDepartments();
	}, []);

	// Handle department selection
	const handleDepartmentSelect = (department: Department) => {
		setSelectedDepartment(department);
		setSelectedService(null);
	};

	// Handle service selection
	const handleServiceSelect = (service: Service) => {
		setSelectedService(service);
	};

	// Reset selection to go back to department list
	const handleBackToDepartments = () => {
		setSelectedDepartment(null);
		setSelectedService(null);
	};

	// Reset selection to go back to service list
	const handleBackToServices = () => {
		setSelectedService(null);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-primary-600 text-white p-6">
				<div className="max-w-6xl mx-auto">
					<h1 className="text-3xl font-bold mb-2">
						Book Government Appointments
					</h1>
					<p className="text-lg">
						Select a department, service, and schedule your appointment
					</p>
				</div>
			</header>

			{/* Breadcrumb Navigation */}
			<div className="bg-white border-b">
				<div className="max-w-6xl mx-auto py-4 px-6">
					<div className="flex items-center text-sm">
						<Link to="/" className="text-gray-500 hover:text-primary-600">
							Home
						</Link>
						<ChevronRight size={16} className="mx-2 text-gray-400" />
						<span className="text-gray-500">Book Appointment</span>
						{selectedDepartment && (
							<>
								<ChevronRight size={16} className="mx-2 text-gray-400" />
								<button
									onClick={handleBackToDepartments}
									className="text-primary-600 hover:underline">
									{selectedDepartment.name}
								</button>
							</>
						)}
						{selectedService && (
							<>
								<ChevronRight size={16} className="mx-2 text-gray-400" />
								<button
									onClick={handleBackToServices}
									className="text-primary-600 hover:underline">
									{selectedService.name}
								</button>
							</>
						)}
					</div>
				</div>
			</div>

			{/* Main Content */}
			<main className="max-w-6xl mx-auto p-6">
				{isLoading ? (
					<div className="flex justify-center p-10">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
					</div>
				) : error ? (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
						{error}
					</div>
				) : (
					<>
						{/* Step 1: Select Department */}
						{!selectedDepartment && (
							<div>
								<div className="flex items-center mb-6">
									<Building2 size={24} className="mr-3 text-primary-600" />
									<h2 className="text-2xl font-bold">Select a Department</h2>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{departments.map((department) => (
										<div
											key={department.department_id}
											className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
											onClick={() => handleDepartmentSelect(department)}>
											<div className="p-6">
												<h3 className="font-bold text-xl mb-3 text-primary-600">
													{department.name}
												</h3>

												<div className="space-y-3 mb-4 text-gray-600">
													{department.address && (
														<div className="flex items-start">
															<MapPin
																size={18}
																className="mr-2 text-gray-400 mt-0.5 flex-shrink-0"
															/>
															<span>{department.address}</span>
														</div>
													)}
													{department.contact_email && (
														<div className="flex items-center">
															<Mail
																size={18}
																className="mr-2 text-gray-400 flex-shrink-0"
															/>
															<span className="text-sm">
																{department.contact_email}
															</span>
														</div>
													)}
													{department.contact_phone && (
														<div className="flex items-center">
															<Phone
																size={18}
																className="mr-2 text-gray-400 flex-shrink-0"
															/>
															<span>{department.contact_phone}</span>
														</div>
													)}
												</div>

												<div className="flex justify-between items-center mt-4">
													<span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
														{department.services.length} Services
													</span>
													<ChevronRight
														size={20}
														className="text-primary-600"
													/>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Step 2: Select Service */}
						{selectedDepartment && !selectedService && (
							<div>
								<div className="flex items-center mb-6">
									<ClipboardList size={24} className="mr-3 text-primary-600" />
									<h2 className="text-2xl font-bold">Select a Service</h2>
								</div>

								<div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
									<h3 className="font-bold text-xl mb-3 text-primary-600">
										{selectedDepartment.name}
									</h3>
									<div className="space-y-2 text-gray-600 mb-4">
										{selectedDepartment.address && (
											<div className="flex items-start">
												<MapPin
													size={18}
													className="mr-2 text-gray-400 mt-0.5 flex-shrink-0"
												/>
												<span>{selectedDepartment.address}</span>
											</div>
										)}
										{selectedDepartment.contact_email && (
											<div className="flex items-center">
												<Mail
													size={18}
													className="mr-2 text-gray-400 flex-shrink-0"
												/>
												<span className="text-sm">
													{selectedDepartment.contact_email}
												</span>
											</div>
										)}
										{selectedDepartment.contact_phone && (
											<div className="flex items-center">
												<Phone
													size={18}
													className="mr-2 text-gray-400 flex-shrink-0"
												/>
												<span>{selectedDepartment.contact_phone}</span>
											</div>
										)}
									</div>
									<Button
										variant="outline"
										className="text-primary-600 border-primary-600"
										onClick={handleBackToDepartments}>
										Choose Different Department
									</Button>
								</div>

								<div className="mt-8">
									<h3 className="text-xl font-semibold mb-4">
										Available Services
									</h3>

									{selectedDepartment.services.length === 0 ? (
										<div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded">
											No services available for this department at the moment.
										</div>
									) : (
										<div className="space-y-4">
											{selectedDepartment.services.map((service: Service) => (
												<div
													key={service.service_id}
													className="bg-white p-6 rounded-lg border hover:border-primary-600 hover:shadow-md transition-all cursor-pointer"
													onClick={() => handleServiceSelect(service)}>
													<h4 className="text-lg font-bold text-primary-600 mb-2">
														{service.name}
													</h4>
													<p className="text-gray-600 mb-4">
														{service.description}
													</p>

													<div className="flex flex-wrap gap-3">
														<div className="bg-gray-100 px-3 py-1 rounded text-sm flex items-center">
															<Clock size={14} className="mr-1 text-gray-500" />
															{service.estimated_total_completion_time}
														</div>
														{service.category && (
															<div className="bg-gray-100 px-3 py-1 rounded text-sm">
																{service.category}
															</div>
														)}
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						)}

						{/* Step 3: View Availability */}
						{selectedService && (
							<div>
								<div className="flex items-center mb-6">
									<Clock size={24} className="mr-3 text-primary-600" />
									<h2 className="text-2xl font-bold">
										Service Details & Availability
									</h2>
								</div>

								<div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
									<h3 className="font-bold text-xl mb-2 text-primary-600">
										{selectedService.name}
									</h3>
									<p className="text-gray-600 mb-4">
										{selectedService.description}
									</p>

									<div className="flex flex-wrap gap-4 mb-6">
										<div className="bg-gray-100 px-4 py-2 rounded-lg">
											<span className="text-gray-500 font-medium">
												Department:
											</span>{" "}
											<span className="text-gray-800">
												{selectedDepartment?.name}
											</span>
										</div>
										<div className="bg-gray-100 px-4 py-2 rounded-lg">
											<span className="text-gray-500 font-medium">
												Category:
											</span>{" "}
											<span className="text-gray-800">
												{selectedService.category}
											</span>
										</div>
										<div className="bg-gray-100 px-4 py-2 rounded-lg">
											<span className="text-gray-500 font-medium">
												Estimated Time:
											</span>{" "}
											<span className="text-gray-800">
												{selectedService.estimated_total_completion_time}
											</span>
										</div>
									</div>

									<div className="flex gap-3">
										<Button
											variant="outline"
											className="text-primary-600 border-primary-600"
											onClick={handleBackToServices}>
											Choose Different Service
										</Button>

										<Link
											to={`/calendar/${selectedService.service_id}${
												appointmentId ? `?appointmentId=${appointmentId}` : ""
											}`}>
											<Button className="bg-primary-600 hover:bg-primary-600/90">
												View Available Slots
											</Button>
										</Link>
									</div>
								</div>
							</div>
						)}
					</>
				)}
			</main>
		</div>
	);
};

export default BookingFlow;
