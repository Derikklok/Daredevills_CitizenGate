import {useEffect, useState} from "react";
import {MyAppointmentCard} from "@/components/appointments/MyAppointmentCard";
import {DraftAppointmentCard} from "@/components/appointments/DraftAppointmentCard";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Badge} from "@/components/ui/badge";
import type {Appointment} from "@/lib/types";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@clerk/clerk-react";
import {createDraftAppointment, getUserAppointments} from "@/lib/api";
import {FileText, Calendar, CheckCircle, AlertCircle} from "lucide-react";

const MyAppointments = () => {
	const navigate = useNavigate();
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [isCreatingDraft, setIsCreatingDraft] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const {getToken} = useAuth();

	const handleBookAppointment = async () => {
		try {
			setIsCreatingDraft(true);

			const token = await getToken();
			if (!token) return;

			const draft = await createDraftAppointment(
				{
					// Empty object - service will be added later
				},
				token
			);
			if (draft) {
				navigate(`/book-appointment/new?appointmentId=${draft.appointment_id}`);
			}
		} catch (error) {
			console.error("Failed to start appointment booking:", error);
		} finally {
			setIsCreatingDraft(false);
		}
	};

	// Separate appointments by status
	const draftAppointments = appointments.filter(
		(apt) => apt.appointment_status?.toLowerCase() === "draft"
	);
	const pendingAppointments = appointments.filter(
		(apt) =>
			apt.appointment_status?.toLowerCase() === "pending" ||
			apt.appointment_status?.toLowerCase() === "confirmed" ||
			apt.appointment_status?.toLowerCase() === "scheduled"
	);
	const completedAppointments = appointments.filter(
		(apt) => apt.appointment_status?.toLowerCase() === "completed"
	);
	const cancelledAppointments = appointments.filter(
		(apt) => apt.appointment_status?.toLowerCase() === "cancelled"
	);

	const refreshAppointments = async () => {
		try {
			const token = await getToken();
			if (!token) return;
			const data = await getUserAppointments(token);
			setAppointments(data);
		} catch (error) {
			console.error("Failed to refresh appointments:", error);
		}
	};

	useEffect(() => {
		const fetchAppointments = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const token = await getToken();
				if (!token) {
					setError("Authentication required");
					return;
				}

				const data: Appointment[] = await getUserAppointments(token);
				setAppointments(data);
			} catch (error) {
				console.error("Failed to fetch appointments:", error);
				setError(
					error instanceof Error ? error.message : "Failed to load appointments"
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAppointments();
	}, [getToken]);

	const renderAppointmentSection = (
		appointments: Appointment[],
		emptyMessage: string,
		isDraft = false
	) => {
		if (appointments.length === 0) {
			return (
				<div className="text-center py-8 text-gray-500">
					<p>{emptyMessage}</p>
				</div>
			);
		}

		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{appointments.map((appointment) => {
					if (isDraft) {
						return (
							<DraftAppointmentCard
								key={appointment.appointment_id}
								appointment={appointment}
								onUpdate={refreshAppointments}
							/>
						);
					}
					return (
						<MyAppointmentCard
							key={appointment.appointment_id}
							appointment={appointment}
							onUpdate={refreshAppointments}
						/>
					);
				})}
			</div>
		);
	};

	return (
		<div className="min-h-screen pb-20 py-4 px-4">
			<div className="mb-6">
				<h1 className="text-xl font-semibold text-primary-600 mb-2 text-left">
					My Appointments
				</h1>
				<p className="text-sm font-light text-gray-600 text-left">
					Manage your bookings by status. Continue drafts or view active and
					completed appointments.
				</p>
			</div>

			{isLoading ? (
				<div className="flex justify-center items-center h-40">
					<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
					<span className="ml-3 text-gray-600">Loading appointments...</span>
				</div>
			) : error ? (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
					{error}
				</div>
			) : (
				<Tabs defaultValue="drafts" className="w-full">
					<TabsList className="grid w-full grid-cols-4 mb-6">
						<TabsTrigger value="drafts" className="flex items-center gap-2">
							<FileText className="w-4 h-4" />
							<span className="hidden sm:inline">Drafts</span>
							{draftAppointments.length > 0 && (
								<Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
									{draftAppointments.length}
								</Badge>
							)}
						</TabsTrigger>
						<TabsTrigger value="active" className="flex items-center gap-2">
							<Calendar className="w-4 h-4" />
							<span className="hidden sm:inline">Active</span>
							{pendingAppointments.length > 0 && (
								<Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
									{pendingAppointments.length}
								</Badge>
							)}
						</TabsTrigger>
						<TabsTrigger value="completed" className="flex items-center gap-2">
							<CheckCircle className="w-4 h-4" />
							<span className="hidden sm:inline">Completed</span>
							{completedAppointments.length > 0 && (
								<Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
									{completedAppointments.length}
								</Badge>
							)}
						</TabsTrigger>
						<TabsTrigger value="cancelled" className="flex items-center gap-2">
							<AlertCircle className="w-4 h-4" />
							<span className="hidden sm:inline">Cancelled</span>
							{cancelledAppointments.length > 0 && (
								<Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
									{cancelledAppointments.length}
								</Badge>
							)}
						</TabsTrigger>
					</TabsList>

					<TabsContent value="drafts" className="mt-0">
						<div className="mb-4">
							<h2 className="text-lg font-medium text-gray-900 mb-2">
								Draft Appointments
							</h2>
							<p className="text-sm text-gray-600">
								Continue where you left off. Complete your booking process.
							</p>
						</div>
						<div className="max-h-[calc(100vh-300px)] overflow-y-auto">
							{renderAppointmentSection(
								draftAppointments,
								"No draft appointments. Start a new booking below.",
								true
							)}
						</div>
					</TabsContent>

					<TabsContent value="active" className="mt-0">
						<div className="mb-4">
							<h2 className="text-lg font-medium text-gray-900 mb-2">
								Active Appointments
							</h2>
							<p className="text-sm text-gray-600">
								Your confirmed and scheduled appointments.
							</p>
						</div>
						<div className="max-h-[calc(100vh-300px)] overflow-y-auto">
							{renderAppointmentSection(
								pendingAppointments,
								"No active appointments scheduled."
							)}
						</div>
					</TabsContent>

					<TabsContent value="completed" className="mt-0">
						<div className="mb-4">
							<h2 className="text-lg font-medium text-gray-900 mb-2">
								Completed Appointments
							</h2>
							<p className="text-sm text-gray-600">
								Your appointment history and completed services.
							</p>
						</div>
						<div className="max-h-[calc(100vh-300px)] overflow-y-auto">
							{renderAppointmentSection(
								completedAppointments,
								"No completed appointments yet."
							)}
						</div>
					</TabsContent>

					<TabsContent value="cancelled" className="mt-0">
						<div className="mb-4">
							<h2 className="text-lg font-medium text-gray-900 mb-2">
								Cancelled Appointments
							</h2>
							<p className="text-sm text-gray-600">
								Previously cancelled appointments and bookings.
							</p>
						</div>
						<div className="max-h-[calc(100vh-300px)] overflow-y-auto">
							{renderAppointmentSection(
								cancelledAppointments,
								"No cancelled appointments."
							)}
						</div>
					</TabsContent>
				</Tabs>
			)}

			{/* Fixed Action Button */}
			<div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
				<Button
					className="w-full bg-primary-500 hover:bg-primary-700 text-white"
					onClick={handleBookAppointment}
					disabled={isCreatingDraft}>
					{isCreatingDraft ? "Starting..." : "Book New Appointment"}
				</Button>
			</div>
		</div>
	);
};

export default MyAppointments;
