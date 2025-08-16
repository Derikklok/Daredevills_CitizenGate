import {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {useUser, useAuth} from "@clerk/clerk-react";
import {
	ClockIcon,
	BuildingOfficeIcon,
	DocumentTextIcon,
	CheckCircleIcon,
	ExclamationTriangleIcon,
	ArrowLeftIcon,
	CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import {Button} from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {
	getServices,
	getRequiredDocuments,
	createDraftAppointment,
} from "@/lib/api";
import type {Service, RequiredDocument} from "@/lib/types";

export default function ServiceDetailsPage() {
	const {serviceId} = useParams<{serviceId: string}>();
	const navigate = useNavigate();
	const {user} = useUser();
	const {getToken} = useAuth();

	const [service, setService] = useState<Service | null>(null);
	const [requiredDocuments, setRequiredDocuments] = useState<
		RequiredDocument[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [bookingLoading, setBookingLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchServiceDetails = async () => {
			try {
				setLoading(true);
				setError(null);

				if (!serviceId) {
					setError("Service ID is required");
					return;
				}

				// Fetch all services and find the one we need
				const services = await getServices();
				const foundService = services.find((s) => s.service_id === serviceId);

				if (!foundService) {
					setError("Service not found");
					return;
				}

				setService(foundService);

				// Fetch required documents for this service
				try {
					const documents = await getRequiredDocuments(serviceId);
					setRequiredDocuments(documents);
				} catch (docError) {
					console.warn("Could not fetch required documents:", docError);
					// Don't set error here as the service details are still valid
				}
			} catch (error) {
				console.error("Error fetching service details:", error);
				setError("Failed to load service details");
			} finally {
				setLoading(false);
			}
		};

		fetchServiceDetails();
	}, [serviceId]);

	const handleBookAppointment = async () => {
		if (!service || !user) return;

		try {
			setBookingLoading(true);
			const token = await getToken();

			if (!token) {
				navigate("/sign-in");
				return;
			}

			// Create a draft appointment
			const draftResponse = await createDraftAppointment(
				{
					user_id: user.id,
					// We'll set other required fields in the booking flow
				},
				token
			);

			// Navigate to calendar view with the draft appointment
			navigate(
				`/calendar/${service.service_id}?appointmentId=${draftResponse.appointment_id}`
			);
		} catch (error) {
			console.error("Error creating draft appointment:", error);
			// Still navigate to calendar view as fallback
			navigate(`/calendar/${service.service_id}`);
		} finally {
			setBookingLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#600D29] mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading service details...</p>
				</div>
			</div>
		);
	}

	if (error || !service) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center max-w-md mx-auto">
					<ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						{error || "Service not found"}
					</h2>
					<p className="text-gray-600 mb-6">
						We couldn't find the service you're looking for.
					</p>
					<Button
						onClick={() => navigate("/")}
						className="bg-[#600D29] hover:bg-[#600D29]/90">
						<ArrowLeftIcon className="h-4 w-4 mr-2" />
						Back to Home
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-4xl mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-6">
					<Button
						variant="ghost"
						onClick={() => navigate(-1)}
						className="mb-4 text-[#600D29] hover:text-[#600D29]/80">
						<ArrowLeftIcon className="h-4 w-4 mr-2" />
						Back
					</Button>

					<div className="bg-white rounded-lg shadow-sm border p-6">
						<div className="space-y-6">
							<div>
								<h1 className="text-3xl font-bold text-[#600D29] mb-2">
									{service.name}
								</h1>

								{service.category && (
									<Badge variant="secondary" className="mb-3">
										{service.category}
									</Badge>
								)}

								{service.description && (
									<p className="text-gray-700 mb-4 leading-relaxed">
										{service.description}
									</p>
								)}

								<div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
									{service.department && (
										<div className="flex items-center gap-2">
											<BuildingOfficeIcon className="h-4 w-4" />
											<span>{service.department.name}</span>
										</div>
									)}

									{service.estimated_total_completion_time && (
										<div className="flex items-center gap-2">
											<ClockIcon className="h-4 w-4" />
											<span>{service.estimated_total_completion_time}</span>
										</div>
									)}
								</div>
							</div>

							<div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
								<Button
									onClick={handleBookAppointment}
									disabled={bookingLoading}
									className="bg-[#600D29] hover:bg-[#600D29]/90 text-white flex-1 sm:flex-none">
									{bookingLoading ? (
										<>
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
											Booking...
										</>
									) : (
										<>
											<CalendarDaysIcon className="h-4 w-4 mr-2" />
											Book Appointment
										</>
									)}
								</Button>

								<Button
									variant="outline"
									onClick={() => navigate("/services/all")}
									className="border-[#600D29] text-[#600D29] hover:bg-[#600D29] hover:text-white">
									View All Services
								</Button>
							</div>
						</div>
					</div>
				</div>

				{/* Service Information Cards */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
					{/* Department Information */}
					{service.department && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<BuildingOfficeIcon className="h-5 w-5 text-[#600D29]" />
									Department Information
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div>
										<p className="font-semibold text-gray-900">
											{service.department.name}
										</p>
										{service.department.description && (
											<p className="text-sm text-gray-600 mt-1">
												{service.department.description}
											</p>
										)}
									</div>

									{service.department.address && (
										<div>
											<p className="text-sm font-medium text-gray-700">
												Address:
											</p>
											<p className="text-sm text-gray-600">
												{service.department.address}
											</p>
										</div>
									)}

									<div className="flex flex-col gap-1">
										{service.department.contact_email && (
											<p className="text-sm text-gray-600">
												<span className="font-medium">Email:</span>{" "}
												{service.department.contact_email}
											</p>
										)}
										{service.department.contact_phone && (
											<p className="text-sm text-gray-600">
												<span className="font-medium">Phone:</span>{" "}
												{service.department.contact_phone}
											</p>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Processing Time */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<ClockIcon className="h-5 w-5 text-[#600D29]" />
								Processing Information
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{service.estimated_total_completion_time ? (
									<div>
										<p className="text-sm font-medium text-gray-700">
											Estimated Completion Time:
										</p>
										<p className="text-lg font-semibold text-[#600D29]">
											{service.estimated_total_completion_time}
										</p>
									</div>
								) : (
									<p className="text-sm text-gray-600">
										Processing time information will be provided during your
										appointment.
									</p>
								)}

								<div className="pt-2 border-t border-gray-200">
									<p className="text-xs text-gray-500">
										Processing times may vary based on individual circumstances
										and document verification requirements.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Required Documents */}
				{requiredDocuments.length > 0 && (
					<Card className="mb-8">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<DocumentTextIcon className="h-5 w-5 text-[#600D29]" />
								Required Documents
							</CardTitle>
							<CardDescription>
								Please ensure you have the following documents ready for your
								appointment.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 gap-4">
								{requiredDocuments.map((doc) => (
									<div
										key={doc.document_id}
										className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
										<CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
										<div>
											<p className="font-medium text-gray-900">{doc.name}</p>
											{doc.description && (
												<p className="text-sm text-gray-600 mt-1">
													{doc.description}
												</p>
											)}
											{doc.is_mandatory && (
												<Badge variant="destructive" className="mt-2 text-xs">
													Required
												</Badge>
											)}
										</div>
									</div>
								))}
							</div>
						</CardContent>
						<CardFooter>
							<p className="text-sm text-gray-600">
								<strong>Note:</strong> You can upload these documents during the
								booking process or bring them to your appointment.
							</p>
						</CardFooter>
					</Card>
				)}

				{/* Quick Booking Section */}
				<Card className="bg-gradient-to-r from-[#600D29]/5 to-[#A8174E]/5 border-[#600D29]/20">
					<CardHeader>
						<CardTitle className="text-[#600D29]">Ready to Book?</CardTitle>
						<CardDescription>
							Schedule your appointment now and we'll guide you through the
							process.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<h4 className="font-semibold text-gray-900 mb-2">
									What happens next:
								</h4>
								<ul className="text-sm text-gray-600 space-y-1">
									<li>• Choose your preferred date and time</li>
									<li>• Upload required documents (optional)</li>
									<li>• Receive appointment confirmation</li>
									<li>• Get reminded before your appointment</li>
								</ul>
							</div>

							<div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-end">
								<Button
									onClick={handleBookAppointment}
									disabled={bookingLoading}
									size="lg"
									className="bg-[#600D29] hover:bg-[#600D29]/90 text-white w-full sm:w-auto">
									{bookingLoading ? (
										<>
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
											Processing...
										</>
									) : (
										<>
											<CalendarDaysIcon className="h-4 w-4 mr-2" />
											Book Appointment Now
										</>
									)}
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
