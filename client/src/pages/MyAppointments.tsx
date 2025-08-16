import {useEffect, useState} from "react";
import {MyAppointmentCard} from "@/components/appointments/MyAppointmentCard";
import {Button} from "@/components/ui/button";
import type {Appointment} from "@/lib/types";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@clerk/clerk-react";
import {createDraftAppointment, getUserAppointments} from "@/lib/api";

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

	return (
		<div className="min-h-screen pb-20 py-4 px-4">
			<div>
				<h1 className="text-xl font-semibold text-primary-600 mb-2 text-left">
					My Appointments
				</h1>
				<p className="text-sm font-light text-gray-600 mb-6 text-left">
					The bookings you've made through the app are shown below.
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
			) : appointments.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-gray-500 mb-4">No appointments found.</p>
					<p className="text-sm text-gray-400">
						Click "Book Appointment" below to get started.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{appointments.map((appointment) => (
						<MyAppointmentCard
							key={appointment.appointment_id}
							appointment={appointment}
						/>
					))}
				</div>
			)}

			<div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
				<Button
					className="w-full bg-primary-500 hover:bg-primary-700 text-white"
					onClick={handleBookAppointment}
					disabled={isCreatingDraft}>
					{isCreatingDraft ? "Starting..." : "Book Appointment"}
				</Button>
			</div>
		</div>
	);
};

export default MyAppointments;
